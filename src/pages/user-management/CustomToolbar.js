import {GridToolbar} from "@material-ui/data-grid";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import {Fragment, useEffect, useState} from "react";
import AccountActionModal from "./AccountActionModal";



const CustomToolbar = (props) => {
    const [facultyList, setFacultyList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [isOpenDialog: boolean, setOpenDialog] = useState(false);
    const openDialog = (): void => {
        setOpenDialog(true);
    }

    const toolbarStyle = {
        width: '100%',
        display: 'flex',
        justifyContent: "space-between"
    }
    const addUserButton = {
        display: 'flex',
        gap: '4px',
        backgroundColor: 'blue',
        color: "white",
        margin: '8px'
    }

    useEffect((): void => {
        setFacultyList(props.facultyList && props.facultyList.data ? props.facultyList.data : []);
        setRoleList(props.roleList && props.roleList.data ? props.roleList.data : []);
    }, [props]);

    const closeDialog = (): void => {
        setOpenDialog(false);
    }

    return (
        <div style={toolbarStyle}>
            <GridToolbar/>
            <Fragment>
                <Button style={addUserButton}
                        type="button"
                        onClick={openDialog}
                        variant="contained">
                    <AddIcon></AddIcon>
                    <span>Add User</span>
                </Button>
                <AccountActionModal isOpenDialog={isOpenDialog}
                                    facultyList={facultyList}
                                    title={"Add New Account"}
                                    action={"add"}
                                    roleList={roleList}
                                    closeDialog={closeDialog}></AccountActionModal>
            </Fragment>
        </div>
    )
}

export default CustomToolbar
