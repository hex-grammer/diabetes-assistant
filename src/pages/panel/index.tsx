import { getSession } from "next-auth/react";
import type { GetServerSidePropsContext } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();
  // if login
  useEffect(() => {
    const getAssyncSession = async () => {
      const session = await getSession();
      const login = localStorage.getItem("login");

      if (login !== "true" && !session) {
        void router.push("/login");
      } else {
        void router.push("/panel/dashboard");
      }
    };

    getAssyncSession().catch((err) => {
      console.log(err);
    });
  }, []);
  return <div />;
}

export default Home;
