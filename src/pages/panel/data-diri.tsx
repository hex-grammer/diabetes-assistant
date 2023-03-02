import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Layout from "../Layout";

interface FormData {
  beratBadan: number;
  tinggiBadan: number;
  umur: number;
  aktivitas: string;
  jenisKelamin: string;
}

function DataDiri() {
  const router = useRouter();
  const paths = router.pathname.split("/").slice(2);
  // activate submit usestate
  const [submit, setSubmit] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    beratBadan: 20,
    tinggiBadan: 100,
    umur: 10,
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formData);
    // tambahkan logika untuk mengirim data ke backend
    toast.success("Data berhasil disimpan!");
  };

  return (
    <Layout>
      <>
        <div className="relative grid h-fit w-full grid-cols-1 gap-2 p-6 sm:grid-cols-6">
          <div className="col-span-full mb-2">
            <h1 className="text-center text-2xl font-bold uppercase">
              {paths}
            </h1>
          </div>
          <div className="col-span-2 rounded-md bg-gray-50 p-4 px-6 shadow-md sm:col-start-3 sm:py-6 sm:px-12">
            <form onSubmit={handleSubmit}>
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
              <div className="mb-4">
                <label
                  className="mb-1 block font-bold text-gray-700"
                  htmlFor="umur"
                >
                  Umur
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
                    min={10}
                  />
                  <span className="ml-2 min-w-[25%]">Tahun</span>
                </div>
              </div>
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
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default DataDiri;

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
