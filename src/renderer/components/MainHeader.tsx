import { SettingsIcon } from 'lucide-react'
import type { JSX } from 'react'
import { Button } from '@/components/ui/button'

type MainHeaderProps = {
  onOpenSettings: () => void
}

export function MainHeader({ onOpenSettings }: MainHeaderProps): JSX.Element {
  return (
    <header className="flex items-center justify-end p-2">
      <Button variant="ghost" size="icon" aria-label="Settings" onClick={onOpenSettings}>
        <SettingsIcon />
      </Button>
    </header>
  )
}
