if (navigator.userAgent.match(/trident|msie/i)) {
  if (typeof window.CustomEvent !== 'function') {
    const CustomEvent = function (event: string, params: any) {
      params = params || {bubbles: false, cancelable: false, detail: undefined}

      const evt = document.createEvent('CustomEvent')
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
      return evt
    }

    CustomEvent.prototype = window.Event.prototype

    window.CustomEvent = <any>CustomEvent
  }
}
