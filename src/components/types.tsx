import { CSSProperties, ReactNode } from 'react'

export type ColDef = {
  label: string
  key: string
  isSortable: boolean
  width: number
  align?: CSSProperties['textAlign']
  style?: CSSProperties
  render?: (props: {
    col: ColDef
    row: any
    colIndex: number
    rowIndex: number
  }) => ReactNode
  transform?: (props: {
    col: ColDef
    row: any
    colIndex: number
    rowIndex: number
  }) => ReactNode
  data?: { [key: string]: any }
}

export type SortProp = {
  key: string
  dir: string
}
