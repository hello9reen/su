import {toNumber} from "../utils";

export default (input: HTMLInputElement, meta: DecimalMetadata) => {
  let cursor: number = input.selectionStart as number

  cursor -= input.value
    .substring(meta.prefix.length, cursor)
    .split(/[^\d.]/)
    .length - 1

  cursor -= meta.prefix.length

  input.value = toNumber(input.value)

  if (/^-/.test(input.value))
    cursor++

  setTimeout(() => {
    input.setSelectionRange(cursor, cursor)
  })
}
