import { type JSX, useEffect, useState } from 'react'
import { MainView } from './pages/MainView'
import { SettingsView } from './pages/SettingsView'

type View = 'main' | 'settings'

export function App(): JSX.Element | null {
  const [view, setView] = useState<View | null>(null)

  useEffect(() => {
    async function chooseInitialView(): Promise<void> {
      try {
        const settings = await window.bridge.loadProviderSettings()
        setView(settings ? 'main' : 'settings')
      } catch {
        setView('settings')
      }
    }

    void chooseInitialView()
  }, [])

  if (view === null) {
    return null
  }

  if (view === 'settings') {
    return <SettingsView onBack={() => setView('main')} />
  }

  return <MainView onOpenSettings={() => setView('settings')} />
}
