import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button, Modal, TextField } from '@mui/material';

const ConsolidatedList = () => {
  const [invoiceVariances, setInvoiceVariances] = useState(() => {
    // Generate fake invoice variances
    return Array.from({ length: 200 }, (_, index) => ({
      id: index + 1,
      invoiceNumber: `INV-${index + 1}`,
      varianceAmount: Math.random() * 1000,
      status: Math.random() < 0.5 ? 'Pending' : 'Paid',
    }));
  });

  const [selectedVariance, setSelectedVariance] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleOpenModal = (variance) => {
    setSelectedVariance(variance);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedVariance(null);
    setOpenModal(false);
  };

  const handleSaveChanges = () => {
    // Handle saving changes to the selected variance
    // You can access the selectedVariance state here
    // and perform the necessary logic to save the changes
    // to your data source.
    // For example, you can make an API call to update the data.
    // Once the changes are saved, you can close the modal.
    handleCloseModal();
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      // If the same column is clicked again, toggle the sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If a different column is clicked, set the new sort column and order
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const sortedVariances = invoiceVariances.sort((a, b) => {
    if (sortColumn === 'invoiceNumber') {
      return sortOrder === 'asc' ? a.invoiceNumber.localeCompare(b.invoiceNumber) : b.invoiceNumber.localeCompare(a.invoiceNumber);
    } else if (sortColumn === 'varianceAmount') {
      return sortOrder === 'asc' ? a.varianceAmount - b.varianceAmount : b.varianceAmount - a.varianceAmount;
    } else if (sortColumn === 'status') {
      return sortOrder === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
    }
    return 0;
  });

  return (
    <Box sx={{ height: 'calc(80vh - 64px)', overflow: 'auto' }}>
      <TableContainer component={Paper} sx={{ maxHeight: '100%' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <Button variant="text" onClick={() => handleSort('invoiceNumber')}>
                  Invoice Number
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="text" onClick={() => handleSort('varianceAmount')}>
                  Variance Amount
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="text" onClick={() => handleSort('status')}>
                  Status
                </Button>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedVariances.map((variance) => (
              <TableRow key={variance.id}>
                <TableCell>{variance.invoiceNumber}</TableCell>
                <TableCell>{variance.varianceAmount.toFixed(2)}</TableCell>
                <TableCell>{variance.status}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleOpenModal(variance)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, minWidth: 400 }}>
          <TextField label="Invoice Number" value={selectedVariance?.invoiceNumber} fullWidth />
          <TextField label="Variance Amount" value={selectedVariance?.varianceAmount.toFixed(2)} fullWidth />
          <TextField label="Status" value={selectedVariance?.status} fullWidth />
          <Button variant="contained" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ConsolidatedList;