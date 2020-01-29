const PRINT_PATTERN: RegExp = /^([^#.0-9]*)([#,.0-9]*)([^#0-9]*)$/
const DECIMAL_PATTERN: RegExp = /^((?:#*(?:,#+)*)\d*(?:,\d+)*)?(\.(?:\d+#*|#+))?$/

const defineInteger = (pattern: string, meta: DecimalMetadata): void => {
  if (!pattern) {
    meta.integer.max = 0
    return
  }

  const groupSize = pattern.lastIndexOf(',')
  meta.integer.groups = groupSize === -1 ? 0 : pattern.length - groupSize - 1

  const [all, fill] = /^(?:#*)(\d*)$/.exec(pattern.replace(/[^#\d]/g, ''))

  if (all)
    meta.integer.max = all.length

  if (fill)
    meta.integer.fill = fill
}
const defineFaction = (pattern: string, meta: DecimalMetadata): void => {
  if (!pattern) {
    meta.fraction.max = 0
    return
  }

  const [all, fill] = /^(\d*)(?:#*)$/.exec(pattern.replace(/[^#0-9]/g, ''))

  if (all)
    meta.fraction.max = all.length

  if (fill)
    meta.fraction.fill = fill
}

export default (input: Element) => {
  const pattern = input.getAttribute('data-pattern') || ''

  const [, prefix, decimalPattern, suffix] = PRINT_PATTERN.exec(pattern)

  if (!DECIMAL_PATTERN.test(decimalPattern))
    throw `illegal numeric pattern "${decimalPattern}"`

  const meta: DecimalMetadata = {
    prefix,
    suffix,
    integer: {
      groups: 3,
      fill: '',
      max: Infinity
    },
    fraction: {
      fill: '',
      max: Infinity
    }
  }

  if (pattern) {
    const [integerPart, fractionPart] = decimalPattern.split('.')
    defineInteger(integerPart, meta)
    defineFaction(fractionPart, meta)
  }

  return meta
}
