import { useState } from 'react'
import { MainView } from './MainView'
import { SettingsView } from './SettingsView'

type View = 'main' | 'settings'

export function App() {
  const [view, setView] = useState<View>('main')

  if (view === 'settings') {
    return <SettingsView onBack={() => setView('main')} />
  }

  return <MainView onOpenSettings={() => setView('settings')} />
}
