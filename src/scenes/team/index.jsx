import { Box, Typography, useTheme, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";   
import { Header } from "../../components"; 
import { DataGrid } from "@mui/x-data-grid"; 
import { mockDataTeam } from "../../data/mockData"; 
import { tokens } from "../../theme"; 
import { AdminPanelSettingsOutlined, LockOpenOutlined, SecurityOutlined, EditOutlined, DeleteOutline } from "@mui/icons-material"; 
import { useState } from "react";

const Team = () => { 
  const theme = useTheme(); 
  const colors = tokens(theme.palette.mode); 

  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRoles, setUserRoles] = useState([]);
  const [userPermissions, setUserPermissions] = useState({ read: false, write: false, delete: false });
  const [editUserId, setEditUserId] = useState(null);
  const [users, setUsers] = useState(mockDataTeam);  // Store users in state

  const columns = [
    { field: "id", headerName: "ID", width: 30 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
      width: 50,
    },
    { field: "phone", headerName: "Phone Number", flex: 1, width: 150 },
    { field: "email", headerName: "Email", flex: 1, width: 200 },
    {
      field: "access",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="120px"
            p={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            bgcolor={
              access === "admin"
                ? colors.greenAccent[600]
                : colors.greenAccent[700]
            }
            borderRadius={1}
          >
            {access === "admin" && <AdminPanelSettingsOutlined />}
            {access === "manager" && <SecurityOutlined />}
            {access === "user" && <LockOpenOutlined />}
            <Typography textTransform="capitalize">{access}</Typography>
          </Box>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row: { status } }) => {
        return (
          <Button
            variant="contained"
            color={status === "Active" ? "success" : "error"}
            sx={{
              textTransform: "capitalize",
              width: "100px",
            }}
          >
            {status === "Active" ? "Active" : "Not Active"}
          </Button>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <Box display="flex" gap={2} mr={-1}>
            <Button
              variant="outlined"
              color="secondary" 
              size="small"
              startIcon={<EditOutlined />}
              onClick={() => handleEditUser(params.row.id)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteOutline />}
              onClick={() => handleDeleteUser(params.row.id)}
            >
              Delete
            </Button>
          </Box>
        );
      },
    },
  ];

  // Edit user function
  const handleEditUser = (id) => {
    const userToEdit = users.find(user => user.id === id);
    setUserName(userToEdit.name);
    setUserEmail(userToEdit.email);
    setUserRoles(userToEdit.roles);
    setUserPermissions(userToEdit.permissions);
    setEditUserId(id);
    setOpen(true);  // Open form in edit mode
  };

  // Delete user function
  const handleDeleteUser = (id) => {
    const filteredUsers = users.filter(user => user.id !== id);
    setUsers(filteredUsers);  // Update the state after deletion
    console.log("User with ID", id, "has been deleted");
  };

  const handleAddUser = () => {
    setUserName("");  // Clear user name for new user
    setUserEmail("");  // Clear email for new user
    setUserRoles([]);  // Clear roles for new user
    setUserPermissions({ read: false, write: false, delete: false });  // Default permissions for new user
    setEditUserId(null);  // No user to edit
    setOpen(true);  // Open the form to add user
  };

  const handleClose = () => {
    setOpen(false);  // Close the dialog
  };

  const handleSubmit = () => {
    if (editUserId) {
      // Update existing user logic
      const updatedUsers = users.map(user =>
        user.id === editUserId
          ? { ...user, name: userName, email: userEmail, roles: userRoles, permissions: userPermissions }
          : user
      );
      setUsers(updatedUsers);
      console.log("User updated with ID:", editUserId);
    } else {
      // Add new user logic
      const newUser = {
        id: users.length + 1,  // Simple ID generation for new user
        name: userName,
        email: userEmail,
        roles: userRoles,
        permissions: userPermissions,
      };
      setUsers([...users, newUser]);
      console.log("Adding new user:", newUser);
    }
    setOpen(false);  // Close the form after submitting
  };

  return (
    <Box m="20px">
      <Header color="secondary" title="USER MANAGEMENT" subtitle="Manage Users and Their Roles" />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddUser}
        sx={{ mb: 2 }}
      >
        Add New User
      </Button>
      
      <Box
        mt="40px"
        height="75vh"
        flex={1}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            border: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            "& .MuiDataGrid-columnHeaderTitle": {
              color: theme.palette.mode === 'dark' ? 'white' : 'white', 
            },
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-iconSeparator": {
            color: colors.primary[100],
          },
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          checkboxSelection
        />
      </Box>

      {/* Dialog for Add/Edit User Form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle color="secondary">{editUserId ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          <TextField
            label="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="User Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          {/* Add more fields here for roles, permissions, etc. */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="secondary">
            {editUserId ? "Update User" : "Add User"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Team;
