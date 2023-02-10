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

function Materi() {
  const router = useRouter();
  const { materi } = router.query;
  const title = materi?.toString().toUpperCase().replaceAll("-", " ");
  // const ABJAD = [...new Array(26)].map((_, i) => String.fromCharCode(i + 65));
  return (
    <Layout>
      <>
        <div className="grid h-fit w-full grid-cols-1 gap-2 p-6 sm:grid-cols-6">
          <div className="col-span-full mb-2">
            <h1 className="text-center text-2xl font-bold">{title}</h1>
            <div>
              <Link href={`/admin/materi`}>/materi/</Link>
              <span className="text-blue-600">{materi}</span>
            </div>
          </div>
          {/* {ABJAD.map((abjad) => (
            <AbjadCard
              key={abjad}
              title={abjad}
              image={`https://loremflickr.com/250/150/${abjad}`}
            />
          ))} */}
          {/* <Link
            href={`/admin/materi/tambah-materi`}
            className="flex items-center justify-center rounded-md bg-gray-100 text-[4rem] text-gray-500 transition-all delay-75 hover:text-[5rem] hover:text-blue-500 hover:shadow-md"
          >
            <IoMdAddCircleOutline />
          </Link> */}
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default Materi;
