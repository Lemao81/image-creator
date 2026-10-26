import { SettingsIcon } from 'lucide-react'
import { type JSX, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

type MainHeaderProps = {
  onOpenSettings: () => void
}

export function MainHeader({ onOpenSettings }: MainHeaderProps): JSX.Element {
  const [fakeProvider, setFakeProvider] = useState(false)

  useEffect(() => {
    void window.bridge.isFakeProvider().then(setFakeProvider)
  }, [])

  return (
    <header className="flex items-center gap-2 p-2">
      {fakeProvider && (
        <span className="rounded-md bg-muted px-2 py-1 font-medium text-muted-foreground text-xs">
          Fake Provider
        </span>
      )}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Settings"
        className="ml-auto"
        onClick={onOpenSettings}
      >
        <SettingsIcon />
      </Button>
    </header>
  )
}
