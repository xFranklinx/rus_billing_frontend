import React, { useState, useEffect, useMemo } from 'react';
import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Button, TableSortLabel, Modal, Box, TextField, MenuItem } from '@mui/material';

/**
 * ReusableTableWithModal - A component that displays data in a sortable table with an edit modal.
 * 
 * @param {Object} props
 * @param {Object} props.data - The data to be displayed in the table
 * @param {Array} props.fields - Array of objects defining table columns
 * @param {Array} props.modalFields - Array of objects defining form fields in the modal
 * @param {Function} props.apiHandlerFunction - Function to handle API calls for updates
 * @param {Function} [props.customModalContent] - Optional function to render custom modal content
 */
const ReusableTableWithModal = ({
  data,
  fields,
  modalFields,
  apiHandlerFunction,
  customModalContent
}) => {
  // State for modal visibility
  const [open, setOpen] = useState(false);

  // State for the currently selected item for editing
  const [selectedItem, setSelectedItem] = useState(null);

  // State for all items in the table
  const [items, setItems] = useState([]);

  // State for current sort order (ascending or descending)
  const [order, setOrder] = useState('desc');

  // State for the field currently being used for sorting
  const [orderBy, setOrderBy] = useState(fields[0].field);

  // State for the form data in the edit modal
  const [formData, setFormData] = useState({});


  // Effect to initialize or update items when data prop changes
  useEffect(() => {
    setItems(data?.data || createSkeletonData());
  }, [data, fields]);


  // Effect to update form data when selected item changes
  useEffect(() => {
    // Create an object with all fields from modalFields, 
    // populated with data from the selected item (if available)
    setFormData(modalFields.reduce((acc, field) => ({
      ...acc,
      [field.name]: selectedItem?.[field.name] || ''
    }), {}));
  }, [selectedItem, modalFields]);


  /**
   * Creates skeleton data for loading state
   * @returns {Array} Array of skeleton data objects
   */
  const createSkeletonData = () =>
    Array(5).fill().map((_, index) => ({
      _id: `skeleton-${index}`,
      ...fields.reduce((acc, field) => ({ ...acc, [field.field]: 'Loading...' }), {})
    }));


  // Memoized sorted items to prevent unnecessary re-sorting
  const sortedItems = useMemo(() =>
    [...items].sort((a, b) =>
      (a[orderBy] < b[orderBy] ? -1 : 1) * (order === 'asc' ? 1 : -1)
    ), [items, order, orderBy]);


  /**
   * Opens the edit modal for a specific item
   * @param {Object} item - The item to be edited
   */
  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };


  /**
   * Closes the edit modal and resets the selected item
   */
  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };


  /**
   * Handles changes in the form fields
   * @param {Object} e - The event object from the input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  /**
   * Handles the submission of the edit form
   */
  const handleSubmit = async () => {
    try {
      // Call the API handler function with the form data
      const response = await apiHandlerFunction(formData._id, formData);

      // Update the items state with the new data
      setItems(prevItems => prevItems.map(item => {
        // If this is the item that was just updated (matching IDs)
        if (item._id === response.data._id) {
          // Return the updated item data from the API response
          return response.data;
        }
        // For all other items, return them unchanged
        return item;
      }));

      // Close the modal after successful update
      handleClose();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };


  /**
   * Handles the request to sort the table
   * @param {string} property - The property to sort by
   */
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  /**
   * Renders the table header with sort functionality
   * @returns {JSX.Element} The table header JSX
   */
  const renderTableHeader = () => (
    <TableHead>
      <TableRow>
        {fields.map(({ field, label }) => (
          <TableCell key={field}>
            <TableSortLabel
              active={orderBy === field}
              direction={orderBy === field ? order : 'asc'}
              onClick={() => handleRequestSort(field)}
            >
              {label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );


  /**
   * Renders the table body with all items
   * @returns {JSX.Element} The table body JSX
   */
  const renderTableBody = () => (
    <TableBody>
      {sortedItems.map((item) => (
        <TableRow key={item._id}>
          {fields.map(({ field }) => (
            <TableCell key={field}>{item[field]}</TableCell>
          ))}
          <TableCell>
            <Button onClick={() => handleOpen(item)}>Edit</Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );


  /**
   * Renders the default modal content
   * @returns {JSX.Element} The default modal content JSX
   */
  const renderDefaultModalContent = () => (
    <Box sx={modalStyle}>
      <h2>Edit Item</h2>
      {modalFields.map(({ name, label, select, options }) => (
        <TextField
          key={name}
          name={name}
          label={label}
          value={formData[name]}
          onChange={handleChange}
          fullWidth
          margin="normal"
          select={select}
        >
          {select && options.map(({ value, label }) => (
            <MenuItem key={value} value={value}>{label}</MenuItem>
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
  );


  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          {renderTableHeader()}
          {renderTableBody()}
        </Table>
      </TableContainer>
      <Modal open={open} onClose={handleClose}>
        {customModalContent
          ? customModalContent({
            formData,
            handleChange,
            handleSubmit,
            handleClose,
            selectedItem
          })
          : renderDefaultModalContent()}
      </Modal>
    </Box>
  );
};

// Styles for the modal
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