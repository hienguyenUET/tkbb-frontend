import {A} from 'hookrouter'
import React, {useContext, useEffect, useState} from "react";
import * as UserManagementClient from '../../api/user-management'
import {AuthContext} from "../../auth/auth_context";
import {DataGrid, GridCellParams, GridColDef, GridRowProps} from "@material-ui/data-grid";
import IconButton from "@material-ui/core/IconButton";
import {Delete, Edit, MoreVert} from "@material-ui/icons";
import {Menu, MenuItem} from "@material-ui/core";
import CustomToolbar from "./CustomToolbar";
import {getFaculties} from "../../api/faculty";
import AccountActionModal from "./AccountActionModal";

export default function UserManagement() {
    const [facultyList, setFacultyList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [accountInfoForAction, setAccountInfoForAction] = useState(null);
    const [isOpenEditDialog, setOpenEditDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    let [showError, setShowError] = useState(false);
    const [rows, setRows] = useState([])
    const authContext = useContext(AuthContext)
    const columns: GridColDef[] = [
        {
            field: 'index',
            headerName: 'No',
            width: 80
        },
        {
            field: 'username',
            headerName: 'Username',
            flex: true,
        },
        {
            field: 'password',
            headerName: 'Password',
            flex: true,

        },
        {
            field: 'name',
            headerName: 'Name',
            flex: true,
        },
        {
            field: 'role',
            headerName: 'Role',
            flex: true
        },
        {
            field: 'faculty',
            headerName: 'Faculty',
            flex: true,
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 100,
            sortable: false,
            renderCell: (params: GridCellParams): void => (
                <div>
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
                            display: 'flex',
                            gap: '16px'
                        }}>
                            <Edit/>
                            Edit
                        </MenuItem>
                        <MenuItem onClick={handleClose} style={{
                            display: 'flex',
                            gap: '16px'
                        }}>
                            <Delete/>
                            Delete
                        </MenuItem>
                    </Menu>
                </div>
            )
        }
    ];

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
            if (data.id !== authContext.getUserData().id) {
                data.index = index;
                rowData.push(mapToDto(data));
                index++;
            }
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
            password: handleNullValue(rowData, 'password'),
            faculty: rowData ? handleNullValue(rowData.facultyInfo, 'facultyName') : '',
            role: rowData ? handleNullValue(rowData.role, 'roleName') : '',
            roleId: rowData ? handleNullValue(rowData, "role_id") : -1,
            facultyId: rowData ? handleNullValue(rowData, "faculty_id") : -1,
        }
    }

    const closeDialog = (): void => {
        setAccountInfoForAction(null);
        setOpenEditDialog(false);
        getAccountList().then(accountListResponse => mapDataRow(accountListResponse));
    }

    const handleNullValue = (rowData, name) => {
        if (!rowData || !rowData[name]) {
            return null;
        }
        return rowData[name];
    }

    useEffect(() => {
        getAccountList().then(accountListResponse => mapDataRow(accountListResponse));
        getFacultyList().then(facultyListResponse => setFacultyList(facultyListResponse));
        getRoleList().then(roleListResponse => setRoleList(roleListResponse));
    }, [])

    return (
        <div className="content-wrapper">
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
                                components={{Toolbar: CustomToolbar}}
                                componentsProps={{
                                    toolbar: {
                                        facultyList,
                                        roleList,
                                    }
                                }}
                            />
                            <AccountActionModal facultyList={facultyList && facultyList.data ? facultyList.data : []}
                                                title={"Edit Account Info"}
                                                actionType={"edit"}
                                                accountInfo={accountInfoForAction}
                                                roleList={roleList && roleList.data ? roleList.data : []}
                                                isOpenDialog={isOpenEditDialog}
                                                closeDialog={closeDialog}/>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
