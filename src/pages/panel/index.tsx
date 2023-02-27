import { getSession } from "next-auth/react";
import type { GetServerSidePropsContext } from "next";

function Home() {
  return <div />;
}

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "",
        permanent: false,
      },
    };
  }
  return {
    redirect: {
      destination: "/panel/dashboard",
    },
  };
}
