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
    imgURL: "/eth.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/eth.svg",
    route: "/mybanks",
    label: "My Banks",
  },
  {
    imgURL: "/eth.svg",
    route: "/transaction-history",
    label: "Transaction History",
  },
  {
    imgURL: "/eth.svg",
    route: "/payment-transfer",
    label: "Transfer Funds",
  },
];
