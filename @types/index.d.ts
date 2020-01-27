export {}

declare global {
  interface DecimalMeta {
    rulable: boolean
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

  interface GroupRegexps {
    [key: number]: RegExp
  }
}
