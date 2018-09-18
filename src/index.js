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

const getCode = (e) => e.which || e.charCode || e.keyCode

document.querySelectorAll('input[type=number]')
  .forEach(el => {
    el.type = 'tel' // change type for mobile key pad
    el.classList.add('su')
    el.style.textAlign = 'right'

    el.addEventListener('keydown', e => {
      const key = getCode(e)

      console.log('down', key, e.ctrlKey, e.metaKey, e.altKey, e.shiftKey)

      // number keys 0(48) ~ 9(57)
      // number pads 0(96) ~ 9(105)
      if ((key >= 48 && key <= 57 && !e.shiftKey)
       || (key >= 96 && key <= 105)) {
        
      }
      else if (KEYS.UP === key) {
        el.value = parseInt(el.value || 0) + 1
      }
      else if (KEYS.DOWN === key) {
        el.value = parseInt(el.value || 0) - 1
      }
      else if (!keyContains(key)) {
        e.preventDefault()
      }

    }, false)

    el.addEventListener('keypress', e => {
      const key = getCode(e)
      console.log('press', key, e.ctrlKey, e.metaKey, e.altKey)
    })
  })