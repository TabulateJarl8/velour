/** List of top-level collapsible categories */
export const Categories = {
  System: 'System Configuration',
  EssentialApps: 'Essential Applications',
  AdditionalApps: 'Additional Applications',
  Customization: 'Customization',
} as const

/** Union type of every category for type checking */
export type Category = (typeof Categories)[keyof typeof Categories]

/**
 * Raw header data for categories that have headers.
 *
 * This isn't just a compile-time thing so that the plugin generation script can actually read this
 * data at runtime.
 */
export const CategoryHeadingsData = {
  [Categories.AdditionalApps]: [
    'Internet & Communication',
    'Office Productivity',
    'Programming and DevOps',
    'Media & Graphics',
    'Gaming & Emulation',
    'Remote Networking',
    'File Sharing & Downloading',
    'System Tools',
  ],
} as const

/** Compile-time category heading type checking */
export type CategoryHeadings = {
  [K in keyof typeof CategoryHeadingsData]: (typeof CategoryHeadingsData)[K][number]
}
