import type { JSX } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'

type TransparentBackgroundFieldProps = {
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
}

export function TransparentBackgroundField({
  enabled,
  onEnabledChange,
}: TransparentBackgroundFieldProps): JSX.Element {
  return (
    <Field orientation="horizontal" className="h-8 w-auto self-end">
      <Checkbox id="transparent-background" checked={enabled} onCheckedChange={onEnabledChange} />
      <FieldLabel htmlFor="transparent-background">Transparent background</FieldLabel>
    </Field>
  )
}
