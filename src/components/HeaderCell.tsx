import { Icon } from 'office-ui-fabric-react'
import React, { ReactNode } from 'react'
import { GridCellProps } from 'react-virtualized'
import styled from 'styled-components'
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
  const { style, columnIndex } = cellProps

  let label: ReactNode = <Label>{col.label}</Label>

  if (col.renderLabel) {
    label = col.renderLabel({ col, colIndex: columnIndex })
  }

  let headerContent

  if (col.renderHeader) {
    headerContent = col.renderHeader({ col, colIndex: columnIndex })
  }
  //
  else {
    headerContent = (
      <DefaultCell>
        {sort && col.isSortable && (
          <StyledIcon
            iconName={
              sort.key === col.key
                ? sort.dir === 'asc'
                  ? 'SortUp'
                  : 'SortDown'
                : 'Sort'
            }
          />
        )}
        {label}
      </DefaultCell>
    )
  }

  let align = 'flex-start'
  if (col.align) align = col.align
  if (col.align === 'right') align = 'flex-end'

  return (
    <Root
      style={{
        ...style,
        cursor: isLoading ? 'wait' : 'pointer',
        justifyContent: align
      }}
      onClick={() => {
        onClick && onClick(col)
      }}
    >
      {headerContent}
    </Root>
  )
}

const Root = styled.div`
  font-size: 14px;
  height: 100%;
  font-weight: 600;
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

const DefaultCell = styled.div`
  padding: 0 12px 0 12px;
  display: flex;
  align-items: center;
  height: 100%;
`

const Label = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const StyledIcon = styled(Icon)`
  margin-right: 5px;
`
