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
const numberFormat = v => v.replace(/[^\d]/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')


document.querySelectorAll('input[type=number]')
  .forEach(el => {
    el.type = 'tel' // change type for mobile key pad
    el.classList.add('su')
    el.style.textAlign = 'right'

    el.addEventListener('keydown', e => {
      const key = getCode(e)

      // number keys 0(48) ~ 9(57)
      // number pads 0(96) ~ 9(105)
      if ((key >= 48 && key <= 57 && !e.shiftKey)
       || (key >= 96 && key <= 105)) {
        // bypass
      }
      // decimal point(110), priod(190)
      else if ((key === 110 || key === 190) && el.value.indexOf('.') < 0) {
        // bypass        
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

      // number keys 0(48) ~ 9(57)
      // number pads 0(96) ~ 9(105)
      if ((key >= 48 && key <= 57 && !e.shiftKey)
       || (key >= 96 && key <= 105)) {
        let cursor = el.selectionStart
        let add = cursor > 0 &&
                    el.value.slice(/,/)[0].length === 3

        const fraction = el.value.indexOf('.')

        console.log(cursor, fraction, add, el.value)

        if (fraction > -1) {
          if (fraction < cursor) {
            add = false
          }

          el.value = numberFormat(el.value.substring(0, fraction))
                   + el.value.substring(fraction)
        }
        else {
          el.value = numberFormat(el.value)
        }

        if (add) {
          cursur++
        }

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