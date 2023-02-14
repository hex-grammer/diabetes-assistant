import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  query?: string;
};

const Breadcrump = (props: Props) => {
  const router = useRouter();
  const paths = router.pathname.split("/").slice(2);
  return (
    <div>
      {paths.map((path, i) => (
        <Link key={i} href={`${router.pathname.split(path)[0]}${path}`}>
          /{path}
        </Link>
      ))}
    </div>
  );
};

export default Breadcrump;
