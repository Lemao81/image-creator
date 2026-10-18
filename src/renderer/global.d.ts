import type { Bridge } from '~/bridge'

declare global {
  interface Window {
    bridge: Bridge
  }
}
