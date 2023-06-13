import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import type { User, kkh } from "@prisma/client";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { MdOutlineDeleteForever } from "react-icons/md";

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

type Aturan = {
  id?: number;
  makanan: string;
  kategori: number[];
};

function ForwardChaining() {
  const router = useRouter();
  const { data: session } = useSession();
  const paths = router.pathname.split("/").slice(2);
  const [rekomendasiMenu, setRekomendasiMenu] = useState<string[]>([]);
  const [beratBadan, setBeratBadan] = useState(0);
  const [tinggiBadan, setTinggiBadan] = useState(0);
  const [imt, setImt] = useState(0);
  const [domLoaded, setDomLoaded] = useState(false);

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

  // usestate aturan
  const [oldAturan, setOldAturan] = useState<Aturan[]>([
    {
      id: 0,
      makanan: "Loading...",
      kategori: [0, 0, 0, 0, 0],
    },
  ]);

  const [tabelAturan, setTabelAturan] = useState(oldAturan);

  useEffect(() => {
    try {
      void axios.get("/api/makanan/getAll").then((res: { data: Aturan[] }) => {
        setOldAturan(res.data);
        setTabelAturan(res.data);
      });
    } catch (error) {}
  }, []);

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
      const kat =
        aturan.kategori[KATEGORI.findIndex((k) => k.kategori === kategori)];
      if (kat) {
        rekomendasiMenu.push(`${aturan.makanan} (${kat}gr)`);
      }
    });
    return rekomendasiMenu;
  };

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

  // axios request to set kkh in /api/kkh/getLast in useEffect
  useEffect(() => {
    setDomLoaded(true);
    // get user from local storage
    const userLocal = JSON.parse(localStorage.getItem("user") || "{}") as User;

    try {
      void axios
        .get("/api/kkh/getLast", {
          params: {
            dataLength: 4,
            email: session?.user?.email,
            username: userLocal.username,
          },
        })
        .then((res: { data: kkh[] }) => {
          setBeratBadan(res.data[0]?.berat_badan || 0);
          setTinggiBadan(res.data[0]?.tinggi_badan || 1);
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
                            {aturan.kategori.map((kat, j) => (
                              <td
                                key={j}
                                className="whitespace-nowrap p-2 text-center text-sm text-gray-500"
                              >
                                <div>{kat ? `${kat}gr` : "-"}</div>
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
                    Rekomendasi menu berdasarkan nilai IMT anda ({imt}≈
                    {hitungKategoriIMT(imt)}) adalah:{" "}
                    {tampilkanRekomendasiMenu(
                      hitungKategoriIMT(imt) || "Gemuk"
                    ).map((menu, i) => (
                      <span key={i} className="font-semibold text-orange-600">
                        {menu}
                        {", "}
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
