import {
  Home as HomeIcon,
  Assessment as DashboardIcon,
  Business as CustomersIcon,
  // Automations
  Receipt as InvoiceEmailSchedulerIcon,
  CurrencyExchange as MorphIcon,
  RemoveRedEye as SqlVisionIcon,
  CheckBox as VOPIcon,
  // Forms
  AttachMoney as SolutionsAdjustmentsIcon,
  // Admin
  People as UsersIcon,
} from '@mui/icons-material'

const sidebarLinks = {
  Main: [
    { text: 'Home', url: '/', icon: <HomeIcon /> },
    { text: 'Dashboard', url: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Customers', url: '/customers', icon: <CustomersIcon /> },
  ],
  Automations: [
    { text: 'Invoice Email Scheduler', url: '/automations/invoice-email-scheduler', icon: <InvoiceEmailSchedulerIcon /> },
    { text: 'Morph', url: '/automations/morph', icon: <MorphIcon /> },
    { text: 'SQL Vision', url: '/automations/sql-vision', icon: <SqlVisionIcon /> },
    { text: 'VOP', url: '/automations/vop', icon: <VOPIcon /> },
  ],
  Forms: [
    { text: 'Solutions', url: '/forms/solutions-adjustments', icon: <SolutionsAdjustmentsIcon /> },
  ],
  Admin: [
    { text: 'Users', url: '/admin/users', icon: <UsersIcon /> },
  ]
}

export default sidebarLinks