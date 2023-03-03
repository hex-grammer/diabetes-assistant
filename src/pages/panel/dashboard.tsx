import React, { useState } from "react";
import Layout from "../Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import type { GetServerSidePropsContext } from "next";
import DataDiri from "./data-diri";

function Dashboard() {
  const router = useRouter();
  const paths = router.pathname.split("/").slice(2);
  // usestate Kebutuhan Kalori Harian (KKH)
  const [kkh, setKkh] = useState(0);

  return (
    <Layout>
      <>
        <div className="relative grid h-fit w-full grid-cols-1 gap-4 p-6 sm:grid-cols-6">
          <div className="col-span-full mb-2 rounded-md bg-gray-50 p-4 shadow-md">
            <h1 className="text-2xl font-bold uppercase">{paths}</h1>
          </div>
          <div className="mb-2 rounded-md bg-gray-50 p-4 shadow-md sm:col-span-2">
            <h2 className="mb-2 mb-2 text-center text-xl font-bold uppercase">
              Data Diri
            </h2>
            <DataDiri setKKH={setKkh} />
          </div>
          <div className="mb-2 h-fit rounded-md bg-gray-50 p-4 pb-8 shadow-md sm:col-span-2">
            <h2 className="mb-2 text-center text-xl font-bold uppercase">
              Kebutuhan Kalori Harian
            </h2>
            {/* show kkh */}
            <div className="flex h-1/4 items-end justify-center py-4">
              <span className="text-5xl font-bold text-green-600">
                {kkh ? kkh.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : 0}
              </span>
              <span className="ml-1 text-xl font-semibold text-gray-700">
                kkal/hari
              </span>
            </div>
            {/* keterangan */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-center text-sm text-gray-700 sm:px-4">
                Kebutuhan kalori harian (KKH) adalah jumlah kalori yang
                dibutuhkan untuk menjaga kesehatan dan beraktivitas sehari-hari.
              </span>
            </div>
          </div>
          <div className="mb-2 rounded-md bg-gray-50 p-4 shadow-md sm:col-span-2">
            <h2 className="mb-2 text-center text-xl font-bold uppercase">
              Rekomendasi Menu Makanan
            </h2>
          </div>
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default Dashboard;

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
