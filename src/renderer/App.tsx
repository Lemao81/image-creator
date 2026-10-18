import { type JSX, useState } from 'react'
import { MainView } from './pages/MainView'
import { SettingsView } from './pages/SettingsView'

type View = 'main' | 'settings'

export function App(): JSX.Element {
  const [view, setView] = useState<View>('main')

  if (view === 'settings') {
    return <SettingsView onBack={() => setView('main')} />
  }

  return <MainView onOpenSettings={() => setView('settings')} />
}
