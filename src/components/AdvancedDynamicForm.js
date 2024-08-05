import React, { useState, useEffect } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Box
} from '@mui/material';
import PropTypes from 'prop-types';

const EnhancedDynamicForm = ({
  formConfig,
  onSubmit,
  initialData = {},
  isReadOnly = false,
  customerOptions = []
}) => {
  const [formData, setFormData] = useState({});
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const convertedData = Object.entries(formConfig.fields).reduce((acc, [key, field]) => {
      if (field.type === 'select' && initialData[key] === undefined) {
        acc[key] = '';
      } else if (field.type === 'checkbox') {
        acc[key] = initialData[key] === 'Yes' || initialData[key] === true;
      } else {
        acc[key] = initialData[key] !== undefined ? initialData[key] : '';
      }
      return acc;
    }, {});
    setFormData(convertedData);
  }, [initialData, formConfig.fields]);

  const handleInputChange = (fieldId, value) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldId]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const submittedData = Object.entries(formData).reduce((acc, [key, value]) => {
      const field = formConfig.fields[key];
      if (field && field.type === 'checkbox') {
        acc[key] = value ? 'Yes' : 'No';
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
    onSubmit(submittedData);
  };

  const handleClear = () => {
    const clearedData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    setFormData(clearedData);
    setActiveStep(0);
  };

  const renderField = (field) => {
    const value = formData[field.id] !== undefined ? formData[field.id] : '';
    const props = {
      fullWidth: true,
      label: field.label,
      value: value,
      onChange: (e) => handleInputChange(field.id, e.target.value),
      required: field.required,
      disabled: isReadOnly
    };

    switch (field.type) {
      case 'text':
      case 'number':
      case 'email':
        return <TextField {...props} type={field.type} />;
      case 'select':
        return (
          <FormControl fullWidth>
            <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
            <Select
              {...props}
              labelId={`${field.id}-label`}
              displayEmpty
            >
              <MenuItem value="">
                <em></em>
              </MenuItem>
              {(field.id === 'customerId' ? customerOptions : field.options).map((option) => (
                <MenuItem key={option.value || option} value={option.value || option}>
                  {option.label || option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(value)}
                onChange={(e) => handleInputChange(field.id, e.target.checked)}
                disabled={isReadOnly}
              />
            }
            label={field.label}
          />
        );
      case 'textarea':
        return <TextField {...props} multiline rows={4} />;
      case 'date':
        return <TextField {...props} type="date" InputLabelProps={{ shrink: true }} />;
      default:
        return null;
    }
  };

  const isFieldVisible = (field) => {
    if (!field.conditional) return true;
    const { conditional } = field;

    switch (conditional.operator) {
      case 'equals':
        return formData[conditional.field] === conditional.value;
      case 'notEquals':
        return formData[conditional.field] !== conditional.value;
      case 'greaterThan':
        return Number(formData[conditional.field]) > Number(conditional.value);
      case 'lessThan':
        return Number(formData[conditional.field]) < Number(conditional.value);
      default:
        return true;
    }
  };

  const renderSection = (section, sectionIndex) => (
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }} key={sectionIndex}>
      {section.title && (
        <Typography variant="h6" gutterBottom>
          {section.title}
        </Typography>
      )}
      <Grid container spacing={2}>
        {section.layout.map((row, rowIndex) => (
          <Grid item xs={12} key={rowIndex}>
            <Grid container spacing={2}>
              {row.fields.map((fieldId) => {
                const field = formConfig.fields[fieldId];
                if (!field || !isFieldVisible(field)) return null;
                return (
                  <Grid item xs={12} sm={12 / row.fields.length} key={field.id}>
                    {renderField(field)}
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  const renderStepContent = (step) => {
    return formConfig.pages[step].sections.map((section, index) => renderSection(section, index));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <form onSubmit={handleSubmit}>
      {formConfig.useWizard ? (
        <>
          <Stepper activeStep={activeStep} alternativeLabel>
            {formConfig.pages.map((page, index) => (
              <Step key={index}>
                <StepLabel>{page.title}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 2 }}>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button
                color="secondary"
                onClick={handleClear}
                sx={{ mr: 1 }}
              >
                Clear
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button
                onClick={activeStep === formConfig.pages.length - 1 ? handleSubmit : handleNext}
              >
                {activeStep === formConfig.pages.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </Box>
          </Box>
        </>
      ) : (
        <>
          {formConfig.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.sections.map((section, sectionIndex) => renderSection(section, sectionIndex))}
            </React.Fragment>
          ))}
          {!isReadOnly && (
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="secondary"
                onClick={handleClear}
                sx={{ mr: 1 }}
              >
                Clear
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </Box>
          )}
        </>
      )}
    </form>
  );
};

EnhancedDynamicForm.propTypes = {
  formConfig: PropTypes.shape({
    useWizard: PropTypes.bool,
    pages: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      sections: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        layout: PropTypes.arrayOf(PropTypes.shape({
          fields: PropTypes.arrayOf(PropTypes.string)
        }))
      }))
    })),
    fields: PropTypes.objectOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      required: PropTypes.bool,
      options: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          value: PropTypes.string,
          label: PropTypes.string
        })
      ])),
      conditional: PropTypes.object
    }))
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  isReadOnly: PropTypes.bool,
  customerOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string
  }))
};

export default EnhancedDynamicForm;