// src/routes/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { AuthProvider } from "./AuthProvider";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import OwnerLayout from "../layouts/OwnerLayout";
import ProductsPage from "../pages/Admin/Product/ProductsPage";
import CategoriesPage from "../pages/Admin/Category/CategoriesPage";
import CartPage from "../pages/Client/CartPage";
import CustomerAddressPage from "../pages/Client/Dashboard/CustomerAddressPage";
import CheckoutPage from "../pages/Client/CheckoutPage";
import OrderListPage from "../pages/Client/Dashboard/OrderListPage";
import MainContent from "../pages/Client/HomePage";
import ProductDetail from "../pages/Client/ProductDetailPage/ProductDetailPage";
import Test from "../pages/Admin/test";
import BrandsPage from "../pages/Admin/Brand/BrandsPage";
import HomepageConfigPage from "../pages/Admin/Config/Homepageconfigpage";
import ChatBot from "../pages/Chat/ChatBot";
import CategoryPage from "../pages/Client/CategoryPage";
import AboutShop from "../pages/Client/AboutShop/AboutShop";
import OrdersPage from "../pages/Admin/Order";
import ClientLayout from "../layouts/ClientLayout";
import BrandPage from "../pages/Client/CategoryPage copy";

export const router = createBrowserRouter([
  {
    // Tất cả routes đều có Topbar
    element: (
      <AuthProvider>
        <MainLayout />
        <ChatBot></ChatBot>
      </AuthProvider>
    ),
    children: [
      // Public routes
      {
        path: "/",
        element: <MainContent />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/about",
        element: <AboutShop />,
      },
      {
        path: "/category/:slug",
        element: <CategoryPage />,
      },
      {
        path: "/brand/:slug",
        element: <BrandPage />,
      },
      {
        path: "/product/:id",
        element: <ProductDetail />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/user",
        element: <PrivateRoute>
                    <ClientLayout/>
                  </PrivateRoute>,
        children: [
          {
            path: "address",
            element: <CustomerAddressPage />,
          },
          {
            path: "orders",
            element: <OrderListPage />,
          },
        ],
      },
      {
        path: "/admin",
        element: <PrivateRoute>
                    <OwnerLayout/>
                  </PrivateRoute>,
        children: [
          {
            path: "products",
            element: <ProductsPage />,
          },
          {
            path: "categories",
            element: <CategoriesPage />,
          },
          {
            path: "brands",
            element: <BrandsPage />,
          },
          {
            path: "address",
            element: <CustomerAddressPage />,
          },
          {
            path: "orders",
            element: <OrdersPage />,
          },
          {
            path: "checkout",
            element: <CheckoutPage />,
          },
          {
            path: "configs",
            element: <HomepageConfigPage />,
          },
          {
            path: "test",
            element: <Test />,
          }
        ],
      },
      // Catch all
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);