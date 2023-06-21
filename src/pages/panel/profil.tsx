"use client";

import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { User } from "@prisma/client";
import useSWR, { mutate } from "swr";
import { BiEdit } from "react-icons/bi";
import { MdOutlineCancel } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useSession } from "next-auth/react";

const fetcher = (apiURL: string) => fetch(apiURL).then((res) => res.json());

type userType = {
  user: User;
};

const UserPage: React.FC = () => {
  const { data: session } = useSession();
  const { data, isLoading } = useSWR<userType>(
    `/api/user/getByUserId?email=${
      session?.user?.email || "r124lisone@gmail.com"
    }`,
    fetcher
  );

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(data?.user.name);

  const handleEditClick = () => {
    setName(data?.user.name);
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSaveClick = async () => {
    try {
      const userId = data?.user.username || data?.user.email;
      const userIdType = data?.user.username ? "username" : "email";
      // Send request to update user data
      const response = await fetch("/api/user/update", {
        method: "PUT",
        body: JSON.stringify({ name, [userIdType]: userId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Data updated successfully
        setIsEditing(false);
        // Update the user data in the session
        toast.success("Data user berhasil diupdate!");
        void mutate(
          `/api/user/getByUserId?email=${
            session?.user?.email || "r124lisone@gmail.com"
          }`
        ); // Revalidate the data using SWR
        if (session && session.user) session.user.name = name;
      } else {
        // Handle error case
        console.error("Failed to update user data");
        toast.error("Gagal mengupdate data user!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <>
        <div className="relative grid h-fit w-full grid-cols-1 gap-4 p-6 sm:grid-cols-6">
          <div className="rounded-md bg-gray-100 p-4 shadow-md sm:col-span-4 sm:col-start-2">
            <h1 className="mb-4 text-2xl font-semibold uppercase">Profile</h1>
            {/* <div className="grid gap-4 sm:grid-cols-2"> */}
            {isLoading || !data ? (
              <div>Loading...</div>
            ) : (
              <div
                // key={data.user.id}
                className="grid grid-cols-12 rounded-md border bg-gray-50 p-2 shadow-md"
              >
                <p className="col-span-3 sm:col-span-2">Nama</p>
                {isEditing ? (
                  <div className="col-span-9 flex items-center gap-2 truncate sm:col-span-10">
                    :
                    <input
                      type="text"
                      value={`${name || ""}`}
                      onChange={handleInputChange}
                      className="border-b bg-transparent text-gray-500 outline-none"
                      // on enter press
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          void handleSaveClick();
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        setName(data?.user.name);
                        setIsEditing(false);
                      }}
                      className="text-red-500"
                    >
                      <MdOutlineCancel />
                    </button>
                    <button
                      onClick={() => void handleSaveClick()}
                      className="text-green-600"
                    >
                      <AiOutlineCheckCircle />
                    </button>
                  </div>
                ) : (
                  <div className="col-span-9 flex items-center truncate sm:col-span-10">
                    : {data?.user.name} &nbsp;
                    <BiEdit
                      className="cursor-pointer text-orange-600"
                      onClick={handleEditClick}
                    />
                  </div>
                )}
                {/* <div className="row-span-2 flex h-full px-1">
                  <button
                    onClick={() =>
                      void handleDelete(data.user.username, data.user.email)
                    }
                    className="sm:col-span-2 col-span-3 rounded-md bg-red-500 px-2 py-1 text-xl text-white"
                  >
                    <MdOutlineDelete />
                  </button>
                </div> */}
                <p className="col-span-3 sm:col-span-2">UserID</p>
                <p className="col-span-9 truncate sm:col-span-10">
                  : {data.user.username || data.user.email}
                </p>
              </div>
            )}
            {/* </div> */}
          </div>
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
};

export default UserPage;
