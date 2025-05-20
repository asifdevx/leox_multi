import Footer from "@/components/footer/Footer";
import Header from "@/components/Header";

const Layout = (props: any) => {
  return (
    <div className="w-screen min-h-screen flex flex-col bg-[#ffffff] text-black">
      <Header />
      <div className="mt-20 ">{props.children}</div>
      <Footer />

    </div>
  );
};

export default Layout;

