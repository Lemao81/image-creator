import type { JSX } from 'react'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { outputFormatLabels } from '~/constants'
import type { OutputFormat } from '~/types'

type OutputFormatFieldProps = {
  format: OutputFormat
  onFormatChange: (format: OutputFormat) => void
}

const outputFormatItems = Object.entries(outputFormatLabels).map(([value, label]) => ({
  value: value as OutputFormat,
  label,
}))

export function OutputFormatField({ format, onFormatChange }: OutputFormatFieldProps): JSX.Element {
  return (
    <Field className="w-36">
      <FieldLabel htmlFor="output-format">Output format</FieldLabel>
      <Select
        items={outputFormatItems}
        value={format}
        onValueChange={(f) => f && onFormatChange(f)}
      >
        <SelectTrigger id="output-format" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {outputFormatItems.map((i) => (
            <SelectItem key={i.value} value={i.value}>
              {i.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
