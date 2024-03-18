import {A} from 'hookrouter'
import React, {useContext, useEffect, useState} from "react";
import * as UserManagementClient from '../../api/user-management'
import {AuthContext} from "../../auth/auth_context";
import {DataGrid, GridCellParams, GridColDef, GridRowProps} from "@material-ui/data-grid";
import IconButton from "@material-ui/core/IconButton";
import {Dehaze} from "@material-ui/icons";
import {ClickAwayListener, Menu, MenuItem} from "@material-ui/core";
import CustomToolbar from "./CustomToolbar";

export default function UserManagement() {
    const [anchorEl, setAnchorEl] = useState();
    const [open: boolean, setOpen] = useState(false);
    const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };
    const handleClose = (): void => {
        setAnchorEl(null);
        setOpen(false);
    };
    let [showError, setShowError] = useState(false);
    const [rows, setRows] = useState([])
    const authContext = useContext(AuthContext)
    const columns: GridColDef[] = [
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
                <IconButton id="menu-actions"
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}>
                    <Dehaze/>
                    <ClickAwayListener onClickAway={handleClose}>
                        <Menu id="menu-actions"
                              anchorEl={anchorEl}
                              open={open}>
                            <MenuItem onClick={handleClose}>Edit</MenuItem>
                            <MenuItem>Delete</MenuItem>
                        </Menu>
                    </ClickAwayListener>
                </IconButton>
            )
        }
    ];

    const getAccountList = async () => {
        return await UserManagementClient.getAccountList()
    }

    const mapDataRow = (dataList) => {
        if (!dataList || !dataList.data || dataList.data.length === 0) {
            setRows([]);
        }
        const tempRowData = dataList.data;
        const rowData: GridRowProps[] = [];
        tempRowData.forEach(data => {
            if (data.id !== authContext.getUserData().id) {
                rowData.push(mapToDto(data));
            }
        })
        setRows(rowData)
    }

    const mapToDto = (rowData) => {
        return {
            id: handleNullValue(rowData, 'id'),
            name: handleNullValue(rowData, 'name'),
            email: handleNullValue(rowData, 'email'),
            username: handleNullValue(rowData, 'username'),
            password: handleNullValue(rowData, 'password'),
            faculty: rowData ? handleNullValue(rowData.facultyInfo, 'facultyName') : '',
            role: rowData ? handleNullValue(rowData.role, 'roleName') : '',
        }
    }

    const handleNullValue = (rowData, name) => {
        if (!rowData || !rowData[name]) {
            return null;
        }
        return rowData[name];
    }

    useEffect(() => {
        getAccountList().then(data => mapDataRow(data))
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
                                components={{Toolbar: CustomToolbar}}
                                columns={columns}/>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
