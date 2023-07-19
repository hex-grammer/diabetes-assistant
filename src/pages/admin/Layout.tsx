import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import SideMenu from "../../components/SideMenu";
import { useGlobalContext } from "../../lib/GlobalContext";
import Head from "next/head";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi2";
import { useRouter } from "next/router";
import { BiFoodMenu } from "react-icons/bi";
import { CgUserList } from "react-icons/cg";

type Props = {
  children?: JSX.Element;
};

const Loading = () => {
  return (
    <>
      <div className="flex h-20 animate-pulse items-center justify-center rounded-md bg-gray-400 bg-opacity-40 py-4 px-2 text-center text-gray-400 shadow-lg sm:col-span-3" />
      <div className="flex h-12 animate-pulse items-center justify-center rounded-md bg-gray-400 bg-opacity-40 py-4 px-2 text-center text-gray-400 shadow-lg sm:h-20" />
    </>
  );
};

function Layout(props: Props) {
  const [menuStatus, setMenuStatus] = useState("no");
  const { loading } = useGlobalContext();
  // get url path
  const router = useRouter();
  const { pathname } = router;
  const path = pathname.split("/")[2] as string;

  useEffect(() => {
    // reload on url change
    void router.push(path);
  }, [path]);

  return (
    <div className="font-poppins flex h-screen overflow-hidden">
      <Head>
        <title>Diabetes Assistant</title>
      </Head>
      <SideMenu
        admin
        menuStatus={menuStatus}
        setMenuStatus={setMenuStatus}
        menuLists={[
          { title: "Dashboard", icon: <MdOutlineSpaceDashboard /> },
          // { title: "Logika Fuzzy", icon: <GiBrain /> },
          {
            title: "Master Data",
            icon: <BiFoodMenu />,
          },
          {
            title: "History User",
            icon: <CgUserList />,
          },
          // {
          //   title: "Kalkulator",
          //   icon: <GiWeightScale />,
          // },
          {
            title: "Data User",
            icon: <HiOutlineUsers />,
          },
          // {
          //   title: "Makanan",
          //   icon: <MdOutlineFoodBank />,
          // },
          // {
          //   title: "Pekerjaan",
          //   icon: <RiFileUserLine />,
          // },
          // { title: "Admin", icon: <RiTeamLine /> },
        ]}
      />
      <div className="flex w-full flex-col">
        <Header setMenuStatus={setMenuStatus} admin />
        {/* BODY/CONTENT */}
        <div className="relative h-full w-full overflow-y-auto bg-gray-200 bg-[url('/bg-panel.jpg')] bg-cover bg-right text-gray-700">
          {/* floating div to cover the background */}
          {/* <div className="absolute w-full bg-gray-100 bg-opacity-40 sm:h-full" /> */}
          {loading ? <Loading /> : props?.children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
