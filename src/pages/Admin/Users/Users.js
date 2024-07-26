import React, { useState, useEffect } from 'react'
import axios from 'axios'
import UsersTable from './components/UsersTable'
import { getUsers } from 'utils/handleApiCall'

const Users = () => {
  const [users, setUsers] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users from the API
        setUsers(await getUsers())
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