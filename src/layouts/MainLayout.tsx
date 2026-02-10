import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import TopBar from "../components/Topbar2/Topbar";

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh", 
                    alignItems:"center",
                    display: "flex", 
                    flexDirection: "column" }}>
        <TopBar />
        <div style={{ flex: 1, display: "flex", 
                      justifyContent: "center", 
                      minWidth:1400,
                      padding: "20px" }}>
          <Outlet />
        </div>
        <Footer />                      
    </Layout>
  );
};

export default MainLayout;
