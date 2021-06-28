import React, { useEffect, useState, useRef } from 'react'
import { A } from 'hookrouter'
import { DataGrid, GridToolbar } from '@material-ui/data-grid'
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import Iframe from 'react-iframe'
import GetAppIcon from '@material-ui/icons/GetApp'
import Modal from 'react-bootstrap/Modal'
import AddIcon from '@material-ui/icons/Add'


import { getUsers, uploadUsers, deleteUser, crawArticleData, createUsers, crawlUsers} from '../api'


const Dashboard = props => {
  const [userRows, setUserRows] = useState([])
  const userFileRef = useRef('')
  const cFacultyRef = useRef('')
  const cFullnameRef = useRef('')
  const cGoogleScholarRef = useRef('')
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const reloadUser = async () => {
    const { data: users } = await getUsers()

    setUserRows(users)
  }

  const handleCreate = async () => {
    const body = {
      fullName: cFullnameRef.current.value,
      faculty: cFacultyRef.current.value,
      gsUrl: cGoogleScholarRef.current.value,
    }

    await createUsers(body)
    handleClose()
    reloadUser()
  }

  const userColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'faculty',
      headerName: 'Faculty',
      editable: true,
      width: 160,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      editable: true,
      width: 160,
    },
    {
      field: 'gsUrl',
      headerName: 'Google Scholar Url',
      editable: true,
      width: 550,
      renderCell: (params) => {
        return (
          <div>
            <a href={params.getValue('gsUrl')}>{params.getValue('gsUrl')}</a>
          </div>
        )
      },
    },
    {
      headerName: "Crawl",
      field: "crawl",
      sortable: false,
      width: 160,
      renderCell: (params) => {
        return (
          <div>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCrawl.bind(this, params.getValue('id'))}
            >
              Crawl
            </Button>
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
              onClick={handleDeleteUser.bind(this, params.getValue('id'))}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    reloadUser()
  }, [])

  const handleUploadUserFile = async () => {
    await uploadUsers(userFileRef.current.files[0])
    await reloadUser()
  }

  const handleDeleteUser = async (id) => {
    await deleteUser(id)
    await reloadUser()
  }

  const handleCrawl = async (id) => {
    await crawlUsers(id)
  }

  const handleCrawlArticle = async () => {
    await crawArticleData()
  }

  return (
    <div>
      <div className="content-wrapper">

        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Dashboard</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right nav-links">
                  <li className="breadcrumb-item"><A href="/" >Home</A></li>
                  <li className="breadcrumb-item active">Dashboard</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            <div>
              <div className="d-flex justify-content-between align-items-center m-1">
                <div>
                  <h4>Job queue</h4>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    size="small"
                    startIcon={<GetAppIcon />}
                    onClick={handleCrawlArticle}
                  >
                    Crawl all article Data
                </Button>
                </div>
              </div>
              <div>
                <Iframe
                  url="http://112.137.129.214:35280/queues/queue/crawlGS"
                  width="100%"
                  height="450px"
                  display="initial"
                  position="relative"
                />
              </div>
            </div>

            <div>
              <div className="d-flex justify-content-between align-items-center m-1">
                <div>
                  <h4>Authors</h4>
                </div>
                <div>
                  <input
                    accept=".xlsx"
                    type="file"
                    ref={userFileRef}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    size="small"
                    startIcon={<CloudUploadIcon />}
                    onClick={handleUploadUserFile}
                  >
                    UPLOAD
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  className="ml-1"
                  startIcon={<AddIcon />}
                  onClick={handleShow}
                >
                  Create
                </Button>
                </div>
              </div>

              <div style={{ height: 700, width: '100%', backgroundColor: '#fff' }}>
                <DataGrid
                  rows={userRows}
                  columns={userColumns}
                  pageSize={10}
                  components={{
                    Toolbar: GridToolbar
                  }}
                />
              </div>

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Create Authors</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="form-group">
                    <input
                      className="form-control m-1"
                      placeholder="Fullname"
                      type="text"
                      ref={cFullnameRef}
                    />
                    <input
                      className="form-control m-1"
                      placeholder="Faculty"
                      type="Text"
                      ref={cFacultyRef}
                    />
                    <input
                      className="form-control m-1"
                      placeholder="Google Scholar Url"
                      type="Text"
                      ref={cGoogleScholarRef}
                    />
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
        </section>
      </div>
    </div>
  )
}

export default Dashboard
