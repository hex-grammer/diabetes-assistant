import { useRouter } from "next/router";
import React from "react";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { useGlobalContext } from "../lib/GlobalContext";

type Props = {
  title: string;
  description: string;
  link: string;
};

const Alert = (props: Props) => {
  const { setLoading } = useGlobalContext();
  const router = useRouter();
  return (
    <button
      className="flex h-fit cursor-pointer flex-col items-start justify-center rounded-md bg-red-500 bg-opacity-40 p-4 py-3 text-left shadow-lg sm:col-span-2"
      onClick={(e) => {
        e.preventDefault();
        setLoading(true);
        router
          .push(props.link)
          .then(() => setLoading(false))
          .catch((err) => console.error(err));
      }}
    >
      {/* heading */}
      <div className="mb-1 flex items-center text-lg font-semibold text-gray-300">
        <HiOutlineBellAlert className="mr-1 text-2xl" />
        {/* <div className="h-[7px] w-[8px] absolute right-[7px] top-[3px] bg-red-300 rounded-full" /> */}
        {props.title}
      </div>

      {/* description */}
      <div className="text-sm text-gray-400">{props.description}</div>
    </button>
  );
};

export default Alert;
