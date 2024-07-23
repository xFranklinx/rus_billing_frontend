import React, { useState, useEffect } from 'react'
import CustomersTable from './components/CustomersTable'
import ReusableTableWithModal from 'components/ReuseableTableWithModal'

const Customers = () => {
  const [customers, setCustomers] = useState(null)

  useEffect(() => {
    // Fetch customers from the backend
    // Update the state with the fetched customers
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/v1/customers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        setCustomers(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchCustomers()
  }, [])


  const fields = [
    { field: 'name', label: 'Name' },
    { field: 'status', label: 'Status' },
  ];

  const modalFields = [
    { name: 'name', label: 'Name' },
    { name: 'status', label: 'Status' },
  ];

  const apiUrl = 'http://localhost:5000/api/v1/users';
  const token = localStorage.getItem('token');

  const usersData = {
    data: [
      // Example user data
      { _id: '1', name: 'John Doe', email: 'john@example.com', accountType: 'Admin', position: 'CEO', department: 'Management', managerName: 'N/A' },
      // Add more users as needed
    ]
  };

  console.log(customers.data)


  return (
    // <CustomersTable />
    <ReusableTableWithModal
      data={customers.data}
      fields={fields}
      modalFields={modalFields}
      apiUrl={apiUrl}
      token={token}
    />
  )
}

export default Customers