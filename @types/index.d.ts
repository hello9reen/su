export {}

declare global {
  interface DecimalMetadata {
    unlimited: boolean
    prefix: string
    suffix: string
    revert?: number
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
