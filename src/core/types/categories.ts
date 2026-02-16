export const Categories = {
  System: 'System Configuration',
  EssentialApps: 'Essential Applications',
  AdditionalApps: 'Additional Applications',
  Customization: 'Customization',
} as const

export type Category = (typeof Categories)[keyof typeof Categories]

export interface CategoryHeadings {
  [Categories.AdditionalApps]:
    | 'Internet & Communication'
    | 'Office Productivity'
    | 'Programming and DevOps'
    | 'Media & Graphics'
    | 'Gaming & Emulation'
    | 'Remote Networking'
    | 'File Sharing & Downloading'
    | 'System Tools'
}
