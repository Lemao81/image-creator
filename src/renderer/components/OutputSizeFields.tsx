import type { JSX } from 'react'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { parseSizeValue } from '@/lib/output-size'
import type { OutputSizeInput } from '@/types'
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

const presetsListId = 'output-size-presets'

function SizeField({ id, label, value, onValueChange }: SizeFieldProps): JSX.Element {
  const invalid = parseSizeValue(value) === null

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        value={value}
        list={presetsListId}
        inputMode="numeric"
        aria-invalid={invalid}
        onChange={(e) => onValueChange(e.target.value)}
      />
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
      <datalist id={presetsListId}>
        {outputSizePresets.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>
    </FieldGroup>
  )
}
