import React from 'react'
import styled from 'styled-components'
import { GridCellProps } from 'react-virtualized'
import { Icon } from 'office-ui-fabric-react'
import { ColDef, SortProp } from './types'

type Props = {
  cellProps: GridCellProps
  col: ColDef
  sort?: SortProp
  isLoading: boolean
  onClick?: (col: ColDef) => void
}

export const HeaderCell = ({
  cellProps,
  col,
  sort,
  isLoading,
  onClick
}: Props) => {
  const { style } = cellProps

  return (
    <Root
      style={{
        ...style,
        cursor: isLoading ? 'wait' : 'pointer',
        justifyContent: col.align ? col.align : 'flex-start'
      }}
      onClick={() => {
        onClick && onClick(col)
      }}
    >
      {sort && col.isSortable && (
        <Icon
          iconName={
            sort.key === col.key
              ? sort.dir === 'asc'
                ? 'SortUp'
                : 'SortDown'
              : 'Sort'
          }
        />
      )}
      <Label>{col.label}</Label>
    </Root>
  )
}

const Root = styled.div`
  font-size: 14px;
  text-align: left;
  height: 100%;
  font-weight: 600;
  padding: 0 12px 0 12px;
  display: flex;
  align-items: center;
  border-top: 1px solid rgb(237, 235, 233);
  border-bottom: 1px solid rgb(237, 235, 233);
  user-select: none;
  &:hover {
    background-color: rgb(243, 242, 241);
  }
  &:focus {
    outline: none;
  }
`

const Label = styled.span`
  margin-left: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`
