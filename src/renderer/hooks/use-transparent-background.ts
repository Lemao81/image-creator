import { useEffect, useState } from 'react'
import type { TransparentBackgroundState } from '@/types'

export function useTransparentBackground(): TransparentBackgroundState {
  const [enabled, setEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    async function restoreTransparentBackground(): Promise<void> {
      const stored = await window.bridge.loadTransparentBackground()
      setEnabled(stored ?? false)
    }

    restoreTransparentBackground().catch(console.error)
  }, [])

  function change(next: boolean): void {
    setEnabled(next)
    window.bridge.storeTransparentBackground(next).catch(console.error)
  }

  return { enabled, change }
}
