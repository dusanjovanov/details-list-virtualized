import React, { ReactNode, useEffect, useRef } from 'react'
import {
  AutoSizer,
  GridCellRenderer,
  MultiGrid,
  MultiGridProps
} from 'react-virtualized'
import { Cell, DefaultCell } from './Cell'
import { HeaderCell } from './HeaderCell'
import { ColDef, SortProp } from './types'

type Props = {
  cols: ColDef[]
  rows: any[]
  sort?: SortProp
  onClickHeader?: (props: { col: ColDef; colIndex: number }) => void
  onClickCell?: (props: {
    col: ColDef
    row: any
    colIndex: number
    rowIndex: number
  }) => void
  bodyCellRenderer?: GridCellRenderer
  headerCellRenderer?: GridCellRenderer
  id: string
} & MultiGridProps

export const DetailsList = ({
  cols,
  rows,
  width,
  sort,
  onClickHeader,
  onClickCell,
  bodyCellRenderer,
  headerCellRenderer,
  id,
  ...props
}: Props) => {
  const refGrid = useRef<MultiGrid>(null)

  useEffect(() => {
    if (!refGrid.current) return
    refGrid.current.recomputeGridSize()
    refGrid.current.forceUpdateGrids()
  }, [width])

  const cellRenderer: GridCellRenderer = (cellProps) => {
    const { columnIndex, rowIndex, key } = cellProps
    const col = cols[columnIndex]
    const row = rows[rowIndex - 1]

    if (rowIndex === 0) {
      return (
        <HeaderCell
          key={key}
          cellProps={cellProps}
          col={col}
          isLoading={false}
          sort={sort}
          onClick={() => {
            onClickHeader && onClickHeader({ col, colIndex: columnIndex })
          }}
        />
      )
    } else {
      let toRender: ReactNode = <DefaultCell>{row[col.key]}</DefaultCell>

      if (col.render) {
        const customRender = col.render({
          col,
          row,
          colIndex: columnIndex,
          rowIndex: rowIndex - 1
        })
        toRender = customRender
      } else if (col.transform) {
        toRender = (
          <DefaultCell>
            {col.transform({
              col,
              row,
              colIndex: columnIndex,
              rowIndex: rowIndex - 1
            })}
          </DefaultCell>
        )
      }
      return (
        <Cell
          key={key}
          cellProps={cellProps}
          onClick={() => {
            onClickCell &&
              onClickCell({ col, row, colIndex: columnIndex, rowIndex })
          }}
          col={col}
        >
          {toRender}
        </Cell>
      )
    }
  }

  return (
    <AutoSizer>
      {() => (
        <MultiGrid
          {...props}
          ref={refGrid}
          id={id}
          width={width}
          columnCount={cols.length}
          rowCount={rows.length + 1}
          rowHeight={42}
          fixedRowCount={1}
          enableFixedColumnScroll
          hideBottomLeftGridScrollbar
          cellRenderer={cellRenderer}
        />
      )}
    </AutoSizer>
  )
}
