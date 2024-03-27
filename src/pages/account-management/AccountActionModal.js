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
import * as UserManagementClient from "../../api/account-management.js";
import {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/styles";
import {getUserListForAddAccount} from "../../api/user";

const useStyles = makeStyles((theme) => ({
    facultyListDropdown: {
        marginTop: 10, maxHeight: 200
    }, roleListDropdown: {
        marginTop: 10, maxHeight: 100
    },
    authorNameList: {
        marginTop: 10,
        maxHeight: 250
    }
}))
const AccountActionModal = (props) => {
    const [authorList, setAuthorList] = useState([]);
    const classes = useStyles();
    const [currentAuthorIndex, setCurrentAuthorIndex] = useState(0);
    const [usernameController: string, setUserNameController] = useState({
        value: '', isError: false
    });
    const [nameController: string, setNameController] = useState({
        value: '', isError: false
    });
    const [roleController: number, setRoleController] = useState({
        value: -1, isError: false
    })
    const [facultyController: number, setFacultyController] = useState({
        value: -1, isError: false
    })
    const handleAddUserInputFormChanges = (setControllerValue, controller, newValue): void => {
        setControllerValue({
            value: newValue,
        })
    }

    const getAuthorList = async () => {
        return await getUserListForAddAccount();
    }

    const resetAddUserInputForm = (setController): void => {
        setController({
            value: '', isError: false
        });
    }
    const closeDialog = (): void => {
        props.closeDialog();
        resetFormValue();
    }

    const resetFormValue = (): void => {
        resetAddUserInputForm(setUserNameController);
        resetAddUserInputForm(setNameController);
        setFacultyController({
            value: -1, isError: false
        });
        setRoleController({
            value: -1, isError: false
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
                ...usernameController,
                isError: true
            });
        }
        if (!nameController.value) {
            isAbleToTakeAction = false;
            setNameController({
                ...nameController,
                isError: true
            });
        }
        if (isDropdownValueIsNull(facultyController) && !isDropdownValueIsNull(roleController) && !isAddingAdminOrContentAdminAccount()) {
            isAbleToTakeAction = false;
            setFacultyController({
                ...facultyController,
                isError: true
            });
        }
        if (!roleController.value || roleController.value === -1) {
            isAbleToTakeAction = false;
            setRoleController({
                ...roleController,
                isError: true
            });
        }
        if (isAbleToTakeAction) {
            const actionForm = {
                username: usernameController.value,
                name: nameController.value,
                role_id: roleController.value,
            }
            if (!isAddingAdminOrContentAdminAccount()) {
                if (isResearcherRole()) {
                    actionForm.faculty_id = authorList[currentAuthorIndex].facultyInfo["id"];
                    actionForm.user_id = authorList[currentAuthorIndex].id;
                } else {
                    actionForm.faculty_id = facultyController.value;
                }
            }

            if (props.actionType === 'edit') {
                actionForm.id = props.accountInfo.id;
                submitForm(actionForm);
            } else {
                submitForm(actionForm);
            }
        }
    }

    const isDropdownValueIsNull = (dropdownController) => {
        return dropdownController.value === undefined || dropdownController.value === null || dropdownController.value === -1;
    }

    const isAddingAdminOrContentAdminAccount = (): boolean => {
        if (isDropdownValueIsNull(roleController)) {
            return false;
        }
        return roleController.value === 1 || roleController.value === 2;
    }

    const setFormFieldValue = (): void => {
        if (props && props.accountInfo) {
            const accountInfo = props.accountInfo;
            setUserNameController({
                value: accountInfo.username
            });
            setNameController({
                value: accountInfo.name
            });
            setRoleController({
                value: accountInfo.roleId
            });
            setFacultyController({
                value: accountInfo.facultyId
            });
        }
    }

    const isResearcherRole = (): boolean => {
        return roleController.value === 4;
    }

    const handleRoleChange = (newValue): void => {
        setFacultyController({
            value: -1, isError: false
        });
        setUserNameController({
            ...usernameController,
            isError: false
        })
        setNameController({
            ...nameController,
            isError: false
        })
        handleAddUserInputFormChanges(setRoleController, roleController, newValue);
    }

    useEffect(() => {
        if (props.isOpenDialog) {
            setFormFieldValue();
            getAuthorList().then(response => {
                if (response && response.data && response.data.length > 0) {
                    let index = 0;
                    response.data.forEach(author => {
                        author.index = index;
                        index++;
                    })
                    setAuthorList(response.data);
                } else {
                    setAuthorList([]);
                }
            });
        }
    }, [props.isOpenDialog])

    return (<Dialog open={props.isOpenDialog} fullWidth={true}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
            <form
                onSubmit={onSubmitForm}
                style={{
                    display: 'flex', flexDirection: 'column', gap: '8px'
                }}>
                <FormControl>
                    <TextField autoFocus
                               required
                               error={isShowError(usernameController)}
                               value={usernameController.value}
                               onChange={(event): void => (handleAddUserInputFormChanges(setUserNameController, usernameController, event.target.value))}
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
                {isResearcherRole() ? (
                    <FormControl error={isShowError(nameController)}>
                        <InputLabel required id="name" shrink>Name</InputLabel>
                        <Select label="Name"
                                fullWidth={true}
                                onChange={(event): void => {
                                    const currentIndex = event.target.value;
                                    setCurrentAuthorIndex(currentIndex);
                                    if (authorList && currentAuthorIndex < authorList.length) {
                                        const selectedAuthor = authorList[currentIndex];
                                        setFacultyController({
                                            value: selectedAuthor.facultyInfo["id"]
                                        })
                                        setNameController({
                                            value: selectedAuthor.fullName
                                        })
                                    }
                                }}
                                MenuProps={{
                                    classes: {
                                        paper: classes.authorNameList
                                    }
                                }}
                                labelId="name">
                            {authorList.map(author => (
                                <MenuItem value={author.index}>{author.fullName}</MenuItem>))}
                        </Select>
                        <FormHelperText>{isShowError(nameController) ? 'This field is required' : ''}</FormHelperText>
                    </FormControl>) : (
                    <FormControl>
                        <TextField required
                                   id="name"
                                   margin="dense"
                                   InputLabelProps={{
                                       shrink: true
                                   }}
                                   error={isShowError(nameController)}
                                   value={nameController.value}
                                   onChange={(event): void => (handleAddUserInputFormChanges(setNameController, nameController, event.target.value))}
                                   helperText={isShowError(nameController) ? "This field is required" : ''}
                                   fullWidth
                                   name="name"
                                   label="Name"
                                   type="text">
                        </TextField>
                    </FormControl>)
                }
                {/*<FormControl>*/}
                {/*    <TextField id="email"*/}
                {/*               margin="dense"*/}
                {/*               fullWidth*/}
                {/*               required*/}
                {/*               InputLabelProps={{*/}
                {/*                   shrink: true*/}
                {/*               }}*/}
                {/*               error={emailController.isRequiredError || emailController.isInvalidFormat}*/}
                {/*               value={emailController.value}*/}
                {/*               onChange={(event): void => (handleAddUserInputFormChanges(setEmailController, event.target.value))}*/}
                {/*               helperText={setEmailErrorHelperText()}*/}
                {/*               name="email"*/}
                {/*               label="Email"*/}
                {/*               type="text">*/}
                {/*    </TextField>*/}
                {/*</FormControl>*/}
                <FormControl error={isShowError(roleController)}>
                    <InputLabel required id="role" shrink>Role</InputLabel>
                    <Select label="Role"
                            labelId="role"
                            value={roleController.value}
                            onChange={event => (handleRoleChange(event.target.value))}
                            MenuProps={{
                                classes: {
                                    paper: classes.roleListDropdown
                                }
                            }}
                            style={{
                                width: '20%'
                            }}>
                        {props.roleList.map(role => (<MenuItem value={role.id}>{role.roleName}</MenuItem>))}
                    </Select>
                    <FormHelperText>{isShowError(roleController) ? 'This field is required' : ''}</FormHelperText>
                </FormControl>
                {(!isDropdownValueIsNull(roleController) && !isAddingAdminOrContentAdminAccount()) ? (
                    <FormControl error={isShowError(facultyController)}>
                        <InputLabel required id="faculty" shrink>Faculty</InputLabel>
                        <Select label="Faculty"
                                id="faculty"
                                inputProps={{readOnly: isResearcherRole()}}
                                value={facultyController.value}
                                onChange={event => (handleAddUserInputFormChanges(setFacultyController, facultyController, event.target.value))}
                                MenuProps={{
                                    classes: {
                                        paper: classes.facultyListDropdown
                                    }
                                }}
                                style={{
                                    width: '20%',
                                }}>
                            {props.facultyList.map(faculty => (
                                <MenuItem value={faculty.id}>{faculty.facultyName}</MenuItem>))}
                        </Select>
                        <FormHelperText>{isShowError(facultyController) ? 'This field is required' : ''}</FormHelperText>
                    </FormControl>) : <div></div>}
            </form>
        </DialogContent>
        <DialogActions>
            <Button variant="contained" onClick={closeDialog} type="button">Cancel</Button>
            <Button variant="contained" onClick={onSubmitForm} color="primary">Save</Button>
        </DialogActions>
    </Dialog>);
}

export default AccountActionModal
