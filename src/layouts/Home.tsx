import { Link, Outlet } from "react-router-dom";
import GithubIcon from "../components/icons/Github";
import { MotionCanvasLibraryIcon } from "../components/icons";
import { ToastContainer } from "react-toastify";

export default function HomeLayout() {
  return (
    <div>
      <div className="absolute h-screen w-32 bg-right-curtain bg-contain bg-no-repeat left-0 animate-upward top-0 -z-10">

      </div>

      <div className="absolute h-screen w-32 bg-left-curtain bg-contain bg-no-repeat right-0 animate-upward top-0 -z-10">

      </div>
      <div className="container h-screen mx-auto px-2">
      <ToastContainer />
        <div className="py-3 flex justify-between sticky top-0 z-10 bg-transparent backdrop-filter backdrop-blur-sm bg-opacity-40 border-b border-[#E2E9ED]">
          <div className="flex items-center gap-8">
            <Link to={"/"}>
              <div className="flex items-center gap-2 text-lg font-semibold cursor-pointer">
                <MotionCanvasLibraryIcon size={25} />
                <span className="tracking-tight">Motion Canvas Library</span>
              </div>
            </Link>


            <div className="flex items-center gap-2 text-gray-500 text-lg">
              <Link to={`library`} className="hover:text-black">Library</Link>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-base bg-[#DEE9EE] px-3 py-1 rounded">
              <Link to={`try`} className="hover:text-black">Try / Submit</Link>
            </div>
          </div>



          <div className="flex items-center gap-2">
            <Link to={`https://github.com/Urchmaney/motion-canvas-library`} target="_blank"><GithubIcon size={30} /></Link>
          </div>
        </div>

        <div className="pt-5 min-h-[80vh]">
          <Outlet />
        </div>
      </div>
    </div>
  )
}