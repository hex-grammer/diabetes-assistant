import Layout from "../Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import type { GetServerSidePropsContext } from "next";

function ForwardChaining() {
  const router = useRouter();
  const paths = router.pathname.split("/").slice(2);
  return (
    <Layout>
      <>
        <div className="relative grid h-fit w-full grid-cols-1 gap-2 p-6 sm:grid-cols-6">
          <div className="col-span-full mb-2">
            <h1 className="text-center text-2xl font-bold uppercase">
              {paths}
            </h1>
          </div>
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default ForwardChaining;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
