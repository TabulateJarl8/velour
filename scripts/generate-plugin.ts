/* eslint-disable jsdoc/require-jsdoc */
import { input, select, confirm } from '@inquirer/prompts'
import { PluginDiscoveryProvider, PluginLoader } from '../src/core/loader'
import path from 'path'
import fs from 'fs/promises'
import {
  CategoryHeadingsData,
  PluginModule,
  Categories,
  ConcretePluginDef,
} from '../src/core/types'
import { logger } from '../src/core/logger'
import { program } from 'commander'

type CLIArgs = {
  template?: 'app' | 'generic'
  location?: string
  category?: string
  heading?: string
}

type PluginContext = {
  existingPlugins: Map<string, ConcretePluginDef>
  pluginsDir: string
  folderChoices: { name: string; value: string }[]
}

type PluginMeta = {
  id: string
  name: string
  description: string
}

type PluginCategory = {
  category: string
  heading?: string
}

program
  .option('-t, --template <type>', 'Plugin template (app or generic)')
  .option('-c, --category <cat>', 'Category')
  .option('--heading <head>', 'Sub-category heading')
  .option('-l, --location <path>', 'Target subfolder')
  .parse(process.argv)

const args = program.opts() as CLIArgs

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

async function getPluginContext(): Promise<PluginContext> {
  const loader = new PluginLoader(nodeProvider)
  const existingPlugins = await loader.loadPlugins(true)

  const pluginsDir = path.join(process.cwd(), 'src/plugins')
  const dirents = await fs.readdir(pluginsDir, { recursive: true, withFileTypes: true })

  const subfolders = dirents
    .filter((e) => e.isDirectory())
    .map((e) =>
      path
        .join(e.parentPath, e.name)
        .replace(pluginsDir, '')
        .replace(/^[\\/]/, ''),
    )

  const folderChoices = [
    { name: '(root) plugins/', value: '' },
    ...subfolders.map((f) => ({ name: `plugins/${f}`, value: f })),
  ]

  return { existingPlugins, pluginsDir, folderChoices }
}

async function promptLocation(context: PluginContext, cliValue?: string): Promise<string> {
  if (cliValue !== undefined) return cliValue
  return select({ message: 'Where should the plugin be created?', choices: context.folderChoices })
}

async function promptMetadata(
  context: PluginContext,
  pluginType: keyof typeof generators,
): Promise<PluginMeta> {
  const pluginList = Array.from(context.existingPlugins.values())

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

  const nameNormalized = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const idSuggestion = pluginType === 'app' ? `install-app-${nameNormalized}` : nameNormalized

  const id = await input({
    message: 'Plugin ID (e.g. my-plugin): ',
    required: true,
    default: idSuggestion,
    validate: (val) => {
      if (context.existingPlugins.has(val)) return `The ID ${val} is taken`
      if (!/^[a-z0-9-]+$/.test(val)) return 'ID must be lowercase, numbers, or dashes'
      return true
    },
  })

  const description = escape(await input({ message: 'Description: ', required: true }))

  return { id, name, description }
}

async function promptCategory(): Promise<PluginCategory> {
  const options = Object.values(Categories).map((o) => ({
    value: o,
  }))
  const category =
    args.category ||
    escape(
      await select({
        message: 'Select a Category:',
        choices: options,
      }),
    )

  // get heading if the category needs it
  let heading = args.heading
  if (!heading && category in CategoryHeadingsData) {
    const key = category as keyof typeof CategoryHeadingsData
    const headingOptions = CategoryHeadingsData[key].map((s) => ({ value: s }))

    heading = escape(
      await select({
        message: 'Select a heading within the category:',
        choices: headingOptions,
      }),
    )
  }

  return { category, heading }
}

