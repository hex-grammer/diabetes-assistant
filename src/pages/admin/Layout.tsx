import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import SideMenu from "../../components/SideMenu";
import { useGlobalContext } from "../../lib/GlobalContext";
import Head from "next/head";
import { BsJournalBookmarkFill } from "react-icons/bs";
import { TiSortAlphabeticallyOutline } from "react-icons/ti";
import { BiBook } from "react-icons/bi";
import { MdSlowMotionVideo } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";

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
  const { loading, setLoading } = useGlobalContext();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="font-poppins flex h-screen overflow-hidden">
      <Head>
        <title>Belajar BISINDO</title>
      </Head>
      <SideMenu
        menuStatus={menuStatus}
        setMenuStatus={setMenuStatus}
        menuLists={[
          { title: "Materi", notif: false, icon: <BsJournalBookmarkFill /> },
          {
            title: "Abjad BISINDO",
            notif: false,
            icon: <TiSortAlphabeticallyOutline />,
          },
          { title: "Kamus BISINDO", notif: false, icon: <BiBook /> },
          {
            title: "Pertanyaan Umum",
            notif: false,
            icon: <MdSlowMotionVideo />,
          },
          {
            title: "Kalimat Perkenalan",
            notif: false,
            icon: <MdSlowMotionVideo />,
          },
          {
            title: "Kalimat Sapaan",
            notif: false,
            icon: <MdSlowMotionVideo />,
          },
          // { title: "Peserta", notif: false, icon: <RiTeamLine /> },
        ]}
      />
      <div className="flex w-full flex-col">
        <Header setMenuStatus={setMenuStatus} />
        {/* BODY/CONTENT */}
        <div className="h-full w-full overflow-y-auto bg-gray-200 text-gray-700 ">
          {loading ? <Loading /> : props?.children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
