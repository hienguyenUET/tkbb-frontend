import React, { useEffect, useState } from 'react'
import { DataGrid, GridToolbar } from '@material-ui/data-grid'
import CachedOutlined from '@material-ui/icons/CachedOutlined'
import FindInPageOutlined from '@material-ui/icons/FindInPageOutlined'
import IconButton from '@material-ui/core/IconButton'
import { deleteJunk, getJunks } from '../api/junk'

const Junk = () => {
  const citationLink = (citation, user) => (`https://scholar.google.com/citations?view_op=view_citation&hl=en&user=${user}&citation_for_view=${citation}`)
  const [rows, setRows] = useState([])

  const reloadTable = async () => {
    const { data: junks } = await getJunks()
    let rows = junks.map(j => {
      j.id = j.citation;
      return j;
    });
    console.log(rows);
    setRows(rows);
  }

  const columns = [
    { field: 'id', headerName: 'Citation', width: 120 },
    {
      field: 'fullName',
      headerName: 'Name',
      width: 300,
      editable: true,
      renderCell: (params) => {
        return (
          <div>
            {params.getValue('fullName')}
          </div>
        )
      },
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 600,
      editable: true,
      renderCell: (params) => {
        return (
          <div title={params.getValue('title')}>
            {params.getValue('title')}
          </div>
        )
      },
    },
    {
      field: 'error',
      headerName: 'Error',
      width: 300,
      editable: true,
      renderCell: (params) => {
        return (
          <div title={params.getValue('error')}>
            {params.getValue('error')}
          </div>
        )
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      sortable: false,
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <IconButton color="primary"
              onClick={() => window.open(citationLink(params.getValue('citation'), params.getValue('user')), "_blank")}>
              <FindInPageOutlined />
            </IconButton>
            <IconButton
              color="secondary"
              onClick={async () => {
                await deleteJunk(params.getValue('citation'));
                await reloadTable();
              }}
            >
              <CachedOutlined />
            </IconButton>
          </div>
        )
      },
    }]

  useEffect(() => {
    reloadTable()
  }, [])

  return (
    <div>
      <div className="content-wrapper">

        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Junk</h1>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            <div>
              <div style={{ height: 700, width: '100%', backgroundColor: '#fff' }}>
                {<DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={20}
                  components={{
                    Toolbar: GridToolbar
                  }}
                  id="citation"
                />}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Junk
