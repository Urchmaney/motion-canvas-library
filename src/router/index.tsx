import { createBrowserRouter } from "react-router-dom";
import pages from "../pages";
import layout from "../layouts";
import { loadLibraryNodes } from "./loaders";

const { Home, Library, Try } = pages;
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
        path: "try/:componentId?",
        element: <Try />
      }
    ]
  }
])