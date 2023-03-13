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
  const [beratBadan, setBeratBadan] = useState(0);
  const [tinggiBadan, setTinggiBadan] = useState(0);
  const [umur, setUmur] = useState(0);
  const [imt, setImt] = useState(0);
  const [tabelKKH, setTabelKKH] = useState<kkh[] | null>([]);
  const [domLoaded, setDomLoaded] = useState(false);

  // CONSTANT VARIABLES
  const tabelAturan = [
    ["Mudah", "Sangat kurus", "Istirahat", "Laki-laki", "Sedikit"],
    ["Mudah", "Sangat kurus", "Istirahat", "Perempuan", "Sedikit"],
    ["Mudah", "Sangat kurus", "Ringan", "Laki-laki", "Sedikit"],
    ["Mudah", "Sangat kurus", "Ringan", "Perempuan", "Sedikit"],
    ["Mudah", "Sangat kurus", "Sedang", "Laki-laki", "null"],
    ["Mudah", "Sangat kurus", "Sedang", "Perempuan", null],
    ["Mudah", "Sangat kurus", "Berat", "Laki-laki", null],
    ["Mudah", "Sangat kurus", "Berat", "Perempuan", null],
    ["Mudah", "Sangat kurus", "Sangat berat", "Laki-laki", null],
    ["Mudah", "Sangat kurus", "Sangat berat", "Perempuan", null],
    ["Mudah", "Kurus", "Istirahat", "Laki-laki", null],
    ["Mudah", "Kurus", "Istirahat", "Perempuan", null],
    ["Mudah", "Kurus", "Ringan", "Laki-laki", null],
    ["Mudah", "Kurus", "Ringan", "Perempuan", null],
    ["Mudah", "Kurus", "Sedang", "Laki-laki", null],
    ["Mudah", "Kurus", "Sedang", "Perempuan", null],
    ["Mudah", "Kurus", "Berat", "Laki-laki", null],
    ["Mudah", "Kurus", "Berat", "Perempuan", null],
    ["Mudah", "Kurus", "Sangat berat", "Laki-laki", null],
    ["Mudah", "Kurus", "Sangat berat", "Perempuan", null],
    ["Mudah", "Normal", "Istirahat", "Laki-laki", null],
    ["Mudah", "Normal", "Istirahat", "Perempuan", null],
    ["Mudah", "Normal", "Ringan", "Laki-laki", null],
    ["Mudah", "Normal", "Ringan", "Perempuan", null],
    ["Mudah", "Normal", "Sedang", "Laki-laki", null],
    ["Mudah", "Normal", "Sedang", "Perempuan", null],
    ["Mudah", "Normal", "Berat", "Laki-laki", null],
    ["Mudah", "Normal", "Berat", "Perempuan", null],
  ];

  // Fungsi perhitungan himpunan fuzzy umur
  const FuzzyUmur = () => {
    let muda = 0;
    let parobaya = 0;
    let tua = 0;
    let sangatTua = 0;

    // Menghitung nilai keanggotaan himpunan fuzzy
    if (umur <= 25) {
      muda = 1;
    } else if (umur > 25 && umur < 40) {
      muda = (40 - umur) / (40 - 25);
      parobaya = (umur - 25) / (40 - 25);
    } else if (umur >= 40 && umur <= 60) {
      parobaya = (60 - umur) / (60 - 40);
      tua = (umur - 40) / (60 - 40);
    } else if (umur > 60 && umur < 70) {
      tua = (70 - umur) / (70 - 60);
      sangatTua = (umur - 60) / (70 - 60);
    } else if (umur >= 70) {
      tua = 1;
    }

    // Menampilkan proses perhitungan himpunan fuzzy umur
    return (
      <>
        <div className="font-mono text-blue-700">
          <div>Umur = {umur}</div>
          <div>| Muda&nbsp;| Parobaya&nbsp;| Tua&nbsp;&nbsp;| Sangat Tua |</div>
          <div>
            | {muda.toFixed(2)}&nbsp;| &nbsp;&nbsp;{parobaya.toFixed(2)}
            &nbsp;&nbsp;&nbsp;| {tua.toFixed(2)}&nbsp;| &nbsp;&nbsp;&nbsp;
            {sangatTua.toFixed(2)}&nbsp;&nbsp;&nbsp; |
          </div>
        </div>
      </>
    );
  };

  const FuzzyBeratBadan = () => {
    let sangatKurus = 0;
    let kurus = 0;
    let normal = 0;
    let gemuk = 0;
    let sangatGemuk = 0;

    // Menghitung nilai keanggotaan himpunan fuzzy
    if (imt <= 16.5) {
      sangatKurus = 1;
    } else if (imt > 16.5 && imt < 17) {
      sangatKurus = (17 - imt) / (17 - 16.5);
      kurus = (imt - 16.5) / (17 - 16.5);
    } else if (imt > 17 && imt < 18) {
      kurus = 1;
    } else if (imt >= 18 && imt <= 18.5) {
      kurus = (18.5 - imt) / (18.5 - 18);
      normal = (imt - 18) / (18.5 - 18);
    } else if (imt > 18.5 && imt < 24.5) {
      normal = 1;
    } else if (imt >= 24.5 && imt <= 25) {
      normal = (25 - imt) / (25 - 24.5);
      gemuk = (imt - 24.5) / (25 - 24.5);
    } else if (imt >= 25 && imt <= 26.5) {
      gemuk = 1;
    } else if (imt >= 26.5 && imt <= 27) {
      gemuk = (27 - imt) / (27 - 26.5);
      sangatGemuk = (imt - 26.5) / (27 - 26.5);
    } else if (imt > 27) {
      sangatGemuk = 1;
    }

    // Menampilkan proses perhitungan himpunan fuzzy berat badan
    return (
      <>
        <div className="font-mono text-blue-700">
          <div>IMT = {imt}</div>
          <div>| Sangat Kurus | Kurus | Normal | Gemuk | Sangat Gemuk |</div>
          <div>
            | {sangatKurus.toFixed(2)}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |{" "}
            {kurus.toFixed(2)}&nbsp; | {normal.toFixed(2)}&nbsp;&nbsp; |{" "}
            {gemuk.toFixed(2)}&nbsp; | {sangatGemuk.toFixed(2)}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
          </div>
        </div>
      </>
    );
  };

  const FuzzyAktivitas = () => {
    const aktivitas = 7.5;
    let istirahat = 0;
    let ringan = 0;
    let sedang = 0;
    let berat = 0;
    let sangatBerat = 0;

    // Menghitung nilai keanggotaan himpunan fuzzy
    if (aktivitas <= 2) {
      istirahat = 1;
    } else if (aktivitas > 2 && aktivitas < 4) {
      istirahat = (4 - aktivitas) / 2;
    } else if (aktivitas > 2 && aktivitas < 4) {
      istirahat = (4 - aktivitas) / 2;
      if (aktivitas >= 3) {
        ringan = (aktivitas - 3) / 3;
      }
    } else if (aktivitas >= 4 && aktivitas <= 6) {
      sedang = (aktivitas - 4) / (6 - 4);
      if (aktivitas >= 4) {
        ringan = (5 - aktivitas) / (5 - 4);
      }
    } else if (aktivitas > 6 && aktivitas < 8) {
      sedang = (aktivitas - 6) / (8 - 6);
      if (aktivitas >= 7) {
        berat = (aktivitas - 7) / 7;
      }
    } else if (aktivitas >= 8 && aktivitas <= 10) {
      sangatBerat = (aktivitas - 8) / (10 - 8);
      // Mengatasi nilai keanggotaan yang lebih besar dari 1 pada titik overlap
      if (aktivitas < 9) {
        berat = (9 - aktivitas) / (9 - 8);
      }
    }

    // Menampilkan proses perhitungan himpunan fuzzy aktivitas
    return (
      <>
        <div className="font-mono text-blue-700">
          <div>Aktivitas = {aktivitas}</div>
          <div>| Istirahat | Ringan | Sedang | Berat | Sangat Berat |</div>
          <div>
            | {istirahat.toFixed(2)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;
            {ringan.toFixed(2)}
            &nbsp;&nbsp;| &nbsp;{sedang.toFixed(2)}&nbsp;&nbsp;| &nbsp;
            {berat.toFixed(2)}&nbsp;| &nbsp;&nbsp;
            {sangatBerat.toFixed(2)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
          </div>
        </div>
      </>
    );
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
          setUmur(res.data[0]?.umur || 0);
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
                    Berikut adalah proses perhitungan himpunan fuzzy umur
                  </div>
                  <span className="font-mono text-blue-700">
                    {/* penjelasan perhitungan himpunan fuzzy umur */}
                    <FuzzyUmur />
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
                    Berikut adalah proses perhitungan himpunan fuzzy berat badan
                    berdasarkan Index Massa Tubuh (IMT) anda:
                  </div>
                  <FuzzyBeratBadan />
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
                  <FuzzyAktivitas />
                </div>
              </div>
              {/* Tabel Aturan-Makanan */}
              <div className="row-start-5 h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-3 sm:col-start-4 sm:row-span-6 sm:row-start-1">
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
                            {aturan.map((kat, i) => (
                              <td
                                key={i}
                                className="whitespace-nowrap p-2 text-sm text-gray-500"
                              >
                                {kat}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </div>
                  </table>
                </div>
              </div>
              {/* DEFUZZIFIKASI */}
              <div className="h-fit rounded-md bg-gray-50 py-2 px-4 shadow-md sm:col-span-3">
                <h2 className="mb-1 font-bold uppercase">5. Defuzzifikasi</h2>
                <div className="">
                  <span className="text-sm text-gray-700"></span>
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
