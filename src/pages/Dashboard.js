import {useContext, useEffect, useRef, useState} from 'react'
import {A} from 'hookrouter'
import DataGrid from '../components/ScholarDataGrid'
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import IconButton from '@material-ui/core/IconButton'
import GetAppIcon from '@material-ui/icons/GetApp'
import {crawlUsers, createUsers, deleteUser, getUsers, updateUser, uploadUsers} from '../api/user'
import {crawlArticleData} from '../api/article';
import {getFaculties} from '../api/faculty'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import {AuthContext} from "../auth/auth_context";

const useStyles = makeStyles((theme) => ({
    facultyListDropdown: {
        marginTop: 10,
        maxHeight: 200
    },
    roleListDropdown: {
        marginTop: 10,
        maxHeight: 100
    }
}))
const Dashboard = props => {
    const authContext = useContext(AuthContext);
    const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/
    const [faculties, setFaculties] = useState([]);
    const classes = useStyles();
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
    const [newAuthor, setNewAuthor] = useState({
        fullName: '',
        englishName: '',
        faculty: -1,
        gsUrl: '',
    })
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
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
    const handleClose = () => {
        setShow(false);
        setIsFormSubmitted(false);
        setNewAuthor({
                fullName: '',
                englishName: '',
                faculty: -1,
                gsUrl: '',
            }
        )
    }

    const reloadUser = async () => {
        const {data: users} = await getUsers(authContext.getUserData().faculty.id);
        if (showError) {
            setRows(users.filter(u => (u.crawlStatus && u.crawlStatus.length)));
            setUsers(users.filter(u => (u.crawlStatus && u.crawlStatus.length)));
        } else {
            setRows(users);
            setUsers(users);
        }
    }

    const getFacultyList = async () => {
        return await getFaculties()
    }

    const isValidUrl = (url) => {
        if (!url) {
            return true;
        }
        return urlRegex.test(url);
    }

    const setFacultyList = (): void => {
        getFacultyList().then((response): void => {
            response && response.data ? setFaculties(response.data) : setFaculties([]);
        });
    }

    const getRowParamValue = (param, fieldName) => {
        if (!param) {
            return null;
        }
        return param.row[fieldName];
    }

    const handleCreate = async () => {
        setIsFormSubmitted(true);
        if (!newAuthor.fullName || !newAuthor.englishName || isFacultyValueIsNull() || isErrorScholarUrl()) {
            return;
        }
        const body = {
            fullName: newAuthor.fullName,
            englishName: newAuthor.englishName,
            faculty: newAuthor.faculty,
            gsUrl: newAuthor.gsUrl,
        }

        await createUsers(body)
        handleClose()
        reloadUser()
    }

    const userColumns = [
        {field: 'id', headerName: 'ID', width: 100},
        {
            field: 'faculty',
            headerName: 'Faculty',
            // editable: true,
            renderCell: (params) => (
                <div style={{width: '100%', overflow: ' hidden', textOverflow: 'ellipsis'}}
                     title={getRowParamValue(params, 'facultyInfo').id}>{getRowParamValue(params, 'facultyInfo').facultyName}
                </div>
            ),
            width: 120,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            renderCell: (params) => {
                let crawlStatus = getRowParamValue(params, 'crawlStatus');
                return (<div style={{
                    width: '100%',
                    overflow: ' hidden',
                    textOverflow: 'ellipsis',
                    color: (crawlStatus && crawlStatus.length) ? 'red' : 'inherit'
                }}
                             title={(crawlStatus && crawlStatus.length) ? crawlStatus : getRowParamValue(params, 'fullName')}>{getRowParamValue(params, 'fullName')}
                </div>)
            },
            // editable: true,
            width: 180,
        },
        {
            field: 'englishName',
            // editable: true,
            headerName: "Eng. name",
            renderCell: (params) => (
                <div style={{width: '100%', overflow: ' hidden', textOverflow: 'ellipsis'}}
                     title={getRowParamValue(params, 'faculty')}>{getRowParamValue(params, 'englishName') && getRowParamValue(params, 'englishName').length ? getRowParamValue(params, 'englishName') : 'N/A'}
                </div>
            ),
            width: 120,
        },
        {
            field: 'gsUrl',
            headerName: 'Google Scholar Url',
            // editable: true,
            width: 550,
            renderCell: (params) => {
                return (
                    <div>
                        <a href={getRowParamValue(params, 'gsUrl')}>{getRowParamValue(params, 'gsUrl')}</a>
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
                            onClick={() => handleCrawl(getRowParamValue(params, 'id'))}
                        >
                            Crawl {yearWindow} năm
                        </Button>
                    </div>
                )
            },
        },
        // {field: 'startDate', headerName: "Start", editable: true, sortable: false, width: 120},
        // {field: 'endDate', headerName: "End", editable: true, sortable: false, width: 120},
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
                            onClick={() => handleDeleteUser(getRowParamValue(params, 'id'))}
                        >
                            <DeleteIcon/>
                        </IconButton>
                    </div>
                )
            },
        },
    ]

    useEffect(() => {
        setFacultyList();
        setShowError(false);
        reloadUser();
    }, [])
    const isFacultyValueIsNull = () => {
        return newAuthor.faculty === undefined || newAuthor.faculty === null || newAuthor.faculty === -1;
    }
    const handleUploadUserFile = async () => {
        await uploadUsers(userFileRef.current.files[0])
        await reloadUser()
    }

    const handleDeleteUser = async (id) => {
        console.log(id);
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
        await crawlArticleData(yearWindow)
    }

    const isErrorScholarUrl = (): boolean => {
        return !newAuthor.gsUrl || !isValidUrl(newAuthor.gsUrl);
    }
    const showErrorTextForScholarUrl = (): string => {
        if (!newAuthor.gsUrl && isFormSubmitted) {
            return "This field is required";
        } else if (!isValidUrl(newAuthor.gsUrl) && isFormSubmitted) {
            return "Invalid Url";
        }
        return '';
    }

    const handleCellChanged = ({id, field, props}) => {
        const body = {}
        switch (field) {
            case 'startDate':
            case 'endDate':
                body[field] = props.value.length ? props.value : null;
                break;
            default:
                body[field] = props.value
        }

        updateUser(id, body)
            .finally(() => reloadUser())
    }

    const showFormFieldError = (fieldName) => {
        return isFormSubmitted && !newAuthor[fieldName];
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
                                    <li className="breadcrumb-item"><A href="/">Home</A></li>
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
                                <Button variant="contained" color="primary" component="span" size="small"
                                        startIcon={<GetAppIcon/>}
                                        onClick={handleCrawlArticle}>
                                    Crawl
                                </Button>
                                <select style={{marginLeft: "6px"}} value={props.faculty}
                                        onChange={(evt) => setYearWindow(evt.target.value)}>
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
                                    startIcon={<CloudUploadIcon/>}
                                    onClick={handleUploadUserFile}
                                >UPLOAD
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    className="ml-1"
                                    startIcon={<AddIcon/>}
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

                        <div style={{height: 700, width: '100%', backgroundColor: '#fff'}}>
                            <DataGrid
                                rows={rows}
                                columns={userColumns}
                                pageSize={30}
                                filterModel={filterModel}
                                // onFilterModelChange={(params) => {
                                //     // params.api.setPage(0);
                                // }}
                                clearFilterFn={() => {
                                    requestSearch('');
                                    setFilterModel({items: []})
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
                        <Dialog open={show} fullWidth={true}>
                            <DialogTitle>Create New Author</DialogTitle>
                            <DialogContent>
                                <form onSubmit={handleCreate} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px'
                                }}>
                                    <FormControl>
                                        <TextField required
                                                   id="name"
                                                   margin="dense"
                                                   InputLabelProps={{
                                                       shrink: true
                                                   }}
                                                   error={showFormFieldError("fullName")}
                                                   value={newAuthor.fullName}
                                                   onChange={(event): void => (setNewAuthor({
                                                       ...newAuthor,
                                                       fullName: event.target.value
                                                   }))}
                                                   helperText={showFormFieldError("fullName") ? "This field is required" : ''}
                                                   fullWidth
                                                   name="name"
                                                   label="Full Name"
                                                   type="text">
                                        </TextField>
                                    </FormControl>
                                    <FormControl>
                                        <TextField required
                                                   id="englishName"
                                                   margin="dense"
                                                   InputLabelProps={{
                                                       shrink: true
                                                   }}
                                                   error={showFormFieldError("englishName")}
                                                   value={newAuthor.englishName}
                                                   onChange={(event): void => (setNewAuthor({
                                                       ...newAuthor,
                                                       englishName: event.target.value
                                                   }))}
                                                   helperText={showFormFieldError("englishName") ? "This field is required" : ''}
                                                   fullWidth
                                                   name="englishName"
                                                   label="English Name"
                                                   type="text">
                                        </TextField>
                                    </FormControl>
                                    <FormControl error={isFacultyValueIsNull() && isFormSubmitted}>
                                        <InputLabel required id="faculty" shrink>Faculty</InputLabel>
                                        <Select label="Faculty"
                                                id="faculty"
                                                value={newAuthor.faculty}
                                                onChange={(event): void => (setNewAuthor({
                                                    ...newAuthor,
                                                    faculty: event.target.value
                                                }))}
                                                MenuProps={{
                                                    classes: {
                                                        paper: classes.facultyListDropdown
                                                    }
                                                }}
                                                style={{
                                                    width: '20%',
                                                }}>
                                            {faculties.map(faculty => (
                                                <MenuItem value={faculty.id}>{faculty.facultyName}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{isFacultyValueIsNull() && isFormSubmitted ? 'This field is required' : ''}</FormHelperText>
                                    </FormControl>
                                    <FormControl>
                                        <TextField required
                                                   id="scholarUrl"
                                                   margin="dense"
                                                   InputLabelProps={{
                                                       shrink: true
                                                   }}
                                                   error={isErrorScholarUrl() && isFormSubmitted}
                                                   value={newAuthor.gsUrl}
                                                   onChange={(event): void => (setNewAuthor({
                                                       ...newAuthor,
                                                       gsUrl: event.target.value
                                                   }))}
                                                   helperText={showErrorTextForScholarUrl()}
                                                   fullWidth
                                                   name="gsUrl"
                                                   label="Google Scholar Url"
                                                   type="text">
                                        </TextField>
                                    </FormControl>
                                </form>
                            </DialogContent>
                            <DialogActions>
                                <Button variant="contained" onClick={handleClose} type="button">Cancel</Button>
                                <Button variant="contained" onClick={handleCreate} color="primary">Save</Button>
                            </DialogActions>
                        </Dialog>
                        {/*<Modal animation={false} show={show} onHide={handleClose}>*/}
                        {/*    <Modal.Header closeButton>*/}
                        {/*        <Modal.Title>Create Authors</Modal.Title>*/}
                        {/*    </Modal.Header>*/}
                        {/*    <Modal.Body>*/}
                        {/*        <div className="form-group">*/}
                        {/*            <input*/}
                        {/*                className="form-control m-1"*/}
                        {/*                placeholder="Fullname"*/}
                        {/*                type="text"*/}
                        {/*                ref={cFullnameRef}*/}
                        {/*            />*/}
                        {/*            <input*/}
                        {/*                className="form-control m-1"*/}
                        {/*                placeholder="English name"*/}
                        {/*                type="text"*/}
                        {/*                ref={cEnglishNameRef}*/}
                        {/*            />*/}
                        {/*            /!*<input*!/*/}
                        {/*            /!*  className="form-control m-1"*!/*/}
                        {/*            /!*  placeholder="Faculty"*!/*/}
                        {/*            /!*  type="Text"*!/*/}
                        {/*            /!*  ref={cFacultyRef}*!/*/}
                        {/*            /*/}
                        {/*            <select auto>*/}
                        {/*                {*/}
                        {/*                    faculties.map(c => (<option value={c.id}>{c.facultyName}</option>))*/}
                        {/*                }*/}
                        {/*            </select>*/}
                        {/*            <input*/}
                        {/*                className="form-control m-1"*/}
                        {/*                placeholder="Google Scholar Url"*/}
                        {/*                type="Text"*/}
                        {/*                ref={cGoogleScholarRef}*/}
                        {/*            />*/}
                        {/*        </div>*/}
                        {/*    </Modal.Body>*/}
                        {/*    <Modal.Footer>*/}
                        {/*        <Button variant="contained" className="mr-2" color="secondary" onClick={handleClose}>*/}
                        {/*            Close*/}
                        {/*        </Button>*/}
                        {/*        <Button variant="contained" color="primary" onClick={handleCreate}>*/}
                        {/*            Create*/}
                        {/*        </Button>*/}
                        {/*    </Modal.Footer>*/}
                        {/*</Modal>*/}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Dashboard
