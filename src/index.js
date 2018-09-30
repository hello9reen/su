const KEYS = {
  BACKSPACE: 8,
  DELETE: 46,
  PAGEUP: 33,
  PAGEDOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  TAB: 9,
  MINUS: 189,
  MINUS_NUMPAD: 109
},
keyContains = (key) => {
  for (let keyName in KEYS) {
    if (KEYS[keyName] === key) return true
  }

  return false
}

const getCode = e => e.which || e.charCode || e.keyCode
const numberFormat = v => (v||'').replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const registry = el => {
  el.type = 'tel' // change type for mobile key pad
  el.classList.add('su')
  el.style.textAlign = 'right'

  el.addEventListener('keydown', e => {
    const key = getCode(e)

    // number keys 0(48) ~ 9(57)
    // number pads 0(96) ~ 9(105)
    // decimal point(110), priod(190)
    if ((key >= 48 && key <= 57 && !e.shiftKey)
     || (key >= 96 && key <= 105)
     || ((key === 110 || key === 190))
    ) {
      el.beforeValue = el.value
    }
    else if (KEYS.UP === key) {
      el.value = parseInt(el.value || 0) + 1
    }
    else if (KEYS.DOWN === key) {
      el.value = parseInt(el.value || 0) - 1
    }
    else if (KEYS.DELETE === key) {
      const cursor = el.selectionStart

      if (',' === el.value.substring(cursor, cursor + 1)) {
        el.focus()
        el.setSelectionRange(cursor + 1, cursor + 1)
      }
    }
    else if (KEYS.BACKSPACE === key) {
      const cursor = el.selectionStart

      if (',' === el.value.substring(cursor - 1, cursor)) {
        el.focus()
        el.setSelectionRange(cursor - 1, cursor - 1)
      }
    }
    else if (KEYS.MINUS === key || KEYS.MINUS_NUMPAD === key) {
      if (!/^\-/.test(el.value)) {
        const cursor = el.selectionStart

        el.value = '-' + el.value

        el.focus()
        el.setSelectionRange(cursor + 1, cursor + 1)
      }

      e.preventDefault()
    }
    else if (!e.ctrlKey && !e.metaKey && !keyContains(key)) {
      e.preventDefault()
    }

  }, false)

  el.addEventListener('keyup', e => {
    const key = getCode(e)
    let cursor = el.selectionStart

    if (el.value === el.keyupValue) return

    if ((key >= 48 && key <= 57 && !e.shiftKey) // number keys 0(48) ~ 9(57)
     || (key >= 96 && key <= 105) // number pads 0(96) ~ 9(105)
     || key === KEYS.DELETE
     || key === KEYS.BACKSPACE
    ) {
      const point = el.value.indexOf('.')

      if (point === -1) {
        el.value = numberFormat(el.value)

        if (key !== KEYS.DELETE && key !== KEYS.BACKSPACE) {
          if (/^\-?\d{3}/.test(el.beforeValue)) cursor++
        }
      }
      else if (point > cursor) {
        const integer = el.value.substring(0, point)
        const fraction = el.value.substring(point)

        el.value = numberFormat(integer) + '.'
                 + fraction.replace(/[^\d]/g, '')

        if (key !== KEYS.DELETE && key !== KEYS.BACKSPACE) {
          if (/^\-?\d{3}/.test(el.beforeValue)) cursor++
        }
      }

      el.focus()
      el.setSelectionRange(cursor, cursor)
    }
    // decimal point(110), priod(190).
    else if (key === 110 || key === 190) {
      const integer = el.value.substring(0, cursor)
      const fraction = el.value.substring(cursor)

      el.value = numberFormat(integer) + '.'
               + fraction.replace(/[^\d]/g, '')

      cursor = el.value.indexOf('.') + 1

      el.focus()
      el.setSelectionRange(cursor, cursor)
    }

    el.keyupValue = el.value
  })

  el.addEventListener('blur', e => {
    if (/\.$/.test(el.value)) {
      el.value = el.value.substring(0, el.value.length - 1)
    }
  })
}

document.addEventListener('DOMContentLoaded', e => {
  document.querySelectorAll('input[type=number]:not(.su)')
  .forEach(registry)
})
