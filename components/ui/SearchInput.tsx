import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function SearchInput() {
  return (
    <div className="flex justify-between items-center border-[1px] border-zinc-300 hover:border-zinc-500 duration-200 rounded-xl">
      <input
        className="flex-1 border-none outline-none bg-transparent py-2 mx-4"
        type="text"
        placeholder="Search for authorizations of your favorite IPs"
      />

      <FontAwesomeIcon className="w-[16px] h-[16px] text-zinc-400 mr-4" icon={faSearch} />
    </div>
  );
}
