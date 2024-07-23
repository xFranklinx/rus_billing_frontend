import React from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';

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

const AdjustmentModal = ({
  open,
  handleClose,
  currentAdjustment,
  setCurrentAdjustment,
  editMode,
  enableEdit,
  userData,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentAdjustment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResponseChange = (e) => {
    const { name, value } = e.target;
    setCurrentAdjustment(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [name]: value
      }
    }));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {currentAdjustment.formId.length > 0 ? 'Edit Adjustment' : 'Create New Adjustment'}
        </Typography>
        <form>
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel id="form-id-label">Form ID</InputLabel>
            <Select
              labelId="form-id-label"
              id="form-id"
              name="formId"
              value={currentAdjustment.formId}
              onChange={handleChange}
              label="Form ID"
              disabled={!editMode}
            >
              <MenuItem value="Billing Adjustment">Billing Adjustment</MenuItem>
              <MenuItem value="ROA">ROA</MenuItem>
            </Select>
          </FormControl>
          {currentAdjustment.formId.length > 0 ? <TextField
            fullWidth
            margin="normal"
            label="Submitted By"
            value={userData[currentAdjustment.submittedBy]?.name || 'Loading...'}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          /> : null}
          <TextField
            fullWidth
            margin="normal"
            label="Did Original Hours Entered In Replicon Generate Invoice"
            name="didOriginalHoursEnteredInRepliconGenerateInvoice"
            value={currentAdjustment.responses.didOriginalHoursEnteredInRepliconGenerateInvoice}
            onChange={handleResponseChange}
            InputProps={{
              readOnly: !editMode,
            }}
            variant="outlined"
          />
          {/* Add more fields as necessary */}
          {!editMode && (
            <Button variant="contained" color="primary" onClick={enableEdit}>
              Edit
            </Button>
          )}
        </form>
      </Box>
    </Modal>
  );
};

export default AdjustmentModal;
