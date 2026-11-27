import { ChevronDownIcon } from 'lucide-react'
import type { JSX } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import type { OutputSizeInput } from '@/types'
import { outputSizeLimit, parseSizeValue } from '@/utils/helpers'
import { outputSizePresets } from '~/constants'
import type { OutputFormat } from '~/types'

type OutputSizeFieldsProps = {
  size: OutputSizeInput
  format: OutputFormat | null
  onSizeChange: (size: OutputSizeInput) => void
}

type SizeFieldProps = {
  id: string
  label: string
  value: string
  limit: number
  disabled?: boolean
  onValueChange: (value: string) => void
}

function SizeField({
  id,
  label,
  value,
  limit,
  disabled = false,
  onValueChange,
}: SizeFieldProps): JSX.Element {
  const invalid = !disabled && parseSizeValue(value, limit) === null

  return (
    <Field data-invalid={invalid} data-disabled={disabled} className="w-36">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={id}
          value={value}
          inputMode="numeric"
          disabled={disabled}
          aria-invalid={invalid}
          onChange={(e) => onValueChange(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              disabled={disabled}
              render={<InputGroupButton size="icon-xs" aria-label={`${label} presets`} />}
            >
              <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={value} onValueChange={(v) => onValueChange(String(v))}>
                {outputSizePresets
                  .filter((p) => p <= limit)
                  .map((p) => (
                    <DropdownMenuRadioItem key={p} value={String(p)} closeOnClick>
                      {p}
                    </DropdownMenuRadioItem>
                  ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
      {invalid && <FieldError>Enter a whole number from 1 to {limit}</FieldError>}
    </Field>
  )
}

export function OutputSizeFields({
  size,
  format,
  onSizeChange,
}: OutputSizeFieldsProps): JSX.Element {
  const limit = outputSizeLimit(format)

  return (
    <>
      <SizeField
        id="output-width"
        label="Width"
        value={size.width}
        limit={limit}
        onValueChange={(w) => onSizeChange({ width: w, height: w })}
      />
      <SizeField
        id="output-height"
        label="Height"
        value={size.height}
        limit={limit}
        disabled={format === 'ico'}
        onValueChange={(h) => onSizeChange({ ...size, height: h })}
      />
    </>
  )
}
