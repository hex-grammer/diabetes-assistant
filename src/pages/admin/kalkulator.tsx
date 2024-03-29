import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import type { GetServerSidePropsContext } from "next";
import type { kkh } from "@prisma/client";
import DataDiri from "./data-diri";

function Kalkulator() {
  const router = useRouter();
  const paths = router.pathname.split("/").slice(2);
  const [kkh, setKKH] = useState(0);
  const [rumusKKH, setRumusKKH] = useState<React.ReactNode>(<></>);
  const [imb, setIMB] = useState(0);
  const [rumusIMT, setRumusIMT] = useState<React.ReactNode>(<></>);
  const [bbi, setBBIdeal] = useState(0);
  const [rumusBBI, setRumusBBI] = useState<React.ReactNode>(<></>);
  const [amb, setAMB] = useState(0);
  const [rumusAMB, setRumusAMB] = useState<React.ReactNode>(<></>);
  const spaces = (num: number) => String.fromCharCode(160).repeat(num);

  // if login
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
  }, []);

  return (
    <Layout>
      <>
        <div className="relative grid h-fit w-full grid-cols-1 gap-4 p-6 sm:grid-cols-6">
          <div className="col-span-full block rounded-md bg-gray-50 p-4 text-center shadow-md sm:hidden">
            <h1 className="text-2xl font-bold uppercase">{paths}</h1>
          </div>
          {/* DATA DIRI */}
          <div className="h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-2 sm:row-span-3">
            <h2 className="mb-2 text-center text-xl font-bold uppercase">
              Data Diri
            </h2>
            <DataDiri
              setKKH={setKKH}
              setRumusKKH={setRumusKKH}
              setIMT={setIMB}
              setRumusIMT={setRumusIMT}
              setBBIdeal={setBBIdeal}
              setRumusBBI={setRumusBBI}
              setAMB={setAMB}
              setRumusAMB={setRumusAMB}
              kalkulator={true}
            />
          </div>
          {/* KKH */}
          <div className="h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-2 sm:col-start-3">
            <h2 className="mb-2 text-xl font-bold uppercase">Kalori Tetap</h2>
            <div className="py-2">
              <span className="text-4xl font-bold text-green-600">
                {kkh
                  ? (kkh - 337).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  : 0}
              </span>
              <span className="ml-1 text-lg font-medium text-gray-600">
                kkal/hari
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm text-gray-700">
                Kalori tetap adalah jumlah kalori yang akan digunakan untuk
                mencari nilai kebutuhan kalori harian.
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm text-gray-700">{rumusKKH}</span>
            </div>
          </div>
          {/* Index Massa Tubuh (IMT) */}
          <div className="h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-2 sm:col-start-5">
            <h2 className="mb-2 text-xl font-bold uppercase">
              Index Massa Tubuh (IMT)
            </h2>
            <div className="">
              <span className="text-4xl font-bold text-green-600">{imb}</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm text-gray-700">
                Index Massa Tubuh (IMT) adalah angka yang menunjukkan apakah
                berat badan seseorang berada pada kategori yang sehat atau
                tidak.
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm text-gray-700">{rumusIMT}</span>
            </div>
          </div>
          {/* Berat Badan Ideal (BBI) */}
          <div className="h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-2 sm:col-start-3">
            <h2 className="mb-2 text-xl font-bold uppercase">
              Berat Badan Ideal (BBI)
            </h2>
            <div className="">
              <span className="text-4xl font-bold text-green-600">{bbi}</span>
              <span className="ml-1 text-lg font-medium text-gray-600">kg</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-700">
                Berat badan ideal (BBI) adalah berat badan yang sesuai dengan
                tinggi badan dan jenis kelamin seseorang.
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm text-gray-700">{rumusBBI}</span>
            </div>
          </div>
          {/* Angka Metabolisme Basal */}
          <div className="h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-2 sm:col-start-5">
            <h2 className="mb-2 text-xl font-bold uppercase">
              Angka Metabolisme Basal
            </h2>
            <div className="">
              <span className="text-4xl font-bold text-green-600">{amb}</span>
              <span className="ml-1 text-lg font-medium text-gray-600">
                kalori
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-700">
                Angka Metabolisme Basal (AMB) adalah jumlah kalori yang
                dibutuhkan tubuh untuk menjaga fungsi tubuh sehari-hari.
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm text-gray-700">{rumusAMB}</span>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default Kalkulator;
