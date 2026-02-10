import { Layout, Menu } from "antd";
import {
  HomeOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;

const ClientLayout = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" , width:"100%"}}>
      <Sider collapsible trigger={null} theme="light">
        <div style={{textAlign: "center", padding: 16 }}>
          🏠 Người dùng
        </div>

        <Menu
          mode="inline"
          defaultSelectedKeys={["address"]}
          items={[
            {
              key: "address",
              icon: <HomeOutlined />,
              label: "Address",
              onClick: () => navigate("/user/address"),
            },
            {
              key: "orders",
              icon: <HomeOutlined />,
              label: "Orders",
              onClick: () => navigate("/user/orders"),
            }, 
            {
              key: "test",
              icon: <HomeOutlined />,
              label: "Test",
              onClick: () => navigate("/user/test"),
            },
          ]}
        />
      </Sider>

      <Layout style={{ width: "100%" }}>
        <Content style={{ paddingLeft: 16 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ClientLayout;
