import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import type { User, kkh } from "@prisma/client";
import axios from "axios";
import { ATURAN } from "../../lib/aturan-fuzzy";

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

type Atuaran = {
  no: number;
  umur: string;
  berat: string;
  aktivitas: string;
  jenis_kelamin: string;
  kalori_harian: string;
};

type Pekerjaan = {
  nama_pekerjaan: string;
  aktivitas: string;
};

function LogikaFuzzy() {
  const router = useRouter();
  const paths = router.pathname.split("/").slice(2);

  const [umur, setUmur] = useState(0);
  const [imt, setImt] = useState(0);
  const { data: session } = useSession();
  const [fuzzyUmur, setFuzzyUmur] = useState({ label: "", nilai: 0 });
  const [fuzzyBeratBadan, setFuzzyBeratBadan] = useState({
    label: "",
    nilai: 0,
  });
  const [fuzzyAktivitas, setFuzzyAktivitas] = useState({ label: "", nilai: 0 });
  const [tabelKKH, setTabelKKH] = useState<kkh[] | null>([]);
  const [domLoaded, setDomLoaded] = useState(false);
  const [tabelPekerjaan, setTabelPekerjaan] = useState<Pekerjaan[]>([
    {
      nama_pekerjaan: "",
      aktivitas: "",
    },
  ]);

  // CONSTANT VARIABLES
  const tabelAturan = ATURAN as Atuaran[];

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

    // set label dan nilai himpunan fuzzy berdasarkan nilai tertinggi
    if (muda > parobaya && muda > tua && muda > sangatTua) {
      setFuzzyUmur({ label: "Muda", nilai: muda });
    } else if (parobaya > muda && parobaya > tua && parobaya > sangatTua) {
      setFuzzyUmur({ label: "Parobaya", nilai: parobaya });
    } else if (tua > muda && tua > parobaya && tua > sangatTua) {
      setFuzzyUmur({ label: "Tua", nilai: tua });
    } else if (sangatTua > muda && sangatTua > parobaya && sangatTua > tua) {
      setFuzzyUmur({ label: "Sangat Tua", nilai: sangatTua });
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

    sangatKurus = parseFloat(sangatKurus.toFixed(2));
    kurus = parseFloat(kurus.toFixed(2));
    normal = parseFloat(normal.toFixed(2));
    gemuk = parseFloat(gemuk.toFixed(2));
    sangatGemuk = parseFloat(sangatGemuk.toFixed(2));

    // set label dan nilai himpunan fuzzy berdasarkan nilai tertinggi
    if (
      sangatKurus > kurus &&
      sangatKurus > normal &&
      sangatKurus > gemuk &&
      sangatKurus > sangatGemuk
    ) {
      setFuzzyBeratBadan({
        label: "Sangat Kurus",
        nilai: sangatKurus,
      });
    } else if (
      kurus > sangatKurus &&
      kurus > normal &&
      kurus > gemuk &&
      kurus > sangatGemuk
    ) {
      setFuzzyBeratBadan({ label: "Kurus", nilai: kurus });
    } else if (
      normal > sangatKurus &&
      normal > kurus &&
      normal > gemuk &&
      normal > sangatGemuk
    ) {
      setFuzzyBeratBadan({
        label: "Normal",
        nilai: normal,
      });
    } else if (
      gemuk > sangatKurus &&
      gemuk > kurus &&
      gemuk > normal &&
      gemuk > sangatGemuk
    ) {
      setFuzzyBeratBadan({ label: "Gemuk", nilai: gemuk });
    } else if (
      sangatGemuk > sangatKurus &&
      sangatGemuk > kurus &&
      sangatGemuk > normal &&
      sangatGemuk > gemuk
    ) {
      setFuzzyBeratBadan({
        label: "Sangat Gemuk",
        nilai: sangatGemuk,
      });
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
    const { aktivitas } =
      tabelPekerjaan.filter(
        (item) => tabelKKH && item.nama_pekerjaan === tabelKKH[0]?.pekerjaan
      )[0] || {};
    const labelAktivitas =
      aktivitas === "ringan" ? 4 : aktivitas === "sedang" ? 6 : 8;
    let istirahat = 0;
    let ringan = 0;
    let sedang = 0;
    let berat = 0;
    let sangatBerat = 0;

    // Menghitung nilai keanggotaan himpunan fuzzy
    if (labelAktivitas <= 2) {
      istirahat = 1;
    } else if (labelAktivitas > 2 && labelAktivitas < 4) {
      istirahat = (4 - labelAktivitas) / 2;
    } else if (labelAktivitas > 2 && labelAktivitas < 4) {
      istirahat = (4 - labelAktivitas) / 2;
      ringan = (labelAktivitas - 2) / 2;
    } else if (labelAktivitas >= 4 && labelAktivitas <= 6) {
      sedang = (labelAktivitas - 4) / (6 - 4);
      ringan = (6 - labelAktivitas) / (6 - 4);
    } else if (labelAktivitas > 6 && labelAktivitas < 8) {
      sedang = (labelAktivitas - 6) / (8 - 6);
      berat = (8 - labelAktivitas) / (8 - 6);
    } else if (labelAktivitas >= 8 && labelAktivitas <= 10) {
      sangatBerat = (labelAktivitas - 8) / (10 - 8);
      berat = (labelAktivitas - 8) / 8;
    }

    // set label dan nilai himpunan fuzzy berdasarkan nilai tertinggi
    if (
      istirahat > ringan &&
      istirahat > sedang &&
      istirahat > berat &&
      istirahat > sangatBerat
    ) {
      setFuzzyAktivitas({ label: "Istirahat", nilai: istirahat });
    } else if (
      ringan > istirahat &&
      ringan > sedang &&
      ringan > berat &&
      ringan > sangatBerat
    ) {
      setFuzzyAktivitas({ label: "Ringan", nilai: ringan });
    } else if (
      sedang > istirahat &&
      sedang > ringan &&
      sedang > berat &&
      sedang > sangatBerat
    ) {
      setFuzzyAktivitas({ label: "Sedang", nilai: sedang });
    } else if (
      berat > istirahat &&
      berat > ringan &&
      berat > sedang &&
      berat > sangatBerat
    ) {
      setFuzzyAktivitas({ label: "Berat", nilai: berat });
    } else if (
      sangatBerat > istirahat &&
      sangatBerat > ringan &&
      sangatBerat > sedang &&
      sangatBerat > berat
    ) {
      setFuzzyAktivitas({ label: "Sangat Berat", nilai: sangatBerat });
    }

    // Menampilkan proses perhitungan himpunan fuzzy aktivitas
    return (
      <>
        <div className="font-mono text-blue-700">
          <div>Pekerjaan = {tabelKKH && tabelKKH[0]?.pekerjaan}</div>
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

  // fungsi defuzzifikasi
  const Defuzzifikasi = () => {
    const cal = (tabelKKH && tabelKKH[0]?.kkh && tabelKKH[0]?.kkh - 312) || 0;
    const JK = (cal * 0.05).toFixed(2) as unknown as number;
    const spaces = (num: number) => String.fromCharCode(160).repeat(num);
    const { aktivitas } =
      tabelPekerjaan.filter(
        (item) => tabelKKH && item.nama_pekerjaan === tabelKKH[0]?.pekerjaan
      )[0] || {};
    const persentaseAktivitas =
      aktivitas === "ringan" ? 20 : aktivitas === "sedang" ? 30 : 40;
    const nilaiAktivitas = (cal * (persentaseAktivitas / 100)).toFixed(2);
    const persentaseBB =
      fuzzyBeratBadan.label === "Kurus"
        ? 20
        : fuzzyBeratBadan.label === "Gemuk"
        ? 30
        : 0;
    const nilaiBB = (cal * (persentaseBB / 100)).toFixed(2);

    return (
      <>
        <div className="font-mono text-blue-700">
          <div>Kalori Basal &nbsp;= {cal} kalori</div>
          <div>Jenis Kelamin = {tabelKKH && tabelKKH[0]?.jenis_kelamin}</div>
          <div>
            {spaces(14)}= {cal} * 5%
          </div>
          <div>
            {spaces(14)}= {(cal * 0.05).toFixed(2)}
          </div>
          <div>
            Aktivitas {spaces(4)}= {aktivitas} <br />
            {spaces(14)}= {cal} * {persentaseAktivitas}% <br />
            {spaces(14)}= {nilaiAktivitas}
          </div>
          <div>
            Total Kalori &nbsp;= Kalori basal {umur > 40 && "- U "}- JK - BB +
            AK
          </div>
          <div>
            {spaces(14)}= {cal || 0} {umur > 40 && `- ${umur} `}- {JK} -{" "}
            {nilaiBB} + {nilaiAktivitas}
          </div>
          <div>
            {spaces(14)}={" "}
            {(cal || 0) -
              (umur > 40 ? umur : 0) -
              JK -
              parseInt(nilaiBB) +
              parseInt(nilaiAktivitas)}{" "}
            kalori
          </div>
        </div>
      </>
    );
  };

  // if login
  useEffect(() => {
    const getAssyncSession = async () => {
      const session = await getSession();
      const login = localStorage.getItem("login");

      if (login !== "true" && !session) {
        void router.push("/login");
      }

      await axios
        .get("/api/pekerjaan/getAll")
        .then((res: { data: Pekerjaan[] }) => {
          setTabelPekerjaan(res.data);
        });
    };

    getAssyncSession().catch((err) => {
      console.log(err);
    });
  }, []);

  // axios request to set kkh in /api/kkh/getLast in useEffect
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}") as User;
    setDomLoaded(true);
    try {
      void axios
        .get("/api/kkh/getLast", {
          params: {
            dataLength: 4,
            email: session?.user?.email,
            username: user.username,
          },
        })
        .then((res: { data: kkh[] }) => {
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
                  <div className="w-full overflow-x-auto whitespace-nowrap pb-2 sm:pb-0">
                    <FuzzyUmur />
                  </div>
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
                  <div className="w-full overflow-x-auto whitespace-nowrap pb-2 sm:pb-0">
                    <FuzzyBeratBadan />
                  </div>
                </div>
              </div>
              {/* HIMPUNAN FUZZY AKTIVITAS */}
              <div className="h-fit rounded-md bg-gray-50 px-4 py-2 shadow-md sm:col-span-3">
                <h2 className="mb-1 font-bold uppercase">
                  3. Himpunan Fuzzy Aktivitas
                </h2>
                <div className="text-sm">
                  <div className="mb-1">
                    Berikut adalah proses perhitungan himpunan fuzzy aktivitas
                    berdasarkan pekerjaan anda:
                  </div>
                  <div className="w-full overflow-x-auto whitespace-nowrap pb-2 sm:pb-0">
                    <FuzzyAktivitas />
                  </div>
                </div>
              </div>
              {/* Tabel Aturan (Implikasi) */}
              <div className="row-start-5 h-fit rounded-md bg-gray-50 p-4 px-1 shadow-md sm:col-span-3 sm:col-start-4 sm:row-span-6 sm:row-start-1">
                <h2 className="mb-2 text-center text-xl font-bold uppercase">
                  4. Tabel Aturan (Implikasi)
                </h2>
                {/* link download file excel berisi data tabel aturan lengkap */}
                {/* <a
                  href="/api/kkh/download"
                  className="p-2 text-blue-600 underline"
                >
                  Download file aturan
                </a> */}
                <div className="w-full overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <div className="bgre min-w-full sm:max-h-[70vh]">
                      {/* TabelHeader */}
                      <TabelHeader
                        HEADERS={[
                          "No",
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
                              {i + 1}
                            </td>
                            <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                              {aturan.umur}
                            </td>
                            <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                              {aturan.berat}
                            </td>
                            <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                              {aturan.aktivitas}
                            </td>
                            <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                              {aturan.jenis_kelamin}
                            </td>
                            <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                              {aturan.kalori_harian}
                            </td>
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
                  <div>
                    Berdasarkan himpunan fuzzy dan tabel aturan yang telah
                    diperoleh, berikut adalah kebutuhan kalori harian anda:
                  </div>
                  <Defuzzifikasi />
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
