import React, { useState } from "react";
import Layout from "../Layout";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
const ReactPlayer = dynamic(() => import("react-player/youtube"), {
  ssr: false,
});

function Materi() {
  const router = useRouter();
  const { materi } = router.query;
  const [activateAdd, setActivateAdd] = useState(false);
  const [editLabel, setEditLabel] = useState("");
  const title = materi?.toString().toUpperCase().replaceAll("-", " ");
  const handleBatalUpdate = () => {
    setActivateAdd(false);
    setEditLabel("");
  };
  return (
    <Layout>
      <>
        <div className="grid h-fit w-full grid-cols-1 gap-4 overflow-hidden p-6 sm:max-h-[92vh] sm:grid-cols-12">
          <div className="col-span-full">
            <h1 className="text-center text-2xl font-bold">{title}</h1>
            <div>
              <Link href={`/admin/materi`}>/materi/</Link>
              <span className="text-blue-600">{materi}</span>
            </div>
          </div>
          {/* COURSE VIDEOS */}
          {/* MAIN VIDEO */}
          <div className="col-span-full h-fit sm:col-span-8">
            <div className="rounded-md shadow-lg">
              <ReactPlayer
                width="100%"
                controls={true}
                url="https://www.youtube.com/watch?v=cGavOVNDj1s"
              />
            </div>
            <h3 className="mt-2 text-xl font-medium">Judul Video</h3>
          </div>
          {/* other videos */}
          <div className="col-span-full flex w-full flex-col gap-2 sm:col-span-4">
            {/* Video List */}
            <div className="flex max-h-[72vh] flex-col gap-0.5 overflow-auto rounded-md bg-gray-400 text-gray-100">
              {[...new Array<number>(10)].map((_, i) => (
                <div
                  className="flex cursor-pointer justify-between gap-2 rounded-sm bg-gray-500 p-2 hover:bg-gray-600"
                  key={i}
                >
                  <ReactPlayer
                    width={120}
                    height={70}
                    playIcon={<div />}
                    controls={false}
                    light={true}
                    url="https://www.youtube.com/watch?v=6_gXiBe9y9A"
                  />
                  <div className="flex-1 text-sm">
                    <p>Judul Video asdf asdf asdf asdf {i + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default Materi;

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
