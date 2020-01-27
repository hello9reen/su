export const toNumber = (text: string): string => text.replace(/[^\d-.]/g, '')

const groupRegExps: { [key: number]: RegExp } = {}
export const grouping = (integer: string | number, group: number = 3): string => {
  if (!integer) return ''
  if (!groupRegExps[group])
    groupRegExps[group] = new RegExp(`\\B(?=(\\d{${group}})+(?!\\d))`, 'g')

  return toNumber(String(integer))
    .replace(groupRegExps[group], ',')
}

export const fillInteger = (value: string, fill: string) => {
  if (!value) return fill
  else if (value.length < fill.length)
    return fill.substring(0, fill.length - value.length) + value

  return value
}

export const fillFraction = (value: string, fill: string) => {
  if (!fill && !value) return ''
  else if (value.length < fill.length)
    value += fill.substring(value.length)

  return '.' + value
}
