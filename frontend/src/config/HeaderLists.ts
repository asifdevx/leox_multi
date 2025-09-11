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
