import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  children?: JSX.Element;
  title?: string;
  image?: string;
};

const MateriCard = (props: Props) => {
  const router = useRouter();
  const admin = router.pathname.includes("admin");
  const blob = props.title
    ? props.title.toLocaleLowerCase().replace(/ /g, "-")
    : "";
  return (
    <Link
      href={`${admin ? "/admin" : ""}/materi/${blob}`}
      className="group h-fit overflow-hidden rounded-md bg-gray-100 hover:shadow-md"
    >
      <div className="overflow-hidden">
        <img
          src={props.image}
          className="w-full rounded-t-md bg-contain duration-100 ease-in group-hover:scale-110"
        />
      </div>
      <h2 className="p-2 text-lg font-medium">{props.title}</h2>
    </Link>
  );
};

export default MateriCard;
