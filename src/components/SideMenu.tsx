import { signOut } from "next-auth/react";
import Link from "next/link";
import React, { useEffect } from "react";
import { GoSignOut } from "react-icons/go";
import { TiSortAlphabeticallyOutline } from "react-icons/ti";
import { RiTeamLine } from "react-icons/ri";
import { BsJournalBookmarkFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { AiOutlineClose } from "react-icons/ai";
import { useGlobalContext } from "../lib/GlobalContext";
import { BiBook } from "react-icons/bi";
import { MdSlowMotionVideo } from "react-icons/md";

type Props = {
  menuStatus: string;
  menuLists: {
    title: string;
    notif: boolean;
    icon: JSX.Element;
  }[];
  setMenuStatus: (arg: string) => void;
};

const SideMenu = (props: Props) => {
  const router = useRouter();
  const path = router.pathname.includes("admin")
    ? router.pathname.replace("/admin/materi/", "")
    : router.pathname.replace("/materi/", "");
  const { materi } = router.query;
  const selectedMenu = materi || path;

  useEffect(() => {
    console.log(selectedMenu);
  }, []);

  // const selectedMenu = router.pathname.split('/').includes();

  const { setLoading } = useGlobalContext();

  const handleAnimation = () => {
    if (props.menuStatus === "open") {
      return "animate-slideIn right-0";
    }
    if (props.menuStatus === "close") {
      return "animate-slideOut right-[100%]";
    }
    return "animate-none right-[100%]";
  };

  const onMenuClick = async (
    e: React.MouseEvent<HTMLElement>,
    eachMenu: string
  ) => {
    e.preventDefault();
    props.setMenuStatus("close");
    setLoading(true);
    if (eachMenu === "peserta") {
      await router.push("/admin/peserta");
    } else if (router.pathname.includes("admin")) {
      await router.push(
        eachMenu === "materi" ? "/admin/materi" : `/admin/materi/${eachMenu}`
      );
    } else {
      await router.push(
        eachMenu === "materi" ? "/materi" : `/materi/${eachMenu}`
      );
    }
  };

  return (
    <div
      className={`${handleAnimation()} absolute z-50 flex h-screen w-full flex-col border-r-[1px] border-gray-500 border-opacity-50 bg-primary text-gray-100 sm:relative sm:right-0 sm:w-[22%] sm:animate-none `}
    >
      <div className="mb-4 flex items-center justify-between border-none border-gray-500 bg-primary-dark px-6 sm:border-b-[1px]">
        <Link
          href={"/"}
          className="font-fredoka flex  min-h-[10vh] items-center text-2xl text-primary sm:min-h-[8vh]"
        >
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="logo" className="h-8 w-8" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              BISINDO
            </h1>
          </div>
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

      {props.menuLists.map((menu, i) => {
        const eachMenu = menu.title.toLowerCase().replace(" ", "-");
        return (
          <div
            key={i}
            // href={eachMenu === "materi" ? "/materi" : `/materi/${eachMenu}`}
            className={`mx-3 my-0.5 flex cursor-pointer items-center rounded-sm py-2 px-4 text-left hover:bg-primary-dark ${
              selectedMenu.includes(eachMenu) ? "bg-primary-dark" : ""
            }`}
            onClick={(e) => void onMenuClick(e, eachMenu)}
          >
            <span className="w-6 text-xl">{menu.icon}</span>
            <span className="ml-2 flex leading-4">{menu.title}</span>
          </div>
        );
      })}
      <hr className="my-4 opacity-30" />
      <button
        className="hover:bg-blue-prime mx-3 mb-2 flex items-center rounded-sm py-3 px-6 text-left"
        onClick={() => void signOut({ callbackUrl: "/login" })}
      >
        <GoSignOut className="mr-2" />
        Logout
      </button>
    </div>
  );
};

export default SideMenu;
