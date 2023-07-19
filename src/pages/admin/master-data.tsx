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

type Pekerjaan = {
  id: number;
  nama_pekerjaan: string;
  aktivitas: string;
};

function ForwardChaining() {
  const router = useRouter();
  const { data: session } = useSession();
  const paths = router.pathname.split("/").slice(2);
  // const [beratBadan, setBeratBadan] = useState(0);
  // const [tinggiBadan, setTinggiBadan] = useState(0);
  // const [imt, setImt] = useState(0);
  const [domLoaded, setDomLoaded] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedValue, setEditedValue] = useState("");
  const [editMakananIndex, setEditMakananIndex] = useState(-1);
  const [newMenu, setNewMenu] = useState("");
  const [editPekerjaanIndex, setEditPekerjaanIndex] = useState(-1);
  const [editKerjaan, setEditKerjaan] = useState("");
  const [newPekerjaan, setNewPekerjaan] = useState({
    id: 0,
    nama_pekerjaan: "",
    aktivitas: "ringan",
  });
  const [dataBerubah, setDataBerubah] = useState(false);
  const [dataPekerjaanBerubah, setDataPekerjaanBerubah] = useState(false);
  const [tabelOldPekerjaan, setTabelOldPekerjaan] = useState<Pekerjaan[]>([
    {
      id: 0,
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

  const onTambahDataPekerjaan = () => {
    if (newPekerjaan.nama_pekerjaan === "") return;
    setDataPekerjaanBerubah(true);
    setTabelPekerjaan((prev) => {
      return [newPekerjaan, ...prev];
    });
    setNewPekerjaan({
      id: 0,
      nama_pekerjaan: "",
      aktivitas: "",
    });
  };

  function updateKerjaanById(id: number, newMakanan: string): void {
    setDataPekerjaanBerubah(true);
    const kerjaanBaru = tabelPekerjaan.map((item) => {
      if (item.id === id) {
        return { ...item, nama_pekerjaan: newMakanan };
      }
      return item;
    });
    setTabelPekerjaan(kerjaanBaru);
  }

  const onKerjaanChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    setDataPekerjaanBerubah(true);
    setEditKerjaan(e.target.value);
    updateKerjaanById(id, e.target.value);
  };

  const handleSimpanPekerjaan = () => {
    setDataPekerjaanBerubah(false);
    setTabelOldPekerjaan(tabelPekerjaan);
    const newData = tabelPekerjaan.filter((newDataItem) => {
      const oldData = tabelOldPekerjaan.find(
        (oldDataItem) => oldDataItem.id === newDataItem.id
      );
      if (!oldData) {
        return true;
      }
      return (
        newDataItem.nama_pekerjaan !== oldData.nama_pekerjaan ||
        newDataItem.aktivitas !== oldData.aktivitas
      );
    });

    // console.log(newData);
    axios
      .post("/api/pekerjaan/create", newData)
      .then(() => {
        toast.success("Data Berhasil Disimpan!");
      })
      .catch(() => {
        toast.error("Gagal menambah data!");
      });
  };

  const onBatalPekerjaan = () => {
    setDataPekerjaanBerubah(false);
    setTabelPekerjaan(tabelOldPekerjaan);
  };

  const onDeletePekerjaan = (
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

  function onAktivitasChange(nama_kerjaan: string, aktivitas: string) {
    setDataPekerjaanBerubah(true);
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

  // usestate aturan
  const [oldAturan, setOldAturan] = useState<Aturan[]>([
    {
      id: 0,
      makanan: "Loading...",
      kategori: [0, 0, 0, 0, 0],
    },
  ]);

  const [tabelAturan, setTabelAturan] = useState(oldAturan);
  const [newMakanan, setNewMakanan] = useState({
    makanan: "",
    kategori: [0, 0, 0, 0, 0],
  });

  useEffect(() => {
    try {
      void axios.get("/api/makanan/getAll").then((res: { data: Aturan[] }) => {
        setOldAturan(res.data);
        setTabelAturan(res.data);
      });
    } catch (error) {}
  }, []);

  useEffect(() => {
    console.log(tabelAturan);
  }, [tabelAturan]);

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

  const toggleKategori = (
    makananName: string,
    kategoriIndex: number,
    newValue: number
  ) => {
    setDataBerubah(true);
    setTabelAturan((prevTabelAturan) =>
      prevTabelAturan.map((aturan) => {
        if (aturan.makanan === makananName) {
          const newKategori = [...aturan.kategori];
          newKategori[kategoriIndex] = newValue;
          return {
            ...aturan,
            kategori: newKategori,
          };
        }
        return aturan;
      })
    );
  };

  const onTambahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMakanan((prev) => {
      return {
        ...prev,
        makanan: e.target.value,
      };
    });
  };

  const onTambahData = () => {
    if (newMakanan.makanan === "") return;
    setDataBerubah(true);
    setTabelAturan((prev) => {
      return [newMakanan, ...prev];
    });
    setNewMakanan({
      makanan: "",
      kategori: [0, 0, 0, 0, 0],
    });
  };

  function updateMakananById(id: number, newMakanan: string): void {
    setDataBerubah(true);
    const aturanBaru = tabelAturan.map((item) => {
      if (item.id === id) {
        return { ...item, makanan: newMakanan };
      }
      return item;
    });

    setTabelAturan(aturanBaru);
  }

  const onMakanChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    setDataBerubah(true);
    setNewMenu(e.target.value);
    updateMakananById(id, e.target.value);
  };

  const handleSimpan = () => {
    setDataBerubah(false);
    setOldAturan(tabelAturan);
    const newData = [
      ...tabelAturan.filter((aturan) => {
        const oldData = oldAturan.find((oldData) => oldData.id === aturan.id);
        if (!oldData) {
          return true;
        }
        return (
          JSON.stringify(oldData.kategori) !==
            JSON.stringify(aturan.kategori) ||
          JSON.stringify(oldData.makanan) !== JSON.stringify(aturan.makanan)
        );
      }),
    ];

    axios
      .post("/api/makanan/create", newData)
      .then(() => {
        toast.success("Data Berhasil Disimpan!");
      })
      .catch(() => {
        toast.error("Gagal menambah data!");
      });
  };

  const onBatal = () => {
    setDataBerubah(false);
    setTabelAturan(oldAturan);
    setEditMakananIndex(-1);
  };

  const onDelete = (
    id: number,
    setTabelAturan: React.Dispatch<React.SetStateAction<Aturan[]>>
  ) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    axios
      .delete(`/api/makanan/delete/`, { params: { id } })
      .then(() => {
        setTabelAturan((oldData) => oldData.filter((data) => data.id !== id));
      })
      .catch((error) => {
        console.error(error);
      });
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
      void axios.get("/api/kkh/getLast", {
        params: {
          dataLength: 4,
          email: session?.user?.email,
          username: userLocal.username,
        },
      });
    } catch (error) {}
  }, []);

  useEffect(() => {
    try {
      void axios
        .get("/api/pekerjaan/getAll")
        .then((res: { data: Pekerjaan[] }) => {
          setTabelPekerjaan(res.data);
        });
    } catch (error) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              {/* pekerjaan */}
              <div className="flex flex-col gap-4 sm:col-span-2">
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
                            onClick={onTambahDataPekerjaan}
                          >
                            Tambah
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* tombol simpan & batal */}
                    {dataPekerjaanBerubah && (
                      <div className="flex gap-2">
                        <div className="flex items-center justify-between">
                          <button
                            className={`focus:shadow-outline rounded bg-blue-500 py-1 px-2 font-bold text-white opacity-100 hover:bg-blue-600 focus:outline-none`}
                            type="submit"
                            onClick={handleSimpanPekerjaan}
                          >
                            Simpan
                          </button>
                        </div>
                        <div className="fosem flex items-center justify-between">
                          <button
                            className={`focus:shadow-outline rounded bg-gray-300 py-1 px-2 font-semibold text-gray-800 opacity-100 focus:outline-none`}
                            type="submit"
                            onClick={onBatalPekerjaan}
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-full overflow-x-auto sm:max-h-[70vh]">
                    <table className="min-w-full divide-y divide-gray-200 ">
                      <TabelHeader
                        HEADERS={["", "Nama Pekerjaan", "Aktivitas"]}
                      />
                      <tbody className="divide-y divide-gray-200 bg-gray-50">
                        {tabelPekerjaan?.map((kerjaan, i) => (
                          <tr key={i}>
                            {/* delete */}
                            <td className="py-2">
                              <div
                                onClick={() =>
                                  onDeletePekerjaan(
                                    kerjaan.nama_pekerjaan || "",
                                    setTabelPekerjaan
                                  )
                                }
                                className="flex cursor-pointer items-center justify-center rounded-sm bg-red-500 p-1 px-0.5 text-white"
                              >
                                <MdOutlineDeleteForever />
                              </div>
                            </td>
                            {/* nama pekerjaan */}
                            <td
                              className="whitespace-nowrap p-2 text-sm text-gray-500"
                              onClick={() => {
                                setEditPekerjaanIndex(parseInt(`${i}`));
                                setEditKerjaan(kerjaan.nama_pekerjaan);
                              }}
                            >
                              {editPekerjaanIndex === parseInt(`${i}`) ? (
                                <input
                                  type="text"
                                  value={editKerjaan}
                                  onChange={(e) =>
                                    onKerjaanChange(e, kerjaan.id)
                                  }
                                  className="w-fit cursor-pointer bg-transparent outline-none"
                                  autoFocus
                                />
                              ) : (
                                <div className="cursor-pointer">
                                  {kerjaan.nama_pekerjaan}
                                </div>
                              )}
                            </td>
                            {/* aktivitas */}
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
              {/* Tabel Aturan-Makanan */}
              <div className="h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-4 sm:col-start-3">
                <h2 className="mb-2 text-center text-xl font-bold uppercase">
                  Tabel Aturan-Makanan
                </h2>
                <div className="w-full overflow-x-auto">
                  {/* Action Tabel Admin */}
                  <div className="mb-2 flex flex-col-reverse gap-2 p-2 sm:flex-row sm:items-end sm:justify-between sm:p-0">
                    {/* tambah makanan */}
                    <div className="flex flex-col items-start text-sm">
                      <label
                        className="mb-1 block whitespace-nowrap font-semibold text-gray-700"
                        htmlFor="makanan"
                      >
                        Tambah Data Makanan:
                      </label>
                      <div className="flex gap-2">
                        <input
                          className="focus:shadow-outline appearance-none rounded border py-1 px-2 leading-tight text-gray-700 shadow focus:outline-none"
                          id="makanan"
                          type="text"
                          name="makanan"
                          value={newMakanan.makanan}
                          onChange={(e) => onTambahChange(e)}
                          required
                          min={20}
                        />
                        {/* tombol tambah */}
                        <div className="flex items-center justify-between">
                          <button
                            className={`focus:shadow-outline rounded bg-blue-500 py-1 px-2 font-bold text-white opacity-100 hover:bg-blue-600 focus:outline-none`}
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
                  <table className="min-w-full divide-y divide-gray-200">
                    <div className="min-w-full">
                      {/* TabelHeader */}
                      <TabelHeader
                        HEADERS={[
                          "",
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
                            {/* delete */}
                            <td className="w-fit p-1">
                              <div
                                onClick={() =>
                                  onDelete(aturan.id || 0, setTabelAturan)
                                }
                                className="flex cursor-pointer items-center justify-center rounded-sm bg-red-500 p-1 px-0.5 text-white"
                              >
                                <MdOutlineDeleteForever />
                              </div>
                            </td>

                            {/* nama makanan */}
                            <td
                              className="whitespace-nowrap p-2 text-sm text-gray-500"
                              onClick={() => {
                                setEditMakananIndex(parseInt(`${i}`));
                                setNewMenu(aturan.makanan);
                              }}
                            >
                              {editMakananIndex === parseInt(`${i}`) ? (
                                <input
                                  type="text"
                                  value={newMenu}
                                  onChange={(e) =>
                                    onMakanChange(e, aturan.id || 0)
                                  }
                                  className="w-fit cursor-pointer bg-transparent outline-none"
                                  autoFocus
                                />
                              ) : (
                                <div className="cursor-pointer">
                                  {aturan.makanan}
                                </div>
                              )}
                            </td>

                            {/* kategori */}
                            {aturan.kategori.map((kat, j) => (
                              <td
                                key={j}
                                className="whitespace-nowrap p-2 text-center text-sm text-gray-500"
                              >
                                {editingIndex === parseInt(`${i}${j}`) ? (
                                  <input
                                    type="number"
                                    value={editedValue}
                                    onChange={(e) =>
                                      setEditedValue(e.target.value)
                                    }
                                    onBlur={() => {
                                      toggleKategori(
                                        aturan.makanan,
                                        j,
                                        parseInt(editedValue)
                                      );
                                      setEditedValue("");
                                      setEditingIndex(-1);
                                    }}
                                    className="cursor-pointer bg-transparent outline-none"
                                    autoFocus
                                  />
                                ) : (
                                  <div
                                    onClick={() => {
                                      setEditedValue(kat?.toString() || "0");
                                      setEditingIndex(parseInt(`${i}${j}`));
                                    }}
                                    className="cursor-pointer"
                                  >
                                    {kat ? `${kat}gr` : "-"}
                                  </div>
                                )}
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
              {/* <div className="h-fit rounded-md bg-gray-50 py-2 px-4 shadow-md sm:col-span-3">
                <h2 className="mb-1 font-bold uppercase">2. Kategori IMT</h2>
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div className="flex gap-2 text-sm sm:w-2/5">
                    Tabel berikut menunjukkan kategori IMT yang terbagi menjadi
                    5 kategori berdasarkan range nilai IMT.
                  </div>
                  <div className="flex flex-1 justify-center overflow-x-auto rounded-md bg-white">
                    <table className="divide-y divide-gray-200">
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
                    </table>
                  </div>
                </div>
              </div> */}
              {/* REKOMENDASI MENU */}
              {/* <div className="h-fit rounded-md bg-gray-50 py-2 px-4 shadow-md sm:col-span-3">
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
              </div> */}
            </>
          )}
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default ForwardChaining;
