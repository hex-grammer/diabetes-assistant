import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
import type { User, kkh } from "@prisma/client";

interface FormData {
  id_kkh?: number;
  berat_badan: number;
  tinggi_badan: number;
  umur: number;
  pekerjaan: string;
  aktivitas: string;
  jenis_kelamin: string;
  kkh?: number;
  imt?: number;
  email?: string | null;
}

type Pekerjaan = {
  nama_pekerjaan: string;
  aktivitas: string;
};

interface DataDiriProps {
  setKKH?: React.Dispatch<React.SetStateAction<number>>;
  setIMT?: React.Dispatch<React.SetStateAction<number>>;
  setBBIdeal?: React.Dispatch<React.SetStateAction<number>>;
  setAMB?: React.Dispatch<React.SetStateAction<number>>;
  setTabelKKH?: React.Dispatch<React.SetStateAction<kkh[] | null>>;
  setRekomendasiMenu?: React.Dispatch<React.SetStateAction<string[] | null>>;
  setKategoriIMT?: React.Dispatch<React.SetStateAction<string>>;
  updateData?: boolean;
  kalkulator?: boolean;
}

function DataDiri({
  setKKH,
  setIMT,
  setBBIdeal,
  setAMB,
  setTabelKKH,
  setRekomendasiMenu,
  setKategoriIMT,
  updateData,
  kalkulator,
}: DataDiriProps) {
  const [submit, setSubmit] = useState(false);
  const { data: session } = useSession();
  const [updateTable, setUpdateTable] = useState(false);
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
  const [tabelPekerjaan, setTabelPekerjaan] = useState<Pekerjaan[]>([
    {
      nama_pekerjaan: "",
      aktivitas: "",
    },
  ]);

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

  // set submit true jika formData berubah dan tidak kosong
  useEffect(() => {
    if (kalkulator) {
      setSubmit(true);
      return;
    }
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
    // get user from local storage
    const user = JSON.parse(localStorage.getItem("user") || "{}") as User;
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
          setKKH && setKKH(res.data[0]?.kkh || 0);
          setIMT && setIMT(res.data[0]?.imt || 0);
          setKategoriIMT && setKategoriIMT(hitungKategoriIMT() || "");
          setTabelKKH && setTabelKKH(res.data);
          setFormData(
            res.data[0] || {
              berat_badan: 20,
              tinggi_badan: 100,
              umur: 15,
              pekerjaan: "",
              aktivitas: "",
              jenis_kelamin: "",
              imt: 0,
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
              imt: 0,
            }
          );
        });

      void axios
        .get("/api/pekerjaan/getAll")
        .then((res: { data: Pekerjaan[] }) => {
          setTabelPekerjaan(res.data);
        });
    } catch (error) {}
  }, [updateTable]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    // jika target name adalah pekerjaan, maka ubah aktivitas sesuai dengan pekerjaan
    if (event.target.name === "pekerjaan") {
      const pekerjaanToKategori = tabelPekerjaan[
        tabelPekerjaan.map((p) => p.nama_pekerjaan).indexOf(event.target.value)
      ]?.aktivitas as string;

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

  // fungsi untuk menghitung IMT
  const hitungIMT = () => {
    const { berat_badan: berat_badan, tinggi_badan: tinggi_badan } = formData;
    const imt = berat_badan / ((tinggi_badan / 100) * (tinggi_badan / 100));
    // limit decimal to 2
    return Math.round((imt + Number.EPSILON) * 100) / 100;
  };

  // fungsi untuk menghitung Kategori IMT
  const hitungKategoriIMT = () => {
    const imt = hitungIMT();
    if (imt < 17) {
      setRekomendasiMenu &&
        setRekomendasiMenu([
          MAKANAN.M001,
          MAKANAN.M002,
          MAKANAN.M004,
          MAKANAN.M006,
          MAKANAN.M008,
          MAKANAN.M009,
          MAKANAN.M014,
          MAKANAN.M016,
          MAKANAN.M017,
          MAKANAN.M018,
          MAKANAN.M019,
          MAKANAN.M020,
          MAKANAN.M023,
        ]);
      return "Sangat Kurus";
    } else if (imt >= 17 && imt <= 18.5) {
      setRekomendasiMenu &&
        setRekomendasiMenu([
          MAKANAN.M001,
          MAKANAN.M002,
          MAKANAN.M006,
          MAKANAN.M008,
          MAKANAN.M009,
          MAKANAN.M010,
          MAKANAN.M013,
          MAKANAN.M019,
          MAKANAN.M021,
          MAKANAN.M022,
          MAKANAN.M023,
          MAKANAN.M024,
        ]);
      return "Kurus";
    } else if (imt >= 18.5 && imt <= 25) {
      setRekomendasiMenu &&
        setRekomendasiMenu([
          MAKANAN.M001,
          MAKANAN.M006,
          MAKANAN.M007,
          MAKANAN.M008,
          MAKANAN.M009,
          MAKANAN.M010,
          MAKANAN.M011,
          MAKANAN.M014,
          MAKANAN.M018,
        ]);
      return "Normal";
    } else if (imt >= 25 && imt <= 27) {
      setRekomendasiMenu &&
        setRekomendasiMenu([
          MAKANAN.M001,
          MAKANAN.M006,
          MAKANAN.M009,
          MAKANAN.M010,
          MAKANAN.M014,
        ]);
      return "Gemuk";
    } else if (imt >= 27) {
      setRekomendasiMenu &&
        setRekomendasiMenu([
          MAKANAN.M001,
          MAKANAN.M008,
          MAKANAN.M014,
          MAKANAN.M015,
        ]);
      return "Obesitas";
    }
  };

  // Fungsi hitung berat badan ideal
  const hitungBBIdeal = () => {
    const { tinggi_badan: tinggi_badan, jenis_kelamin: jenis_kelamin } =
      formData;
    let bbIdeal;
    if (jenis_kelamin === "pria") {
      bbIdeal = tinggi_badan - 100 - 0.1 * (tinggi_badan - 100);
    } else {
      bbIdeal = tinggi_badan - 100 - 0.15 * (tinggi_badan - 100);
    }

    return parseInt(bbIdeal.toFixed(2));
  };

  // fungsi untuk menghitung angka metabolisme basal
  const hitungAMB = () => {
    const {
      berat_badan: berat_badan,
      tinggi_badan: tinggi_badan,
      umur,
      jenis_kelamin: jenis_kelamin,
    } = formData;
    let amb = 0;

    // Hitung AMB berdasarkan rumus Harris-Benedict
    if (jenis_kelamin === "laki-laki") {
      amb = 88.362 + 13.397 * berat_badan + 4.799 * tinggi_badan - 5.677 * umur;
    } else if (jenis_kelamin === "perempuan") {
      amb = 447.593 + 9.247 * berat_badan + 3.098 * tinggi_badan - 4.33 * umur;
    }

    return parseInt(amb.toFixed(2));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // if form data === default form data
    if (
      JSON.stringify(formData) === JSON.stringify(defaultFormData) &&
      !kalkulator
    ) {
      toast.error("Data tidak berubah!");
      return;
    }

    setKKH && setKKH(hitungKKH());
    setIMT && setIMT(hitungIMT());
    setBBIdeal && setBBIdeal(hitungBBIdeal());
    setAMB && setAMB(hitungAMB());

    // get user from local storage
    const user = JSON.parse(localStorage.getItem("user") || "{}") as User;

    if (!updateData) return;

    // axios request data to /api/kkh
    try {
      await axios.post("/api/kkh/create", {
        ...formData,
        berat_badan: Number(formData.berat_badan),
        tinggi_badan: Number(formData.tinggi_badan),
        umur: Number(formData.umur),
        email: session?.user?.email,
        username: user.username,
        kkh: hitungKKH(),
        imt: hitungIMT(),
      });
      setUpdateTable((t) => !t);
      toast.success("Data berhasil disimpan!");
    } catch (error) {
      toast.error("Data gagal disimpan!");
    }
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
          {tabelPekerjaan.map((pekerjaan) => (
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
          {kalkulator ? "Hitung" : "Hitung KKH"}
        </button>
      </div>
    </form>
  );
}

export default DataDiri;
