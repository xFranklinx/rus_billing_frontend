import React, { useState, useEffect, useContext } from 'react';
import { Button, Toolbar, Box, Typography, CircularProgress, Tabs, Tab } from '@mui/material';
import BillingAdjustmentsTable from './components/BillingAdjustmentsTable';
import AdjustmentModal from './components/AdjustmentModal';
import billingAdjustmentForms from 'config/forms/billingAdjustmentForms.json';
import { AuthContext } from 'contexts/AuthContext';
import { createBillingAdjustment, getAllBillingAdjustments, getCustomers, getBillingAdjustmentById, updateBillingAdjustment } from 'utils/handleApiCall';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const BillingAdjustmentsPage = () => {
  const { user } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [formConfigs] = useState({
    'billing-adjustment': billingAdjustmentForms,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [customers, setCustomers] = useState({});

  const canViewAllSubmissions = ['Admin', 'Manager', 'Team Lead'].includes(user.accountType);

  useEffect(() => {
    fetchSubmissions();
    fetchCustomers();
  }, [canViewAllSubmissions, user.id]);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllBillingAdjustments({
        viewAll: canViewAllSubmissions,
      });
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError('Failed to fetch submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      const customersData = response.data.reduce((acc, customer) => {
        acc[customer._id] = customer.name;
        return acc;
      }, {});
      setCustomers(customersData);
      const options = response.data.map(customer => ({
        value: customer._id,
        label: customer.name
      }));
      setCustomerOptions(options);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to fetch customers. Please try again.');
    }
  };

  const handleOpenModal = () => {
    setSelectedSubmission(null);
    setIsEditing(false);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSubmission(null);
    setIsEditing(false);
  };

  const handleSubmit = async (formType, formData) => {
    try {
      if (selectedSubmission) {
        await updateBillingAdjustment(selectedSubmission._id, { responses: formData });
      } else {
        await createBillingAdjustment({ responses: formData }, { formType });
      }
      handleCloseModal();
      fetchSubmissions();
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit form. Please try again.');
    }
  };

  const handleViewDetails = async (submissionId) => {
    try {
      const submission = await getBillingAdjustmentById(submissionId);
      setSelectedSubmission(submission.data);
      setIsEditing(false);
      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching submission details:', error);
      setError('Failed to fetch submission details. Please try again.');
    }
  };

  const handleEditSubmission = () => {
    setIsEditing(true);
  };

  const handleRetry = () => {
    fetchSubmissions();
    fetchCustomers();
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '2000px', margin: '0 auto', overflowX: 'hidden' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Billing Adjustments</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          New Adjustment
        </Button>
      </Toolbar>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box textAlign="center" my={4}>
          <Typography color="error" gutterBottom>{error}</Typography>
          <Button variant="outlined" color="primary" onClick={handleRetry}>
            Retry
          </Button>
        </Box>
      )}

      {!loading && !error && (
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <Tabs value={tabValue} onChange={handleChangeTab} aria-label="billing adjustment tabs">
            {formConfigs['billing-adjustment'].formTypes.map((formType, index) => (
              <Tab label={formType.name} key={formType.id} id={`simple-tab-${index}`} aria-controls={`simple-tabpanel-${index}`} />
            ))}
          </Tabs>
          {formConfigs['billing-adjustment'].formTypes.map((formType, index) => (
            <TabPanel value={tabValue} index={index} key={formType.id}>
              <BillingAdjustmentsTable
                submissions={submissions.filter(s => s.formType === formType.id)}
                onViewDetails={handleViewDetails}
                formFields={formType.fields}
                customers={customers}
              />
            </TabPanel>
          ))}
        </Box>
      )}

      <AdjustmentModal
        open={openModal}
        onClose={handleCloseModal}
        formConfigs={formConfigs}
        onSubmit={handleSubmit}
        customerOptions={customerOptions}
        selectedSubmission={selectedSubmission}
        isEditing={isEditing}
        onEdit={handleEditSubmission}
      />
    </Box>
  );
};

export default BillingAdjustmentsPage;