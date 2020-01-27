import metadata from './metadata'
import keydown from "./events/keydown";
import focus from "./events/focus";
import formatting from "./events/formatting";

document.addEventListener('DOMContentLoaded', () => {
  const changeEvent = new Event('change')

  // <input class="su" ...> 들을 찾는데,
  // 이미 적용된(su--dyed) 건 제외하고 찾아요.
  document.querySelectorAll('input.su:not(.su--dyed)')
    .forEach(element => {
      const input = element as HTMLInputElement;

      register(input, metadata(element))

      // 초기에 값이 할당된 경우, change 이벤트를 호출해서
      // 값을 정의된 패턴에 맞게 formatting 해줘요.
      if (input.value)
        element.dispatchEvent(changeEvent)
    })
})

const register = (input: HTMLInputElement, meta: DecimalMetadata): void => {
  input.addEventListener(
    'keydown',
    (e: KeyboardEvent) => keydown(e, input, meta),
    false
  )

  input.addEventListener(
    'focus',
    () => focus(input, meta),
    false)

  input.addEventListener(
    'focusout',
    (e: Event) => formatting(e, input, meta),
    false)

  input.addEventListener(
    'change',
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
