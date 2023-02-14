import React, { useState } from "react";
import Layout from "../Layout";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AbjadCard from "../../../components/AbjadCard";
import { useRouter } from "next/router";
import { AiOutlineCloseCircle } from "react-icons/ai";

function Materi() {
  const router = useRouter();
  const paths = router.pathname.split("/").slice(2);
  const [modalLabel, setModalLabel] = useState("");
  const ABJAD = [...new Array(26)].map((_, i) => String.fromCharCode(i + 65));
  return (
    <Layout>
      <>
        <div className="relative grid h-fit w-full grid-cols-1 gap-2 p-6 sm:grid-cols-6">
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
          <div className="col-span-full mb-2">
            <h1 className="text-center text-2xl font-bold">ABJAD BISINDO</h1>
            <div>
              <Link href={`/admin/materi`}>/materi/</Link>
              <span className="text-blue-600">abjad-bisindo</span>
            </div>
          </div>
          {ABJAD.map((abjad) => (
            <AbjadCard
              key={abjad}
              title={abjad}
              showModal={() => setModalLabel(abjad)}
              image={`https://loremflickr.com/250/150/${abjad}`}
            />
          ))}
          {/* <Link
            href={`/admin/materi/tambah-materi`}
            className="flex items-center justify-center rounded-md bg-gray-100 text-[4rem] text-gray-500 transition-all delay-75 hover:text-[5rem] hover:text-blue-500 hover:shadow-md"
          >
            <IoMdAddCircleOutline />
          </Link> */}
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default Materi;
