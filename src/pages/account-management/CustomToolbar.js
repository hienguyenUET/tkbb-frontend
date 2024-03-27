import {GridToolbar} from "@material-ui/data-grid";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import React, {useEffect, useState} from "react";
import AccountActionModal from "./AccountActionModal";
import {Box, Menu, MenuItem} from "@material-ui/core";
import {Delete, Edit, Refresh} from "@material-ui/icons";


const CustomToolbar = (props) => {
    const [facultyList, setFacultyList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [isOpenDialog: boolean, setOpenDialog] = useState(false);
    // const [addAccountMenuAnchorEl, setAddAccountMenuAnchorEl] = useState(null);
    // const [isOpenAddAccountMenu: boolean, setOpenAddAccountMenu] = useState(false);
    const openDialog = (): void => {
        setOpenDialog(true);
    }
    const closeDialog = (): void => {
        setOpenDialog(false);
    }
    const toolbarStyle = {
        width: '100%', display: 'flex', justifyContent: "space-between"
    }
    const addUserButton = {
        display: 'flex', gap: '4px', backgroundColor: 'blue', color: "white", margin: '8px'
    }

    const enableDeleteButton = {
        display: 'flex', backgroundColor: '#fce0e0', color: "red", margin: '8px'
    }

    const disableDeleteButton = {
        display: 'flex', backgroundColor: '#fce0e0', color: "red", margin: '8px', opacity: 0.5
    }

    // const openAddAccountMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
    //     console.log(event)
    //     // setOpenAddAccountMenu(true);
    //     setAddAccountMenuAnchorEl(event.currentTarget);
    // }

    // const closeAddAccountMenu = (): void => {
    //     // setOpenAddAccountMenu(false);
    //     setAddAccountMenuAnchorEl(null);
    // }

    useEffect((): void => {
        setFacultyList(props.facultyList && props.facultyList.data ? props.facultyList.data : []);
        setRoleList(props.roleList && props.roleList.data ? props.roleList.data : []);
    }, [props]);

    return (
        <div style={toolbarStyle}>
            <GridToolbar/>
            <div style={{
                display: 'flex',
            }}>
                <Box>
                    <Button style={addUserButton}
                            type="button"
                            id="add-account-button"
                            onClick={openDialog}
                            // onClick={openAddAccountMenu}
                            // aria-controls={Boolean(addAccountMenuAnchorEl) ? 'add-account-menu' : undefined}
                            // aria-haspopup="true"
                            // aria-expanded={Boolean(addAccountMenuAnchorEl) ? 'true' : undefined}
                            startIcon={<AddIcon></AddIcon>}
                            variant="contained">
                        <span>Add User</span>
                    </Button>
                    {/*<Menu id="add-account-menu"*/}
                    {/*      // style={{*/}
                    {/*      //     marginTop: '32px'*/}
                    {/*      // }}*/}
                    {/*      anchorEl={addAccountMenuAnchorEl}*/}
                    {/*      anchorOrigin={{*/}
                    {/*          vertical: 'bottom',*/}
                    {/*          horizontal: 'right',*/}
                    {/*      }}*/}
                    {/*      transformOrigin={{*/}
                    {/*          vertical: 'bottom',*/}
                    {/*          horizontal: 'right',*/}
                    {/*      }}*/}
                    {/*      MenuListProps={{*/}
                    {/*          'aria-labelledby': 'add-account-button',*/}
                    {/*      }}*/}
                    {/*      onClose={closeAddAccountMenu}*/}
                    {/*      open={Boolean(addAccountMenuAnchorEl)}>*/}
                    {/*    <MenuItem style={{*/}
                    {/*        display: 'flex', gap: '16px'*/}
                    {/*    }}>*/}
                    {/*        <Edit/>*/}
                    {/*        Admin/Content Admin*/}
                    {/*    </MenuItem>*/}
                    {/*    <MenuItem style={{*/}
                    {/*        display: 'flex', gap: '16px'*/}
                    {/*    }}>*/}
                    {/*        <Edit/>*/}
                    {/*        Department*/}
                    {/*    </MenuItem>*/}
                    {/*    <MenuItem style={{*/}
                    {/*        display: 'flex', gap: '16px'*/}
                    {/*    }}>*/}
                    {/*        <Refresh/>*/}
                    {/*        Researcher*/}
                    {/*    </MenuItem>*/}
                    {/*</Menu>*/}
                    <AccountActionModal isOpenDialog={isOpenDialog}
                                        facultyList={facultyList}
                                        title={"Add New Account"}
                                        action={"add"}
                                        handleActionSuccess={props.handleActionSuccess}
                                        roleList={roleList}
                                        closeDialog={closeDialog}>
                    </AccountActionModal>
                </Box>
                <Button variant="contained"
                        onClick={props.openDeleteMultipleAccountsConfirmDialog}
                        startIcon={<Delete style={{
                            color: 'red'
                        }}>
                        </Delete>}
                        disabled={props.rowSelectionCount === 0}
                        style={props.rowSelectionCount === 0 ? disableDeleteButton : enableDeleteButton}>
                    <span>
                        Delete Account(s)
                    </span>
                </Button>
            </div>
        </div>
    )
}

export default CustomToolbar
