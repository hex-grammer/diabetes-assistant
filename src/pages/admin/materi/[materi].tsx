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
  const title = materi?.toString().toUpperCase().replaceAll("-", " ");
  // const ABJAD = [...new Array(26)].map((_, i) => String.fromCharCode(i + 65));
  return (
    <Layout>
      <>
        <div className="grid h-fit w-full grid-cols-1 gap-4 p-6 sm:grid-cols-12">
          <div className="col-span-full mb-2">
            {/* <div>
              <Link href={`/admin/materi`}>/materi/</Link>
              <span className="text-blue-600">{materi}</span>
            </div> */}
            <h1 className="text-center text-2xl font-bold">{title}</h1>
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
            <Link
              href={`/admin/materi/tambah-kalimat`}
              className="flex items-center justify-center rounded-md bg-gray-100 py-3 text-[3rem] text-gray-500 transition-all delay-75 hover:text-[4rem] hover:text-blue-500 hover:shadow-md"
            >
              <IoMdAddCircleOutline />
            </Link>
            {[...new Array(10)].map((_, i) => (
              <div className="flex gap-2">
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
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default Materi;
