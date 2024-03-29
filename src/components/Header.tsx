import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { AiOutlineMenu } from "react-icons/ai";

type Props = {
  admin?: boolean;
  setMenuStatus: (arg: string) => void;
};

const Header = ({ admin = false, ...props }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);

  // useeffect to get user from localstorage
  useEffect(() => {
    console.log("session");
    console.log(session);
    const userLocal = JSON.parse(
      localStorage.getItem("user") as string
    ) as User;

    if (userLocal) {
      setUser(userLocal);
    }

    if (router.pathname.includes("admin") && !userLocal) {
      void router.push("/panel/dashboard");
      return;
    }

    if (router.pathname.includes("admin") && userLocal.type !== "admin") {
      void router.push("/panel/dashboard");
    }
  }, []);

  return (
    <div
      className={`flex min-h-[10vh] items-center justify-between ${
        admin ? "bg-primary-dark" : "bg-primary"
      } py-2 px-6 text-white shadow-md sm:min-h-[8vh] sm:justify-end`}
    >
      {/* profil */}
      <div className="flex items-center sm:flex-row-reverse ">
        {/* image but use <img/> */}
        {session?.user?.image ? (
          <Image
            alt={`Foto profil ${String(session?.user?.name)}`}
            width={36}
            height={36}
            src={`${String(session?.user?.image)}`}
            className="rounded-full"
          />
        ) : (
          <Avatar
            round={true}
            size="36"
            name={user?.name || "User"}
            color="orange"
            textMarginRatio={0.05}
          />
        )}
        <div className="ml-2 font-semibold text-gray-200 sm:mr-2">
          {session?.user?.name || user?.name}
        </div>
      </div>
      <button
        className="text-3xl sm:hidden"
        onClick={() => props.setMenuStatus("open")}
      >
        <AiOutlineMenu />
      </button>
    </div>
  );
};

export default Header;
