import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import type { GetServerSidePropsContext } from "next";
import type { kkh } from "@prisma/client";
import DataDiri from "./data-diri";

function Dashboard() {
  const router = useRouter();
  const paths = router.pathname.split("/").slice(2);
  const [kkh, setKKH] = useState(0);
  const [tabelKKH, setTabelKKH] = useState<kkh[] | null>([]);

  return (
    <Layout>
      <>
        <div className="relative grid h-fit w-full grid-cols-1 gap-4 p-6 sm:grid-cols-6">
          <div className="col-span-full mb-2 rounded-md bg-gray-50 p-4 shadow-md">
            <h1 className="text-2xl font-bold uppercase">{paths}</h1>
          </div>
          <div className="mb-2 h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-2 sm:row-span-3">
            <h2 className="mb-2 text-center text-xl font-bold uppercase">
              Data Diri
            </h2>
            <DataDiri setTabelKKH={setTabelKKH} setKKH={setKKH} />
          </div>
          <div className="mb-2 h-fit rounded-md bg-gray-50 p-4 pb-8 shadow-md sm:col-span-4 sm:col-start-3 ">
            <h2 className="mb-2 text-center text-xl font-bold uppercase">
              Kebutuhan Kalori Harian
            </h2>
            <div className="flex h-1/4 items-end justify-center py-4">
              <span className="text-5xl font-bold text-green-600">
                {kkh ? kkh.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : 0}
              </span>
              <span className="ml-1 text-xl font-semibold text-gray-700">
                kkal/hari
              </span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-center text-sm text-gray-700 sm:px-4">
                Kebutuhan kalori harian (KKH) adalah jumlah kalori yang
                dibutuhkan untuk menjaga kesehatan dan beraktivitas sehari-hari.
              </span>
            </div>
          </div>
          <div className=" sm:col-start-3 mb-2 h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-4">
            <h2 className="mb-2 text-center text-xl font-bold uppercase">
              Riwayat KKH
            </h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    No.
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Tanggal
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Berat Badan
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Tinggi Badan
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Umur
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    KKH
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {tabelKKH?.map((kkh, i) => (
                  <tr key={kkh.id_kkh}>
                    <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
                      {i + 1}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
                      {`${kkh.created_at}`.replace(/^(\d{4})-(\d{2})-(\d{2}).*/, '$3-$2-$1')}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
                      {kkh.berat_badan}kg
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
                      {kkh.tinggi_badan}cm
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
                      {kkh.umur} Tahun
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
                      {kkh.kkh.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
