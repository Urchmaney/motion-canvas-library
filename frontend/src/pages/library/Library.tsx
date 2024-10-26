import LeftArrowIcon from "../../components/icons/LeftArrow";
import SearchIcon from "../../components/icons/Search";

export default function () {
  const preview = true;
  return (
    <div className="md:flex">
      <div className="basis-1/4">
        <div className="pe-3">
          <div>
            <form action="/search" className="max-w-[480px] w-full">
              <div className="relative">
                <input type="text" name="q" className="w-full border h-8 shadow p-4 rounded-full dark:text-gray-800 dark:border-gray-700 dark:bg-gray-200" placeholder="search" />
                <button type="submit">
                  <SearchIcon classString="text-teal-400 h-4 w-4 absolute top-2.5 right-3 fill-current dark:text-teal-300" />
                </button>
              </div>
            </form>
          </div>

          <div className="pt-5">
            <h3 className="font-bold text-gray-500">
              Components
            </h3>
            <div>
              <div className="flex justify-center">
                VScode
              </div>
              <div className="flex justify-center">
                Window
              </div>
              <div className="flex justify-center">
                Camera
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="grow pt-5 pl-5">
        <h2 className="font-bold text-xl"> VSCode</h2>
        <p className="text-gray-500">
          A visual studio code animation and abilities
        </p>

        <div>
          <div className="border-b border-gray-200 flex gap-3">
            <p className={`px-3 ${preview ? "border-b border-black font-bold" : ""}`}>
              Preview
            </p>
            <p className={`px-3 ${!preview ? "border-b border-black font-bold" : ""}`}>
              Code
            </p>
          </div>

          <div>

          </div>
        </div>

      </div>
    </div>
  )
}