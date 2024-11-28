import { createBrowserRouter } from "react-router-dom";
import pages from "../pages";
import layout from "../layouts";
import Try from "../pages/Try";
import { loadLibraryNodes } from "./loaders";

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
        path: "library/:id?",
        element: <Library />,
        loader: loadLibraryNodes,
      },
      {
        path: "try",
        element: <Try />
      }
    ]
  }
])