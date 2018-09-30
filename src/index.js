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
  DOWN: 40
},
keyContains = (key) => {
  for (let keyName in KEYS) {
    if (KEYS[keyName] === key) return true
  }

  return false
}

const getCode = e => e.which || e.charCode || e.keyCode
const numberFormat = v => (v||'').replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')


document.querySelectorAll('input[type=number]')
  .forEach(el => {
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
      else if (!e.ctrlKey && !e.metaKey && !keyContains(key)) {
        e.preventDefault()
      }

    }, false)

    el.addEventListener('keyup', e => {
      const key = getCode(e)
      let cursor = el.selectionStart

      // number keys 0(48) ~ 9(57)
      // number pads 0(96) ~ 9(105)
      if ((key >= 48 && key <= 57 && !e.shiftKey)
       || (key >= 96 && key <= 105)) {
        const point = el.value.indexOf('.')

        if (point === -1) {
          el.value = numberFormat(el.value)

          if (/^\d{3}/.test(el.beforeValue)) cursor++
        }
        else if (point > cursor) {
          const integer = el.value.substring(0, point)
          const fraction = el.value.substring(point)

          el.value = numberFormat(integer) + '.'
                   + fraction.replace(/[^\d]/g, '')

          if (/^\d{3}/.test(el.beforeValue)) cursor++
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
    })

    el.addEventListener('blur', e => {
      if (/\.$/.test(el.value)) {
        el.value = el.value.substring(0, el.value.length - 1)
      }
    })
  })