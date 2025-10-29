import { shortenAddress } from '@/utils/ShortenAddress';
type profileNavItemFunProps={
    showOwner:number,
    username?:string,
}
export const profileUserDetails = [
  {
    title: 'Follower',
  },
  {
    title: 'Following',
  },
  {
    title: 'Address',
  },
];

export const ProfileNavItemFun = ({title,arrayLength}:{title:string,arrayLength:number})=>[
    { title, path: `/${title}`, count: arrayLength?? 0 },
    { title, path: `/${title}`, count: arrayLength?? 0 },
    { title, path: `/${title}` , count:arrayLength ?? 0 },
    { title, path: `/${title}` , count: arrayLength?? 0 },
  ]

