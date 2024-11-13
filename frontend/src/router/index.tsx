import { createBrowserRouter } from "react-router-dom";
import pages from "../pages";
import layout from "../layouts";
import Try from "../pages/Try";

const { Home, Library } = pages;
const { HomeLayout } = layout;

export default createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "library",
        element: <Library />
      },
      {
        path: "try",
        element: <Try />
      }
    ]
  }
])