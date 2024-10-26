import { Link, Outlet } from "react-router-dom";
import GithubIcon from "../components/icons/Github";

export default function HomeLayout() {
  return (
    <div>
      <div className="container mx-auto">
        <div className="py-3 flex justify-between sticky top-0">
          <div>
            icon
          </div>
          <div className="flex items-center gap-2">
            <Link to={`library`}>Library</Link>
            <Link to={`https://github.com/urchmaney`} target="_blank"><GithubIcon size={25} /></Link>
          </div>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}