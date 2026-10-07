#!/usr/bin/env bash
input=$(cat)
sep=$'\033[38;5;250m│\033[0m'

model=$(printf '%s' "$input" | jq -r '.model.display_name // .model.id // empty' 2>/dev/null)
effort=$(printf '%s' "$input" | jq -r '.effort.level // empty' 2>/dev/null)
style=$(printf '%s' "$input" | jq -r '.output_style.name // empty' 2>/dev/null)
head="$model"
[[ -n $effort ]] && head+="${head:+ }($effort)"
prefix=""
[[ -n $head ]] && prefix=$'\033[38;5;223m'"$head"$'\033[0m'
[[ -n $style ]] && prefix+="${prefix:+ }$style"
[[ -n $prefix ]] && prefix+=" $sep "

pct=$(printf '%s' "$input" | jq -r '
  .context_window as $c
  | if $c.used_percentage != null then $c.used_percentage
    elif $c.current_usage != null and ($c.context_window_size // 0) > 0 then
      (($c.current_usage.input_tokens // 0)
       + ($c.current_usage.cache_creation_input_tokens // 0)
       + ($c.current_usage.cache_read_input_tokens // 0)) * 100 / $c.context_window_size
    else 0 end
  | floor' 2>/dev/null)
pct=${pct:-0}
(( pct < 0 )) && pct=0
(( pct > 100 )) && pct=100

if (( pct >= 80 )); then
  color='\033[31m'
elif (( pct >= 50 )); then
  color='\033[33m'
else
  color='\033[32m'
fi
dim='\033[2m'
reset='\033[0m'

width=20
used=$(( pct * width / 100 ))
free=$(( width - used ))

bar_used=$(printf '%*s' "$used" '' | sed 's/ /▓/g')
bar_free=$(printf '%*s' "$free" '' | sed 's/ /░/g')

size=$(printf '%s' "$input" | jq -r '
  .context_window.context_window_size // empty
  | if . >= 1000000 then "\((. / 100000 | floor) / 10)M"
    elif . >= 1000 then "\(. / 1000 | floor)k"
    else tostring end' 2>/dev/null)
size_part=""
[[ -n $size ]] && size_part=" \033[38;5;248mof ${size}${reset}"

color_for() {
  if (( $1 >= 80 )); then
    printf '\033[38;5;210m'
  elif (( $1 >= 50 )); then
    printf '\033[38;5;229m'
  else
    printf '\033[38;5;114m'
  fi
}

limits=""
while IFS=$'\t' read -r label used; do
  if [[ -n $used ]]; then
    used=${used%.*}
    limits+=" ${sep} ${label}: $(color_for "$used")${used}%${reset}"
  else
    limits+=" ${sep} ${label}: ${dim}–${reset}"
  fi
done < <(printf '%s' "$input" | jq -r '
  [["5h", .rate_limits.five_hour], ["7d", .rate_limits.seven_day]][]
  | [.[0], (.[1].used_percentage // "" | tostring)]
  | @tsv' 2>/dev/null)

dir=$(printf '%s' "$input" | jq -r '.workspace.current_dir // .cwd // empty' 2>/dev/null)
dir_part=""
[[ -n $dir ]] && dir_part=" ${sep} \033[38;5;253m${dir##*/}${reset}"

printf "%s${color}%s${reset}${dim}${color}%s${reset}${color}%d%%${reset}%b%b%b" "$prefix" "$bar_used" "$bar_free" "$pct" "$size_part" "$limits" "$dir_part"
