import Layout from "../Layout";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MateriCard from "../../components/MateriCard";
import { IoMdAddCircleOutline } from "react-icons/io";
import { getSession } from "next-auth/react";

function Materi() {
  const MATERI = [
    {
      id: 1,
      title: "Abjad BISINDO",
      image: "https://loremflickr.com/250/150/hand?random=1",
    },
    {
      id: 2,
      title: "Kamus BISINDO",
      image: "https://loremflickr.com/250/150/hand?random=2",
    },
    {
      id: 3,
      title: "Kalimat Perkenalan",
      image: "https://loremflickr.com/250/150/hand?random=3",
    },
    {
      id: 4,
      title: "Kalimat Sapaan",
      image: "https://loremflickr.com/250/150/hand?random=4",
    },
    {
      id: 5,
      title: "Pertanyaan Umum",
      image: "https://loremflickr.com/250/150/hand?random=5",
    },
  ];

  return (
    <Layout>
      <>
        <div className="relative grid h-fit w-full grid-cols-1 gap-4 p-6 sm:grid-cols-4">
          <div className="col-span-full mb-2">
            <h1 className="text-center text-2xl font-bold">DAFTAR MATERI</h1>
          </div>
          {MATERI.map((materi) => (
            <MateriCard
              key={materi.id}
              title={materi.title}
              image={materi.image}
            />
          ))}
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default Materi;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  console.log(session?.user);
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
