import Layout from "./Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Admin() {
  return (
    <Layout>
      <>
        {/* say wellcome */}
        <div className="flex flex-col items-center justify-center p-6">
          {/* <h1 className="text-2xl font-bold">Selamat Datang, {props.userData.name}</h1> */}
          <h1 className="text-2xl font-bold">Selamat Datang, Admin</h1>
        </div>
        <ToastContainer position="top-right" />
      </>
    </Layout>
  );
}

export default Admin;
