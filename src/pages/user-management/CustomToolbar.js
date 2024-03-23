import {GridToolbar} from "@material-ui/data-grid";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import {useEffect, useState} from "react";
import AccountActionModal from "./AccountActionModal";
import {Box} from "@material-ui/core";
import {Delete} from "@material-ui/icons";


const CustomToolbar = (props) => {
    const [facultyList, setFacultyList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [isOpenDialog: boolean, setOpenDialog] = useState(false);
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
                            startIcon={<AddIcon></AddIcon>}
                            onClick={openDialog}
                            variant="contained">
                        <span>Add User</span>
                    </Button>
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
