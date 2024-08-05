import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import PropTypes from 'prop-types';
import AdvancedDynamicForm from 'components/AdvancedDynamicForm';

const AdjustmentModal = ({
  open,
  onClose,
  formConfigs,
  onSubmit,
  customerOptions,
  selectedSubmission,
  isEditing,
  onEdit
}) => {
  const [selectedForm, setSelectedForm] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (selectedSubmission) {
      const form = formConfigs['billing-adjustment'].formTypes.find(form => form.id === 'SolutionsBillingAdjustment');
      setSelectedForm(form);
      setFormData(selectedSubmission.responses || {});
    } else {
      setSelectedForm(null);
      setFormData({});
    }
  }, [selectedSubmission, formConfigs]);

  const handleFormSelect = (event) => {
    const selected = formConfigs['billing-adjustment'].formTypes.find(form => form.id === event.target.value);
    setSelectedForm(selected);
    setFormData({});
  };

  const handleSubmit = (submittedFormData) => {
    onSubmit(selectedForm.id, submittedFormData);
    setSelectedForm(null);
    setFormData({});
  };

  const handleEdit = () => {
    onEdit();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: 600,
        maxHeight: '90vh',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {selectedSubmission ? (isEditing ? 'Edit' : 'View') : 'New'} Billing Adjustment Form
        </Typography>

        {!selectedSubmission && (
          <Select
            fullWidth
            value={selectedForm ? selectedForm.id : ''}
            onChange={handleFormSelect}
            displayEmpty
            sx={{ mt: 2, mb: 4 }} // Increased bottom margin
          >
            <MenuItem value="" disabled>
              Select Billing Adjustment Form
            </MenuItem>
            {formConfigs['billing-adjustment'].formTypes.map((form) => (
              <MenuItem key={form.id} value={form.id}>
                {form.name}
              </MenuItem>
            ))}
          </Select>
        )}

        {selectedForm && (
          <>
            {selectedSubmission && !isEditing && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleEdit}
                sx={{ mt: 2, mb: 2, mr: 2 }}
              >
                Edit
              </Button>
            )}

            <AdvancedDynamicForm
              formConfig={selectedForm}
              onSubmit={handleSubmit}
              initialData={formData}
              isReadOnly={selectedSubmission && !isEditing}
              customerOptions={customerOptions}
            />
          </>
        )}
      </Box>
    </Modal>
  );
};

AdjustmentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  formConfigs: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  customerOptions: PropTypes.array.isRequired,
  selectedSubmission: PropTypes.object,
  isEditing: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default AdjustmentModal;