import {GridToolbar} from "@material-ui/data-grid";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import {Fragment, useState} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";

const CustomToolbar = () => {
    const [isOpenDialog: boolean, setOpenDialog] = useState(false);

    const openDialog = (): void => {
        setOpenDialog(true);
    }
    const closeDialog = (): void => {
        setOpenDialog(false);
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
        'margin': '8px'
    }
    const addForm = {
        width: "12rem",
        display: 'flex',
        flexDirection: 'column'
    }

    return (
        <div style={toolbarStyle}>
            <GridToolbar/>
            <Fragment>
                <Button style={addUserButton}
                        onClick={openDialog}
                        variant="contained">
                    <AddIcon></AddIcon>
                    <span>Add User</span>
                </Button>
                <Dialog open={isOpenDialog} fullWidth={true}>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogContent>
                        <TextField autoFocus
                                   required
                                   id="username"
                                   margin="dense"
                                   fullWidth
                                   name="username"
                                   label="Username"
                                   type="text">
                        </TextField>
                        <br/>
                        <TextField required
                                   id="password"
                                   margin="dense"
                                   fullWidth
                                   autoComplete="off"
                                   name="password"
                                   label="Password"
                                   type="password">
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog}>Cancel</Button>
                        <Button>Add</Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        </div>
    )
}

export default CustomToolbar
