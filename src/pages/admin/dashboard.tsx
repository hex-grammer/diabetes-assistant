import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import type { kkh } from "@prisma/client";
import DataDiri from "./data-diri";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineDeleteForever } from "react-icons/md";

const TabelHeader = ({ HEADERS }: { HEADERS: string[] }) => {
  return (
    <thead className="">
      <tr>
        {HEADERS.map((header, index) => (
          <th
            key={index}
            scope="col"
            className={`whitespace-nowrap p-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 `}
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

type Pekerjaan = {
  nama_pekerjaan: string;
  aktivitas: string;
};

function Dashboard() {
  const router = useRouter();
  const paths = router.pathname.split("/").slice(2);
  const [kkh, setKKH] = useState(0);
  const [kategoriIMT, setKategoriIMT] = useState("");
  const [tabelKKH, setTabelKKH] = useState<kkh[] | null>([]);
  const [rekomendasiMenu, setRekomendasiMenu] = useState<string[] | null>([]);
  const [newPekerjaan, setNewPekerjaan] = useState({
    nama_pekerjaan: "",
    aktivitas: "ringan",
  });
  const [dataBerubah, setDataBerubah] = useState(false);
  const [tabelOldPekerjaan, setTabelOldPekerjaan] = useState<Pekerjaan[]>([
    {
      nama_pekerjaan: "",
      aktivitas: "",
    },
  ]);
  const [tabelPekerjaan, setTabelPekerjaan] = useState(tabelOldPekerjaan);

  const onChangePekerjaan = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPekerjaan((prev) => {
      return {
        ...prev,
        nama_pekerjaan: e.target.value,
      };
    });
  };

  const onTambahData = () => {
    if (newPekerjaan.nama_pekerjaan === "") return;
    setDataBerubah(true);
    setTabelPekerjaan((prev) => {
      return [newPekerjaan, ...prev];
    });
    setNewPekerjaan({
      nama_pekerjaan: "",
      aktivitas: "",
    });
  };

  const handleSimpan = () => {
    setDataBerubah(false);
    setTabelOldPekerjaan(tabelPekerjaan);
    const newData = [
      ...tabelPekerjaan.filter((kerjaan) => {
        const oldData = tabelOldPekerjaan.find(
          (oldData) => oldData.nama_pekerjaan === kerjaan.nama_pekerjaan
        );
        if (!oldData) {
          return true;
        }
        return (
          JSON.stringify(oldData.aktivitas) !==
          JSON.stringify(kerjaan.aktivitas)
        );
      }),
    ];

    axios
      .post("/api/pekerjaan/create", newData)
      .then(() => {
        toast.success("Data Berhasil Disimpan!");
      })
      .catch(() => {
        toast.error("Gagal menambah data!");
      });
  };

  const onBatal = () => {
    setDataBerubah(false);
    setTabelPekerjaan(tabelOldPekerjaan);
  };

  const onDelete = (
    nama_pekerjaan: string,
    setTabelPekerjaan: React.Dispatch<React.SetStateAction<Pekerjaan[]>>
  ) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    axios
      .delete(`/api/pekerjaan/delete/`, { params: { nama_pekerjaan } })
      .then(() => {
        setTabelPekerjaan((oldData) =>
          oldData.filter((data) => data.nama_pekerjaan !== nama_pekerjaan)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
          setTabelOldPekerjaan(res.data);
          setTabelPekerjaan(res.data);
        });
    };

    getAssyncSession().catch((err) => {
      console.log(err);
    });
  }, []);

  function onAktivitasChange(nama_kerjaan: string, aktivitas: string) {
    setDataBerubah(true);
    setTabelPekerjaan((prevTabel) =>
      prevTabel.map((kerjaan) => {
        if (kerjaan.nama_pekerjaan === nama_kerjaan) {
          return {
            ...kerjaan,
            aktivitas,
          };
        }
        return kerjaan;
      })
    );
  }

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
          {/* 1st column */}
          <div className="flex flex-col gap-4 sm:col-span-2 sm:col-start-3">
            {/* KKH */}
            <div className="h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-2 sm:col-start-3">
              <h2 className="mb-2 text-xl font-bold uppercase">
                Kebutuhan Kalori Harian
              </h2>
              <div className="flex items-end py-2">
                <span className="text-4xl font-bold text-green-600">
                  {kkh
                    ? kkh.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    : 0}
                </span>
                <span className="ml-1 text-lg font-medium text-gray-600">
                  kkal/hari
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm text-gray-700">
                  Kebutuhan kalori harian (KKH) adalah jumlah kalori yang
                  dibutuhkan untuk menjaga kesehatan dan beraktivitas
                  sehari-hari.
                </span>
              </div>
            </div>
            {/* TABEL PEKERJAAN */}
            <div className="h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-2 sm:col-start-5">
              <h2 className="mb-2 text-center text-xl font-bold uppercase">
                Tabel Pekerjaan
              </h2>
              {/* Action Tabel Admin */}
              <div className="mb-1 flex w-full flex-col-reverse gap-2 py-2 sm:items-end sm:justify-between">
                {/* tambah makanan */}
                <div className="flex w-full flex-col items-start text-sm">
                  <div className="flex w-full gap-2">
                    <input
                      className="focus:shadow-outline w-full appearance-none rounded border py-2 px-2 leading-tight text-gray-700 shadow focus:outline-none"
                      id="makanan"
                      type="text"
                      name="makanan"
                      placeholder="Pekerjaan Baru"
                      value={newPekerjaan.nama_pekerjaan}
                      onChange={(e) => onChangePekerjaan(e)}
                    />
                    {/* tombol tambah */}
                    <div className="flex items-center justify-between">
                      <button
                        className={`focus:shadow-outline rounded bg-blue-500 py-2 px-2 font-bold text-white opacity-100 hover:bg-blue-600 focus:outline-none`}
                        type="submit"
                        onClick={onTambahData}
                      >
                        Tambah
                      </button>
                    </div>
                  </div>
                </div>
                {/* tombol simpan & batal */}
                {dataBerubah && (
                  <div className="flex gap-2">
                    <div className="flex items-center justify-between">
                      <button
                        className={`focus:shadow-outline rounded bg-blue-500 py-1 px-2 font-bold text-white opacity-100 hover:bg-blue-600 focus:outline-none`}
                        type="submit"
                        onClick={handleSimpan}
                      >
                        Simpan
                      </button>
                    </div>
                    <div className="fosem flex items-center justify-between">
                      <button
                        className={`focus:shadow-outline rounded bg-gray-300 py-1 px-2 font-semibold text-gray-800 opacity-100 focus:outline-none`}
                        type="submit"
                        onClick={onBatal}
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full overflow-x-auto sm:max-h-[30vh]">
                <table className="min-w-full divide-y divide-gray-200 ">
                  <TabelHeader HEADERS={["", "Nama Pekerjaan", "Aktivitas"]} />
                  <tbody className="divide-y divide-gray-200 bg-gray-50">
                    {tabelPekerjaan?.map((kerjaan, i) => (
                      <tr key={i}>
                        <td className="py-2">
                          <div
                            onClick={() =>
                              onDelete(
                                kerjaan.nama_pekerjaan || "",
                                setTabelPekerjaan
                              )
                            }
                            className="flex cursor-pointer items-center justify-center rounded-sm bg-red-500 p-1 px-0.5 text-white"
                          >
                            <MdOutlineDeleteForever />
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {kerjaan.nama_pekerjaan}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          <select
                            // className=""
                            id="aktivitas"
                            name="aktivitas"
                            value={kerjaan.aktivitas}
                            onChange={(e) =>
                              void onAktivitasChange(
                                kerjaan.nama_pekerjaan,
                                e.target.value
                              )
                            }
                            required
                          >
                            <option value="">Pilih Aktivitas</option>
                            <option value="ringan">Ringan</option>
                            <option value="sedang">Sedang</option>
                            <option value="berat">Berat</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* 2nd column */}
          <div className="flex flex-col gap-4 sm:col-span-2 sm:col-start-5">
            {/* REKOMENDASI MENU */}
            <div className="h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-2 sm:col-start-5">
              <h2 className="mb-2 text-xl font-bold uppercase">
                Rekomendasi Menu
              </h2>
              <div className="flex flex-col">
                <span className="text-sm text-gray-700">
                  Makanan yang direkomendasikan berdasarkan Index Massa Tubuh
                  anda{" "}
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
            <div className="h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-2 sm:col-start-3">
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
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
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
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default Dashboard;
