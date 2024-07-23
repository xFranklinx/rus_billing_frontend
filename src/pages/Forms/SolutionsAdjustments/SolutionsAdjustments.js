import React, { useState } from 'react'
import BillingAdjustmentTable from './components/BillingAdjustmentsTable'

const SolutionsAdjustments = () => {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <BillingAdjustmentTable />
  )
}

export default SolutionsAdjustments