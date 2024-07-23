import React, { useState, useEffect } from 'react'
import axios from 'axios'
import UsersTable from './components/UsersTable'

const Users = () => {
  const [users, setUsers] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users from the API
        const response = await axios.get('http://localhost:5000/api/v1/users')
        setUsers(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchUsers()
  }, [])

  if (!users) {
    return <div>Loading...</div>
  }

  return (
    <UsersTable usersData={users} />
  )
}

export default Users