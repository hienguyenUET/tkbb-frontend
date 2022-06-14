import { useEffect, useState, useRef } from 'react'
import { A } from 'hookrouter'
//import { DataGrid } from '@material-ui/data-grid'
//import DataGrid from '../components/DataGrid'
import DataGrid from '../components/ScholarDataGrid'
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import BugReportOutlined from '@material-ui/icons/BugReportOutlined';
import IconButton from '@material-ui/core/IconButton'

import GetAppIcon from '@material-ui/icons/GetApp'
import Modal from 'react-bootstrap/Modal'
import Input from '@material-ui/core/Input'

import { getUsers, uploadUsers, deleteUser, updateUser, crawArticleData, createUsers, crawlUsers} from '../api'


const Dashboard = props => {
  const [users, setUsers] = useState([]);
  const [rows, setRows] = useState([])
  let [showError, setShowError] = useState(false);
  const userFileRef = useRef('')
  const cFacultyRef = useRef('')
  const cFullnameRef = useRef('')
  const cEnglishNameRef = useRef('')
  const cGoogleScholarRef = useRef('')
  const [show, setShow] = useState(false);
  const [yearWindow, setYearWindow] = useState(0);

  let [filterModel, setFilterModel] = useState({items: []});
  let [searchText, setSearchText] = useState('');

  const requestSearch = (searchValue) => {
    function escapeRegExp(value) {
      return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = users.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(('' + row[field]));
      });
    });
    setRows(filteredRows);
  };
  const handleClose = () => setShow(false)

  const reloadUser = async () => {
    const { data: users } = await getUsers()
    console.log(showError);
    if (showError) {
      setRows(users.filter(u => (u.crawlStatus && u.crawlStatus.length)));
      setUsers(users.filter(u => (u.crawlStatus && u.crawlStatus.length)));
    }
    else {
      setRows(users);
      setUsers(users);
    }
  }

  const handleCreate = async () => {
    const body = {
      fullName: cFullnameRef.current.value,
      englishName: cEnglishNameRef.current.value,
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
      renderCell: (params) => (
        <div style={{width: '100%', overflow:' hidden', textOverflow: 'ellipsis'}} 
          title={params.getValue('faculty')}>{params.getValue('faculty')}
        </div>
      ),
      width: 120,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      renderCell: (params) => {
        let crawlStatus = params.getValue('crawlStatus');
        return (<div style={{
            width: '100%', 
            overflow:' hidden', 
            textOverflow: 'ellipsis', 
            color: (crawlStatus && crawlStatus.length)?'red':'inherit'
          }} 
          title={(crawlStatus && crawlStatus.length)?crawlStatus:params.getValue('fullName')}>{params.getValue('fullName')}
        </div>)
      },
      editable: true,
      width: 180,
    },
    {
      field: 'englishName',
      editable: true,
      headerName: "Eng. name",
      renderCell: (params) => (
        <div style={{width: '100%', overflow:' hidden', textOverflow: 'ellipsis'}} 
          title={params.getValue('faculty')}>{params.getValue('englishName') && params.getValue('englishName').length ? params.getValue('englishName') : 'N/A'}
        </div>
      ),
      width: 120,
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
              onClick={() => handleCrawl(params.getValue('id'))}
            >
              Crawl {yearWindow} năm
            </Button>
          </div>
        )
      },
    },
    { field: 'startDate', headerName: "Start", editable: true, sortable: false, width: 120 },
    { field: 'endDate', headerName: "End", editable: true, sortable: false, width: 120 },
    {
      headerName: "Actions",
      field: "actions",
      width: 100,
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
    setShowError(false);
    reloadUser();
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
    console.log("ShowERROR:", showError, id);
    await crawlUsers(id, yearWindow);
    console.log("ShowERROR1:", showError);
    await reloadUser()
  }

  const handleCrawlArticle = async () => {
    await crawArticleData(yearWindow)
  }
  const handleCellChanged = ({id, field, props}) => {
    const body = {}
    switch (field) {
    case 'startDate':
    case 'endDate':
      body[field] = props.value.length?props.value:null;
      break;
    default:
      body[field] = props.value
    }

    updateUser(id, body)
      .finally(() => reloadUser())
  }
  return (
    <div>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Scholars {showError}</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right nav-links">
                  <li className="breadcrumb-item"><A href="/" >Home</A></li>
                  <li className="breadcrumb-item active">Scholars</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center m-1">
              <div>
                <Button variant="contained" color="primary" component="span" size="small" startIcon={<GetAppIcon />}
                  onClick={handleCrawlArticle} >
                  Crawl
                </Button>
                <select style={{marginLeft: "6px"}} value={props.faculty} onChange={(evt) => setYearWindow(evt.target.value)}>
                  <option value={0}>Năm hiện tại</option>
                  <option value={1}>Từ 1 năm trước</option>
                  <option value={2}>Từ 2 năm trước</option>
                  <option value={3}>Từ 3 năm trước</option>
                  <option value={4}>Từ 4 năm trước</option>
                  <option value={5}>Từ 5 năm trước</option>
                  <option value={-1}>Tất cả các năm</option>
                </select>
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
                >UPLOAD
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  className="ml-1"
                  startIcon={<AddIcon />}
                  onClick={() => setShow(true)}
                >Create
                </Button>
                {/*<Button 
                  variant="contained" 
                  className="ml-1"
                  size="small"
                  color={showError?"primary":"secondary"}
                  startIcon={<BugReportOutlined />}
                  onClick={async () => {setShowError(!showError);await reloadUser();}}>
                  {showError?"Show Error":"Show All"}
                </Button>*/}
              </div>
            </div>

            <div style={{ height: 700, width: '100%', backgroundColor: '#fff' }}>
              <DataGrid
                rows={rows}
                columns={userColumns}
                pageSize={30}
                filterModel={filterModel}
                onFilterModelChange={(params) => {
                  params.api.setPage(0);
                }}
                clearFilterFn={() => {
                  requestSearch('');
                  setFilterModel({items:[]})
                }}
                filterText={searchText}
                filterTextChangeFn={(event) => requestSearch(event.target.value)}
                errorOnly={showError}
                toggleErrorOnly={() => {
                    showError = !showError;
                    setShowError(showError);
                    reloadUser();
                }}
                onEditCellChangeCommitted={handleCellChanged}
              />
                {/*onEditCellChangeCommitted={handleCellChanged}*/}
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
                    placeholder="English name"
                    type="text"
                    ref={cEnglishNameRef}
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
        </section>
      </div>
    </div>
  )
}

export default Dashboard
