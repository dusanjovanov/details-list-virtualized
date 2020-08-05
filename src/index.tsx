import * as React from 'react'
import styles from './styles.module.css'
import { DetailsList } from './components/DetailsList'
import { ColDef, SortProp } from './components/types'
import { Cell } from './components/Cell'
import { HeaderCell } from './components/HeaderCell'
import './index.css'
import { initializeIcons } from '@uifabric/icons'

initializeIcons()

export { DetailsList, ColDef, SortProp, Cell, HeaderCell }

interface Props {
  text: string
}

export const ExampleComponent = ({ text }: Props) => {
  return <div className={styles.test}>Example Component: {text}</div>
}
