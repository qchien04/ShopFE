import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import TopBar from "../components/Topbar2/Topbar";

const MainLayout = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopBar />

      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "0 16px", // mobile padding
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1400px", // desktop giới hạn
          }}
        >
          <Outlet />
        </div>
      </div>

      <Footer />
    </Layout>
  );
};

export default MainLayout;