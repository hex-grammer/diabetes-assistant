import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { AiOutlineMenu } from "react-icons/ai";

type Props = {
  setMenuStatus: Function;
};

const Header = (props: Props) => {
  const { data: session } = useSession();
  // const src = `${session?.user?.image}`;
  const src = "https://i.pravatar.cc/300";

  return (
    <div className="flex min-h-[10vh] items-center justify-between bg-primary py-2 px-6 text-white shadow-md sm:min-h-[12vh] sm:justify-end">
      {/* profil */}
      <div className="flex items-center sm:flex-row-reverse ">
        <Image
          alt={`Foto profil ${session?.user?.name}`}
          width={36}
          height={36}
          loader={() => src}
          src={src}
          className="mr-2 rounded-full sm:ml-2"
        />
        <div>
          <div className="font-semibold text-gray-200">
            {/* {session?.user?.name} */}
            Nama Pengguna
          </div>
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
