import React, { useState, useEffect } from 'react'
import { DetailsList, ColDef } from 'details-list-virtualized'
import faker from 'faker'
import { useWindowSize } from './useWindowSize'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import { createPortal } from 'react-dom'
import moment from 'moment'
import { useToasts } from 'react-toast-notifications'
import { Icon } from 'office-ui-fabric-react'

const getCols = (
  rows: any[],
  setRows: (rows: any[]) => void,
  addToast: any
) => {
  const cols: ColDef[] = [
    {
      key: 'profileImage',
      isSortable: false,
      label: '',
      width: 50,
      align: 'center',
      render: ({ row }) => (
        <img style={{ width: '100%', height: '100%' }} src={row.profileImage} />
      )
    },
    {
      key: 'name',
      isSortable: true,
      label: 'Name',
      width: 100
    },
    {
      key: 'dob',
      isSortable: true,
      label: 'Date of Birth',
      width: 150,
      transform: ({ row }) => {
        return moment(row.dob).format('LL')
      },
      renderLabel: () => {
        return (
          <div style={{ display: 'flex' }}>
            <Icon iconName='Calendar' />
          </div>
        )
      },
      align: 'center'
    },
    {
      key: 'address',
      isSortable: true,
      label: 'Address',
      width: 200,
      transform: ({ row }) => {
        return (
          <div
            data-for='tooltip'
            data-tip={row.address}
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
          >
            {row.address}
          </div>
        )
      }
    },
    {
      key: 'phoneNumber',
      isSortable: true,
      label: 'Phone',
      width: 200
    },
    {
      key: 'email',
      isSortable: true,
      label: 'Email',
      width: 200
    },
    {
      key: 'isEmployed',
      isSortable: false,
      label: 'Is employed',
      width: 150,
      align: 'center',
      transform: ({ row }) => (
        <input
          type='checkbox'
          checked={row.isEmployed}
          onChange={(e) => {
            const isChecked = e.target.checked
            setRows(
              rows.map((r) => {
                if (r.id === row.id) {
                  return {
                    ...r,
                    isEmployed: isChecked
                  }
                }
                return r
              })
            )
          }}
        />
      )
    },
    {
      key: 'companyName',
      isSortable: false,
      label: 'Company',
      width: 200,
      transform: ({ row }) => {
        if (row.isEmployed) {
          return row.companyName
        } else {
          return '❌'
        }
      }
    },
    {
      key: 'gender',
      isSortable: false,
      label: 'Gender',
      width: 200,
      transform: ({ row }) => {
        return (
          <select
            value={row.gender}
            onChange={(e) => {
              setRows(
                rows.map((r) => {
                  if (r.id === row.id) {
                    return {
                      ...r,
                      gender: e.target.value
                    }
                  }
                  return r
                })
              )
            }}
          >
            <option value='male'>M</option>
            <option value='female'>F</option>
          </select>
        )
      }
    },
    {
      key: 'pet',
      isSortable: true,
      label: 'Pet',
      width: 70,
      align: 'center',
      transform: ({ row }) => {
        if (row.pet === 'cat') {
          return (
            <div data-for='tooltip' data-tip='Cat'>
              😺
            </div>
          )
        } else if (row.pet === 'dog') {
          return (
            <div data-for='tooltip' data-tip='Dog'>
              🐶
            </div>
          )
        } else {
          return (
            <div data-for='tooltip' data-tip='Lizard'>
              🦎
            </div>
          )
        }
      }
    },
    {
      key: 'options',
      isSortable: false,
      label: '',
      width: 40,
      render: ({ row, rowIndex }) => {
        return (
          <CenteredCell>
            <button
              style={{ padding: '2px' }}
              onClick={() => {
                const rowsCopy = rows.slice(0)
                rowsCopy.splice(rowIndex, 1)
                setRows(rowsCopy)
                addToast(`Deleted ${row.name}`, {
                  appearance: 'error',
                  autoDismiss: true,
                  // @ts-ignore
                  autoDismissTimeout: 3000
                })
              }}
            >
              🗑️
            </button>
          </CenteredCell>
        )
      }
    },
    {
      key: 'filler',
      label: '',
      renderHeader: () => {
        return (
          <iframe
            width='100%'
            height='100%'
            src='https://www.youtube.com/embed/tgbNymZ7vqY'
          ></iframe>
        )
      },
      align: 'center',
      render: ({ row }) => {
        return (
          <CenteredCell>
            <img
              id={`image-${row.id}`}
              style={{
                width: 40,
                height: '100%',
                marginRight: 5
              }}
              src='https://picsum.photos/40/40'
            />
            <button
              onClick={() => {
                const img = document.getElementById(
                  `image-${row.id}`
                ) as HTMLImageElement
                img.src = `https://picsum.photos/${getRandomInt(
                  30,
                  40
                )}/${getRandomInt(30, 40)}`
              }}
            >
              New image
            </button>
          </CenteredCell>
        )
      },
      width: 0
    }
  ]

  return cols
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const initRows = Array(1000)
  .fill(0)
  .map((_, idx) => {
    const isEmployed = faker.random.boolean()
    const gender = Math.random() > 0.5 ? 'male' : 'female'

    return {
      id: faker.random.uuid(),
      profileImage: `https://avatars.dicebear.com/api/${gender}/${idx}.svg`,
      name: faker.name.firstName(),
      address: faker.address.streetAddress() + ', ' + faker.address.city(),
      phoneNumber: faker.phone.phoneNumber(),
      email: faker.internet.email(),
      isEmployed,
      companyName: faker.company.companyName(),
      gender,
      pet: Math.random() > 0.7 ? 'dog' : Math.random() > 0.5 ? 'cat' : 'lizard',
      dob: faker.date.past(30)
    }
  })

const App = () => {
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const [rows, setRows] = useState(initRows)
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' })
  const [width, setWidth] = useState(windowWidth)
  const [fixedCols, setFixedCols] = useState(2)
  const { addToast } = useToasts()

  const cols = getCols(rows, setRows, addToast)

  useEffect(() => {
    setRows([
      ...rows.sort((a, b) => {
        if (a[sort.key] > b[sort.key]) {
          if (sort.dir === 'desc') return -1
          else return 1
        } else if (a[sort.key] < b[sort.key]) {
          if (sort.dir === 'desc') return 1
          else return -1
        } else {
          return 0
        }
      })
    ])
  }, [sort])

  useEffect(() => {
    setWidth(Math.min(width, windowWidth))
  }, [windowWidth, width])

  const headerHeight = 100

  return (
    <>
      <div style={{ height: headerHeight, paddingBottom: 20 }}>
        <h1>Basic List</h1>
        <Controls>
          <div>
            <div>Width: {width}</div>
            <input
              type='range'
              value={width}
              min={300}
              max={windowWidth}
              onChange={(e) => {
                setWidth(+e.target.value)
              }}
            />
          </div>
          <div>
            <div>Fixed columns: {fixedCols}</div>
            <input
              type='range'
              value={fixedCols}
              min={0}
              step={1}
              max={cols.length}
              onChange={(e) => {
                setFixedCols(+e.target.value)
              }}
            />
          </div>
        </Controls>
      </div>
      <DetailsList
        id='myList'
        cols={cols}
        rows={rows}
        columnCount={cols.length}
        rowCount={rows.length}
        columnWidth={({ index }) => {
          if (cols[index].key === 'filler') {
            return Math.max(
              0,
              cols.reduce((sum, c) => sum + c.width, 0)
            )
          }
          return cols[index].width
        }}
        fixedColumnCount={fixedCols}
        cellRenderer={() => null}
        height={windowHeight - headerHeight}
        width={width}
        rowHeight={40}
        onSectionRendered={() => {
          ReactTooltip.rebuild()
        }}
        onClickCell={({ row }) => {
          addToast(`Clicked on ${row.name}`, {
            appearance: 'info',
            autoDismiss: true,
            // @ts-ignore
            autoDismissTimeout: 3000
          })
        }}
        sort={sort}
        onClickHeader={({ col }) => {
          if (!col.isSortable) return

          const isSorted = sort.key === col.key
          if (isSorted) {
            setSort({
              key: col.key,
              dir: sort.dir === 'asc' ? 'desc' : 'asc'
            })
          } else {
            setSort({
              key: col.key,
              dir: 'asc'
            })
          }
        }}
      />
      {createPortal(
        <ReactTooltip id='tooltip' effect='solid' />,
        document.body
      )}
    </>
  )
}

export default App

const CenteredCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`

const Controls = styled.div`
  display: flex;
  align-items: center;
`
