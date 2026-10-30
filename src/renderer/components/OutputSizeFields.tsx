import { ChevronDownIcon } from 'lucide-react'
import type { JSX } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import type { OutputSizeInput } from '@/types'
import { parseSizeValue } from '@/utils/helpers'
import { maxOutputSize, outputSizePresets } from '~/constants'

type OutputSizeFieldsProps = {
  size: OutputSizeInput
  onSizeChange: (size: OutputSizeInput) => void
}

type SizeFieldProps = {
  id: string
  label: string
  value: string
  onValueChange: (value: string) => void
}

function SizeField({ id, label, value, onValueChange }: SizeFieldProps): JSX.Element {
  const invalid = parseSizeValue(value) === null

  return (
    <Field data-invalid={invalid} className="w-36">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={id}
          value={value}
          inputMode="numeric"
          aria-invalid={invalid}
          onChange={(e) => onValueChange(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<InputGroupButton size="icon-xs" aria-label={`${label} presets`} />}
            >
              <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={value} onValueChange={(v) => onValueChange(String(v))}>
                {outputSizePresets.map((p) => (
                  <DropdownMenuRadioItem key={p} value={String(p)} closeOnClick>
                    {p}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
      {invalid && <FieldError>Enter a whole number from 1 to {maxOutputSize}</FieldError>}
    </Field>
  )
}

export function OutputSizeFields({ size, onSizeChange }: OutputSizeFieldsProps): JSX.Element {
  return (
    <FieldGroup className="flex-row items-start">
      <SizeField
        id="output-width"
        label="Width"
        value={size.width}
        onValueChange={(w) => onSizeChange({ width: w, height: w })}
      />
      <SizeField
        id="output-height"
        label="Height"
        value={size.height}
        onValueChange={(h) => onSizeChange({ ...size, height: h })}
      />
    </FieldGroup>
  )
}
