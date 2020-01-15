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

const PRINT_PATTERN: RegExp = /^([^#0-9]*)([#,0-9]*)([^#0-9]*)$/
const DECIMAL_PATTERN: RegExp = /^((#+((#,(#+\d*|\d+))|(\d,\d+))*)|(\d+(,\d+)*))(\.(\d+#*|#+))?$/


const accepts = (key: string): boolean => ACCEPT_KEYS.indexOf(key) > -1

const numberFormat = (value: string | number): string => {
  if (!value) return ''

  return String(value)
    .replace(/[^\d]/g, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const registry = (input: HTMLInputElement): void => {
  const pattern = {
    origin: input.dataset['pattern'] || '',
    groups: null as RegExp,
    integer: {
      fill: '',
      max: 0
    },
    fraction: {
      fill: '',
      max: 0
    }
  }

  const [integer, fraction] = pattern.origin.split('.')

  const groupPosition = integer.lastIndexOf(',')
  if (groupPosition > 0)
    pattern.groups = new RegExp(`\\B(?=(\\d{$(integer.length - groupPosition) + '})+(?!\\d))`)

  const [all, /*mutable*/, immutable] = /^(#*)(0*)$/.exec(integer.replace(/[^#0]/g, ''))
  if (all)
    pattern.integer.max = all.length

  if (immutable)
    pattern.integer.fill = immutable


  if (!pattern) input.setAttribute('data-pattern', '#,##0')
  else {
    // TODO
  }

  input.classList.add('su')
  input.style.textAlign = 'right'

  input.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      const key: string = e.key
      console.log('keydown', key)

      if (/[0-9.]/.test(key)) {
        input.setAttribute('data-before', input.value)
      } else if (/(Arrow)?Up/.test(key)) {
        input.value = String((Number(input.value) || 0) + 1)
      } else if (/(Arrow)?Down/.test(key)) {
        input.value = String((Number(input.value) || 0) - 1)
      } else if ('Delete' === key) {
        const cursor = input.selectionStart

        if (',' === input.value.substring(cursor, cursor + 1)) {
          input.focus()
          input.setSelectionRange(cursor + 1, cursor + 1)
        }
      } else if ('Backspace' === key) {
        const cursor = input.selectionStart

        if (',' === input.value.substring(cursor - 1, cursor)) {
          input.focus()
          input.setSelectionRange(cursor - 1, cursor - 1)
        }
      } else if ('-' === key) {
        if (!/^[-]/.test(input.value)) {
          const cursor = input.selectionStart

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
    let cursor = input.selectionStart

    if (input.value === input.getAttribute("data-keyup"))
      return

    if (key.match(/[0-9]/) || key === 'Delete' || key === 'Backspace') {
      const point = input.value.indexOf('.')

      if (point === -1) {
        input.value = numberFormat(input.value)

        if (key === 'Delete' || key === 'Backspace') {
          if (/^[-]?\d{3}/.test(input.getAttribute('data-before'))) cursor++
        }
      } else if (point >= cursor) {
        const integer = input.value.substring(0, point)
        const fraction = input.value.substring(point)

        input.value = numberFormat(integer) + '.' + fraction.replace(/[^\d]/g, '')

        if ('Delete' === key || 'Backspace' === key) {
          if (/^[-]?\d{3}/.test(input.getAttribute('data-before'))) cursor++
        }
      }

      input.focus()
      input.setSelectionRange(cursor, cursor)
    } else if ('.' === key) {
      const integer = input.value.substring(0, cursor)
      const fraction = input.value.substring(cursor)

      input.value = numberFormat(integer) + '.' + fraction.replace(/[^\d]/g, '')

      cursor = input.value.indexOf('.') + 1

      input.focus()
      input.setSelectionRange(cursor, cursor)
    }

    input.setAttribute('data-keyup', input.value)
  })

  input.addEventListener('blur', () => {
    const point = input.value.indexOf('.')

    if (point === -1) input.value = numberFormat(input.value)
    else {
      const integer = input.value.substring(0, point)
      const fraction = input.value.substring(point + 1)

      input.value = numberFormat(integer)

      if (fraction) {
        input.value += '.' + fraction.replace(/[^\d]/g, '')
      }
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input.su[type=number]:not(.su--dyed)')
    .forEach(registry)
})
