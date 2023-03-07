import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import { useGlobalContext } from "../lib/GlobalContext";
import Head from "next/head";
import { GiBrain } from "react-icons/gi";
import { TiMediaFastForwardOutline } from "react-icons/ti";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { HiScale } from "react-icons/hi2";

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

  return (
    <div className="font-poppins flex h-screen overflow-hidden">
      <Head>
        <title>Diabetes Assistant</title>
      </Head>
      <SideMenu
        menuStatus={menuStatus}
        setMenuStatus={setMenuStatus}
        menuLists={[
          { title: "Dashboard", icon: <MdOutlineSpaceDashboard /> },
          {
            title: "Forward Chaining",
            icon: <TiMediaFastForwardOutline />,
          },
          { title: "Logika Fuzzy", icon: <GiBrain /> },
          {
            title: "Perbandingan Metode",
            icon: <HiScale />,
          },
          // {
          //   title: "Data Diri",
          //   icon: <RiFileUserLine />,
          // },
          // { title: "Peserta",  icon: <RiTeamLine /> },
        ]}
      />
      <div className="flex w-full flex-col">
        <Header setMenuStatus={setMenuStatus} />
        {/* BODY/CONTENT */}
        <div className="relative h-full w-full overflow-y-auto bg-gray-200 bg-[url('/bg-panel.jpg')] bg-cover bg-right text-gray-700">
          {/* floating div to cover the background */}
          <div className="absolute w-full bg-gray-100 bg-opacity-40 sm:h-full" />
          {loading ? <Loading /> : props?.children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
