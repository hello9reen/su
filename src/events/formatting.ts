import {fillFraction, fillInteger, grouping, toNumber} from '../utils'

const isMinus = (value: string): boolean => /^-/.test(value)

export default (e: Event, input: HTMLInputElement, meta: DecimalMetadata) => {
  if (!input.value) return

  const minus = isMinus(input.value)
  const value = input.value.replace(/[^\d.]/g, '')
  const point = value.indexOf('.')

  if (point === -1) {
    input.value = fillInteger(grouping(value), meta.integer.fill)
      + fillFraction('', meta.fraction.fill)
  } else {
    input.value = fillInteger(grouping(value.substring(0, point)), meta.integer.fill)
    input.value += fillFraction(toNumber(value.substring(point + 1)), meta.fraction.fill)
  }

  input.value = meta.prefix + input.value + meta.suffix

  if (minus)
    input.value = '-' + input.value
}
