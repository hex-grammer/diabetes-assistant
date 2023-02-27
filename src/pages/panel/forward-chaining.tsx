import React, { useState } from "react";
import Layout from "../Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AbjadCard from "../../components/AbjadCard";
import { useRouter } from "next/router";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { getSession } from "next-auth/react";
import type { GetServerSidePropsContext } from "next";

function ForwardChaining() {
  const router = useRouter();
  const paths = router.pathname.split("/").slice(2);
  const [modalLabel, setModalLabel] = useState("");
  return (
    <Layout>
      <>
        <div className="relative grid h-fit w-full grid-cols-1 gap-2 p-6 sm:grid-cols-6">
          {/* modal */}
          {modalLabel !== "" && (
            <div
              className="fixed top-[10vh] left-0 z-20 hidden h-[92vh] w-full items-center justify-center bg-gray-500 bg-opacity-75 backdrop-blur-sm sm:left-[18%] sm:top-[8vh] sm:flex sm:w-[82%]"
              onClick={() => setModalLabel("")}
            >
              <div className="relative">
                <AiOutlineCloseCircle
                  className="absolute right-0 top-0 z-10 cursor-pointer rounded-tr-md bg-gray-300 bg-opacity-40 p-0.5 text-2xl text-gray-800"
                  onClick={() => setModalLabel("")}
                />
                <AbjadCard
                  title={modalLabel}
                  showModal={() => setModalLabel(modalLabel)}
                  image={`https://loremflickr.com/320/180/${modalLabel}`}
                />
              </div>
            </div>
          )}
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
