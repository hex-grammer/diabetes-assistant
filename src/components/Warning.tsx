import { useRouter } from "next/router";
import React from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import { useGlobalContext } from "../lib/GlobalContext";

type Props = {
  title: string;
  description: string;
  link?: string;
  linkTitle?: string;
};

const Warning = (props: Props) => {
  const { setLoading } = useGlobalContext();
  const router = useRouter();
  return (
    <button
      className="flex h-fit cursor-pointer flex-col items-start justify-center rounded-md bg-orange-400 bg-opacity-40 p-4 py-3 text-left shadow-lg sm:col-span-2"
      onClick={async (e) => {
        e.preventDefault();
        if (props.link) {
          setLoading(true);
          await router.push(props.link);
        }
      }}
    >
      {/* heading */}
      <div className="mb-1 flex items-center text-lg font-semibold text-gray-300">
        <RiErrorWarningLine className="mr-1 text-2xl" />
        {/* <div className="h-[7px] w-[8px] absolute right-[7px] top-[3px] bg-red-300 rounded-full" /> */}
        {props.title}
      </div>

      {/* description */}
      <div className="text-sm text-gray-300">{props.description}</div>

      {/* {props.link && (
        <Link
          href="https://wa.me/6282194805556"
          className="bg-gray-400 bg-opacity-20 border-2 border-gray-300 border-opacity-25 text-white rounded-md p-1 px-3 mt-2 text-sm"
        >
          {props.linkTitle}
        </Link>
      )} */}
    </button>
  );
};

export default Warning;
