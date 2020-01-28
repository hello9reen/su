const ACCEPT_KEYS: readonly string[] = [
  'Enter',
  'Backspace',
  'Delete',
  'Home',
  'End',
  'ArrowLeft',
  'Left',
  'ArrowRight',
  'Right',
  'Tab',
  '-'
]

const accepts = (key: string): boolean => ACCEPT_KEYS.indexOf(key) > -1

export default (e: KeyboardEvent, input: HTMLInputElement, meta: DecimalMetadata) => {
  const key: string = e.key
  const cursor: number = input.selectionStart as number

  if (/\d/.test(key)) {
    if (!meta.unlimited) {
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
    if (!meta.unlimited && meta.fraction.max === 0) {
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
  } else if (!e.ctrlKey && !e.metaKey && !e.altKey && !accepts(key)) {
    const fired = () => {
      input.value = input.value.replace(/[^\d-.]/g, '')
      input.removeEventListener('keyup', fired)

      setTimeout(() => {
        const cursor = meta.cursor || 0
        input.setSelectionRange(cursor, cursor)
        input.readOnly = false
      })
    }

    meta.cursor = cursor

    input.addEventListener('keyup', fired)
    input.readOnly = true
  }
}
