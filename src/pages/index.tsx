import { type NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Diabetes Assistant</title>
        <meta
          name="description"
          content="Aplikasi ini dirancang untuk membantu pasien Diabetes Melitus dalam menghitung kadar kalori harian yang dibutuhkan."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-end justify-start bg-[url('/background.jpg')] from-[#023047] to-[#219ebc] bg-cover bg-center px-6 sm:px-24">
        {/* HEADING/NAVBAR LOGO ON THE LEFT, SIGN IN AND SIGN UP ON THE RIGHT */}
        {/* <div className="flex w-full items-center justify-between p-4 sm:px-12">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="logo" className="h-10 w-10" />
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              BISINDO
            </h1>
          </div>
          <div
            onClick={() =>
              // void signIn("google", {
              //   callbackUrl: "/materi",
              // })
              void signOut({
                callbackUrl: "/login",
              })
            }
            className="cursor-pointer rounded-full border-2 border-gray-200 p-1 px-4 font-medium tracking-tight text-white hover:bg-gray-200 hover:font-bold hover:text-blue-700"
          >
            Mulai Belajar
          </div>
        </div> */}
        {/* landing page main text */}
        <div className="container flex h-[100vh] w-[80%] flex-col items-end justify-start gap-2 px-4 py-24 text-right font-medium text-gray-700 sm:w-[50%] sm:gap-4 sm:py-16">
          <h1 className="text-xl font-bold tracking-widest sm:text-5xl">
            Aplikasi Pemenuhan Kebutuhan Gizi Pada Penderita{" "}
            <span className="italic text-[#fb8500]">Diabetes Melitus</span>
          </h1>
          <p className="text-md font-medium tracking-tight text-green-600 sm:text-[20px]">
            Kontrol konsumsi kalori harianmu sekarang!
          </p>
          <div
            onClick={() => void router.push("/daftar")}
            className="cursor-pointer rounded-full border-2 border-green-600 p-1 px-4 font-medium tracking-tight text-green-600 duration-100 hover:bg-green-600 hover:px-8 hover:font-bold hover:text-white hover:shadow-lg"
          >
            Mulai
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
