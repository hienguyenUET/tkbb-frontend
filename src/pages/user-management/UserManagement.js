import {A} from 'hookrouter'
import React, {useContext, useEffect, useState} from "react";
import * as UserManagementClient from '../../api/user-management'
import {AuthContext} from "../../auth/auth_context";
import {
    DataGrid,
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowProps,
    GridSelectionModel
} from "@material-ui/data-grid";
import IconButton from "@material-ui/core/IconButton";
import {Delete, Edit, MoreVert, Refresh} from "@material-ui/icons";
import {Dialog, DialogContent, DialogTitle, Menu, MenuItem} from "@material-ui/core";
import CustomToolbar from "./CustomToolbar";
import {getFaculties} from "../../api/faculty";
import AccountActionModal from "./AccountActionModal";
import {Slide} from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function UserManagement() {
    const [facultyList, setFacultyList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [accountInfoForAction, setAccountInfoForAction] = useState(null);
    const [isOpenEditDialog, setOpenEditDialog] = useState(false);
    const [isOpenActionConfirmDialog, setOpenActionConfirmDialog] = useState(false);
    const [dialogElement, setDialogElement] = useState({
        title: '', content: '', onOkAction: () => {
        }, onCancelAction: () => {
        },
    });
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [rowSelectionCount, setRowSelectionCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [showError, setShowError] = useState(false);
    const [rows, setRows] = useState([])
    const authContext = useContext(AuthContext)
    const columns: GridColDef[] = [{
        field: 'index', headerName: 'No', width: 80, sortable: false
    }, {
        field: 'username', headerName: 'Username', flex: true,
    }, // {
        //     field: 'password',
        //     headerName: 'Password',
        //     width: 200,
        //     renderCell: (params: GridCellParams): void => (
        //         <div style={{
        //             display: "flex",
        //             flexDirection: "row",
        //             width: "100%",
        //             justifyContent: "space-between",
        //         }}>
        //             {params.row.isShowPassword ? params.row.password : '********'}
        //
        //             <Tooltip title={!params.row.isShowPassword ? 'Show password' : 'Hide password'}>
        //                 <IconButton onClick={(): void => {
        //                     const tempRows = rows;
        //                     tempRows[params.row.index - 1].isShowPassword = !params.row.isShowPassword;
        //                     setRows([...tempRows]);
        //                 }}>
        //                     {!params.row.isShowPassword ?
        //                         <Visibility/> : <VisibilityOff/>}
        //                 </IconButton>
        //             </Tooltip>
        //         </div>
        //     )
        // },
        {
            field: 'email', headerName: 'Email', flex: true,
        }, {
            field: 'name', headerName: 'Name', flex: true,
        }, {
            field: 'role', headerName: 'Role', flex: true
        }, {
            field: 'faculty', headerName: 'Faculty', flex: true,
        }, {
            field: 'action',
            headerName: 'Action',
            width: 100,
            sortable: false,
            renderCell: (params: GridCellParams): void => (params.row.id !== authContext.getUserData().id ? (<div>
                <IconButton aria-haspopup="true"
                            aria-controls="menu-list-grow"
                            aria-label="more"
                            onClick={(event) => handleClick(event, params)}>
                    <MoreVert/>
                </IconButton>
                <Menu anchor-id="menu-list-grow"
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      open={Boolean(anchorEl)}>
                    <MenuItem onClick={(event): void => {
                        editAccountInfo(event)
                    }} style={{
                        display: 'flex', gap: '16px'
                    }}>
                        <Edit/>
                        Edit
                    </MenuItem>
                    <MenuItem onClick={openResetPasswordDialog} style={{
                        display: 'flex', gap: '16px'
                    }}>
                        <Refresh/>
                        Reset Password
                    </MenuItem>
                    <MenuItem onClick={openDeleteDialog} style={{
                        display: 'flex', gap: '16px'
                    }}>
                        <Delete/>
                        Delete
                    </MenuItem>
                </Menu>
                <Dialog open={isOpenActionConfirmDialog}
                        keepMounted>
                    <DialogTitle>{dialogElement.title}</DialogTitle>
                    <DialogContent>
                        <div>
                            {dialogElement.content}
                        </div>
                        <div style={{
                            display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px'
                        }}>
                            <button className="btn btn-secondary"
                                    onClick={dialogElement.onCancelAction}>Cancel
                            </button>
                            <button className="btn btn-danger" onClick={dialogElement.onOkAction}>OK</button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>) : <div></div>)
        }];

    const openDeleteDialog = (event): void => {
        event.preventDefault();
        if (accountInfoForAction) {
            setOpenActionConfirmDialog(true);
            setDialogElement({
                title: 'Delete Account',
                content: 'Are you sure to delete this account?',
                onOkAction: deleteAccount,
                onCancelAction: closeActionConfirmDialog
            })
            setAnchorEl(null);
        }
    }

    const openResetPasswordDialog = (event): void => {
        event.preventDefault();
        if (accountInfoForAction) {
            setOpenActionConfirmDialog(true);
            setAnchorEl(null);
            setDialogElement({
                title: 'Reset Password',
                content: 'Are you sure to reset password for this account?',
                onOkAction: resetPassword,
                onCancelAction: closeActionConfirmDialog
            })
        }
    }

    const resetPassword = (event): void => {
        event.preventDefault();
        if (accountInfoForAction) {
            setOpenActionConfirmDialog(false);
            UserManagementClient.resetPassword({id: accountInfoForAction.id}).then(response => {
                if (response === 200) {
                    getAccountList().then(accountListResponse => mapDataRow(accountListResponse));
                    setAnchorEl(null);
                } else {
                    setShowError(true);
                }
            })
        }
    }

    const closeActionConfirmDialog = (): void => {
        setOpenActionConfirmDialog(false);
    }

    const editAccountInfo = (event): void => {
        event.preventDefault();
        if (accountInfoForAction) {
            setOpenEditDialog(true);
            setAnchorEl(null);
        }
    }


    const handleClick = (event, params): void => {
        setAccountInfoForAction(params.row);
        setAnchorEl(event.currentTarget);
    }

    const handleClose = (): void => {
        setAnchorEl(null);
        setAccountInfoForAction(null);
    }

    const deleteAccount = (event): void => {
        event.preventDefault();
        setOpenActionConfirmDialog(false);
        if (accountInfoForAction) {
            UserManagementClient.deleteAccount(accountInfoForAction.id).then(response => {
                if (response === 200) {
                    getAccountList().then(accountListResponse => mapDataRow(accountListResponse));
                    setAnchorEl(null);
                } else {
                    setShowError(true);
                }
            })
        }
    }

    const getAccountList = async () => {
        return await UserManagementClient.getAccountList();
    }

    const getFacultyList = async () => {
        return await getFaculties();
    }

    const getRoleList = async () => {
        return await UserManagementClient.getRoleList();
    }

    const mapDataRow = (dataList) => {
        if (!dataList || !dataList.data || dataList.data.length === 0) {
            setRows([]);
        }
        const tempRowData = dataList.data;
        const rowData: GridRowProps[] = [];
        let index = 1;
        tempRowData.forEach(data => {
            data.index = index;
            rowData.push(mapToDto(data));
            index++;
        })
        setRows(rowData)
    }

    const mapToDto = (rowData) => {
        return {
            id: handleNullValue(rowData, 'id'),
            index: handleNullValue(rowData, 'index'),
            name: handleNullValue(rowData, 'name'),
            email: handleNullValue(rowData, 'email'),
            username: handleNullValue(rowData, 'username'),
            password: handleNullValue(rowData, 'password'), // isShowPassword: false,
            faculty: rowData ? handleNullValue(rowData.facultyInfo, 'facultyName') : '',
            role: rowData ? handleNullValue(rowData.role, 'roleName') : '',
            roleId: rowData ? handleNullValue(rowData, "role_id") : -1,
            facultyId: rowData ? handleNullValue(rowData, "faculty_id") : -1,
        }
    }

    const closeDialog = (): void => {
        setAccountInfoForAction(null);
        setOpenEditDialog(false);
    }

    const handleNullValue = (rowData, name) => {
        if (!rowData || !rowData[name]) {
            return null;
        }
        return rowData[name];
    }

    const handleActionSuccess = () => {
        getAccountList().then(accountListResponse => mapDataRow(accountListResponse));
    }

    const openDeleteMultipleAccountsConfirmDialog = () => {
        setOpenActionConfirmDialog(true);
        setDialogElement({
            title: 'Delete Account',
            content: rowSelectionModel.length === 1 ? 'Are you sure to delete this account?' : 'Are you sure to delete these accounts?',
            onOkAction: deleteMultipleAccounts,
            onCancelAction: closeActionConfirmDialog
        })
    }

    const deleteMultipleAccounts = () => {
        setOpenActionConfirmDialog(false);
        if (rowSelectionModel.length > 0) {
            UserManagementClient.deleteMultipleAccounts(rowSelectionModel.join(',')).then(response => {
                if (response === 200) {
                    getAccountList().then(accountListResponse => mapDataRow(accountListResponse));
                    handleRowSelection([]);
                    setAnchorEl(null);
                } else {
                    setShowError(true);
                }
            })
        }
    }

    const handleRowSelection = (newSelectionModel: GridSelectionModel): void => {
        setRowSelectionModel(newSelectionModel);
        setRowSelectionCount(newSelectionModel.length);
    }

    useEffect(() => {
        getAccountList().then(accountListResponse => mapDataRow(accountListResponse));
        getFacultyList().then(facultyListResponse => setFacultyList(facultyListResponse));
        getRoleList().then(roleListResponse => setRoleList(roleListResponse));
    }, [])

    return (<div className="content-wrapper">
        <div className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                        <h1 className="m-0">User Management {showError}</h1>
                    </div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right nav-links">
                            <li className="breadcrumb-item"><A href="/public">Home</A></li>
                            <li className="breadcrumb-item active">User Management</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>

        <section className="content">
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center m-1">
                    <div style={{height: 700, width: '100%', backgroundColor: '#fff'}}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            selectionModel={rowSelectionModel}
                            onSelectionModelChange={handleRowSelection}
                            checkboxSelection
                            isRowSelectable={(params: GridRowParams): void => (params.id !== authContext.getUserData().id)}
                            disableSelectionOnClick
                            components={{Toolbar: CustomToolbar}}
                            componentsProps={{
                                toolbar: {
                                    handleActionSuccess,
                                    openDeleteMultipleAccountsConfirmDialog,
                                    facultyList,
                                    rowSelectionCount,
                                    roleList
                                }
                            }}
                        />
                        <AccountActionModal facultyList={facultyList && facultyList.data ? facultyList.data : []}
                                            title={"Edit Account Info"}
                                            actionType={"edit"}
                                            accountInfo={accountInfoForAction}
                                            handleActionSuccess={handleActionSuccess}
                                            roleList={roleList && roleList.data ? roleList.data : []}
                                            isOpenDialog={isOpenEditDialog}
                                            closeDialog={closeDialog}/>
                    </div>
                </div>
            </div>
        </section>
    </div>)
}