async function generateAppPlugin(meta: PluginMeta, category: PluginCategory): Promise<string> {
  // get the source packages
  let sourcesValid = false
  let dnfPackage: string
  let flatpakPackage: string
  do {
    dnfPackage = await input({ message: 'DNF Package Name (leave empty if none): ' })
    flatpakPackage = await input({
      message: 'Flatpak Package Name (leave empty if none): ',
      validate: (val) => {
        if ((val.match(/\./g) || []).length < 2)
          return 'Flatpak package names require at least 2 dots'
        return true
      },
    })

    if (!dnfPackage.trim() && !flatpakPackage.trim()) {
      logger.error('Please provide at least one package source')
    } else {
      sourcesValid = true
    }
  } while (!sourcesValid)

  // check if we need RPM fusion
  let rpmFusion = false
  if (dnfPackage) {
    rpmFusion = await confirm({ message: 'Does this package require RPM Fusion?', default: false })
  }

  let options = 'options: {},'
  if (dnfPackage && flatpakPackage) {
    options = `options: {
    source: {
      type: 'radio',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
      default: 'dnf',
      label: 'Choose ${meta.name} installation type:',
    },
  },`
  }

  const deps = []
  if (rpmFusion) deps.push("'enable-rpmfusion'")
  if (flatpakPackage) deps.push("'remove-fedora-flatpak-repos'")
  const depsArray = deps.length != 0 ? `dependencies: [${deps.join(', ')}],` : 'dependencies: [],'

  let generate = ''
  if (dnfPackage && flatpakPackage) {
    generate = `
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub ${flatpakPackage}'
    }

    return 'dnf install -y ${dnfPackage}'
    `
  } else if (dnfPackage) {
    generate = `return 'dnf install -y ${dnfPackage}'`
  } else {
    generate = `return 'flatpak install -y flathub ${flatpakPackage}'`
  }

  return `
import { createPlugin } from '@/core/types'

const PLUGIN_ID = '${meta.id}' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: '${meta.name}',
  description: '${meta.description}',
  preRunMessage: 'Installing ${meta.name}...',
  postRunMessage: '${meta.name} installed successfully.'
  ${options}
  ${depsArray}
  category: '${category.category}',
  ${category.heading ? `heading: '${category.heading}',` : ''}
  generate: (${dnfPackage && flatpakPackage ? 'config' : '_config'}) => {
    ${generate}
  }
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
  `
}

async function generateGenericPlugin(meta: PluginMeta, category: PluginCategory): Promise<string> {
  const preRunMessage =
    escape(
      await input({
        message: 'Pre run message (like "Setting hostname..."): ',
        required: true,
      }),
    ).replace(/\.*$/, '') + '...'

  return `
import { createPlugin } from '@/core/types'

const PLUGIN_ID = '${meta.id}' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: '${meta.name}',
  description: '${meta.description}',
  preRunMessage: '${preRunMessage}',
  options: {},
  category: '${category.category}',
  ${category.heading ? `heading: '${category.heading}',` : ''}
  generate: (config) => {
    return \`# (${meta.name}) script output here\`
  }
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
`
}

const generators = {
  app: { name: 'App Installer (DNF/Flatpak)', fn: generateAppPlugin },
  generic: { name: 'Generic Script', fn: generateGenericPlugin },
}

/** Plugin generation entrypoint */
async function generate() {
  const template =
    args.template ||
    (await select({
      message: 'What kind of plugin do you want to create?',
      choices: Object.entries(generators).map(([key, val]) => ({
        name: val.name,
        value: key as keyof typeof generators,
      })),
    }))

  const context = await getPluginContext()
  const selectedFolder = await promptLocation(context, args.location)

  const meta = await promptMetadata(context, template)
  const category = await promptCategory()

  const content = await generators[template].fn(meta, category)

  const filePath = path.join(context.pluginsDir, selectedFolder, `${meta.id}.ts`)
  await fs.writeFile(filePath, content.trim())

  const displayFile = path.join('src/plugins', selectedFolder, `${meta.id}.ts`)
  logger.success(`Successfully generated plugin: ${displayFile}`)
}

generate().catch(logger.error)
