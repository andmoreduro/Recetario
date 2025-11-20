import { createBrowserRouter } from "react-router-dom"
import Login from "../modules/auth/pages/login"
import Register from "../modules/auth/pages/register"
import Home from "../modules/recipes/pages/home"
import About from "../modules/about/pages/About"
import FAQ from "../modules/about/pages/FAQ"
import Shell from "./layout/shell"
import Profile from "../modules/user/pages/Profile"
import AuthLayout from "./layout/AuthLayout"
import GuestLayout from "./layout/GuestLayout"
import SearchResults from "../modules/recipes/pages/SearchResults"
import Root from "./Root.jsx"

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    element: <GuestLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        element: <Shell />,
        children: [
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: '/home',
            element: <Home />,
          },
          {
            path: '/about',
            element: <About />,
          },
          {
            path: '/search',
            element: <SearchResults />,
          },
          {
            path: '/faq',
            element: <FAQ />,
          },
        ],
      },
    ],
  },
]);
