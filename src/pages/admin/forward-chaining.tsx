import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
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
  kategori: boolean[];
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
  const [dataBerubah, setDataBerubah] = useState(false);

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
      makanan: "",
      kategori: [true, true, true, true, true],
    },
  ]);

  const [tabelAturan, setTabelAturan] = useState(oldAturan);
  const [newMakanan, setNewMakanan] = useState({
    makanan: "",
    kategori: [false, false, false, false, false],
  });

  useEffect(() => {
    try {
      void axios.get("/api/makanan/getAll").then((res: { data: Aturan[] }) => {
        setOldAturan(res.data);
        setTabelAturan(res.data);
      });
    } catch (error) {}
  }, []);

  const toggleKategori = (makananName: string, kategoriIndex: number) => {
    setDataBerubah(true);
    setTabelAturan((prevTabelAturan) =>
      prevTabelAturan.map((aturan) => {
        if (aturan.makanan === makananName) {
          const newKategori = [...aturan.kategori];
          newKategori[kategoriIndex] = !newKategori[kategoriIndex];
          return {
            ...aturan,
            kategori: newKategori,
          };
        }
        return aturan;
      })
    );
  };

  // const FormAturan = () => {
  //   return (
  //     <form onSubmit={(e) => void handleSubmit(e)}>
  //       {/* Makanan */}
  //       <div className="mb-4">
  //         <label className="mb-1 block font-bold text-gray-700" htmlFor="makanan">
  //           Makanan
  //         </label>
  //         <input
  //           className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
  //           id="makanan"
  //           type="text"
  //           name="makanan"
  //           value={formData.makanan}
  //           onChange={handleInputChange}
  //           required
  //         />
  //       </div>
  //       {/* Kategori */}
  //       <div className="mb-4">
  //         <div className="font-bold text-gray-700 mb-1">Kategori</div>
  //         <div className="flex items-center">
  //           <input
  //             className="form-checkbox h-5 w-5 text-blue-600"
  //             id="sangat_kurus"
  //             type="checkbox"
  //             name="kategori"
  //             value="sangat_kurus"
  //             checked={formData.kategori === "sangat_kurus"}
  //             onChange={handleInputChange}
  //           />
  //           <label htmlFor="sangat_kurus" className="ml-2">
  //             Sangat Kurus
  //           </label>
  //         </div>
  //         <div className="flex items-center">
  //           <input
  //             className="form-checkbox h-5 w-5 text-blue-600"
  //             id="kurus"
  //             type="checkbox"
  //             name="kategori"
  //             value="kurus"
  //             checked={formData.kategori === "kurus"}
  //             onChange={handleInputChange}
  //           />
  //           <label htmlFor="kurus" className="ml-2">
  //             Kurus
  //           </label>
  //         </div>
  //         <div className="flex items-center">
  //           <input
  //             className="form-checkbox h-5 w-5 text-blue-600"
  //             id="sedang"
  //             type="checkbox"
  //             name="kategori"
  //             value="sedang"
  //             checked={formData.kategori === "sedang"}
  //             onChange={handleInputChange}
  //           />
  //           <label htmlFor="sedang" className="ml-2">
  //             Sedang
  //           </label>
  //         </div>
  //         <div className="flex items-center">
  //           <input
  //             className="form-checkbox h-5 w-5 text-blue-600"
  //             id="gemuk"
  //             type="checkbox"
  //             name="kategori"
  //             value="gemuk"
  //             checked={formData.kategori === "gemuk"}
  //             onChange={handleInputChange}
  //           />
  //           <label htmlFor="gemuk" className="ml-2">
  //             Gemuk
  //           </label>
  //         </div>
  //         <div className="flex items-center">
  //           <input
  //             className="form-checkbox h-5 w-5 text-blue-600"
  //             id="sangat_gemuk"
  //             type="checkbox"
  //             name="kategori"
  //             value="sangat_gemuk"
  //             checked={formData.kategori === "sangat_gemuk"}
  //             onChange={handleInputChange}
  //           />
  //           <label htmlFor="sangat_gemuk" className="ml-2">
  //             Sangat Gemuk
  //           </label>
  //         </div>
  //       </div>
  //       {/* Submit */}
  //       <div className="flex items-center justify-between">
  //         <button
  //           className={`focus:shadow-outline rounded py-2 px-4 font-bold text-white focus:outline-none ${
  //             submit
  //               ? "bg-blue-500 opacity-100 hover:bg-blue-600"
  //               : "cursor-not-allowed bg-gray-500"}`}>
  //                 Submit
  //               </button>
  //               </div>
  //               </form>
  //   )

  // }

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

  const onChangeMakanan = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      kategori: [false, false, false, false, false],
    });
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
          JSON.stringify(oldData.kategori) !== JSON.stringify(aturan.kategori)
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
                          onChange={(e) => onChangeMakanan(e)}
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
                            <div className="py-2">
                              <div
                                onClick={() =>
                                  onDelete(aturan.id || 0, setTabelAturan)
                                }
                                className="flex cursor-pointer items-center justify-center rounded-sm bg-red-500 p-1 px-0.5 text-white"
                              >
                                <MdOutlineDeleteForever />
                              </div>
                            </div>
                            <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                              {aturan.makanan}
                            </td>
                            {aturan.kategori.map((kat, i) => (
                              <td
                                key={i}
                                className="whitespace-nowrap p-2 text-center text-sm text-gray-500"
                              >
                                <span
                                  onClick={() =>
                                    toggleKategori(aturan.makanan, i)
                                  }
                                  className="cursor-pointer"
                                >
                                  {kat ? "✔" : "❌"}
                                </span>
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
