import Link from "next/link";
import React from "react";

type Props = {
  children?: JSX.Element;
  title?: string;
  image?: string;
  showModal?: () => void;
};

const AbjadCard = (props: Props) => {
  const blob = props.title?.toLocaleLowerCase().replace(/ /g, "-");
  return (
    <div
      className="group h-fit cursor-pointer overflow-hidden rounded-md bg-gray-50 hover:shadow-md"
      onClick={props?.showModal}
    >
      <div className="overflow-hidden">
        <img
          src={props.image}
          className="w-full rounded-t-md bg-contain duration-100 ease-in group-hover:scale-110"
        />
      </div>
      <h2 className="p-1 text-center text-xl font-bold text-gray-500">
        {props.title}
      </h2>
    </div>
  );
};

export default AbjadCard;
