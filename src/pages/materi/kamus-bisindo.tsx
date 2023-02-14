import React, { useRef, useState } from "react";
import Layout from "../Layout";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/router";
import AbjadCard from "../../components/AbjadCard";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";

function KamusBisindo() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const KATEGORI = ["kata benda", "kata kerja", "kata sifat", "nama profesi"];
  const ABJAD = [...new Array<number>(26)].map((_, i) =>
    String.fromCharCode(i + 65)
  );

  //   UseStates
  const [modalLabel, setModalLabel] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("semua");
  const [filteredContent, setFilteredContent] = useState(ABJAD);
  const [activateAdd, setActivateAdd] = useState(false);
  const [editLabel, setEditLabel] = useState("");

  //   focus search on button press
  const focusSearch = () => {
    inputRef?.current?.focus();
  };

  //   filter content
  const filterContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = ABJAD.filter((item) =>
      item.toLowerCase().includes(keyword)
    );
    setFilteredContent(filtered);
  };

  const handleBatalUpdate = () => {
    setActivateAdd(false);
    setEditLabel("");
  };

  return (
    <Layout>
      <>
        <div className="grid h-fit w-full grid-cols-1 gap-2 p-6 sm:grid-cols-6">
          {/* modal */}
          {modalLabel !== "" && (
            <div
              className="fixed top-[10vh] left-0 z-20 hidden h-[92vh] w-full items-center justify-center bg-gray-500 bg-opacity-75 backdrop-blur-sm sm:left-[18%] sm:top-[8vh] sm:flex sm:w-[82%]"
              onClick={() => setModalLabel("")}
            >
              <div className="relative">
                <AiOutlineCloseCircle
                  className="absolute right-0 top-0 z-10 cursor-pointer rounded-tr-md bg-gray-300 bg-opacity-40 p-0.5 text-2xl text-gray-800"
                  onClick={() => setModalLabel("")}
                />
                <AbjadCard
                  title={modalLabel}
                  showModal={() => setModalLabel(modalLabel)}
                  image={`https://loremflickr.com/320/180/${modalLabel}`}
                />
              </div>
            </div>
          )}
          {/* HEADING */}
          <div className="col-span-full mb-2 flex flex-col items-center gap-3">
            <h1 className="text-center text-2xl font-bold">KAMUS BISINDO</h1>
            {/* searchbar */}
            <div className="relative flex w-full justify-center sm:w-1/3">
              <input
                type="text"
                ref={inputRef}
                className="w-full rounded-full border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600"
                onChange={filterContent}
                placeholder="Cari kata..."
              />
              <button
                onClick={focusSearch}
                className="absolute right-0 top-0 mt-0 mr-4 h-full p-2"
              >
                <FiSearch className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
              {/* breadcrum */}
              <div className="py-1">
                <Link href={`/admin/materi`}>/materi/</Link>
                <span className="text-blue-600">kamus-bisindo</span>
              </div>
              {/* Kategori */}
              <div className="flex gap-1">
                <div className="scrollbar-hide flex flex-wrap items-center gap-2">
                  {["semua", ...KATEGORI].map((kategori) => (
                    <div
                      key={kategori}
                      className={`cursor-pointer whitespace-nowrap rounded-full border-2   bg-gray-100 px-3 py-0.5 text-gray-500 ${
                        kategoriAktif === kategori
                          ? "border-blue-600 text-blue-600"
                          : "border-gray-100"
                      }`}
                      onClick={() => setKategoriAktif(kategori)}
                    >
                      {kategori}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Tambah Kata */}
          {/* input judul video and link youtube */}
          {activateAdd || editLabel ? (
            <div className="flex flex-col gap-2 rounded-md bg-gray-500 p-2 duration-200 sm:col-span-2 sm:row-span-2">
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-2 py-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Kata"
                defaultValue={editLabel}
              />
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-2 py-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Kategori"
              />
              {/* Upload gif */}
              <div className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white p-2">
                <label
                  htmlFor="file"
                  className="flex h-full w-full cursor-pointer items-center justify-center gap-1 text-gray-500"
                >
                  Upload GIF
                  <span className="text-blue-500">Browse</span>
                </label>
                <input
                  type="file"
                  id="file"
                  className="hidden"
                  accept="image/gif"
                  onChange={(e) => console.log(e.target.files)}
                />
              </div>
              <div className="flex w-full gap-2">
                {/* batal */}
                <div className="flex justify-end">
                  <button
                    className="rounded-md bg-gray-400 px-2 py-1 text-white"
                    onClick={handleBatalUpdate}
                  >
                    Batal
                  </button>
                </div>
                {/* tambah */}
                <div className="flex justify-end">
                  <button className="rounded-md bg-blue-500 px-2 py-1 text-white">
                    {editLabel ? "Update" : "Tambah"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setActivateAdd(true)}
              className="flex h-full items-center justify-center rounded-md bg-gray-50 py-3 text-[3rem] text-gray-500 transition-all delay-75 hover:text-[4rem] hover:text-blue-500 hover:shadow-md"
            >
              <IoMdAddCircleOutline />
            </div>
          )}
          {/* contents */}
          {filteredContent.map((abjad) => (
            <AbjadCard
              key={abjad}
              title={abjad}
              showModal={() => setModalLabel(abjad)}
              image={`https://loremflickr.com/250/150/${abjad}`}
            />
          ))}
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default KamusBisindo;
