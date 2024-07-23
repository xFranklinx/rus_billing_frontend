import React, { useState, useEffect } from 'react';
import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Button, TableSortLabel, Modal, Box, TextField, MenuItem } from '@mui/material';
import axios from 'axios';

const ReusableTableWithModal = ({ data, fields, modalFields, apiUrl, token }) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState(data || []);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState(fields[0].field);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(modalFields.reduce((acc, field) => {
      acc[field.name] = selectedItem ? selectedItem[field.name] || '' : '';
      return acc;
    }, {}));
  }, [selectedItem, modalFields]);

  // If no data is passed, create a table with 5 skeleton rows
  if (!items) {
    setItems([...Array(5)].map((_, index) => (
      <TableRow key={index}>
        {modalFields.map((field) => (
          <TableCell key={field.name}>Loading...</TableCell>
        ))}
      </TableRow>
    )))
  }

  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`${apiUrl}/${formData._id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const updatedItem = response.data.data;
      setItems((prevItems) => prevItems.map((item) => (item._id === updatedItem._id ? updatedItem : item)));
      handleClose();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedItems = items ? [...items].sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return a[orderBy] > b[orderBy] ? -1 : 1;
    }
  }) : null;

  const tableRows = sortedItems ? sortedItems.map((item) => (
    <TableRow key={item._id}>
      {fields.map((field) => (
        <TableCell key={field.field}>{item[field.field]}</TableCell>
      ))}
      <TableCell>
        <Button onClick={() => handleOpen(item)}>Edit</Button>
      </TableCell>
    </TableRow>
  )) : null;

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {fields.map((field) => (
                <TableCell key={field.field}>
                  <TableSortLabel
                    active={orderBy === field.field}
                    direction={orderBy === field.field ? order : 'asc'}
                    onClick={() => handleRequestSort(field.field)}
                  >
                    {field.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...modalStyle }}>
          <h2>Edit Item</h2>
          {modalFields.map((field) => (
            <TextField
              key={field.name}
              name={field.name}
              label={field.label}
              value={formData[field.name]}
              onChange={handleChange}
              fullWidth
              margin="normal"
              select={field.select}
            >
              {field.select && field.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          ))}
          <Button sx={{ mr: 1 }} onClick={handleClose} variant="contained" color="error">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </Box>
      </Modal>
    </Box>
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

export default ReusableTableWithModal;