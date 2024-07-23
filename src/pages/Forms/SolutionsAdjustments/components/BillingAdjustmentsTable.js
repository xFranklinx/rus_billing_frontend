import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import axios from 'axios';
import AdjustmentModal from './AdjustmentModal';

const BillingAdjustmentTable = () => {
  const [data, setData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [userData, setUserData] = useState({});
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAdjustment, setCurrentAdjustment] = useState({
    formId: '',
    submittedBy: '',
    responses: {
      didOriginalHoursEnteredInRepliconGenerateInvoice: '',
      serviceLine: '',
      customerId: '',
      customerName: '',
      typeOfAdjustment: '',
      isAdditionalIncidentalRequestRequired: '',
      isRoaRequired: '',
      typeOfCorrection: [],
      whyCorrectionIsNeeded: '',
      adjustmentReasonDetails: '',
      submittedOnBehalfOf: '',
      invoicesToBeAdjusted: [],
      resourceNameAndWeekEndingDatesAdjustmentIsFor: [],
      approversFullName: '',
      approversTitle: '',
      approversEmailAddress: '',
      netDollarAmountofAdjustmentRequested: '',
      approvalLevel: '',
    },
  });

  useEffect(() => {
    const getToken = () => {
      return localStorage.getItem('token'); // Adjust according to your storage method
    };

    const fetchFormData = async () => {
      try {
        const token = getToken();
        const response = await axios.get('http://localhost:5000/api/v1/forms/solutionsBillingAdjustments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data);
        setData(response.data);

        // Fetch user data for each submittedBy ID
        const userIds = response.data.data.map(element => element.submittedBy);
        const uniqueUserIds = [...new Set(userIds)]; // Ensure unique IDs only
        const userResponses = await Promise.all(uniqueUserIds.map(id => axios.get(`http://localhost:5000/api/v1/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })));
        const users = userResponses.reduce((acc, userResponse) => {
          acc[userResponse.data.data._id] = userResponse.data.data; // Use data.data to get the actual user object
          return acc;
        }, {});
        setUserData(users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchFormData();
  }, []);

  useEffect(() => {
    if (data && data.data && Object.keys(userData).length > 0) {
      const tableRows = data.data.map(element => (
        <TableRow key={element._id}>
          <TableCell>{element.formId}</TableCell>
          <TableCell>{userData[element.submittedBy] ? userData[element.submittedBy].name : 'Loading...'}</TableCell>
          <TableCell>{element.responses.didOriginalHoursEnteredInRepliconGenerateInvoice}</TableCell>
          <TableCell>{element.responses.serviceLine}</TableCell>
          <TableCell>{element.responses.customerId}</TableCell>
          <TableCell>{element.responses.customerName}</TableCell>
          <TableCell>{element.responses.typeOfAdjustment}</TableCell>
          <TableCell>{element.responses.isAdditionalIncidentalRequestRequired}</TableCell>
          <TableCell>{element.responses.isRoaRequired}</TableCell>
          <TableCell>{element.responses.typeOfCorrection ? element.responses.typeOfCorrection.join(', ') : 'N/A'}</TableCell>
          <TableCell>{element.responses.whyCorrectionIsNeeded}</TableCell>
          <TableCell>{element.responses.adjustmentReasonDetails}</TableCell>
          <TableCell>{element.responses.submittedOnBehalfOf}</TableCell>
          <TableCell>{element.responses.invoicesToBeAdjusted ? element.responses.invoicesToBeAdjusted.join(', ') : 'N/A'}</TableCell>
          <TableCell>
            {element.responses.resourceNameAndWeekEndingDatesAdjustmentIsFor ? element.responses.resourceNameAndWeekEndingDatesAdjustmentIsFor.map((item, index) => (
              <div key={index}>
                {item.resourceName} - {item.weekEndingDate}
              </div>
            )) : 'N/A'}
          </TableCell>
          <TableCell>{element.responses.approversFullName}</TableCell>
          <TableCell>{element.responses.approversTitle}</TableCell>
          <TableCell>{element.responses.approversEmailAddress}</TableCell>
          <TableCell>${element.responses.netDollarAmountofAdjustmentRequested}</TableCell>
          <TableCell>{element.responses.approvalLevel}</TableCell>
          <TableCell>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Edit />}
              onClick={() => handleEdit(element)}
            >
              Edit
            </Button>
          </TableCell>
        </TableRow>
      ));
      setTableData(tableRows);
    }
  }, [data, userData]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEdit = (adjustment) => {
    setCurrentAdjustment(adjustment);
    setEditMode(false); // Start in read-only mode
    handleOpen();
  };

  const handleNew = () => {
    setCurrentAdjustment({
      formId: '',
      submittedBy: '',
      responses: {
        didOriginalHoursEnteredInRepliconGenerateInvoice: '',
        serviceLine: '',
        customerId: '',
        customerName: '',
        typeOfAdjustment: '',
        isAdditionalIncidentalRequestRequired: '',
        isRoaRequired: '',
        typeOfCorrection: [],
        whyCorrectionIsNeeded: '',
        adjustmentReasonDetails: '',
        submittedOnBehalfOf: '',
        invoicesToBeAdjusted: [],
        resourceNameAndWeekEndingDatesAdjustmentIsFor: [],
        approversFullName: '',
        approversTitle: '',
        approversEmailAddress: '',
        netDollarAmountofAdjustmentRequested: '',
        approvalLevel: '',
      },
    });
    setEditMode(true); // Start in edit mode for new adjustments
    handleOpen();
  };

  const enableEdit = () => {
    setEditMode(true);
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        <Button variant="contained" color="primary" onClick={handleNew}>
          Create New Adjustment
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="billing adjustment table">
          <TableHead>
            <TableRow>
              <TableCell>Form ID</TableCell>
              <TableCell>Submitted By</TableCell>
              <TableCell>Did Original Hours Entered In Replicon Generate Invoice</TableCell>
              <TableCell>Service Line</TableCell>
              <TableCell>Customer ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Type of Adjustment</TableCell>
              <TableCell>Is Additional Incidental Request Required</TableCell>
              <TableCell>Is ROA Required</TableCell>
              <TableCell>Type of Correction</TableCell>
              <TableCell>Why Correction Is Needed</TableCell>
              <TableCell>Adjustment Reason Details</TableCell>
              <TableCell>Submitted On Behalf Of</TableCell>
              <TableCell>Invoices To Be Adjusted</TableCell>
              <TableCell>Resource Name And Week Ending Dates Adjustment Is For</TableCell>
              <TableCell>Approver's Full Name</TableCell>
              <TableCell>Approver's Title</TableCell>
              <TableCell>Approver's Email Address</TableCell>
              <TableCell>Net Dollar Amount of Adjustment Requested</TableCell>
              <TableCell>Approval Level</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData}
          </TableBody>
        </Table>
      </TableContainer>

      <AdjustmentModal
        open={open}
        handleClose={handleClose}
        currentAdjustment={currentAdjustment}
        setCurrentAdjustment={setCurrentAdjustment}
        editMode={editMode}
        enableEdit={enableEdit}
        userData={userData} // Pass userData to the modal
      />
    </>
  );
};

export default BillingAdjustmentTable;
