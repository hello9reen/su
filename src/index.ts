import getMetaInfo from './meta'

const ACCEPT_KEYS: readonly string[] = [
  'Enter',
  'Backspace',
  'Delete',
  'Home',
  'End',
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


const groupRegExps: GroupRegexps = {}

const accepts = (key: string): boolean => ACCEPT_KEYS.indexOf(key) > -1

const toNumbers = (text: string): string => text.replace(/[^\d-.]/g, '')

const grouping = (integer: string | number, group: number = 3): string => {
  if (!integer) return ''
  if (!groupRegExps[group])
    groupRegExps[group] = new RegExp(`\\B(?=(\\d{${group}})+(?!\\d))`, 'g')

  return toNumbers(String(integer))
    .replace(groupRegExps[group], ',')
}

const fillInteger = (value: string, fill: string) => {
  if (!value) return fill
  else if (value.length < fill.length)
    return fill.substring(0, fill.length - value.length) + value

  return value
}

const fillFraction = (value: string, fill: string) => {
  if (!fill && !value) return ''
  else if (value.length < fill.length)
    value += fill.substring(value.length)

  return '.' + value
}


const registry = (input: HTMLInputElement): void => {
  const meta: DecimalMeta = getMetaInfo(input)

  input.classList.add('su--dyed')
  input.style.textAlign = 'right'

  input.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      const key: string = e.key
      const cursor: number = input.selectionStart as number

      if (key.charCodeAt(0) > 127) {
        meta.revert = cursor
        input.blur()
        return
      } else if (/\d/.test(key)) {
        if (meta.rulable) {
          const [integer, fraction] = input.value.split('.')

          // 정수값을 입력 할 때
          if (cursor <= integer.length) {
            // 정수 패턴의 최대 길이보다 크면 차단
            if (meta.integer.max <= integer.replace(/^-/, '').length) {
              e.preventDefault()
            }
          }
          // 소수값을 입력 할 때
          else {
            // 소수 패턴의 최대 길이보다 크면 차단
            if (meta.fraction.max <= fraction.length) {
              e.preventDefault()
            }
          }
        }
      } else if ('.' === key) {
        if (meta.rulable && meta.fraction.max === 0) {
          e.preventDefault()
          return
        }

        const dotIndex = input.value.indexOf('.')
        if (dotIndex > -1) {
          e.preventDefault()

          setTimeout(() => {
            const value = input.value.replace(/\./, '')

            if (cursor > dotIndex) {
              input.value = value.substring(0, cursor - 1) + '.' + value.substring(cursor - 1)
              input.setSelectionRange(cursor, cursor)
            } else {
              input.value = value.substring(0, cursor) + '.' + value.substring(cursor)
              input.setSelectionRange(cursor + 1, cursor + 1)
            }
          })
        }
      } else if (/^(Arrow)?(Up|Down)$/.test(key)) {
        const value = Number(input.value),
          dotIndex = input.value.indexOf('.')

        input.value = (value + (/Up$/.test(key) ? 1 : -1))
          .toFixed(dotIndex === -1
            ? 0
            : input.value.length - dotIndex - 1)

        setTimeout(() => input.setSelectionRange(cursor, cursor))
      } else if ('-' === key) {
        e.preventDefault()

        if (/^-/.test(input.value)) {
          input.value = input.value.replace(/-/, '')
          input.setSelectionRange(cursor - 1, cursor - 1)
        } else {
          input.value = '-' + input.value
          input.setSelectionRange(cursor + 1, cursor + 1)
        }

      } else if (!e.ctrlKey && !e.metaKey && !accepts(key)) {
        e.preventDefault()
      }
    },
    false
  )

  input.addEventListener('focus', () => {
    setTimeout(() => {
      let cursor: number = input.selectionStart as number

      cursor -= input.value
        .substring(meta.prefix.length, cursor)
        .split(/[^\d.]/)
        .length - 1

      cursor -= meta.prefix.length

      input.value = toNumbers(input.value)

      if (/^-/.test(input.value)) {
        cursor++
      }

      input.setSelectionRange(cursor, cursor)
    })
  }, false)


  const _focusout = (e: Event) => {
    if (meta.revert) {
      e.stopImmediatePropagation()
      e.stopPropagation()
      e.preventDefault()

      input.focus()

      setTimeout(() => {
        if (meta.revert) {
          input.setSelectionRange(meta.revert, meta.revert)
          meta.revert = undefined
        }
      })

      return
    }

    const minus = /^-/.test(input.value)
    const value = input.value.replace(/[^\d.]/g, '')
    const point = value.indexOf('.')

    if (point === -1) {
      input.value = fillInteger(grouping(value), meta.integer.fill)
        + fillFraction('', meta.fraction.fill)
    } else {
      input.value = fillInteger(grouping(value.substring(0, point)), meta.integer.fill)
      input.value += fillFraction(toNumbers(value.substring(point + 1)), meta.fraction.fill)
    }

    if (minus)
      input.value = '-' + input.value

    if (input.value) {
      input.value = meta.prefix + input.value + meta.suffix
    }
  }

  input.addEventListener('focusout', _focusout, false)
  input.addEventListener('change', _focusout, false)
}

document.addEventListener('DOMContentLoaded', () => {
  const changeEvent = new Event('change')

  document.querySelectorAll('input.su:not(.su--dyed)')
    .forEach(input => {
      registry(input as HTMLInputElement)

      if ((input as HTMLInputElement).value)
        input.dispatchEvent(changeEvent)
    })
})
