import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import Layout from "./Layout";
import Alert from "../../components/Alert";
import { PrismaClient } from "@prisma/client";
import Warning from "../../components/Warning";
import Success from "../../components/Success";
import { useGlobalContext } from "../../lib/GlobalContext";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useSWR from "swr";

// type Props = {
//   userData: {
//     id?: string | null;
//     name?: string | null;
//     email?: string | null;
//     emailVerified?: string | null;
//     image?: string | null;
//     jkel?: string | null;
//     agama?: string | null;
//     tgl_lahir?: string | null;
//     whatsapp?: string | null;
//     provinsi?: string | null;
//     kota_kabupaten?: string | null;
//     kecamatan?: string | null;
//     kelurahan?: string | null;
//     kode_domisili?: string | null;
//     pekerjaan?: string | null;
//     instansi?: string | null;
//     pendidikan?: string | null;
//     pengalaman?: string | null;
//     ver_image?: string | null;
//   };
// };

// function Admin(props: Props) {
function Admin() {
  return (
    <Layout>
      <>
        {/* say wellcome */}
        <div className="flex flex-col items-center justify-center">
          {/* <h1 className="text-2xl font-bold">Selamat Datang, {props.userData.name}</h1> */}
          <h1 className="text-2xl font-bold">Selamat Datang, Admin</h1>
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default Admin;

// export async function getServerSideProps(context:any) {
//   const session = await getSession(context);
//   if (!session) {
//     return {
//       redirect: {
//         destination: "",
//         permanent: false,
//       },
//     };
//   }

//   const prisma = new PrismaClient();

//   let userData = await prisma.user.findUnique({
//     where: {
//       email: session?.user?.email || "",
//     },
//   });
//   userData = await JSON.parse(JSON.stringify(userData));

//   return {
//     props: {
//       session,
//       userData,
//     },
//   };
// }
