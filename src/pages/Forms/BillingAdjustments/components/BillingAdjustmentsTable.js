import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material';
import PropTypes from 'prop-types';

const BillingAdjustmentsTable = ({ submissions = [], onViewDetails, formFields, customers }) => {
  const renderCellContent = (submission, fieldId) => {
    const value = submission.responses[fieldId];
    if (fieldId === 'customerId') {
      return customers[value] || value;
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value || '-';
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Submission Date</TableCell>
            {Object.entries(formFields).map(([fieldId, field]) => (
              <TableCell key={fieldId}>{field.label}</TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission._id}>
              <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
              {Object.keys(formFields).map((fieldId) => (
                <TableCell key={fieldId}>
                  {renderCellContent(submission, fieldId)}
                </TableCell>
              ))}
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onViewDetails(submission._id)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

BillingAdjustmentsTable.propTypes = {
  submissions: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    formType: PropTypes.string.isRequired,
    submittedAt: PropTypes.string.isRequired,
    responses: PropTypes.object.isRequired,
  })).isRequired,
  onViewDetails: PropTypes.func.isRequired,
  formFields: PropTypes.object.isRequired,
  customers: PropTypes.object.isRequired,
};

export default BillingAdjustmentsTable;