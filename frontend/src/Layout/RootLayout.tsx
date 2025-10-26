import Footer from '@/components/footer/Footer';
import Header from '@/components/Header';
import ProfileNav from '@/components/HelperCom/ProfileNav';
import ItemsBanner from '@/components/itemsComponents/ItemsBanner';
import { useRouter } from 'next/router';


const RootLayout = (props: any) => {
  const { asPath } = useRouter();

  return (
    <div className="w-full min-h-screen flex flex-col bg-nft-dark-gradient text-white">
      <Header />
      {asPath.startsWith('/items') && (
        <>
          <ItemsBanner />
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
