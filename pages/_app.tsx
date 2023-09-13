import { Layout } from "@/components/Layout/Layout";
import { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import "../styles/globals.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <NextNProgress height={6} color="#B0E0E6" />
      <Layout>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default App;
