import React, { useState } from "react";
import Layout from "../Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import type { GetServerSidePropsContext } from "next";

function Makanan() {
  const router = useRouter();
  const paths = router.pathname.split("/").slice(2);
  // useState for makanan
  const [makanan, setMakanan] = useState([]);

  return (
    <Layout>
      <>
        <div className="relative grid h-fit w-full grid-cols-1 gap-2 p-6 sm:grid-cols-6">
          <div className="col-span-full block rounded-md bg-gray-50 p-4 text-center shadow-md sm:hidden">
            <h1 className="text-center text-2xl font-bold uppercase">
              {paths}
            </h1>
          </div>
          <div className=" h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-4 sm:col-start-3">
            <h1 className="mb-4 text-center text-2xl font-bold">
              Tabel Makanan
            </h1>
            <table className="w-full table-auto border">
              <thead>
                <tr>
                  <th className="border p-2">No</th>
                  <th className="border px-4 py-2 text-left">Kode Makanan</th>
                  <th className="border px-4 py-2 text-left">Nama Makanan</th>
                </tr>
              </thead>
              <tbody>
                {/* display makanan */}
                {/* {makanan.map((m, i) => (
                  <tr key={m.id}>
                    <td className="border p-2 text-center">{i + 1}</td>
                    <td className="border px-4 py-2">{m.kode}</td>
                    <td className="border px-4 py-2">{m.nama}</td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default Makanan;

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
