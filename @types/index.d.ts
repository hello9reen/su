export {}

declare global {
  interface DecimalMetadata {
    prefix: string
    suffix: string
    cursor?: number
    integer: {
      groups: number
      fill: string
      max: number
    },
    fraction: {
      fill: string
      max: number
    }
  }
}
