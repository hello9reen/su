const KEYS = {
  COMMA: 12
}

const getCode = (e) => e.which || e.charCode || e.keyCode

document.querySelectorAll('input[type=number]')
  .forEach(el => {
    el.addEventListener('keydown', e => {
      const key = getCode(e)

      console.log('down', key, e.ctrlKey, e.metaKey, e.altKey)
    }, false)

    el.addEventListener('keypress', e => {
      const key = getCode(e)
      console.log('press', key, e.ctrlKey, e.metaKey, e.altKey)
    })
  })