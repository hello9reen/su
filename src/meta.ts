const PRINT_PATTERN: RegExp = /^([^#.0-9]*)([#,.0-9]*)([^#0-9]*)$/
const DECIMAL_PATTERN: RegExp = /^((?:#*(?:,#+)*)\d*(?:,\d+)*)?(\.(?:\d+#*|#+))?$/

const defineInteger = (number: string, info: DecimalMeta): void => {
  if (!number) return

  const groupPosition = number.lastIndexOf(',')
  if (groupPosition > 0) {
    info.integer.groups = groupPosition
  }

  const [all, /*mutable*/, immutable] = /^(#*)(\d*)$/.exec(number.replace(/[^#0-9]/g, ''))
  if (all)
    info.integer.max = all.length

  if (immutable)
    info.integer.fill = immutable
}
const defineFaction = (number: string, info: DecimalMeta): void => {
  if (!number) return

  const [all, immutable] = /^(\d*)(#*)$/.exec(number.replace(/[^#0-9]/g, ''))
  if (all)
    info.fraction.max = all.length

  if (immutable)
    info.fraction.fill = immutable
}

const getMetainfo = (input: HTMLInputElement) => {
  const pattern = input.dataset['pattern'] || ''

  const [, prefix, decimalPattern, suffix] = PRINT_PATTERN.exec(pattern)

  if (!DECIMAL_PATTERN.test(decimalPattern))
    throw `illegal numeric pattern "${decimalPattern}"`

  const meta: DecimalMeta = {
    rulable: Boolean(pattern),
    prefix,
    suffix,
    integer: {
      groups: 0,
      fill: '',
      max: 0
    },
    fraction: {
      fill: '',
      max: 0
    }
  }

  const [integerPart, fractionPart] = decimalPattern.split('.')
  defineInteger(integerPart, meta)
  defineFaction(fractionPart, meta)

  return meta
}

export default getMetainfo
