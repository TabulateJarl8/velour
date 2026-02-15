# Adding a New Configuration Option Type

Velour provides numerous suboption input types, including but not limited to:

- Checkboxes
- Number Inputs
- Text Inputs
- Radio Buttons

However, you may want to go about adding a new option. The following guide details my process of adding the radio button option to make following along a bit easier.

## Introduce New Types

In the file `src/core/types.ts`, the new option types must be added.

- Add the option name and the corresponding TypeScript type to the `SubOptionTypeMap` interface:
  ```ts
  export interface SubOptionTypeMap {
    // ...
    /** Radio buttons return the value of a selected option */
    radio: string
  }
  ```
- Introduce a new `*SubOption` interface that extends the `BaseSubOption`:

  ```ts
  /**
   * Radio button suboption schema definition
   *
   * @extends {BaseSubOption<'radio'>} Extends the base option fields with a type of radio
   */
  export interface RadioSubOption extends BaseSubOption<'radio'> {
    // any input-specific options go here - in this case, radio buttons need to store a list of the potential options as well as a default

    /** List of radio options */
    options: RadioOptionChoice[]
    /** Optional default value */
    default?: string
  }
  ```

  - In this specific case, we need to introduce a new data structure for storing the radio button options, so we add that to the same file:

    ```ts
    /** Defines what each radio button in a group will consist of */
    export type RadioOptionChoice = {
      /** The human-readable label of the radio button */
      label: string
      /** The value passed to the config when this button is selected */
      value: string
    }
    ```

- Now, we add the new suboption to the `SubOptionSchema` type:
  ```ts
  export type SubOptionSchema = CheckboxSubOption | ... | RadioSubOption
  ```

## Introduce New Component

Now we need to craft the UI for the new component. Create a new appropriately named file in `src/components/options/`:

<!-- TODO: this ui is ugly -->

```vue
<!-- src/components/options/RadioOption.vue -->
<script setup lang="ts">
import type { RadioSubOption } from '@/core/types'

// change the defineModel generic to be the same type that is in the `SubOptionTypeMap`
const model = defineModel<string>({ required: true })
// define props using your newly created type
defineProps<{
  opt: RadioSubOption
}>()
</script>

<template>
  <!-- components should be labelled with their given name -->
  <label class="label">
    <span class="label-text font-semibold">{{ opt.label }}</span>
  </label>
  <!-- We generate DaisyUI radio buttons for each item in the array -->
  <div class="flex flex-col gap-1 pl-1">
    <label
      v-for="choice in opt.options"
      :key="choice.value"
      class="label cursor-pointer justify-start gap-4"
    >
      <!-- automatically set the user's choice in the model with v-model -->
      <input
        type="radio"
        class="radio radio-sm radio-secondary"
        v-model="model"
        :value="choice.value"
      />
      <span class="label-text">{{ choice.label }}</span>
    </label>
  </div>
  <label class="label">
    <span class="label-text opacity-80">{{ opt.description }}</span>
  </label>
</template>
```

Once you've created your component, add it to the list of possible components in `src/components/PluginOptionsCard.vue`:

```vue
<div v-for="(opt, key) in plugin.options" :key="key" class="form-control w-full max-w-md">
  <CheckboxOption
    v-if="opt.type === 'checkbox'"
    v-model="model[key as keyof ConcretePluginConfig] as boolean"
    :opt="opt"
  />
  <!-- ... -->
  <RadioOption
    v-if="opt.type === 'radio'"
    v-model="model[key as keyof ConcretePluginConfig] as string"
    :opt="opt"
  />
</div>
```

<!-- TODO: unit testing -->
