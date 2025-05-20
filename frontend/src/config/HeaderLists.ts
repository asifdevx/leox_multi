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
    link: "/createNft",
    islink: true,
  },
  {
    name: "Buy",
    link: "/buy",
    islink: true,
  },
];
