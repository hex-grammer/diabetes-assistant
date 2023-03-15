import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { AiOutlineMenu } from "react-icons/ai";

type Props = {
  setMenuStatus: (arg: string) => void;
};

const Header = (props: Props) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);

  // useeffect to get user from localstorage
  useEffect(() => {
    const userLocal = localStorage.getItem("user");
    if (userLocal) {
      setUser(JSON.parse(userLocal) as User);
    }
  }, []);

  return (
    <div className="flex min-h-[10vh] items-center justify-between bg-primary py-2 px-6 text-white shadow-md sm:min-h-[8vh] sm:justify-end">
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
          {String(session?.user?.name) || user?.name}
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
