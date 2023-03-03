import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PEKERJAAN } from "../../lib/pekerjaan";
import axios from "axios";
import { toast } from "react-toastify";
import type { kkh } from "@prisma/client";

interface FormData {
  id_kkh?: number;
  berat_badan: number;
  tinggi_badan: number;
  umur: number;
  pekerjaan: string;
  aktivitas: string;
  jenis_kelamin: string;
  kkh?: number;
  email?: string;
}
interface DataDiriProps {
  setKKH: React.Dispatch<React.SetStateAction<number>>;
}

function DataDiri({ setKKH }: DataDiriProps) {
  const [submit, setSubmit] = useState(false);
  const { data: session } = useSession();
  const [formData, setFormData] = useState<FormData>({
    berat_badan: 20,
    tinggi_badan: 100,
    umur: 15,
    pekerjaan: "",
    aktivitas: "",
    jenis_kelamin: "",
  });
  const [defaultFormData, setDefaultFormData] = useState<FormData>({
    berat_badan: 20,
    tinggi_badan: 100,
    umur: 15,
    pekerjaan: "",
    aktivitas: "",
    jenis_kelamin: "",
  });

  // set submit true jika formData berubah dan tidak kosong
  useEffect(() => {
    if (
      JSON.stringify(formData) === JSON.stringify(defaultFormData) ||
      formData.pekerjaan === "" ||
      formData.jenis_kelamin === ""
    ) {
      setSubmit(false);
    } else {
      setSubmit(true);
    }
  }, [formData]);

  // axios request to set kkh in /api/kkh/getLast in useEffect
  useEffect(() => {
    try {
      void axios
        .get("/api/kkh/getLast", { params: { dataLength: 10 } })
        .then((res: { data: kkh[] }) => {
          setKKH(res.data[0]?.kkh || 0);
          setFormData(
            res.data[0] || {
              berat_badan: 20,
              tinggi_badan: 100,
              umur: 15,
              pekerjaan: "",
              aktivitas: "",
              jenis_kelamin: "",
            }
          );
          setDefaultFormData(
            res.data[0] || {
              berat_badan: 20,
              tinggi_badan: 100,
              umur: 15,
              pekerjaan: "",
              aktivitas: "",
              jenis_kelamin: "",
            }
          );
        });
    } catch (error) {}
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    // jika target name adalah pekerjaan, maka ubah aktivitas sesuai dengan pekerjaan
    if (event.target.name === "pekerjaan") {
      const pekerjaanToKategori = PEKERJAAN[
        PEKERJAAN.map((p) => p.nama_pekerjaan).indexOf(event.target.value)
      ]?.kategori as string;

      setFormData({
        ...formData,
        aktivitas: pekerjaanToKategori,
        [event.target.name]: event.target.value,
      });
    } else {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
      });
    }
  };

  // fungsi untuk menghitung KKH
  const hitungKKH = () => {
    const {
      berat_badan: berat_badan,
      tinggi_badan: tinggi_badan,
      umur,
      aktivitas,
      jenis_kelamin: jenis_kelamin,
    } = formData;
    let kkh = 0;
    if (jenis_kelamin === "laki-laki") {
      kkh = 66 + 13.7 * berat_badan + 5 * tinggi_badan - 6.8 * umur;
    } else {
      kkh = 655 + 9.6 * berat_badan + 1.8 * tinggi_badan - 4.7 * umur;
    }
    if (aktivitas === "ringan") {
      kkh *= 1.375;
    } else if (aktivitas === "sedang") {
      kkh *= 1.55;
    } else if (aktivitas === "berat") {
      kkh *= 1.725;
    } else if (aktivitas === "sangat berat") {
      kkh *= 1.9;
    }
    return Math.round(kkh);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // if form data === default form data
    if (JSON.stringify(formData) === JSON.stringify(defaultFormData)) {
      toast.error("Data tidak berubah!");
      return;
    }

    setKKH(hitungKKH());

    // axios request data to /api/kkh
    try {
      await axios.post("/api/kkh/create", {
        ...formData,
        berat_badan: Number(formData.berat_badan),
        tinggi_badan: Number(formData.tinggi_badan),
        umur: Number(formData.umur),
        email: session?.user?.email,
        kkh: hitungKKH(),
      });
      toast.success("Data berhasil disimpan!");
    } catch (error) {
      toast.error("Data gagal disimpan!");
    }
    // console.log({
    //   ...formData,
    //   email: session?.user?.email,
    //   kkh: hitungKKH(),
    // });
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)}>
      {/* Berat Badan */}
      <div className="mb-4">
        <label
          className="mb-1 block font-bold text-gray-700"
          htmlFor="berat_badan"
        >
          Berat Badan (kg)
        </label>
        <input
          className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
          id="berat_badan"
          type="number"
          name="berat_badan"
          value={formData.berat_badan}
          onChange={handleInputChange}
          required
          min={20}
        />
      </div>
      {/* Tinggi Badan */}
      <div className="mb-4">
        <label
          className="mb-1 block font-bold text-gray-700"
          htmlFor="tinggi_badan"
        >
          Tinggi Badan (cm)
        </label>
        <input
          className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
          id="tinggi_badan"
          type="number"
          name="tinggi_badan"
          value={formData.tinggi_badan}
          onChange={handleInputChange}
          required
          min={100}
        />
      </div>
      {/* Umur */}
      <div className="mb-4">
        <label className="mb-1 block font-bold text-gray-700" htmlFor="umur">
          Umur (15-80 tahun)
        </label>
        <div className="flex items-center">
          <input
            className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
            id="umur"
            type="number"
            name="umur"
            value={formData.umur}
            onChange={handleInputChange}
            required
            min={15}
          />
          <span className="ml-2 min-w-[25%]">Tahun</span>
        </div>
      </div>
      {/* Aktivitas */}
      <div className="mb-4">
        <label
          className="mb-1 block font-bold text-gray-700"
          htmlFor="pekerjaan"
        >
          Pekerjaan
        </label>
        <select
          className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
          id="pekerjaan"
          name="pekerjaan"
          value={formData.pekerjaan}
          onChange={(e) => void handleInputChange(e)}
          required
        >
          <option value="">Pilih Pekerjaan</option>
          {PEKERJAAN.map((pekerjaan) => (
            <option
              key={pekerjaan.nama_pekerjaan}
              value={pekerjaan.nama_pekerjaan}
            >
              {pekerjaan.nama_pekerjaan}
            </option>
          ))}
        </select>
      </div>
      {/* Jenis Kelamin */}
      <div className="mb-4">
        <label
          className="mb-1 block font-bold text-gray-700"
          htmlFor="jenis_kelamin"
        >
          Jenis Kelamin
        </label>
        <div className="flex justify-between sm:w-[80%]">
          <div className="">
            <input
              type="radio"
              id="lakiLaki"
              name="jenis_kelamin"
              value="laki-laki"
              checked={formData.jenis_kelamin === "laki-laki"}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="lakiLaki" className="ml-2">
              Laki-laki
            </label>
          </div>
          <div className="">
            <input
              type="radio"
              id="perempuan"
              name="jenis_kelamin"
              value="perempuan"
              checked={formData.jenis_kelamin === "perempuan"}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="perempuan" className="ml-2">
              Perempuan
            </label>
          </div>
        </div>
      </div>
      {/* Hitung KKH */}
      <div className="flex items-center justify-between">
        <button
          className={`focus:shadow-outline rounded py-2 px-4 font-bold text-white focus:outline-none ${
            submit
              ? "bg-blue-500 opacity-100 hover:bg-blue-600"
              : "cursor-not-allowed bg-gray-500 opacity-50"
          }`}
          type="submit"
          disabled={!submit}
        >
          Hitung KKH
        </button>
      </div>
    </form>
  );
}

export default DataDiri;
