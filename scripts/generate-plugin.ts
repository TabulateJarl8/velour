import { input, select } from '@inquirer/prompts'
import { PluginDiscoveryProvider, PluginLoader } from '../src/core/loader'
import path from 'path'
import fs from 'fs/promises'
import { CategoryHeadingsData, PluginModule, Categories } from '../src/core/types'
import { logger } from '../src/core/logger'

const nodeProvider: PluginDiscoveryProvider = async () => {
  const fs = await import('fs/promises')
  const path = await import('path')
  const dir = path.join(process.cwd(), 'src/plugins')
  const files = await fs.readdir(dir, { recursive: true })

  const mods: Record<string, () => Promise<PluginModule>> = {}
  for (const file of files) {
    if (file.endsWith('.ts')) {
      mods[file] = () => import(path.join(dir, file))
    }
  }
  return mods
}

const escape = (str: string): string => {
  return str.replace(/'/g, "\\'")
}

/** Plugin generation entrypoint */
async function generate() {
  const loader = new PluginLoader(nodeProvider)
  const existingPlugins = await loader.loadPlugins(true)
  const pluginList = Array.from(existingPlugins.values())

  const id = await input({
    message: 'Plugin ID (e.g. my-plugin): ',
    required: true,
    validate: (val) => {
      if (existingPlugins.has(val)) return `The ID ${val} is taken`
      if (!/^[a-z0-9-]+$/.test(val)) return 'ID must be lowercase, numbers, or dashes'
      return true
    },
  })

  const name = escape(
    await input({
      message: 'Plugin Name (e.g. My Plugin): ',
      required: true,
      validate: (val) => {
        const exists = pluginList.some(
          (p) => p.name.trim().toLowerCase() === val.trim().toLowerCase(),
        )
        if (exists) return `A plugin named ${val} already exists`
        return true
      },
    }),
  )

  const description = escape(await input({ message: 'Description: ', required: true }))

  const progressMessage = escape(
    await input({
      message: 'Progress message (like "Setting hostname..."): ',
      required: true,
      validate: (val) => {
        if (!val.endsWith('...')) return 'Please end the message with ...'
        return true
      },
    }),
  )

  const options = Object.values(Categories).map((o) => ({
    value: o,
  }))
  const category = escape(
    await select({
      message: 'Select a Category:',
      choices: options,
    }),
  )

  // get heading if the category needs it
  let heading: string | undefined
  if (category in CategoryHeadingsData) {
    const key = category as keyof typeof CategoryHeadingsData
    const headingOptions = CategoryHeadingsData[key].map((s) => ({ value: s }))

    heading = escape(
      await select({
        message: 'Select a heading within the category:',
        choices: headingOptions,
      }),
    )
  }

  const file = `
import { createPlugin } from '@/core/types'

const plugin = createPlugin({
  id: '${id}',
  name: '${name}',
  description: '${description}',
  progressMessage: '${progressMessage}',
  options: {},
  category: '${category}',
  ${heading ? `heading: '${heading}',` : ''}
  generate: (config) => {
    return \`# (${name}) script output here\`
  }
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    '${id}': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
`

  const filePath = path.join(process.cwd(), 'src/plugins', `${id}.ts`)
  await fs.writeFile(filePath, file.trim())

  logger.success(`Successfully generated plugin: src/plugins/${id}.ts`)
}

generate().catch(logger.error)
