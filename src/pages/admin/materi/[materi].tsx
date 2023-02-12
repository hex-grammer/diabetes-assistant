import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import Layout from "../Layout";
import Alert from "../../../components/Alert";
import { PrismaClient } from "@prisma/client";
import Warning from "../../../components/Warning";
import Success from "../../../components/Success";
import { useGlobalContext } from "../../../lib/GlobalContext";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useSWR from "swr";
import AbjadCard from "../../../components/AbjadCard";
import { IoMdAddCircleOutline } from "react-icons/io";
import Breadcrump from "../../../components/Breadcrump";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player/youtube"), {
  ssr: false,
});

function Materi() {
  const router = useRouter();
  const { materi } = router.query;
  const [activateAdd, setActivateAdd] = useState(false);
  const title = materi?.toString().toUpperCase().replaceAll("-", " ");
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
            <ReactPlayer
              width="100%"
              // height="100%"
              controls={true}
              url="https://www.youtube.com/watch?v=6_gXiBe9y9A"
            />
            <h3 className="text-xl font-medium">Judul Video</h3>
          </div>
          {/* other videos */}
          <div className="col-span-full flex w-full flex-col gap-2 sm:col-span-4">
            <div className="">
              {/* input judul video and link youtube */}
              {activateAdd ? (
                <div className="flex flex-col gap-2 rounded-md bg-gray-600 p-2">
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Judul Video"
                  />
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Link Youtube"
                  />
                  <div className="flex w-full gap-2">
                    {/* batal */}
                    <div className="flex justify-end">
                      <button
                        className="rounded-md bg-gray-400 px-2 py-1 text-white"
                        onClick={() => setActivateAdd(false)}
                      >
                        Batal
                      </button>
                    </div>
                    {/* tambah */}
                    <div className="flex justify-end">
                      <button className="rounded-md bg-blue-500 px-2 py-1 text-white">
                        Tambah
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setActivateAdd(true)}
                  className="flex items-center justify-center rounded-md bg-gray-300 py-3 text-[3rem] text-gray-500 transition-all delay-75 hover:text-[4rem] hover:text-blue-500 hover:shadow-md"
                >
                  <IoMdAddCircleOutline />
                </div>
              )}
            </div>
            <div className="flex max-h-[62vh] flex-col gap-2 overflow-auto rounded-md bg-gray-500 p-2 text-gray-100">
              {[...new Array(10)].map((_, i) => (
                <div className="flex gap-2" key={i}>
                  <ReactPlayer
                    width={120}
                    height={70}
                    playIcon={<div />}
                    controls={false}
                    light={true}
                    url="https://www.youtube.com/watch?v=6_gXiBe9y9A"
                  />
                  Judul Video {i + 1}
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
