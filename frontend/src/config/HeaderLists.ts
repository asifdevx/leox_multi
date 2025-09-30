interface HeaderLists {
  name: string,
  link?: string,
  islink: boolean, 
}

export const HeaderLists:HeaderLists[] = [
  {
    name: "Home",
    link: "/",
    islink: true,
  },
  {
    name: "Create",
    link: "/createNFT",
    islink: true,
  },
  {
    name: "Buy",
    link: "/buy",
    islink: true,
  },
  {
    name: "drops",
    link: "/drops",
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
    imgURL: "/eth.svg",
    route: "/admin/nfts",
    label: "NFT Moderation",
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