/** Mapping between the plugin option types and the real type of their value. */
export interface SubOptionTypeMap {
  /** Checkboxes have two states - true (checked) and false (unchecked) */
  checkbox: boolean
  /** Number inputs have a type of number */
  number: number
  /** Textbox inputs have a type of string */
  text: string
  /** Radio buttons return the value of a selected option */
  radio: string
}

/** Aggregate type representing types that suboptions can be (checkbox, number, etc) */
type SubOptionType = keyof SubOptionTypeMap

/** Defines what each radio button in a group will consist of */
export type RadioOptionChoice = {
  /** The human-readable label of the radio button */
  label: string
  /** The value passed to the config when this button is selected */
  value: string
}

/**
 * Base fields that every option should have
 *
 * @template {SubOptionType} K The possible types a suboption can be (checkbox, number, etc)
 */
type BaseSubOption<K extends SubOptionType> = {
  /** The type of the suboption */
  type: K
  /** The label for the suboption */
  label: string
  /** An optional description for the suboption */
  description?: string
}

/**
 * Radio button suboption schema definition
 *
 * @extends {BaseSubOption<'radio'>} Extends the base option fields with a type of radio
 */
export interface RadioSubOption extends BaseSubOption<'radio'> {
  /** List of radio options */
  options: RadioOptionChoice[]
  /** Required default value */
  default: string
}

/**
 * Checkbox suboption schema definition
 *
 * @extends {BaseSubOption<'checkbox'>} Extends the base option fields with a type of checkbox
 */
export interface CheckboxSubOption extends BaseSubOption<'checkbox'> {
  /** Optional default value - checked (true) or unchecked (false) */
  default?: boolean
}

/**
 * Number suboption schema definition
 *
 * @extends {BaseSubOption<'number'>} Extends the base option fields with a type of number
 */
export interface NumberSubOption extends BaseSubOption<'number'> {
  /** Optional minimum value */
  min?: number
  /** Optional maximum value */
  max?: number
  /** Optional field placeholder */
  placeholder?: string
  /** Optional step value (e.g. 0.1, 0.001, 10, ...) */
  step?: number
  /** Optional default value */
  default?: number
}

/**
 * Text input suboption schema definition
 *
 * @extends {BaseSubOption<'text'>} Extends the base option fields with a type of text
 */
export interface TextSubOption extends BaseSubOption<'text'> {
  /** Whether or not this field is required */
  required: boolean
  /** Optional field placeholder */
  placeholder?: string
  /** Optional default value */
  default?: string
}

/** Aggregate type for a generic "suboption" of some type */
export type SubOptionSchema = CheckboxSubOption | NumberSubOption | TextSubOption | RadioSubOption

/** Default input values for each defined input type */
export const SUB_OPTION_DEFAULTS: SubOptionTypeMap = {
  checkbox: false,
  number: 0,
  text: '',
  // radios are required to provide a default so this doesn't really matter
  radio: '',
}
