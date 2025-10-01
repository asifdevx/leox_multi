interface HeaderLists {
  label: string,
  route: string,
  islink: boolean, 
}

export const HeaderLists:HeaderLists[] = [
  {
    label: "Home",
    route: "/",
    islink: true,
  },
  {
    label: "Create",
    route: "/createNFT",
    islink: true,
  },
  {
    label: "Buy",
    route: "/buy",
    islink: true,
  },
  {
    label: "drops",
    route: "/drops",
    islink: true,
  },
 
];
export const sidebarLinks = [
  {
    imgURL: "/dashboard.svg",
    route: "/admin",
    label: "Dashboard",
  },
  {
    imgURL: "/fee.svg",
    route: "/admin/fee",
    label: "Fee", 
  },
  {
    imgURL: "/transaction.svg",
    route: "/admin/transactions", 
    label: "Transaction History",
  },
  
  {
    imgURL: "/user.svg",
    route: "/admin/users",
    label: "User Management",
  },

  {
    imgURL: "/analytics.svg",
    route: "/admin/analytics",
    label: "Analytics & Reports",
  },
  {
    imgURL: "/role.svg",
    route: "/admin/roles",
    label: "Role Management",
  },
  {
    imgURL: "/notification.svg",
    route: "/admin/notifications",
    label: "System Notifications",
  },


];