import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface FormData {
  beratBadan: number;
  tinggiBadan: number;
  umur: number;
  aktivitas: string;
  jenisKelamin: string;
}
interface DataDiriProps {
  setKKH: React.Dispatch<React.SetStateAction<number>>;
}

function DataDiri({ setKKH }: DataDiriProps) {
  const [submit, setSubmit] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    beratBadan: 20,
    tinggiBadan: 100,
    umur: 15,
    aktivitas: "",
    jenisKelamin: "",
  });

  // set submit true jika formData berubah dan tidak kosong
  useEffect(() => {
    if (
      formData.beratBadan &&
      formData.tinggiBadan &&
      formData.umur &&
      formData.aktivitas &&
      formData.jenisKelamin
    ) {
      setSubmit(true);
    } else {
      setSubmit(false);
    }
  }, [formData]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // fungsi untuk menghitung KKH
  const hitungKKH = () => {
    const { beratBadan, tinggiBadan, umur, aktivitas, jenisKelamin } = formData;
    let kkh = 0;
    if (jenisKelamin === "laki-laki") {
      kkh = 66 + 13.7 * beratBadan + 5 * tinggiBadan - 6.8 * umur;
    } else {
      kkh = 655 + 9.6 * beratBadan + 1.8 * tinggiBadan - 4.7 * umur;
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formData);
    // set KKH
    setKKH(hitungKKH());
    toast.success("Data berhasil disimpan!");
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Berat Badan */}
      <div className="mb-4">
        <label
          className="mb-1 block font-bold text-gray-700"
          htmlFor="beratBadan"
        >
          Berat Badan (kg)
        </label>
        <input
          className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
          id="beratBadan"
          type="number"
          name="beratBadan"
          value={formData.beratBadan}
          onChange={handleInputChange}
          required
          min={20}
        />
      </div>
      {/* Tinggi Badan */}
      <div className="mb-4">
        <label
          className="mb-1 block font-bold text-gray-700"
          htmlFor="tinggiBadan"
        >
          Tinggi Badan (cm)
        </label>
        <input
          className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
          id="tinggiBadan"
          type="number"
          name="tinggiBadan"
          value={formData.tinggiBadan}
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
          htmlFor="aktivitas"
        >
          Jenis Aktivitas
        </label>
        <select
          className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
          id="aktivitas"
          name="aktivitas"
          value={formData.aktivitas}
          onChange={(e) => void handleInputChange(e)}
          required
        >
          <option value="">Pilih Aktivitas</option>
          <option value="ringan">Ringan</option>
          <option value="sedang">Sedang</option>
          <option value="berat">Berat</option>
        </select>
      </div>
      {/* Jenis Kelamin */}
      <div className="mb-4">
        <label
          className="mb-1 block font-bold text-gray-700"
          htmlFor="jenisKelamin"
        >
          Jenis Kelamin
        </label>
        <div className="flex justify-between sm:w-[80%]">
          <div className="">
            <input
              type="radio"
              id="lakiLaki"
              name="jenisKelamin"
              value="laki-laki"
              checked={formData.jenisKelamin === "laki-laki"}
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
              name="jenisKelamin"
              value="perempuan"
              checked={formData.jenisKelamin === "perempuan"}
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
