const ACCEPT_KEYS: readonly string[] = [
  'Backspace',
  'Delete',
  'End',
  'Home',
  'Left',
  'Up',
  'Right',
  'Down',
  'ArrowLeft',
  'ArrowUp',
  'ArrowRight',
  'ArrowDown',
  'Tab',
  '-'
]

const PRINT_PATTERN: RegExp = /^([^#.0-9]*)([#,.0-9]*)([^#0-9]*)$/
const DECIMAL_PATTERN: RegExp = /^((#+((#,(#+\d*|\d+))|(\d,\d+))*)|(\d+(,\d+)*))?(\.(\d+#*|#+))?$/


const accepts = (key: string): boolean => ACCEPT_KEYS.indexOf(key) > -1

const groupRegExps: { [key: number]: RegExp } = {}
const grouping = (integer: string | number, group: number = 3): string => {
  if (!integer) return ''
  if (!groupRegExps[group])
    groupRegExps[group] = new RegExp(`\\B(?=(\\d{${group}})+(?!\\d))`)

  return String(integer)
    .replace(/[^\d]/g, '')
    .replace(groupRegExps[group], ',')
}

const registry = (input: HTMLInputElement): void => {
  const origin = input.dataset['pattern'] || ''

  const [, prefix, decimalPattern, suffix] = PRINT_PATTERN.exec(origin)

  console.log(PRINT_PATTERN.exec(origin))

  if (!DECIMAL_PATTERN.test(decimalPattern))
    throw `illegal numeric pattern "${decimalPattern}"`

  const info = {
      origin,
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
    },
    defineInteger = (number: string) => {
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
    },
    defineFaction = (number: string) => {
      if (!number) return

      const [all, immutable] = /^(\d*)(#*)$/.exec(number.replace(/[^#0-9]/g, ''))
      if (all)
        info.fraction.max = all.length

      if (immutable)
        info.fraction.fill = immutable
    }

  const [integerPart, fractionPart] = decimalPattern.split('.')
  defineInteger(integerPart)
  defineFaction(fractionPart)

  input.setAttribute('data-pattern', JSON.stringify(info))

  input.classList.add('su')
  input.style.textAlign = 'right'

  input.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      const key: string = e.key
      const cursor: number = input.selectionStart as number

      console.log('keydown', key)

      if (/[0-9.]/.test(key)) {
        input.setAttribute('data-before', input.value)
      } else if (/(Arrow)?Up/.test(key)) {
        input.value = String((Number(input.value) || 0) + 1)
      } else if (/(Arrow)?Down/.test(key)) {
        input.value = String((Number(input.value) || 0) - 1)
      } else if ('Delete' === key) {

        if (',' === input.value.substring(cursor, cursor + 1)) {
          input.focus()
          input.setSelectionRange(cursor + 1, cursor + 1)
        }
      } else if ('Backspace' === key) {
        if (',' === input.value.substring(cursor - 1, cursor)) {
          input.focus()
          input.setSelectionRange(cursor - 1, cursor - 1)
        }
      } else if ('-' === key) {
        if (!/^[-]/.test(input.value)) {
          input.value = '-' + input.value

          input.focus()
          input.setSelectionRange(cursor + 1, cursor + 1)
        }

        e.preventDefault()
      } else if (!e.ctrlKey && !e.metaKey && !accepts(key)) {
        e.preventDefault()
      }
    },
    false
  )

  input.addEventListener('keyup', (e: KeyboardEvent) => {
    const key = e.key
    let cursor = input.selectionStart as number

    if (input.value === input.getAttribute("data-keyup"))
      return

    if (key.match(/[0-9]/) || key === 'Delete' || key === 'Backspace') {
      const point = input.value.indexOf('.')

      if (point === -1) {
        input.value = grouping(input.value)

        if (key === 'Delete' || key === 'Backspace') {
          if (/^[-]?\d{3}/.test(<string>input.getAttribute('data-before'))) cursor++
        }
      } else if (point >= cursor) {
        const integer = input.value.substring(0, point)
        const fraction = input.value.substring(point)

        input.value = grouping(integer) + '.' + fraction.replace(/[^\d]/g, '')

        if ('Delete' === key || 'Backspace' === key) {
          if (/^[-]?\d{3}/.test(<string>input.getAttribute('data-before'))) cursor++
        }
      }

      input.focus()
      input.setSelectionRange(cursor, cursor)
    } else if ('.' === key) {
      const integer = input.value.substring(0, cursor)
      const fraction = input.value.substring(cursor)

      input.value = grouping(integer) + '.' + fraction.replace(/[^\d]/g, '')

      cursor = input.value.indexOf('.') + 1

      input.focus()
      input.setSelectionRange(cursor, cursor)
    }

    input.setAttribute('data-keyup', input.value)
  })

  input.addEventListener('blur', () => {
    const point = input.value.indexOf('.')

    if (point === -1) input.value = grouping(input.value)
    else {
      const integer = input.value.substring(0, point)
      const fraction = input.value.substring(point + 1)

      input.value = grouping(integer)

      if (fraction) {
        input.value += '.' + fraction.replace(/[^\d]/g, '')
      }
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input[type=number]:not(.su--dyed)')
    .forEach(input => registry(<HTMLInputElement>input))
})
