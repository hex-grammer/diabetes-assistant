import Layout from "../Layout";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MateriCard from "../../../components/MateriCard";
import { IoMdAddCircleOutline } from "react-icons/io";
import { getSession } from "next-auth/react";
import { PrismaClient, User } from "@prisma/client";
import { Session } from "next-auth";
import { GetServerSidePropsContext } from "next";

interface MateriProps {
  session: Session;
  userData: User | null;
}

function Materi({ session, userData }: MateriProps) {
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
          <Link
            href={`/admin/materi/tambah-materi`}
            className="flex items-center justify-center rounded-md bg-gray-100 text-[4rem] text-gray-500 transition-all delay-75 hover:text-[5rem] hover:text-blue-500 hover:shadow-md"
          >
            <IoMdAddCircleOutline />
          </Link>
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default Materi;

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

  const prisma = new PrismaClient();

  let userData: User | null = await prisma.user.findUnique({
    where: {
      email: session?.user?.email || "",
    },
  });
  userData = userData ? await JSON.parse(JSON.stringify(userData)) : null;

  return {
    props: {
      session,
      userData,
    },
  };
}
