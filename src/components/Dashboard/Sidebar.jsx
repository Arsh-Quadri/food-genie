import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faUsers,
  faUser,
  faSquarePlus,
  faGear,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Sidebar = ({ pathname, setPathname }) => {
  // const location = useLocation();
  // const { pathname } = location;

  return (
    <div className="w-[90%] h-fit bg-[#23323d] shadow-lg shadow-black mt-[20%] rounded-tr-2xl rounded-br-2xl flex flex-col justify-center items-center p-3 gap-3">
      <Link
        to="/dashboard"
        className={`w-full text-left py-2 px-3 hover:bg-[#0e161b] rounded-lg text-[#E5E8EB] font-medium cursor-pointer flex gap-3 justify-start items-center ${
          pathname === "/dashboard" ? "bg-[#0e161b]" : ""
        }`}
        onClick={() => setPathname("/dashboard")}
      >
        <FontAwesomeIcon icon={faChartPie} />
        <div>Dashboard</div>
      </Link>
      <Link
        to="/dashboard/community"
        className={`w-full text-left py-2 px-3 hover:bg-[#0e161b] rounded-lg text-[#E5E8EB] font-medium cursor-pointer flex gap-3 justify-start items-center ${
          pathname === "/dashboard/community" ? "bg-[#0e161b]" : ""
        }`}
        onClick={() => setPathname("/dashboard/community")}
      >
        <FontAwesomeIcon icon={faUsers} />
        <div>Community</div>
      </Link>
      <Link
        to="/dashboard/profile"
        className={`w-full text-left py-2 px-3 hover:bg-[#0e161b] rounded-lg text-[#E5E8EB] font-medium cursor-pointer flex gap-3 justify-start items-center ${
          pathname === "/dashboard/profile" ? "bg-[#0e161b]" : ""
        }`}
        onClick={() => setPathname("/dashboard/profile")}
      >
        <FontAwesomeIcon icon={faUser} />
        <div>My Profile</div>
      </Link>
      <Link
        to="/dashboard/create-post"
        className={`w-full text-left py-2 px-3 hover:bg-[#0e161b] rounded-lg text-[#E5E8EB] font-medium cursor-pointer flex gap-3 justify-start items-center ${
          pathname === "/dashboard/create-post" ? "bg-[#0e161b]" : ""
        }`}
        onClick={() => setPathname("/dashboard/create-post")}
      >
        <FontAwesomeIcon icon={faSquarePlus} />
        <div>Create Post</div>
      </Link>
      <Link
        to="/dashboard/settings"
        className={`w-full text-left py-2 px-3 hover:bg-[#0e161b] rounded-lg text-[#E5E8EB] font-medium cursor-pointer flex gap-3 justify-start items-center ${
          pathname === "/dashboard/settings" ? "bg-[#0e161b]" : ""
        }`}
        onClick={() => setPathname("/dashboard/settings")}
      >
        <FontAwesomeIcon icon={faGear} />
        <div>Settings</div>
      </Link>
      <Link
        to="https://fitness-by-arsh.netlify.app/"
        className={`w-full text-left py-2 px-3 hover:bg-[#0e161b] rounded-lg text-[#E5E8EB] font-medium cursor-pointer flex gap-3 justify-start items-center ${
          pathname === "/dashboard/settings" ? "" : ""
        }`}
        onClick={() => setPathname("/dashboard")}
      >
        <FontAwesomeIcon icon={faDumbbell} />
        <div className="">Fitness Freak</div>
      </Link>
    </div>
  );
};

export default Sidebar;
