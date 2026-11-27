import { useEffect, useState } from 'react'
import type { OutputSizeInput, OutputSizeState } from '@/types'
import { outputSizeLimit, parseOutputSize } from '@/utils/helpers'
import { defaultOutputSize } from '~/constants'
import type { OutputFormat } from '~/types'

export function useOutputSize(format: OutputFormat | null): OutputSizeState {
  const [input, setInput] = useState<OutputSizeInput | null>(null)
  const limit = outputSizeLimit(format)

  useEffect(() => {
    async function restoreOutputSize(): Promise<void> {
      const stored = await window.bridge.loadOutputSize()
      const size = stored ?? defaultOutputSize
      setInput({ width: String(size.width), height: String(size.height) })
    }

    restoreOutputSize().catch(console.error)
  }, [])

  function change(next: OutputSizeInput): void {
    setInput(next)
    const parsed = parseOutputSize(next, limit)
    if (parsed) {
      window.bridge.storeOutputSize(parsed).catch(console.error)
    }
  }

  return { input, size: input && parseOutputSize(input, limit), change }
}
