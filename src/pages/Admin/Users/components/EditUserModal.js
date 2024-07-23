import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, MenuItem } from '@mui/material';
import axios from 'axios';

const EditUserModal = ({ open, handleClose, user, updateUser, leadsAndManagers = [] }) => {
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    email: '',
    accountType: '',
    position: '',
    department: '',
    manager: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        _id: user._id,
        name: user.name || '',
        email: user.email || '',
        accountType: user.accountType || '',
        position: user.position || '',
        department: user.department || '',
        manager: user.manager || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const formDataCopy = { ...formData };
      if (formDataCopy.manager === '') {
        formDataCopy.manager = null;
      }

      const response = await axios.put(`http://localhost:5000/api/v1/users/${formDataCopy._id}`, formDataCopy, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('User updated:', response.data);
      updateUser(response.data);
      handleClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };


  const sortedLeadsAndManagers = leadsAndManagers.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...modalStyle }}>
        <h2>Edit User</h2>
        <TextField
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="accountType"
          label="Role"
          value={formData.accountType}
          onChange={handleChange}
          select
          fullWidth
          margin="normal"
        >
          {['Admin', 'Manager', 'Team Lead', 'Team Member'].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="position"
          label="Position"
          value={formData.position}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="department"
          label="Department"
          value={formData.department}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="manager"
          label="Manager"
          value={formData.manager}
          onChange={handleChange}
          select
          fullWidth
          margin="normal"
        >
          {sortedLeadsAndManagers.map((manager) => (
            <MenuItem key={manager._id} value={manager._id}>
              {manager.name}
            </MenuItem>
          ))}
        </TextField>
        <Button sx={{ mr: 1 }} onClick={handleClose} variant="contained" color="error">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default EditUserModal;
