import React from "react";
import Layout from "./Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { User } from "@prisma/client";
import useSWR, { mutate } from "swr";
import { MdOutlineDelete } from "react-icons/md";

type SelectorType = "email" | "username";

const fetcher = (apiURL: string) => fetch(apiURL).then((res) => res.json());

const UserPage: React.FC = () => {
  const { data, isLoading } = useSWR<User[]>("/api/user/getall", fetcher);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleDelete = async (
    username: string | null,
    email: string | null
  ) => {
    const idType = username ? "username" : "email";
    const userId = username || email;
    if (
      !confirm(
        `Yakin ingin menghapus data user dengan ID: ${userId as string}?`
      )
    )
      return;
    try {
      await fetch(`/api/user/delete?${idType}=${userId as string}`, {
        method: "DELETE",
      });

      toast.success("Data user berhasil dihapus!");
      // Refresh the user data by re-fetching
      void mutate("/api/user/getall");
    } catch (error) {
      toast.error("Error deleting user!");
    }
  };

  console.log(data);
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <>
        <div className="relative grid h-fit w-full grid-cols-1 gap-4 p-6 sm:grid-cols-6">
          <div className="rounded-md bg-gray-100 p-4 shadow-md sm:col-span-4 sm:col-start-2">
            <h1 className="mb-4 text-2xl font-semibold uppercase">User Data</h1>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-12 rounded-md border bg-gray-50 p-2 shadow-md"
                >
                  <p className="col-span-3">Nama</p>
                  <p className="col-span-7 truncate">: {user.name}</p>
                  <div className="row-span-2 flex h-full px-1">
                    <button
                      onClick={() =>
                        void handleDelete(user.username, user.email)
                      }
                      className="col-span-2 rounded-md bg-red-500 px-2 py-1 text-xl text-white"
                    >
                      <MdOutlineDelete />
                    </button>
                  </div>
                  <p className="col-span-3">UserID</p>
                  <p className="col-span-7 truncate">
                    : {user.username || user.email}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
};

export default UserPage;
