import {GridToolbar} from "@material-ui/data-grid";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import {Fragment, useEffect, useState} from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";

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

const CustomToolbar = (props) => {
    const [facultyList, setFacultyList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [isOpenDialog: boolean, setOpenDialog] = useState(false);
    const classes = useStyles();
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
        margin: '8px'
    }
    const addForm = {
        width: "12rem",
        display: 'flex',
        flexDirection: 'column'
    }

    useEffect((): void => {
        setFacultyList(props.facultyList && props.facultyList.data ? props.facultyList.data : []);
        setRoleList(props.roleList && props.roleList.data ? props.roleList.data : []);
    }, [props]);

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
                <Dialog open={isOpenDialog} fullWidth={true}>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogContent>
                        <form autoComplete="off" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            <TextField autoFocus
                                       required
                                       id="username"
                                       margin="dense"
                                       fullWidth
                                       label="Username"
                                       type="text">
                            </TextField>
                            <TextField required
                                       id="password"
                                       margin="dense"
                                       fullWidth
                                       name="password"
                                       label="Password"
                                       type="password">
                            </TextField>
                            <TextField required
                                       id="name"
                                       margin="dense"
                                       fullWidth
                                       name="name"
                                       label="Name"
                                       type="text">
                            </TextField>
                            <TextField id="email"
                                       margin="dense"
                                       fullWidth
                                       name="email"
                                       label="Email"
                                       type="text">
                            </TextField>
                            <FormControl>
                                <InputLabel required id="role">Role</InputLabel>
                                <Select label="Role"
                                        labelId="role"
                                        MenuProps={{
                                            classes: {
                                                paper: classes.roleListDropdown
                                            }
                                        }}
                                        style={{
                                            width: '20%'
                                        }}>
                                    {roleList.map(role => (
                                        <MenuItem value={role.id}>{role.roleName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel required id="faculty">Faculty</InputLabel>
                                <Select label="Faculty"
                                        id="faculty"
                                        MenuProps={{
                                            classes: {
                                                paper: classes.facultyListDropdown
                                            }
                                        }}
                                        style={{
                                            width: '20%',
                                        }}>
                                    {facultyList.map(faculty => (
                                        <MenuItem value={faculty.id}>{faculty.facultyName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog} type="button">Cancel</Button>
                        <Button>Add</Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        </div>
    )
}

export default CustomToolbar
