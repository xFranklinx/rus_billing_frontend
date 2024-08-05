import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
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
      const form = formConfigs['billing-adjustment'].formTypes.find(form => form.id === selectedSubmission.formType);
      setSelectedForm(form || null);
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
    handleClose();
  };

  const handleClose = () => {
    setSelectedForm(null);
    setFormData({});
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          {selectedSubmission ? (isEditing ? 'Edit' : 'View') : 'New'} Billing Adjustment Form
        </Typography>

        {!selectedSubmission && (
          <Select
            fullWidth
            value={selectedForm ? selectedForm.id : ''}
            onChange={handleFormSelect}
            displayEmpty
            sx={{ mb: 4 }}
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
          <AdvancedDynamicForm
            formConfig={selectedForm}
            onSubmit={handleSubmit}
            initialData={formData}
            isReadOnly={selectedSubmission && !isEditing}
            customerOptions={customerOptions}
            isEditing={isEditing}
            onEdit={onEdit}
            onClose={handleClose}
          />
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