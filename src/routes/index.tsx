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
import CustomerAddressPage from "../pages/Client/Dashboard/Address/CustomerAddressPage";
import CheckoutPage from "../pages/Client/CheckoutPage";
import OrderListPage from "../pages/Client/Dashboard/Oder";
import MainContent from "../pages/Client/HomePage";
import ProductDetail from "../pages/Client/ProductDetailPage/ProductDetailPage";
import Test from "../pages/Admin/test";
import BrandsPage from "../pages/Admin/Brand/BrandsPage";
// import HomepageConfigPage from "../pages/Admin/Config/Homepageconfigpage";
import ChatBot from "../pages/Chat/ChatBot";
import CategoryPage from "../pages/Client/CategoryPage";
import AboutShop from "../pages/Client/AboutShop/AboutShop";
import OrdersPage from "../pages/Admin/Order";
import ClientLayout from "../layouts/ClientLayout";
import BrandPage from "../pages/Client/BrandPage";
import CreatePostPage from "../pages/Admin/SEO/CreatePost";
import SearchPage from "../pages/Client/SearchPage";
import PostDetailPage from "../pages/Client/PostDetail/PostPage";
import PostsPage from "../pages/Client/Post";
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import BannerManager from "../pages/Admin/Banner";
import SupportWidget from "../components/Support";
import ChatManagePage from "../pages/Admin/ChatManager";
import ProfilePage from "../pages/Client/Dashboard/Profile/Profile";
import PaymentSuccess from "../pages/Client/PaymentStatus/Success";
import ReviewManagePage from "../pages/Admin/Review/ReviewManagePage";
import WishlistPage from "../pages/Client/WishListPage/WishlistPage";

export const router = createBrowserRouter([
  {
    // Tất cả routes đều có Topbar
    element: (
      <AuthProvider>
        <MainLayout />
        <ChatBot></ChatBot>
        <SupportWidget></SupportWidget>
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
        path: "/products/:id",
        element: <ProductDetail />,
      },
       {
        path: "/post/:id",
        element: <PostDetailPage />,
      },
      {
        path: "success",
        element: <PaymentSuccess />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/post",
        element: <PostsPage />,
      },
      {
        path: "wish-list",
        element: <WishlistPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "/user",
        element: <PrivateRoute>
                    <ClientLayout/>
                  </PrivateRoute>,
        children: [
          {
            path: "profile",
            element: <ProfilePage />,
            index: true,
          },
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
      // Catch all
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <AuthProvider>
        <OwnerLayout></OwnerLayout>
      </AuthProvider>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
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
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "configs",
        element: <BannerManager />,
      },
      {
        path: "reviews",
        element: <ReviewManagePage />,
      },
      {
        path: "chat-manager",
        element: <ChatManagePage />,
      },
      {
        path: "post",
        element: <CreatePostPage />,
      },
      {
        path: "test",
        element: <Test />,
      }
    ],
  }
]);