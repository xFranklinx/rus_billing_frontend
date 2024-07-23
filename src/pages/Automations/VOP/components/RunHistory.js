import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const RunHistory = () => {
  // Sample data of run execution history
  const runHistoryData = [
    { id: 1, date: '2022-01-01', status: 'Success' },
    { id: 2, date: '2022-01-02', status: 'Failed' },
    { id: 3, date: '2022-01-03', status: 'Success' },
  ];

  const handleStartRun = () => {
    // Logic to start a new run
    console.log('Starting a new run...');
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {runHistoryData.map((run) => (
              <TableRow key={run.id}>
                <TableCell>{run.id}</TableCell>
                <TableCell>{run.date}</TableCell>
                <TableCell>{run.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={handleStartRun}>Start New Run</Button>
    </div>
  );
};

export default RunHistory;