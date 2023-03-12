import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import type { GetServerSidePropsContext } from "next";
import type { kkh } from "@prisma/client";
import axios from "axios";

const TabelHeader = ({ HEADERS }: { HEADERS: string[] }) => {
  return (
    <thead className="">
      <tr>
        {HEADERS.map((header, index) => (
          <th
            key={index}
            scope="col"
            className="w-full whitespace-nowrap p-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

function LogikaFuzzy() {
  const router = useRouter();
  const paths = router.pathname.split("/").slice(2);
  const [rekomendasiMenu, setRekomendasiMenu] = useState<string[]>([]);
  const [beratBadan, setBeratBadan] = useState(0);
  const [tinggiBadan, setTinggiBadan] = useState(0);
  const [imt, setImt] = useState(0);
  const [tabelKKH, setTabelKKH] = useState<kkh[] | null>([]);
  const [domLoaded, setDomLoaded] = useState(false);

  // CONSTANT VARIABLES
  const tabelAturan = [
    {
      makanan: "Muda",
      kategori: [true, true, true, true],
    },
  ];
  const KATEGORI = [
    {
      kategori: "Sangat Kurus",
      minIMT: 0,
      maxIMT: 17,
    },
    {
      kategori: "Kurus",
      minIMT: 17,
      maxIMT: 18.5,
    },
    {
      kategori: "Normal",
      minIMT: 18.5,
      maxIMT: 25,
    },
    {
      kategori: "Gemuk",
      minIMT: 25,
      maxIMT: 27,
    },
    {
      kategori: "Obesitas",
      minIMT: 27,
      maxIMT: "∞",
    },
  ];

  // fungsi untuk menghitung Kategori IMT
  const hitungKategoriIMT = (IMT: number) => {
    if (IMT < 17) {
      return "Sangat Kurus";
    } else if (IMT >= 17 && IMT <= 18.5) {
      return "Kurus";
    } else if (IMT >= 18.5 && IMT <= 25) {
      return "Normal";
    } else if (IMT >= 25 && IMT <= 27) {
      return "Gemuk";
    } else if (IMT >= 27) {
      return "Obesitas";
    }
  };

  // fungsi tampilkan rekomendasi menu berdasarkan tabelAturan dan kategori
  const tampilkanRekomendasiMenu = (kategori: string) => {
    const rekomendasiMenu: string[] = [];
    tabelAturan.forEach((aturan) => {
      if (aturan.kategori[KATEGORI.findIndex((k) => k.kategori === kategori)]) {
        rekomendasiMenu.push(aturan.makanan);
      }
    });
    return rekomendasiMenu;
  };

  // axios request to set kkh in /api/kkh/getLast in useEffect
  useEffect(() => {
    setDomLoaded(true);
    try {
      void axios
        .get("/api/kkh/getLast", { params: { dataLength: 4 } })
        .then((res: { data: kkh[] }) => {
          setBeratBadan(res.data[0]?.berat_badan || 0);
          setTinggiBadan(res.data[0]?.tinggi_badan || 1);
          setTabelKKH(res.data);
          setImt(res.data[0]?.imt || 0);
        });
    } catch (error) {}
  }, []);

  return (
    <Layout>
      <>
        <div className="relative grid h-fit w-full grid-cols-1 gap-4 p-6 sm:grid-cols-6">
          <div className="col-span-full block rounded-md bg-gray-50 p-4 text-center shadow-md sm:hidden">
            <h1 className="text-xl font-bold uppercase sm:text-2xl">{paths}</h1>
          </div>
          {domLoaded && (
            <>
              {/* HIMPUNAN FUZZY UMUR */}
              <div className="h-fit rounded-md bg-gray-50 px-4 py-2 shadow-md sm:col-span-3">
                <h2 className="mb-1 font-bold uppercase">
                  1. Himpunan Fuzzy Umur
                </h2>
                <div className="text-sm">
                  <div className="mb-1">
                    Berikut adalah proses perhitungan Index Massa Tubuh (IMT)
                    anda:
                  </div>
                  <span className="font-mono text-blue-700">
                    <div>Berat badan(BB) &nbsp;= {beratBadan} kg</div>
                    <div>
                      Tinggi badan(TB) = {tinggiBadan} cm ≈{" "}
                      {tinggiBadan && tinggiBadan / 100} m
                    </div>
                    <div>IMT = BB/(TB x TB)</div>
                    <div>
                      &nbsp;&nbsp;&nbsp;&nbsp;= {beratBadan} / (
                      {tinggiBadan && tinggiBadan / 100} x{" "}
                      {tinggiBadan && tinggiBadan / 100}) = {imt}
                    </div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;= {imt}</div>
                  </span>
                </div>
              </div>
              {/* HIMPUNAN FUZZY BERAT BADAN */}
              <div className="h-fit rounded-md bg-gray-50 px-4 py-2 shadow-md sm:col-span-3">
                <h2 className="mb-1 font-bold uppercase">
                  2. Himpunan Fuzzy Berat Badan
                </h2>
                <div className="text-sm">
                  <div className="mb-1">
                    Berikut adalah proses perhitungan Index Massa Tubuh (IMT)
                    anda:
                  </div>
                  <span className="font-mono text-blue-700">
                    <div>Berat badan(BB) &nbsp;= {beratBadan} kg</div>
                    <div>
                      Tinggi badan(TB) = {tinggiBadan} cm ≈{" "}
                      {tinggiBadan && tinggiBadan / 100} m
                    </div>
                    <div>IMT = BB/(TB x TB)</div>
                    <div>
                      &nbsp;&nbsp;&nbsp;&nbsp;= {beratBadan} / (
                      {tinggiBadan && tinggiBadan / 100} x{" "}
                      {tinggiBadan && tinggiBadan / 100}) = {imt}
                    </div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;= {imt}</div>
                  </span>
                </div>
              </div>
              {/* HIMPUNAN FUZZY AKTIVITAS */}
              <div className="h-fit rounded-md bg-gray-50 px-4 py-2 shadow-md sm:col-span-3">
                <h2 className="mb-1 font-bold uppercase">
                  3. Himpunan Fuzzy Aktivitas
                </h2>
                <div className="text-sm">
                  <div className="mb-1">
                    Berikut adalah proses perhitungan Index Massa Tubuh (IMT)
                    anda:
                  </div>
                  <span className="font-mono text-blue-700">
                    <div>Berat badan(BB) &nbsp;= {beratBadan} kg</div>
                    <div>
                      Tinggi badan(TB) = {tinggiBadan} cm ≈{" "}
                      {tinggiBadan && tinggiBadan / 100} m
                    </div>
                    <div>IMT = BB/(TB x TB)</div>
                    <div>
                      &nbsp;&nbsp;&nbsp;&nbsp;= {beratBadan} / (
                      {tinggiBadan && tinggiBadan / 100} x{" "}
                      {tinggiBadan && tinggiBadan / 100}) = {imt}
                    </div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;= {imt}</div>
                  </span>
                </div>
              </div>
              {/* Tabel Aturan-Makanan */}
              <div className="row-start-5 h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-3 sm:col-start-4 sm:row-span-4 sm:row-start-1">
                <h2 className="mb-2 text-center text-xl font-bold uppercase">
                  4. Tabel Aturan-Makanan
                </h2>
                <div className="w-full overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <div className="bgre min-w-full sm:max-h-[70vh]">
                      {/* TabelHeader */}
                      <TabelHeader
                        HEADERS={[
                          "Umur",
                          "Berat",
                          "Aktivitas",
                          "Jenis Kelamin",
                          "Kalori Harian",
                        ]}
                      />
                      <tbody className="divide-y divide-gray-200 overflow-auto bg-gray-50">
                        {tabelAturan?.map((aturan, i) => (
                          <tr key={i}>
                            <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                              {aturan.makanan}
                            </td>
                            {aturan.kategori.map((kat, i) => (
                              <td
                                key={i}
                                className="whitespace-nowrap p-2 text-center text-sm text-gray-500"
                              >
                                {kat ? "✔" : "❌"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </div>
                  </table>
                </div>
              </div>
              {/* Tabel Kategori IMT */}
              <div className="h-fit rounded-md bg-gray-50 py-2 px-4 shadow-md sm:col-span-3">
                <h2 className="mb-1 font-bold uppercase">4. Defuzzifikasi</h2>
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  {/* keterangan */}
                  <div className="flex gap-2 text-sm sm:w-2/5">
                    Tabel berikut menunjukkan kategori IMT yang terbagi menjadi
                    5 kategori berdasarkan range nilai IMT.
                  </div>
                  {/* tabel MIN_IMT, MAX_IMT, KATEGORI */}
                  <div className="flex flex-1 justify-center overflow-x-auto rounded-md bg-white">
                    <table className="divide-y divide-gray-200">
                      <div className="sm:max-h-[70vh]">
                        {/* TabelHeader */}
                        {/* <TabelHeader HEADERS={["Min_IMT", "Max_IMT", "Kategori"]} /> */}
                        <tbody className="divide-y divide-gray-200 overflow-auto">
                          {KATEGORI?.map((kat, i) => (
                            <tr key={i}>
                              <td className="whitespace-nowrap p-2 py-1 text-center text-sm text-gray-500">
                                {kat.minIMT}
                              </td>
                              <td className="whitespace-nowrap p-2 py-1 text-center text-sm text-gray-500">
                                ~
                              </td>
                              <td className="whitespace-nowrap p-2 py-1 text-center text-sm text-gray-500">
                                {kat.maxIMT}
                              </td>
                              <td className="whitespace-nowrap p-2 py-1 text-center text-sm text-gray-500">
                                =
                              </td>
                              <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">
                                "{kat.kategori}"
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </div>
                    </table>
                  </div>
                </div>
              </div>
              {/* DEFUZZIFIKASI */}
              <div className="h-fit rounded-md bg-gray-50 py-2 px-4 shadow-md sm:col-span-3">
                <h2 className="mb-1 font-bold uppercase">5. Defuzzifikasi</h2>
                <div className="">
                  <span className="text-sm text-gray-700">
                    Rekomendasi menu berdasarkan nilai IMT anda ({imt}≈
                    {hitungKategoriIMT(imt)}) adalah:{" "}
                    {tampilkanRekomendasiMenu(
                      hitungKategoriIMT(imt) || "Gemuk"
                    ).map((menu, i) => (
                      <span key={i} className="font-semibold text-orange-600">
                        {menu}
                        {i + 1 !== rekomendasiMenu.length ? ", " : ""}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default LogikaFuzzy;

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
