import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, TableSortLabel } from '@mui/material';
import axios from 'axios';
import EditUserModal from './EditUserModal';

const UsersTable = ({ usersData }) => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [leadsAndManagers, setLeadsAndManagers] = useState([]);
  const [users, setUsers] = useState(usersData.data);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('name');
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const runSetup = async () => {
      await getLeadsAndManagers();
      generateTableData();
    }

    runSetup()
  }, [users, order, orderBy]);

  const getLeadsAndManagers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/users/leadsAndManagers');
      const data = await response.json();
      setLeadsAndManagers(data.data);
    } catch (error) {
      console.error('Error fetching leads and managers:', error);
      setLeadsAndManagers([]);
    }
  };

  const handleOpen = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const updateUser = async (updatedUser) => {
    const response = await axios.put(`http://localhost:5000/api/v1/users/${updatedUser.data._id}`, updatedUser.data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })

    setUsers(prevUsers =>
      prevUsers.map(user => user._id === updatedUser.data._id ? response.data.data : user)
    )

    handleClose();
  };

  const userIdToNameMap = users.reduce((acc, user) => {
    acc[user._id] = user.name;
    return acc;
  }, {});

  const usersWithManagerNames = users.map(user => ({
    ...user,
    managerName: userIdToNameMap[user.manager] || 'N/A'
  }));

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedUsers = [...usersWithManagerNames].sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return a[orderBy] > b[orderBy] ? -1 : 1;
    }
  });

  const generateTableData = () => {
    const tableRows = sortedUsers.map((user) => (
      <TableRow key={user._id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.accountType}</TableCell>
        <TableCell>{user.position}</TableCell>
        <TableCell>{user.department}</TableCell>
        <TableCell>{user.managerName}</TableCell>
        <TableCell>
          <Button onClick={() => handleOpen(user)}>Edit</Button>
        </TableCell>
      </TableRow>
    ));

    setTableData(tableRows);
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'name'}
                direction={orderBy === 'name' ? order : 'asc'}
                onClick={() => handleRequestSort('name')}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'email'}
                direction={orderBy === 'email' ? order : 'asc'}
                onClick={() => handleRequestSort('email')}
              >
                Email
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'accountType'}
                direction={orderBy === 'accountType' ? order : 'asc'}
                onClick={() => handleRequestSort('accountType')}
              >
                Role
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'position'}
                direction={orderBy === 'position' ? order : 'asc'}
                onClick={() => handleRequestSort('position')}
              >
                Position
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'department'}
                direction={orderBy === 'department' ? order : 'asc'}
                onClick={() => handleRequestSort('department')}
              >
                Department
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'managerName'}
                direction={orderBy === 'managerName' ? order : 'asc'}
                onClick={() => handleRequestSort('managerName')}
              >
                Manager
              </TableSortLabel>
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData}
        </TableBody>
      </Table>
      <EditUserModal
        open={open}
        handleClose={handleClose}
        user={selectedUser}
        updateUser={updateUser}
        leadsAndManagers={leadsAndManagers}
      />
    </>
  );
};

export default UsersTable;
