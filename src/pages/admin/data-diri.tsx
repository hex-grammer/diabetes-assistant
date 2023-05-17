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
  setRumusKKH?: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setIMT?: React.Dispatch<React.SetStateAction<number>>;
  setRumusIMT?: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setBBIdeal?: React.Dispatch<React.SetStateAction<number>>;
  setRumusBBI?: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setAMB?: React.Dispatch<React.SetStateAction<number>>;
  setRumusAMB?: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setTabelKKH?: React.Dispatch<React.SetStateAction<kkh[] | null>>;
  setRekomendasiMenu?: React.Dispatch<React.SetStateAction<string[] | null>>;
  setKategoriIMT?: React.Dispatch<React.SetStateAction<string>>;
  updateData?: boolean;
  kalkulator?: boolean;
}

function DataDiri({
  setKKH,
  setRumusKKH,
  setRumusIMT,
  setIMT,
  setBBIdeal,
  setRumusBBI,
  setAMB,
  setRumusAMB,
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
  const hitungKKH = (): [number, React.ReactNode] => {
    const { berat_badan, tinggi_badan, umur, aktivitas, jenis_kelamin } =
      formData;
    let kkh = 0;

    const factor = jenis_kelamin === "laki-laki" ? 66 : 655;
    const factor1 = jenis_kelamin === "laki-laki" ? 13.7 : 9.6;
    const factor2 = jenis_kelamin === "laki-laki" ? 5 : 1.8;
    const factor3 = jenis_kelamin === "laki-laki" ? 6.8 : 4.7;
    kkh =
      factor + factor1 * berat_badan + factor2 * tinggi_badan - factor3 * umur;

    switch (aktivitas) {
      case "ringan":
        kkh *= 1.375;
        break;
      case "sedang":
        kkh *= 1.55;
        break;
      case "berat":
        kkh *= 1.725;
        break;
      case "sangat berat":
        kkh *= 1.9;
        break;
      default:
        break;
    }

    kkh = Math.round(kkh);

    const formula = (
      <div className="mt-1 font-mono text-blue-700">
        <p>Jenis Kelamin = {jenis_kelamin}</p>
        <p>
          kkh = {factor} + ({factor1} * berat_badan) + ({factor2} *
          tinggi_badan) - ({factor3} * umur)
        </p>
        <p>kkh = {kkh} kkal/hari</p>
      </div>
    );

    return [kkh, formula];
  };

  // fungsi untuk menghitung IMT
  const hitungIMT = (): [number, React.ReactNode] => {
    const { berat_badan, tinggi_badan } = formData;
    const imt = berat_badan / ((tinggi_badan / 100) * (tinggi_badan / 100));
    const imtRounded = Math.round((imt + Number.EPSILON) * 100) / 100;

    const formula = (
      <div className="mt-1 font-mono text-blue-700">
        <p>IMT = berat_badan / ((tinggi_badan / 100) * (tinggi_badan / 100))</p>
        <p>
          IMT = {berat_badan} / (({tinggi_badan} / 100) * ({tinggi_badan} /
          100))
        </p>
        <p>IMT = {imtRounded}</p>
      </div>
    );

    return [imtRounded, formula];
  };

  // fungsi untuk menghitung Kategori IMT
  const hitungKategoriIMT = () => {
    const imt = hitungIMT()[0];
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
  const hitungBBIdeal = (): [number, React.ReactNode] => {
    const { tinggi_badan, jenis_kelamin } = formData;
    let bbIdeal: number;

    bbIdeal = tinggi_badan - 100 - (tinggi_badan - 100) * (10 / 100);
    bbIdeal = parseInt(bbIdeal.toFixed(2));

    const formula = (
      <div className="mt-1 font-mono text-blue-700">
        <p>Tinggi Badan = {tinggi_badan} cm</p>
        <p>Jenis Kelamin = {jenis_kelamin}</p>
        <p>BBI = (Tinggi Badan-100)-((Tinggi Badan-100)*10%)</p>
        <p>
          BBI = ({tinggi_badan}-100)-(({tinggi_badan}-100)*10%)
        </p>
        <p>BBI = {bbIdeal} kg</p>
      </div>
    );

    return [bbIdeal, formula];
  };

  // fungsi untuk menghitung angka metabolisme basal
  const hitungAMB = (): [number, React.ReactNode] => {
    const { berat_badan, tinggi_badan, umur, jenis_kelamin, aktivitas } =
      formData;
    let amb = 0;
    let formula = <></>;
    let bbi: number;

    bbi = tinggi_badan - 100 - (tinggi_badan - 100) * (10 / 100);
    bbi = parseInt(bbi.toFixed(2));

    // Initial amb
    amb = jenis_kelamin === "laki-laki" ? bbi * 30 : bbi * 25;

    // Adjust AMB based on PERKENI formula for age
    if (umur >= 40 && umur < 60) {
      amb -= amb * (5 / 100);
    } else if (umur >= 60 && umur < 70) {
      amb -= amb * (10 / 100);
    } else if (umur >= 70) {
      amb -= amb * (20 / 100);
    }

    // Adjust AMB based on PERKENI formula for activity level
    if (aktivitas === "istirahat") {
      amb += amb * (5 / 100);
    } else if (aktivitas === "ringan") {
      amb += amb * (10 / 100);
    } else if (aktivitas === "sedang") {
      amb += amb * (30 / 100);
    } else if (aktivitas === "berat") {
      amb += amb * (40 / 100);
    } else if (aktivitas === "sangat berat") {
      amb += amb * (50 / 100);
    }

    formula = (
      <div className="mt-1 font-mono text-blue-700">
        <p>JK = {jenis_kelamin}</p>
        <p>
          AMB ={" "}
          {jenis_kelamin === "laki-laki"
            ? "BBI x 30 kalori"
            : "BBI x 25 kalori"}
        </p>
        <p>
          Umur = {umur}
          {umur < 40 && <span>( AMB -= 0%)</span>}
          {umur >= 40 && umur < 60 && <span>( AMB -= 5%)</span>}
          {umur >= 60 && umur < 70 && <span>( AMB -= 10%)</span>}
          {umur >= 70 && <span>( AMB -= 20%)</span>}
        </p>
        <p>
          Aktivitas = {aktivitas}
          {aktivitas === "istirahat" && <span> (AMB += 5%)</span>}
          {aktivitas === "ringan" && <span> (AMB += 10%)</span>}
          {aktivitas === "sedang" && <span> (AMB += 30%)</span>}
          {aktivitas === "berat" && <span> (AMB += 40%)</span>}
          {aktivitas === "sangat berat" && <span> (AMB += 50%)</span>}
        </p>
        <p>AMB = {amb} kalori</p>
      </div>
    );

    return [amb, formula];
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

    // update KKH
    const [nilaiKKH, rumusKKH] = hitungKKH();
    setKKH && typeof nilaiKKH === "number" && setKKH(nilaiKKH);
    setRumusKKH && setRumusKKH(rumusKKH);
    // update IMT
    const [nilaiIMT, rumusIMT] = hitungIMT();
    setIMT && typeof nilaiIMT === "number" && setIMT(nilaiIMT);
    setRumusIMT && setRumusIMT(rumusIMT);
    // update BBI
    setBBIdeal && setBBIdeal(hitungBBIdeal()[0]);
    setRumusBBI && setRumusBBI(hitungBBIdeal()[1]);
    // update AMB
    setAMB && setAMB(hitungAMB()[0]);
    setRumusAMB && setRumusAMB(hitungAMB()[1]);

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
