// OwnerLayout.tsx
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";

const { Content } = Layout;

const OwnerLayout = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ 
      minHeight: "100vh", 
      width: "100%", 
      display: "flex",
    }}>
      
      {/* Sidebar - Sticky */}
      <div style={{ 
        width: 200,
        flexShrink: 0,
        position: "sticky",
        alignSelf: "flex-start",
        top: 160,
        left:0,
      }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={["products"]}
          style={{
            height: "100%",
            borderRadius: 8,
          }}
          items={[
            {
              key: "products",
              icon: <UnorderedListOutlined />,
              label: "Sản phẩm",
              onClick: () => navigate("/admin/products"),
            },
            {
              key: "categories",
              icon: <UnorderedListOutlined />,
              label: "Danh mục",
              onClick: () => navigate("/admin/categories"),
            },
            {
              key: "brands",
              icon: <UnorderedListOutlined />,
              label: "Brand",
              onClick: () => navigate("/admin/brands"),
            },
            {
              key: "orders",
              icon: <HomeOutlined />,
              label: "Orders",
              onClick: () => navigate("/admin/orders"),
            },
            {
              key: "address",
              icon: <HomeOutlined />,
              label: "Address",
              onClick: () => navigate("/admin/address"),
            },
            
            {
              key: "configs",
              icon: <HomeOutlined />,
              label: "Configs",
              onClick: () => navigate("/admin/configs"),
            },
          ]}
        />
      </div>
      
      {/* Content */}
      <div style={{ 
        flex: 1,
        minWidth: 0,
        paddingLeft: 10,
      }}>
        <Content style={{width:"100%"}}>
          <Outlet />
        </Content>
      </div>
    </div>
  );
};

export default OwnerLayout;