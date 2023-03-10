import React, { useState, useEffect } from "react";
import Layout from "./Layout";
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

function ForwardChaining() {
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
      makanan: "Beras Merah",
      kategori: [true, true, true, true, true],
    },
    {
      makanan: "Buah Apel",
      kategori: [true, true, false, false, false],
    },
    {
      makanan: "Buah Belimbing",
      kategori: [false, false, false, false, false],
    },
    {
      makanan: "Buah Kiwi",
      kategori: [true, false, false, false, false],
    },
    {
      makanan: "Buah Nanas",
      kategori: [false, false, false, false, false],
    },
    {
      makanan: "Buah Pepaya",
      kategori: [true, true, true, true, false],
    },
    {
      makanan: "Bubur Kacang Hijau",
      kategori: [false, false, true, false, false],
    },
    {
      makanan: "Ikan Salmon Panggang",
      kategori: [true, true, true, false, true],
    },
    {
      makanan: "Ikan Tuna Panggang",
      kategori: [true, true, true, true, false],
    },
    {
      makanan: "Jagung",
      kategori: [false, true, true, true, false],
    },
    {
      makanan: "Kacang Merah",
      kategori: [false, false, true, false, false],
    },
    {
      makanan: "Kacang Tanah",
      kategori: [false, false, false, false, false],
    },
    {
      makanan: "Mentimun",
      kategori: [false, true, false, false, false],
    },
    {
      makanan: "Sayur Bayam",
      kategori: [true, false, true, true, true],
    },
    {
      makanan: "Sayur Brokoli",
      kategori: [false, false, false, false, true],
    },
    {
      makanan: "Sayur Kubis/Kol",
      kategori: [true, false, false, false, false],
    },
    {
      makanan: "Sayur Sawi Putih",
      kategori: [true, false, false, false, false],
    },
    {
      makanan: "Susu Bear Brand",
      kategori: [true, false, true, false, false],
    },
    {
      makanan: "Tahu",
      kategori: [true, true, false, false, false],
    },
    {
      makanan: "Telur Rebus",
      kategori: [true, false, false, false, false],
    },
    {
      makanan: "Tempe",
      kategori: [false, true, false, false, false],
    },
    {
      makanan: "Tomat",
      kategori: [false, true, false, false, false],
    },
    {
      makanan: "Wortel",
      kategori: [true, true, false, false, false],
    },
    {
      makanan: "Sayur Sawi Hijau",
      kategori: [false, true, false, false, false],
    },
  ];
  const MAKANAN = {
    M001: "Beras Merah",
    M002: "Buah Apel",
    M003: "Buah Belimbing",
    M004: "Buah Kiwi",
    M005: "Buah Nanas",
    M006: "Buah Pepaya",
    M007: "Bubur Kacang Hijau",
    M008: "Ikan Salmon Panggang",
    M009: "Ikan Tuna Panggang",
    M010: "Jagung",
    M011: "Kacang Merah",
    M012: "Kacang Tanah",
    M013: "Mentimun",
    M014: "Sayur Bayam",
    M015: "Sayur Brokoli",
    M016: "Sayur Kubis/Kol",
    M017: "Sayur Sawi Putih",
    M018: "Susu Bear Brand",
    M019: "Tahu",
    M020: "Telur Rebus",
    M021: "Tempe",
    M022: "Tomat",
    M023: "Wortel",
    M024: "Sayur Sawi Hijau",
  };
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
      maxIMT: "???",
    },
  ];

  // fungsi untuk menghitung IMT
  const hitungIMT = () => {
    const imt = beratBadan / ((tinggiBadan / 100) * (tinggiBadan / 100));
    const imtRounded = Math.round((imt + Number.EPSILON) * 100) / 100;
    setImt(imtRounded);
    return imtRounded;
  };

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
              {/* PERHITUNGAN IMT */}
              <div className="h-fit rounded-md bg-gray-50 px-4 py-2 shadow-md sm:col-span-3">
                <h2 className="mb-1 font-bold uppercase">1. Perhitungan IMT</h2>
                <div className="text-sm">
                  <div className="mb-1">
                    Berikut adalah proses perhitungan Index Massa Tubuh (IMT)
                    anda:
                  </div>
                  <span className="font-mono text-blue-700">
                    <div>Berat badan(BB) &nbsp;= {beratBadan} kg</div>
                    <div>
                      Tinggi badan(TB) = {tinggiBadan} cm ???{" "}
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
                  Tabel Aturan-Makanan
                </h2>
                <div className="w-full overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <div className="min-w-full">
                      {/* TabelHeader */}
                      <TabelHeader
                        HEADERS={[
                          "Makanan",
                          "Sangat Kurus",
                          "Kurus",
                          "Normal",
                          "Gemuk",
                          "Obesitas",
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
                                {kat ? "???" : "???"}
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
                <h2 className="mb-1 font-bold uppercase">2. Kategori IMT</h2>
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  {/* keterangan */}
                  <div className="flex gap-2 text-sm sm:w-2/5">
                    Tabel berikut menunjukkan kategori IMT yang terbagi menjadi
                    5 kategori berdasarkan range nilai IMT.
                  </div>
                  {/* tabel MIN_IMT, MAX_IMT, KATEGORI */}
                  <div className="flex flex-1 justify-center overflow-x-auto rounded-md bg-white">
                    <table className="divide-y divide-gray-200">
                      {/* <div className="sm:max-h-[70vh]"> */}
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
                      {/* </div> */}
                    </table>
                  </div>
                </div>
              </div>
              {/* REKOMENDASI MENU */}
              <div className="h-fit rounded-md bg-gray-50 py-2 px-4 shadow-md sm:col-span-3">
                <h2 className="mb-1 font-bold uppercase">
                  3. Rekomendasi Menu
                </h2>
                <div className="">
                  <span className="text-sm text-gray-700">
                    Rekomendasi menu berdasarkan nilai IMT anda ({imt}???
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

export default ForwardChaining;

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
