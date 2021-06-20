import React, { useEffect, useState, useRef } from 'react'
import { DataGrid, GridToolbar } from '@material-ui/data-grid'
import DeleteIcon from '@material-ui/icons/Delete'
import Modal from 'react-bootstrap/modal'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'

import { createPublishcation, getPublishcation, deletePublishcation, updatePublishcation } from '../api';


const Publishcations = props => {
  const [rows, setRows] = useState([])
  const [show, setShow] = useState(false);

  const cNameRef = useRef('')
  const cPointRef = useRef('')
  const cPubTypeRef = useRef('journal')


  const reloadTable = async () => {
    const { data: pub } = await getPublishcation()

    setRows(pub)
  }

  const handleEditCellChangeCommitted = React.useCallback(
    ({ id, field, props }) => {
      const body = {}
      body[field] = props.value

      updatePublishcation(body, id)
        .finally(() => reloadTable())
    },
    [rows],
  )

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'name',
      headerName: 'Name',
      width: 600,
      editable: true,
      renderCell: (params) => {
        return (
          <div>
            {params.getValue('name')}
          </div>
        )
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 200,
      editable: true,
      renderCell: (params) => {
        return (
          <div>
            {params.getValue('type')}
          </div>
        )
      },
    },
    {
      field: 'point',
      headerName: 'Point',
      width: 200,
      editable: true,
      renderCell: (params) => {
        return (
          <div>
            {params.getValue('point')}
          </div>
        )
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <IconButton
              color="secondary"
              onClick={handleDeletePub.bind(this, params.getValue('id'))}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        )
      },
    }]

  useEffect(() => {
    reloadTable()
  }, [])

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleCreate = async () => {
    const body = {
      name: cNameRef.current.value,
      point: cPointRef.current.value,
      type: cPubTypeRef.current.value,
    }

    await createPublishcation(body)
    handleClose()
    reloadTable()
  }

  const handleDeletePub = async (id) => {
    await deletePublishcation(id)
    reloadTable()
  }

  return (
    <div>
      <div className="content-wrapper">

        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Publishcations</h1>
              </div>
              <div className="col-sm-6">
                <div className="float-sm-right">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleShow}
                  >
                    Create
                  </Button>

                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Create publishcation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="form-group">
                        <input
                          className="form-control m-1"
                          placeholder="Name"
                          type="text"
                          ref={cNameRef}
                        />
                        <input
                          className="form-control m-1"
                          placeholder="Point"
                          type="Number"
                          ref={cPointRef}
                        />
                        <select
                          className="browser-default custom-select form-control m-1"
                          ref={cPubTypeRef}
                        >
                          <option value="journal">Journal</option>
                          <option value="conference">Conference</option>
                        </select>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="contained" className="mr-2" color="secondary" onClick={handleClose}>
                        Close
                      </Button>
                      <Button variant="contained" color="primary" onClick={handleCreate}>
                        Create
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">

            <div>
              <div style={{ height: 700, width: '100%', backgroundColor: '#fff' }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  components={{
                    Toolbar: GridToolbar
                  }}
                  onEditCellChangeCommitted={handleEditCellChangeCommitted}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Publishcations
