import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import Layout from "../Layout";
import Alert from "../../../components/Alert";
import { PrismaClient } from "@prisma/client";
import Warning from "../../../components/Warning";
import Success from "../../../components/Success";
import { useGlobalContext } from "../../../lib/GlobalContext";
import { FileUploader } from "react-drag-drop-files";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useSWR from "swr";
import AbjadCard from "../../../components/AbjadCard";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FcAddImage } from "react-icons/fc";
import Breadcrump from "../../../components/Breadcrump";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player/youtube"), {
  ssr: false,
});

function Materi() {
  const router = useRouter();
  const [activateAdd, setActivateAdd] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const [imagePreview, setImagePreview] = useState("");

  let imageExtensions = ["JPG", "JPEG", "PNG", "GIF", "BMP", "WEBP"];

  const handleChangeFile = (file: File) => {
    setFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  return (
    <Layout>
      <>
        <div className="grid h-fit w-full grid-cols-1 gap-4 overflow-hidden p-6 sm:max-h-[92vh] sm:grid-cols-12">
          {/* HEADING */}
          <div className="col-span-full">
            <h1 className="text-center text-2xl font-bold">TAMBAH MATERI</h1>
            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
              <div className="">
                <Link href={`/admin/materi`}>/materi/</Link>
                <span className="text-blue-600">tambah-materi</span>
              </div>
              {/* tombol batal, draf dan simpan */}
              <div className="flex justify-end gap-2">
                <button
                  className="rounded-md bg-gray-400 px-2 py-1 text-white"
                  onClick={() => router.push("/admin/materi")}
                >
                  Cancel
                </button>
                <button className="rounded-md bg-yellow-500 px-2 py-1 text-gray-800">
                  Save as Draf
                </button>
                <button className="rounded-md bg-blue-600 px-2 py-1 text-white">
                  Save
                </button>
              </div>
            </div>
          </div>
          {/* THUMBNAIL */}
          <div className="col-span-full grid h-fit gap-4 sm:col-span-8">
            <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-md bg-gray-100 py-4 sm:min-h-[45vh]">
              {/* preview image before upload */}
              {
                // if imagePreview is not empty
                imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt={file?.name}
                      className="absolute top-0 left-0 w-full rounded-md bg-contain sm:h-full"
                    />
                    {/* replace image */}

                    <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-md bg-gray-600 bg-opacity-50">
                      <FileUploader
                        handleChange={handleChangeFile}
                        name="file"
                        types={imageExtensions}
                        label={"Upload atau geser gambar tumbnail ke area ini"}
                      >
                        <div className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg p-6 text-center text-blue-600 sm:h-44 sm:w-96 sm:p-2">
                          <div className="flex items-center gap-1 text-white">
                            <FcAddImage className="text-xl" /> Ganti Gambar
                          </div>
                          <div className="text-white">
                            gambar <b>thumbnail</b>
                          </div>
                        </div>
                      </FileUploader>
                    </div>
                  </>
                ) : (
                  <FileUploader
                    handleChange={handleChangeFile}
                    name="file"
                    types={imageExtensions}
                    label={"Upload atau geser gambar tumbnail ke area ini"}
                  >
                    <div className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-600 p-6 text-center text-blue-600 sm:h-44 sm:w-96 sm:p-2">
                      <div className="flex items-center gap-1 underline">
                        <FcAddImage className="text-xl" /> Upload atau Geser
                      </div>
                      <div className="">
                        gambar <b>thumbnail</b> ke area ini
                      </div>
                    </div>
                  </FileUploader>
                )
              }
            </div>

            {/* input judul materi */}
            <input
              type="text"
              className="w-full rounded-md px-2 py-1 text-xl font-medium focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Judul Materi"
            />
          </div>
          {/* other videos */}
          <div className="col-span-full flex w-full flex-col gap-2 sm:col-span-4">
            <div className="">
              {/* input judul video and link youtube */}
              {activateAdd ? (
                <div className="flex flex-col gap-2 rounded-md bg-gray-600 p-2">
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Judul Video"
                  />
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Link Youtube"
                  />
                  <div className="flex w-full gap-2">
                    {/* batal */}
                    <div className="flex justify-end">
                      <button
                        className="rounded-md bg-gray-400 px-2 py-1 text-white"
                        onClick={() => setActivateAdd(false)}
                      >
                        Cancel
                      </button>
                    </div>
                    {/* tambah */}
                    <div className="flex justify-end">
                      <button className="rounded-md bg-blue-500 px-2 py-1 text-white">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setActivateAdd(true)}
                  className="flex items-center justify-center rounded-md bg-gray-300 py-3 text-[3rem] text-gray-500 transition-all delay-75 hover:text-[4rem] hover:text-blue-500 hover:shadow-md"
                >
                  <IoMdAddCircleOutline />
                </div>
              )}
            </div>
            <div className="flex max-h-[62vh] flex-col gap-2 overflow-auto rounded-md bg-gray-500 p-2 py-3 text-gray-100">
              {/* keterangan belum ada konten */}
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="text-lg">Belum ada video</div>
                <div className="text-sm">
                  Tambahkan video dengan mengisi form di atas.
                </div>
              </div>
              {/* {[...new Array(10)].map((_, i) => (
                <div className="flex gap-2" key={i}>
                  <ReactPlayer
                    width={120}
                    height={70}
                    playIcon={<div />}
                    controls={false}
                    light={true}
                    url="https://www.youtube.com/watch?v=6_gXiBe9y9A"
                  />
                  Judul Video {i + 1}
                </div>
              ))} */}
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default Materi;
