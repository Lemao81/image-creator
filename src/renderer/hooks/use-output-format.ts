import { useEffect, useState } from 'react'
import type { OutputFormatState } from '@/types'
import { defaultOutputFormat } from '~/constants'
import type { OutputFormat } from '~/types'

export function useOutputFormat(): OutputFormatState {
  const [format, setFormat] = useState<OutputFormat | null>(null)

  useEffect(() => {
    async function restoreOutputFormat(): Promise<void> {
      const stored = await window.bridge.loadOutputFormat()
      setFormat(stored ?? defaultOutputFormat)
    }

    restoreOutputFormat().catch(console.error)
  }, [])

  function change(next: OutputFormat): void {
    setFormat(next)
    window.bridge.storeOutputFormat(next).catch(console.error)
  }

  return { format, change }
}
