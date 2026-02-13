import { input } from '@inquirer/prompts'
import { PluginDiscoveryProvider, PluginLoader } from '../src/core/loader'
import path from 'path'
import fs from 'fs/promises'
import { PluginModule } from '../src/core/types'

const nodeProvider: PluginDiscoveryProvider = async () => {
  const fs = await import('fs/promises')
  const path = await import('path')
  const dir = path.join(process.cwd(), 'src/plugins')
  const files = await fs.readdir(dir)

  const mods: Record<string, () => Promise<PluginModule>> = {}
  for (const file of files) {
    if (file.endsWith('.ts')) {
      mods[file] = () => import(path.join(dir, file))
    }
  }
  return mods
}

async function generate() {
  const loader = new PluginLoader(nodeProvider)
  const existingPlugins = await loader.loadPlugins()
  const pluginList = Array.from(existingPlugins.values())

  const id = await input({
    message: 'Plugin ID (e.g. my-plugin): ',
    validate: (val) => {
      if (existingPlugins.has(val)) return `The ID ${val} is taken`
      if (!/^[a-z0-9-]+$/.test(val)) return 'ID must be lowercase, numbers, or dashes'
      return true
    },
  })

  const name = await input({
    message: 'Plugin Name (e.g. My Plugin): ',
    validate: (val) => {
      const exists = pluginList.some((p) => p.name.toLowerCase() === val.toLowerCase())
      if (exists) return `A plugin named ${val} already exists`
      return true
    },
  })

  const description = await input({ message: 'Description: ' })

  const file = `
import { createPlugin } from '../core/types'

export default createPlugin({
  id: '${id}',
  name: '${name}',
  description: '${description}',
  options: {},
  generate: (config) => {
    return \`# (${name}) script output here\`
  }
})
`

  const filePath = path.join(process.cwd(), 'src/plugins', `${id}.ts`)
  await fs.writeFile(filePath, file.trim())

  console.log(`[Velour] Successfully generated plugin: src/plugins/${id}.ts`)

}

generate().catch(console.error)
