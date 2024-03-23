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
import Button from "@material-ui/core/Button";
import * as UserManagementClient from "../../api/user-management";
import {useEffect, useState} from "react";
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
const AccountActionModal = (props) => {
    const regexEmailValidator: RegExp = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    const classes = useStyles();
    const [usernameController: string, setUserNameController] = useState({
        value: '',
        isError: false
    });
    // const [passwordController: string, setPasswordController] = useState({
    //     value: '',
    //     isError: false
    // });
    const [nameController: string, setNameController] = useState({
        value: '',
        isError: false
    });
    const [emailController: string, setEmailController] = useState({
        value: '',
        isError: false
    });
    const [roleController: number, setRoleController] = useState({
        value: 0,
        isError: false
    })
    const [facultyController: number, setFacultyController] = useState({
        value: 0,
        isError: false
    })
    const isValidEmail = (email): boolean => {
        if (!email) {
            return true;
        }
        return regexEmailValidator.test(email);
    }
    const handleAddUserInputFormChanges = (setControllerValue, newValue: string): void => {
        setControllerValue({
            value: newValue,
        })
    }

    const resetAddUserInputForm = (setController): void => {
        setController({
            value: '',
            isError: false
        });
    }
    const closeDialog = (): void => {
        props.closeDialog();
        resetAddUserInputForm(setUserNameController);
        // resetAddUserInputForm(setPasswordController);
        resetAddUserInputForm(setNameController);
        resetAddUserInputForm(setEmailController);
        setFacultyController({
            value: 0,
            isError: false
        });
        setRoleController({
            value: 0,
            isError: false
        });
    }

    const handleActionSuccess = (): void => {
        props.handleActionSuccess();
    }

    const submitForm = (addForm): void => {
        if (props.actionType === 'edit') {
            UserManagementClient.updateAccount(addForm).then(response => {
                if (response === 200) {
                    closeDialog();
                    handleActionSuccess();
                }
            });
        } else {
            UserManagementClient.addNewAccount(addForm).then(response => {
                if (response === 200) {
                    closeDialog();
                    handleActionSuccess();
                }
            });
        }
    }
    const isShowError = (controller): boolean => {
        return controller.isError;
    }

    const onSubmitForm = (): void => {
        let isAbleToTakeAction = true;
        if (!usernameController.value) {
            isAbleToTakeAction = false;
            setUserNameController({
                isError: true
            });
        }
        // if (!passwordController.value) {
        //     isAbleToTakeAction = false;
        //     setPasswordController({
        //         isError: true
        //     });
        // }
        if (!nameController.value) {
            isAbleToTakeAction = false;
            setNameController({
                isError: true
            });
        }
        if (!isValidEmail(emailController.value)) {
            isAbleToTakeAction = false;
            setEmailController({
                isError: true
            })
        }
        if (!facultyController.value) {
            isAbleToTakeAction = false;
            setFacultyController({
                isError: true
            });
        }
        if (!roleController.value) {
            isAbleToTakeAction = false;
            setRoleController({
                isError: true
            });
        }
        if (isAbleToTakeAction) {
            if (props.actionType === 'edit') {
                submitForm({
                    username: usernameController.value,
                    // password: passwordController.value,
                    name: nameController.value,
                    email: emailController.value,
                    role_id: roleController.value,
                    faculty_id: facultyController.value,
                    id: props.accountInfo.id
                });
            } else {
                submitForm({
                    username: usernameController.value,
                    // password: passwordController.value,
                    name: nameController.value,
                    email: emailController.value,
                    role_id: roleController.value,
                    faculty_id: facultyController.value
                });
            }
        }
    }

    const setFormFieldValue = (): void => {
        if (props && props.accountInfo) {
            const accountInfo = props.accountInfo;
            setUserNameController({
                value: accountInfo.username
            });
            // setPasswordController({
            //     value: accountInfo.password
            // });
            setNameController({
                value: accountInfo.name
            });
            setEmailController({
                value: accountInfo.email
            });
            setRoleController({
                value: accountInfo.roleId
            });
            setFacultyController({
                value: accountInfo.facultyId
            });
        }
    }

    useEffect(() => {
        setFormFieldValue();
    }, [props.accountInfo])

    return (
        <Dialog open={props.isOpenDialog} fullWidth={true}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <form
                    onSubmit={onSubmitForm}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                    <FormControl>
                        <TextField autoFocus
                                   required
                                   error={isShowError(usernameController)}
                                   value={usernameController.value}
                                   onChange={(event): void => (handleAddUserInputFormChanges(setUserNameController, event.target.value))}
                                   id="username"
                                   autoComplete={"off"}
                                   margin="dense"
                                   fullWidth
                                   InputLabelProps={{
                                       shrink: true
                                   }}
                                   helperText={isShowError(usernameController) ? "This field is required" : ''}
                                   label="Username"
                                   type="text">
                        </TextField>
                    </FormControl>
                    {/*<FormControl>*/}
                    {/*    <TextField required*/}
                    {/*               id="password"*/}
                    {/*               margin="dense"*/}
                    {/*               error={isShowError(passwordController)}*/}
                    {/*               value={passwordController.value}*/}
                    {/*               InputLabelProps={{*/}
                    {/*                   shrink: true*/}
                    {/*               }}*/}
                    {/*               fullWidth*/}
                    {/*               autoComplete={"new-password"}*/}
                    {/*               onChange={(event): void => (handleAddUserInputFormChanges(setPasswordController, event.target.value))}*/}
                    {/*               helperText={isShowError(passwordController) ? "This field is required" : ''}*/}
                    {/*               name="password"*/}
                    {/*               label="Password"*/}
                    {/*               type="password">*/}
                    {/*    </TextField>*/}
                    {/*</FormControl>*/}
                    <FormControl>
                        <TextField required
                                   id="name"
                                   margin="dense"
                                   InputLabelProps={{
                                       shrink: true
                                   }}
                                   error={isShowError(nameController)}
                                   value={nameController.value}
                                   onChange={(event): void => (handleAddUserInputFormChanges(setNameController, event.target.value))}
                                   helperText={isShowError(nameController) ? "This field is required" : ''}
                                   fullWidth
                                   name="name"
                                   label="Name"
                                   type="text">
                        </TextField>
                    </FormControl>
                    <FormControl>
                        <TextField id="email"
                                   margin="dense"
                                   fullWidth
                                   InputLabelProps={{
                                       shrink: true
                                   }}
                                   error={isShowError(emailController)}
                                   value={emailController.value}
                                   onChange={(event): void => (handleAddUserInputFormChanges(setEmailController, event.target.value))}
                                   helperText={isShowError(emailController) ? "Invalid email format" : ''}
                                   name="email"
                                   label="Email"
                                   type="text">
                        </TextField>
                    </FormControl>
                    <FormControl error={isShowError(roleController)}>
                        <InputLabel required id="role" shrink>Role</InputLabel>
                        <Select label="Role"
                                labelId="role"
                                value={roleController.value}
                                onChange={event => (handleAddUserInputFormChanges(setRoleController, event.target.value))}
                                MenuProps={{
                                    classes: {
                                        paper: classes.roleListDropdown
                                    }
                                }}
                                style={{
                                    width: '20%'
                                }}>
                            {props.roleList.map(role => (
                                <MenuItem value={role.id}>{role.roleName}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{isShowError(roleController) ? 'This field is required' : ''}</FormHelperText>
                    </FormControl>
                    <FormControl error={isShowError(facultyController)}>
                        <InputLabel required id="faculty" shrink>Faculty</InputLabel>
                        <Select label="Faculty"
                                id="faculty"
                                value={facultyController.value}
                                onChange={event => (handleAddUserInputFormChanges(setFacultyController, event.target.value))}
                                MenuProps={{
                                    classes: {
                                        paper: classes.facultyListDropdown
                                    }
                                }}
                                style={{
                                    width: '20%',
                                }}>
                            {props.facultyList.map(faculty => (
                                <MenuItem value={faculty.id}>{faculty.facultyName}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{isShowError(facultyController) ? 'This field is required' : ''}</FormHelperText>
                    </FormControl>
                </form>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={closeDialog} type="button">Cancel</Button>
                <Button variant="contained" onClick={onSubmitForm} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AccountActionModal
