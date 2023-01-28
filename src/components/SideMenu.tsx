import { signOut } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { GoSignOut } from "react-icons/go";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { AiOutlinePieChart } from "react-icons/ai";
import { BsCreditCard2Back } from "react-icons/bs";
import { RiQuestionAnswerLine, RiTeamLine } from "react-icons/ri";
import { CiUser } from "react-icons/ci";
import { IoSettingsOutline, IoCreateOutline } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/router";
import { AiOutlineClose } from "react-icons/ai";
import { useGlobalContext } from "../lib/GlobalContext";
import { BiVideoPlus } from "react-icons/bi";
import { MdSlowMotionVideo } from "react-icons/md";

type Props = {
  menuStatus: string;
  setMenuStatus: Function;
};

const SideMenu = (props: Props) => {
  const router = useRouter();
  const selectedMenu = router.pathname.replace("/panel/", "");

  const { setLoading } = useGlobalContext();

  const MENUS = [
    { title: "Materi", notif: false, icon: <MdSlowMotionVideo /> },
    { title: "Peserta", notif: false, icon: <RiTeamLine /> },
    // { title: "Hasil Survei", notif: false, icon: <AiOutlinePieChart /> },
    // { title: "Kelola Saldo", notif: false, icon: <BsCreditCard2Back /> },
    // { title: "Data Diri", notif: true, icon: <CiUser /> },
    // { title: "Pengaturan", notif:false,icon: <IoSettingsOutline /> },
  ];

  const handleAnimation = () => {
    if (props.menuStatus === "open") {
      return "animate-slideIn right-0";
    }
    if (props.menuStatus === "close") {
      return "animate-slideOut right-[100%]";
    }
    return "animate-none right-[100%]";
  };

  return (
    <div
      className={`${handleAnimation()} absolute z-50 flex h-screen w-full flex-col border-r-[1px] border-gray-500 border-opacity-50 bg-primary text-gray-100 sm:relative sm:right-0 sm:w-[22%] sm:animate-none`}
    >
      <div className="flex items-center justify-between border-none border-gray-500 bg-primary-dark px-6 sm:border-b-[1px]">
        <Link
          href={"/"}
          className="font-fredoka flex  min-h-[10vh] items-center text-2xl text-primary sm:min-h-[12vh]"
        >
          <div className="text-xxl font-bold text-red-500">BISINDO</div>
        </Link>
        <div className="sm:hidden">
          <button
            className="text-3xl"
            onClick={() => props.setMenuStatus("close")}
          >
            <AiOutlineClose />
          </button>
        </div>
      </div>

      {/* BUAT SURVEI */}
      {/* <div
        className="mx-3 my-6 flex cursor-pointer items-center rounded-sm bg-blue-700 py-3 px-6 text-left hover:bg-blue-600"
        onClick={(e) => {
          e.preventDefault();
          props.setMenuStatus("close");
          setLoading(true);
          router.push(`/panel/buat-survei`);
        }}
      >
        <span className="w-6 text-xl">
          <BiVideoPlus />
        </span>
        <span className="ml-2">Buat Survei</span>
      </div> */}

      {MENUS.map((menu, i) => {
        const eachMenu = menu.title.toLowerCase().replace(" ", "-");
        return (
          <Link
            key={i}
            href={`/panel/${eachMenu}`}
            className={`${
              eachMenu === selectedMenu && "bg-primary-dark"
            } mx-3 my-2 flex cursor-pointer items-center rounded-sm py-3 px-6 text-left hover:bg-primary-dark`}
            onClick={(e) => {
              e.preventDefault();
              props.setMenuStatus("close");
              setLoading(true);
              router.push(`/panel/${eachMenu}`);
            }}
          >
            <span className="w-6 text-xl">{menu.icon}</span>
            <span className="ml-2 flex">
              {menu.title}
              {/* {menu.notif && (
                <div className="w-2 h-2 ml-0.5 mt-0.5 rounded-full bg-blue-400 bg-opacity-50" />
              )} */}
            </span>
          </Link>
        );
      })}
      {/* <hr className="my-4 opacity-30" />
      <button
        className="mx-3 mb-2 flex items-center rounded-sm py-3 px-6 text-left hover:bg-blue-prime"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        <GoSignOut className="mr-2" />
        Logout
      </button> */}
    </div>
  );
};

export default SideMenu;
