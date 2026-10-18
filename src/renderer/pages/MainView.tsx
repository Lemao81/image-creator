import { SettingsIcon } from 'lucide-react'
import type { JSX } from 'react'
import { Button } from '@/components/ui/button'

type MainViewProps = {
  onOpenSettings: () => void
}

export function MainView({ onOpenSettings }: MainViewProps): JSX.Element {
  return (
    <main className="flex flex-col">
      <header className="flex items-center justify-end p-2">
        <Button variant="ghost" size="icon" aria-label="Settings" onClick={onOpenSettings}>
          <SettingsIcon />
        </Button>
      </header>
    </main>
  )
}
