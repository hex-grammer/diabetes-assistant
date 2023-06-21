import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import SideMenu from "../../components/SideMenu";
import { useGlobalContext } from "../../lib/GlobalContext";
import Head from "next/head";
import { GiBrain, GiWeightScale } from "react-icons/gi";
import { SlCalculator } from "react-icons/sl";
import { TiMediaFastForwardOutline } from "react-icons/ti";
import { MdOutlineFoodBank, MdOutlineSpaceDashboard } from "react-icons/md";
import { HiOutlineUserCircle, HiOutlineUsers, HiScale } from "react-icons/hi2";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

type Props = {
  children?: JSX.Element;
};

const Loading = () => {
  return (
    <div className="flex w-full gap-2 p-8">
      <div className="flex h-20 w-full animate-pulse items-center justify-center rounded-md bg-gray-200 py-4 px-2 text-center text-gray-400 shadow-lg sm:col-span-3 sm:w-3/4">
        Loading...
      </div>
      <div className="flex h-20 w-full animate-pulse items-center justify-center rounded-md bg-gray-200 py-4 px-2 text-center text-gray-400 shadow-lg sm:col-span-3 sm:w-1/4">
        Loading...
      </div>
    </div>
  );
};

function Layout(props: Props) {
  const { data: session } = useSession();
  console.log(session);
  const [menuStatus, setMenuStatus] = useState("no");
  const { loading } = useGlobalContext();
  // get url path
  const router = useRouter();
  const { pathname } = router;
  const path = pathname.split("/")[2] as string;

  useEffect(() => {
    // reload on url change
    void router.push(path);
  }, [pathname]);

  const MENU = session
    ? [
        { title: "Dashboard", icon: <MdOutlineSpaceDashboard /> },
        { title: "Logika Fuzzy", icon: <GiBrain /> },
        {
          title: "Forward Chaining",
          icon: <TiMediaFastForwardOutline />,
        },
        {
          title: "Kalkulator",
          icon: <GiWeightScale />,
        },
        {
          title: "Profil",
          icon: <HiOutlineUserCircle />,
        },
      ]
    : [
        { title: "Dashboard", icon: <MdOutlineSpaceDashboard /> },
        { title: "Logika Fuzzy", icon: <GiBrain /> },
        {
          title: "Forward Chaining",
          icon: <TiMediaFastForwardOutline />,
        },
        {
          title: "Kalkulator",
          icon: <GiWeightScale />,
        },
      ];

  return (
    <div className="font-poppins flex h-screen overflow-hidden">
      <Head>
        <title>Diabetes Assistant</title>
      </Head>
      <SideMenu
        menuStatus={menuStatus}
        setMenuStatus={setMenuStatus}
        menuLists={MENU}
      />
      <div className="flex w-full flex-col">
        <Header setMenuStatus={setMenuStatus} />
        {/* BODY/CONTENT */}
        <div className="relative grid h-full w-full overflow-y-auto bg-gray-200 bg-[url('/bg-panel.jpg')] bg-cover bg-right text-gray-700">
          {loading ? <Loading /> : props?.children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
