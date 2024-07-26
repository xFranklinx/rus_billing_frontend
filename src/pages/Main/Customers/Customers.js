import React, { useState, useEffect } from 'react'
import CustomersTable from './components/CustomersTable'
import ReusableTableWithModal from 'components/ReuseableTableWithModal'
import { getCustomers } from 'utils/handleApiCall'

const Customers = () => {
  const [customers, setCustomers] = useState(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers()
        setCustomers(response)
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

  return (
    <ReusableTableWithModal
      data={customers}
      fields={fields}
      modalFields={modalFields}
    />
  )
}

export default Customers