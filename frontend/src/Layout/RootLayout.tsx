import Footer from '@/components/footer/Footer';
import Header from '@/components/Header';
import ItemsBanner from '@/components/Com/itemsComponents/ItemsBanner';
import ProfileNav from '@/components/Com/HelperCom/ProfileNav';
import { useRouter } from 'next/router';


const RootLayout = (props: any) => {
  const { asPath } = useRouter();

  return (
    <div className="w-full min-h-screen flex flex-col bg-nft-dark-gradient text-white">
      <Header />
      {asPath.startsWith('/items') && (
        <>
          <ItemsBanner userData={{
            name: undefined,
            roles: undefined,
            address: ''
          }} />
          <ProfileNav username={'items'} />
          <div className="w-[98%] h-[2px] mx-auto bg-gradient-to-r from-purple-800 via-purple-500 to-indigo-800 " />
        </>
      )}
      <div className="mt-20 ">{props.children}</div>
      <Footer />
    </div>
  );
};

export default RootLayout;
