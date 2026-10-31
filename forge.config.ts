import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { FuseV1Options, FuseVersion } from '@electron/fuses'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { FusesPlugin } from '@electron-forge/plugin-fuses'
import { VitePlugin } from '@electron-forge/plugin-vite'
import type { ForgeConfig } from '@electron-forge/shared-types'

type PackageManifest = {
  dependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
}

const externalModules = ['sharp']

function installedDependencyClosure(names: string[]): Set<string> {
  const closure = new Set<string>()
  const pending = [...names]
  for (let name = pending.pop(); name !== undefined; name = pending.pop()) {
    const manifestPath = path.join(__dirname, 'node_modules', name, 'package.json')
    if (closure.has(name) || !existsSync(manifestPath)) {
      continue
    }

    closure.add(name)
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as PackageManifest
    pending.push(
      ...Object.keys(manifest.dependencies ?? {}),
      ...Object.keys(manifest.optionalDependencies ?? {}),
    )
  }

  return closure
}

const packagedModuleDirs = [...installedDependencyClosure(externalModules)].map(
  (n) => `/node_modules/${n}`,
)

function isPackaged(file: string): boolean {
  return (
    file === '' ||
    file.startsWith('/.vite') ||
    packagedModuleDirs.some(
      (d) => file === d || file.startsWith(`${d}/`) || d.startsWith(`${file}/`),
    )
  )
}

const config: ForgeConfig = {
  packagerConfig: {
    asar: {
      unpack: '**/node_modules/{sharp,@img}/**/*',
    },
    ignore: (file) => !isPackaged(file),
  },
  rebuildConfig: {},
  makers: [new MakerSquirrel({})],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: 'src/main/main.ts',
          config: 'vite.main.config.mts',
          target: 'main',
        },
        {
          entry: 'src/preload/preload.ts',
          config: 'vite.preload.config.mts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.mts',
        },
      ],
    }),
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
}

export default config
