import React, { useState } from "react"; 
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, IconButton } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { Tooltip, useTheme } from "@mui/material";
import { tokens } from "../../theme"; // Ensure this is correctly imported
import { Header } from "../../components";

const RoleManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode); // Using the theme's color tokens

  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Admin",
      permissions: { read: true, write: true, delete: true },
      customAttributes: ["Full Access"],
    },
    {
      id: 2,
      name: "User",
      permissions: { read: true, write: false, delete: false },
      customAttributes: ["Limited Access"],
    },
    {
      id: 3,
      name: "Manager",
      permissions: { read: true, write: true, delete: false },
      customAttributes: ["Manage Users"],
    },
  ]);

  const [open, setOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState({ read: false, write: false, delete: false });
  const [customAttributes, setCustomAttributes] = useState([]);
  const [editRoleId, setEditRoleId] = useState(null);

  const handleClickOpen = (roleId) => {
    if (roleId) {
      const roleToEdit = roles.find(role => role.id === roleId);
      setRoleName(roleToEdit.name);
      setPermissions(roleToEdit.permissions);
      setCustomAttributes(roleToEdit.customAttributes);
      setEditRoleId(roleId);
    } else {
      setRoleName("");
      setPermissions({ read: false, write: false, delete: false });
      setCustomAttributes([]);
      setEditRoleId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePermissionChange = (event) => {
    setPermissions({ ...permissions, [event.target.name]: event.target.checked });
  };

  const handleCustomAttributeChange = (index, value) => {
    const newAttributes = [...customAttributes];
    newAttributes[index] = value;
    setCustomAttributes(newAttributes);
  };

  const handleSaveRole = () => {
    if (!roleName) {
      alert('Role name is required');
      return;
    }
    const newRole = {
      id: editRoleId || roles.length + 1,
      name: roleName,
      permissions: { ...permissions },
      customAttributes: [...customAttributes],
    };
    if (editRoleId) {
      setRoles(roles.map(role => role.id === editRoleId ? newRole : role));
    } else {
      setRoles([...roles, newRole]);
    }
    handleClose();
  };
  

  const handleDeleteRole = (id) => {
    setRoles(roles.filter((role) => role.id !== id));
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 }, // Set a fixed width for better control
    {
      field: "name",
      headerName: "Role Name",
      width: 150,  // Set a fixed width to control the spacing
      cellClassName: 'name-column--cell',
    },
    {
      field: "permissions",
      headerName: "Permissions",
      width: 250,  // Adjusted to a smaller fixed width
      renderCell: ({ row }) => {
        const permissions = row.permissions;
  
        // Custom styling to display permissions as toggles/pills
        return (
          <Box display="flex" gap={1}> {/* Decreased gap between pills */}
            {Object.keys(permissions).map(
              (perm) =>
                permissions[perm] && (
                  <Button
                    key={perm}
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: permissions[perm] ? "#00796b" : "#e0e0e0", // green if true, gray if false
                      color: permissions[perm] ? "#ffffff" : "#757575", // white text if true, dark gray if false
                      borderRadius: "20px", // pill-shaped
                      padding: "2px 8px", // reduced padding
                      fontWeight: "bold", // make the text bold for emphasis
                      textTransform: "capitalize", // Capitalize first letter for better readability
                    }}
                  >
                    {perm}
                  </Button>
                )
            )}
          </Box>
        );
      },
    },
    {
      field: "customAttributes",
      headerName: "Custom Attributes",
      width: 180,  // Adjusted width for the column
      renderCell: ({ row }) => {
        const formattedAttributes = row.customAttributes.map((attr) =>
          attr.charAt(0).toUpperCase() + attr.slice(1) // Capitalize the first letter of each attribute
        );
        return <Typography>{formattedAttributes.join(", ") || "No Custom Attributes"}</Typography>;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,  // Adjusted width for the Actions column
      renderCell: (params) => (
        <Box display="flex" gap={2}> {/* Reduced gap between buttons */}
          <Tooltip title="Edit Role">
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={() => handleClickOpen(params.row.id)}
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete Role">
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDeleteRole(params.row.id)}
            >
              Delete
            </Button>
          </Tooltip>
        </Box>
      ),
    },
  ];
  

  return (
    <Box m="20px">
      
      <Header color="secondary" title="ROLE MANAGEMENT" subtitle="Manage Roles" />
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleClickOpen(null)}
        startIcon={<Add />}
        sx={{ mb: 3 }}
      >
        Add New Role
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
            color: colors.greenAccent[300], // Green color for role names
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            "& .MuiDataGrid-columnHeaderTitle": {
              color: theme.palette.mode === 'dark' ? 'white' : 'white',  // Ensures text stays white regardless of the theme
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
          rows={roles}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Box>

      {/* Add/Edit Role Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle color="secondary">{editRoleId ? "Edit Role" : "Create New Role"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Role Name"
            fullWidth
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            sx={{ mb: 2 }}
            variant="outlined"
            color="secondary"
          />
          {/* Permissions Section */}
          <Typography variant="h6" color="secondary" sx={{ mt: 2 }}>Permissions</Typography>
          {["read", "write", "delete"].map((perm) => (
            <Box key={perm}>
              <input
                type="checkbox"
                checked={permissions[perm]}
                onChange={handlePermissionChange}
                name={perm}
              />
              <label>{perm.charAt(0).toUpperCase() + perm.slice(1)}</label>
            </Box>
          ))}
          {/* Custom Attributes Section */}
          <Typography variant="h6" color="secondary" sx={{ mt: 2 }}>Custom Attributes</Typography>
          {customAttributes.map((attr, index) => (
            <Grid container spacing={2} key={index} alignItems="center">
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  label={`Attribute ${index + 1}`}
                  value={attr}
                  onChange={(e) => handleCustomAttributeChange(index, e.target.value)}
                  variant="outlined"
                  color="primary"
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => {
                    const newAttributes = customAttributes.filter((_, i) => i !== index);
                    setCustomAttributes(newAttributes);
                  }}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            color="error"
            onClick={() => setCustomAttributes([...customAttributes, ""])}
            sx={{ mt: 2 }}
          >
            Add Custom Attribute
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">Cancel</Button>
          <Button onClick={handleSaveRole} color="secondary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleManagement;
