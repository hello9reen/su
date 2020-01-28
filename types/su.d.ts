export {}

declare global {
  interface Su {
    origin: string
    groups: number
    integer: {
      fill: string
      max: number
    }
    fraction: {
      fill: string
      max: number
    }
  }

  interface Window {
    CustomEvent: CustomEvent
  }
}
