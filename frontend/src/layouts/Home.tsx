import { Link, Outlet } from "react-router-dom";
import GithubIcon from "../components/icons/Github";
import { MotionCanvasLibraryIcon } from "../components/icons";

export default function HomeLayout() {
  return (
    <div>
      <div className="container mx-auto px-2">
        <div className="py-3 flex justify-between sticky top-0">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <MotionCanvasLibraryIcon size={25} />
              <span className="tracking-tight">Motion Canvas Library</span>
            </div>

            <div className="flex items-center gap-2 text-gray-500">
              <Link to={`library`} className="hover:text-black">Library</Link>
            </div>
          </div>



          <div className="flex items-center gap-2">
            <Link to={`https://github.com/Urchmaney/motion-canvas-library`} target="_blank"><GithubIcon size={25} /></Link>
          </div>
        </div>
        <div className="pt-5">
          <Outlet />
        </div>
      </div>
    </div>
  )
}