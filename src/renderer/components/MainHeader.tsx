import { SettingsIcon } from 'lucide-react'
import { type JSX, useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
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
      {fakeProvider && <Badge variant="secondary">Fake Provider</Badge>}
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
