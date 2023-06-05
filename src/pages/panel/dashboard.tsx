import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import type { GetServerSidePropsContext } from "next";
import type { kkh } from "@prisma/client";
import DataDiri from "./data-diri";
import { useGlobalContext } from "../../lib/GlobalContext";

function Dashboard() {
  const router = useRouter();
  const paths = router.pathname.split("/").slice(2);
  const [kkh, setKKH] = useState(0);
  const [kategoriIMT, setKategoriIMT] = useState("");
  const [tabelKKH, setTabelKKH] = useState<kkh[] | null>([]);
  const [rekomendasiMenu, setRekomendasiMenu] = useState<string[] | null>([]);

  useEffect(() => {
    const getAssyncSession = async () => {
      const session = await getSession();
      const login = localStorage.getItem("login");

      if (login !== "true" && !session) {
        void router.push("/login");
      }
    };

    getAssyncSession().catch((err) => {
      console.log(err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <>
        <div className="relative grid h-fit w-full grid-cols-1 gap-4 p-6 sm:grid-cols-6">
          <div className="col-span-full block rounded-md bg-gray-50 p-4 text-center shadow-md sm:hidden">
            <h1 className="text-2xl font-bold uppercase">{paths} </h1>
          </div>
          {/* DATA DIRI */}
          <div className="h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-2 sm:row-span-3">
            <h2 className="mb-2 text-center text-xl font-bold uppercase">
              Data Diri
            </h2>
            <DataDiri
              setKategoriIMT={setKategoriIMT}
              setRekomendasiMenu={setRekomendasiMenu}
              setTabelKKH={setTabelKKH}
              setKKH={setKKH}
              updateData={true}
            />
          </div>
          {/* KKH */}
          <div className="h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-2 sm:col-start-3">
            <h2 className="mb-2 text-xl font-bold uppercase">
              Kebutuhan Kalori Harian
            </h2>
            <div className="flex items-end py-2">
              <span className="text-4xl font-bold text-green-600">
                {kkh
                  ? (kkh - 73).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  : 0}
              </span>
              <span className="ml-1 text-lg font-medium text-gray-600">
                kkal/hari
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm text-gray-700">
                Kebutuhan kalori harian (KKH) adalah jumlah kalori yang
                dibutuhkan untuk menjaga kesehatan dan beraktivitas sehari-hari.
              </span>
            </div>
          </div>
          {/* REKOMENDASI MENU */}
          <div className="h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-2 sm:col-start-5">
            <h2 className="mb-2 text-xl font-bold uppercase">
              Rekomendasi Menu
            </h2>
            <div className="flex flex-col">
              <span className="text-sm text-gray-700">
                Makanan yang direkomendasikan berdasarkan Index Massa Tubuh anda{" "}
                {
                  <span className="font-semibold text-green-600">
                    {tabelKKH && tabelKKH[0]?.imt}
                  </span>
                }{" "}
                {<span className="lowercase">({kategoriIMT}) </span>}
                adalah:{" "}
                {rekomendasiMenu?.map((menu, i) => (
                  <span key={i} className="font-semibold text-orange-600">
                    {menu}
                    {i + 1 !== rekomendasiMenu.length ? ", " : ""}
                  </span>
                ))}
              </span>
            </div>
          </div>
          {/* RIWAYAT KKH */}
          <div className="h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-4 sm:col-start-3">
            <h2 className="mb-2 text-center text-xl font-bold uppercase">
              Riwayat KKH
            </h2>
            <div className="w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
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
                      KKH
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      IMT
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-gray-50">
                  {tabelKKH?.map((kkh, i) => (
                    <tr key={kkh.id_kkh}>
                      <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
                        {i + 1}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
                        {kkh.created_at
                          .toString()
                          .replace(/^(\d{4})-(\d{2})-(\d{2}).*/, "$3-$2-$1")}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
                        {kkh.kkh
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
                        {kkh.imt}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
                        {kkh.berat_badan} kg
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
                        {kkh.tinggi_badan} cm
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
                        {kkh.umur} Tahun
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default Dashboard;
