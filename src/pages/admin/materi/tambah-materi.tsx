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
import MateriCard from "../../../components/MateriCard";
import { IoMdAddCircleOutline } from "react-icons/io";

function Materi() {
  const MATERI = [
    {
      id: 1,
      title: "Materi 1",
      image: "https://loremflickr.com/250/150/hand?random=1",
    },
    {
      id: 2,
      title: "Materi 2",
      image: "https://loremflickr.com/250/150/hand?random=2",
    },
    {
      id: 3,
      title: "Materi 3",
      image: "https://loremflickr.com/250/150/hand?random=3",
    },
    {
      id: 4,
      title: "Materi 4",
      image: "https://loremflickr.com/250/150/hand?random=4",
    },
    {
      id: 5,
      title: "Materi 5",
      image: "https://loremflickr.com/250/150/hand?random=5",
    },
    {
      id: 6,
      title: "Materi 6",
      image: "https://loremflickr.com/250/150/hand?random=6",
    },
  ];
  return (
    <Layout>
      <>
        <div className="grid h-fit w-full grid-cols-1 gap-4 sm:grid-cols-4">
          Tambah Materi
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default Materi;
