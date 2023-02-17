import React, { useEffect } from "react";
import Layout from "./Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { PrismaClient, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";

interface AdminProps {
  session: Session;
  userData: User | null;
}

function Admin({ session, userData }: AdminProps) {
  const router = useRouter();
  useEffect(() => {
    void router.push("/admin/materi");
  }, []);

  return (
    <Layout>
      <>
        {/* say wellcome */}
        <div className="grid grid-cols-12 gap-4 p-6">
          <div className="col-span-8 h-20  w-full animate-pulse rounded-md bg-gray-300 text-2xl font-bold" />
          <div className="col-span-4 h-20 w-full animate-pulse rounded-md bg-gray-300 text-2xl font-bold" />
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default Admin;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "",
        permanent: false,
      },
    };
  }

  const prisma = new PrismaClient();

  let userData: Record<string, any> | null = await prisma.user.findUnique({
    where: {
      email: session?.user?.email || "",
    },
  });
  userData = userData ? JSON.parse(JSON.stringify(userData)) : null;

  return {
    redirect: {
      destination: "/admin/materi",
    },
  };
}
