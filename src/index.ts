import metadata from './metadata'
import keydown from './events/keydown'
import focus from './events/focus'
import formatting from './events/formatting'

import './custom-event-for-ie11'

document.addEventListener('DOMContentLoaded', () => {
  const changeEvent = new (typeof Event === 'function' ? Event : CustomEvent)('change')

  // <input class="su" ...> 들을 찾는데,
  // 이미 적용된(su--dyed) 건 제외하고 찾아요.
  // IE11 의 <NodeList>querySelectorAll 가 forEach 를 지원하지 않아서...
  const nodes = document.querySelectorAll('input.su:not(.su--dyed)')

  for (let i = 0; i < nodes.length; i++) {
    const input = nodes[i] as HTMLInputElement

    register(input, metadata(input))

    // 초기에 값이 할당된 경우, change 이벤트를 호출해서
    // 정의된 패턴에 맞게 값을 formatting 해줘요.
    if (input.value)
      input.dispatchEvent(changeEvent)
  }
})

const register = (input: HTMLInputElement, meta: DecimalMetadata): void => {
  input.addEventListener(
    'keydown',
    (e: KeyboardEvent) => keydown(e, input, meta),
    false
  )

  //
  // input.addEventListener(
  //   'keydown',
  //   (e: KeyboardEvent) => {
  //     console.log('keydown', e.key, input.value)
  //     input.readOnly = true
  //     e.preventDefault()
  //   },
  //   false)
  //
  // input.addEventListener(
  //   'keypress',
  //   (e: KeyboardEvent) => {
  //     console.log('keypress', e.key, input.value)
  //     input.readOnly = false
  //     e.preventDefault()
  //   },
  //   false)
  //
  // input.addEventListener(
  //   'keyup',
  //   (e: KeyboardEvent) => {
  //     console.log('keyup', e.key, input.value)
  //     input.readOnly = false
  //   },
  //   false)


  input.addEventListener(
    'focus',
    () => focus(input, meta),
    false)

  input.addEventListener(
    'focusout',
    (e: Event) => formatting(e, input, meta),
    false)

  // 적용된 형태로 명시하고, 숫자를 위한 정렬 스타일을 적용해요.
  input.classList.add('su--dyed')
  input.style.textAlign = 'right'

  // <input type=number...> 의 경우,
  // setSelectionRange 함수등이 동작하지 않아요.
  if (input.getAttribute('type') === 'number')
    input.setAttribute('type', 'text')
}
