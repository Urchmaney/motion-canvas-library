import { Link } from "react-router-dom";
import { MotionCanvasPlaying } from "../components/icons";

export default function Home() {
  return (
    <div className="h-[calc(100vh-150px)] flex flex-col">
      <div className="flex flex-col items-center text-center justify-center basis-1/3">
        <h1 className="text-5xl md:text-7xl xl:text-9xl font-semibold p-7 pt-9">
          Animation Library
        </h1>
        <p className="text-gray-500 text-xl w-2/3 text-center">
          A library for the incredible <span className="text-[#25c281]"><Link to="https://motioncanvas.io/">motion canvas</Link></span> custom nodes. Bringing ease to creating animations
        </p>
      </div>
      <div className=" p-4 mt-9 grow flex items-center">
        <div className="animated-header max-w-4xl w-full h-52 mx-auto">
          <MotionCanvasPlaying />
        </div>
      </div>
    </div>
  )
}