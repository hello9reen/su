import {fillFraction, fillInteger, grouping} from './utils'

const isMinus = (value: string): boolean => /^-/.test(value)

export default (e: Event, input: HTMLInputElement, meta: DecimalMetadata) => {
  if (!input.value) return

  const minus = isMinus(input.value)
  let [integer = '', fraction = ''] = input.value.split(/\./)

  if (integer.length > meta.integer.max)
    integer = integer.substring(integer.length - meta.integer.max)

  if (fraction.length > meta.fraction.max)
    fraction = fraction.substring(0, meta.fraction.max)

  input.value =
    meta.prefix +
    grouping(fillInteger(integer, meta.integer.fill)) +
    fillFraction(fraction, meta.fraction.fill) +
    meta.suffix

  if (minus)
    input.value = '-' + input.value
}
