import React from "react";
import Layout from "./Layout";
import Link from "next/link";

function Dashboard() {
  return (
    <Layout>
      <>
        <div className="relative grid h-fit w-full grid-cols-1 gap-4 p-6 sm:grid-cols-6">
          <div className="col-span-full block rounded-md bg-gray-50 p-4 text-center text-xl font-bold uppercase shadow-md">
            Selamat Datang Admin👋🏻
          </div>
          <div className="block h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-2">
            <div className="mb-2 text-lg font-bold uppercase">
              Tujuan Aplikasi
            </div>
            Aplikasi ini dirancang dengan tujuan utama untuk membantu penderita
            diabetes melitus dalam mengatur kebutuhan kalori harian mereka.
            Selain itu, Anda juga dapat memberikan rekomendasi menu makanan
            harian yang sesuai dengan kebutuhan gizi mereka. Dengan aplikasi
            ini, semoga kita dapat memberikan dukungan yang lebih baik untuk
            penderita diabetes.
          </div>
          <div className="block h-fit rounded-md bg-gray-50 p-4 shadow-md sm:col-span-2">
            <div className="mb-2 text-lg font-bold uppercase">
              Pengertian Diabetes Melitus
            </div>
            Diabetes melitus adalah kondisi dengan tingginya kadar gula darah
            karena kurangnya insulin atau ketidakmampuan tubuh menggunakannya.
            Menjaga pola makan penting untuk mengontrol kadar gula darah dengan
            memilih makanan sehat, menghindari makanan indeks glikemik tinggi,
            dan mengatur asupan nutrisi dengan bijaksana.
          </div>
          <div className="block rounded-md bg-gray-50 p-4 shadow-md sm:col-span-2">
            <div className="mb-2 text-lg font-bold uppercase">
              Fitur-fitur aplikasi
            </div>
            <ul className="list-inside list-none">
              <li>
                <Link
                  className="font-bold text-blue-700"
                  href="/admin/dashboard"
                >
                  Dashboard
                </Link>{" "}
                - Halaman utama aplikasi yang berisi selamat datang admin,
                pengertian diabetes melitus, tujuan aplikasi, dan penjelasan
                fitur-fitur admin.
              </li>
              <li>
                <Link
                  className="font-bold text-blue-700"
                  href="/admin/master-data"
                >
                  Master Data
                </Link>{" "}
                - Halaman yang berisi data pekerjaan dan data makanan yang
                digunakan dalam aplikasi.
              </li>
              <li>
                <Link
                  className="font-bold text-blue-700"
                  href="/admin/history-user"
                >
                  History User
                </Link>{" "}
                - Halaman yang berisi riwayat KKH dari pengguna aplikasi.
              </li>
              <li>
                <Link
                  className="font-bold text-blue-700"
                  href="/admin/data-user"
                >
                  Data User
                </Link>{" "}
                - Halaman yang berisi data pengguna yang telah melakukan login
                ke aplikasi.
              </li>
            </ul>
          </div>
        </div>
      </>
    </Layout>
  );
}

export default Dashboard;
