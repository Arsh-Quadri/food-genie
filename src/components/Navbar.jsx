import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, database } from "../../backend/firebase";
import { useEffect, useState } from "react";
// import ham from "../assets/hamburger.png";
// import cross from "../assets/cross.png";
import logo from "../assets/logo2.png";
import { onValue, ref } from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faChartPie,
  faGear,
  faRightFromBracket,
  faSquarePlus,
  faUser,
  faUsers,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ user, setIsOnboardingCompleted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const userId = (user && user.uid) || null;
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user
      setIsOnboardingCompleted(null);
      navigate("/");
      // Handle successful sign-out (e.g., redirect to home page)
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fetchUserImage = async () => {
      const userRef = ref(database, `users/${userId}/profile/imagePath`);
      onValue(userRef, (snapshot) => {
        setImageUrl(snapshot.val());
      });
    };
    fetchUserImage();
  }, [user]);
  return (
    <>
      <div className="w-full bg-[#121c24] flex justify-between items-center h-[65px] md:pr-10 border-b border-[#A7A7A7]">
        <div className="flex justify-center items-center gap-10">
          <Link
            to="/"
            className="logo text-xl pl-10 font-[500] cursor-pointer text-[#E5E8EB]"
          >
            <img src={logo} className="w-20 md:w-28  imgcolor" />
          </Link>
        </div>
        <div className="flex justify-center items-center font-[500] gap-3 md:gap-5 text-[#E5E8EB]">
          {/* <Link to="/dashboard" className="cursor-pointer hidden lg:block">
            Dashboard
          </Link> */}
          {/* <div className="cursor-pointer hidden lg:block">How it works</div> */}
          <Link
            to={user ? "/dashboard/community" : "/login"}
            className="cursor-pointer hidden md:block"
          >
            Community
          </Link>

          {user ? (
            <>
              {/* desktop */}
              <div className="userimage flex gap-5 items-center">
                <img
                  src={
                    imageUrl
                      ? imageUrl
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt=""
                  className="w-10 h-10 object-cover mx-3 rounded-full cursor-pointer"
                />
                <div
                  className="cursor-pointer hidden md:flex"
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
              {/* mobile */}
              <div
                className="cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="text-xl block md:hidden pr-5"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faBarsStaggered}
                    className="text-xl block md:hidden pr-5"
                  />
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-[#F5C754] hover:bg-[#f89f2b] text-sm md:text-base px-2 md:px-4 py-1 md:py-2 rounded-xl md:rounded-2xl cursor-pointer md:block text-black"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="bg-[#29384C] hover:bg-[#212e3e] text-sm md:text-base px-3 md:px-4 py-1 md:py-2 rounded-xl md:rounded-2xl cursor-pointer md:block mr-3"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="sider bg-[#23323d] px-10 pt-10 h-screen flex flex-col items-center justify-start font-[500] gap-5 z-10">
          <Link
            to="/dashboard"
            className={`w-[200px] text-left py-2 px-3 hover:bg-[#0e161b] rounded-lg text-[#E5E8EB] font-medium cursor-pointer flex gap-3 justify-center items-center ${
              pathname === "/dashboard" ? "bg-[#0e161b]" : ""
            }`}
          >
            <FontAwesomeIcon icon={faChartPie} />
            <div>Dashboard</div>
          </Link>
          <Link
            to="/dashboard/community"
            className={`w-[200px] text-left py-2 px-3 hover:bg-[#0e161b] rounded-lg text-[#E5E8EB] font-medium cursor-pointer flex gap-3 justify-center items-center ${
              pathname === "/dashboard/community" ? "bg-[#0e161b]" : ""
            }`}
          >
            <FontAwesomeIcon icon={faUsers} />
            <div>Community</div>
          </Link>
          <Link
            to="/dashboard/profile"
            className={`w-[200px] text-left py-2 px-3 hover:bg-[#0e161b] rounded-lg text-[#E5E8EB] font-medium cursor-pointer flex gap-3 justify-center items-center ${
              pathname === "/dashboard/profile" ? "bg-[#0e161b]" : ""
            }`}
          >
            <FontAwesomeIcon icon={faUser} />
            <div>My Profile</div>
          </Link>
          <Link
            to="/dashboard/create-post"
            className={`w-[200px] text-left py-2 px-3 hover:bg-[#0e161b] rounded-lg text-[#E5E8EB] font-medium cursor-pointer flex gap-3 justify-center items-center ${
              pathname === "/dashboard/create-post" ? "bg-[#0e161b]" : ""
            }`}
          >
            <FontAwesomeIcon icon={faSquarePlus} />
            <div>Create Post</div>
          </Link>
          <Link
            to="/dashboard/settings"
            className={`w-[200px] text-left py-2 px-3 hover:bg-[#0e161b] rounded-lg text-[#E5E8EB] font-medium cursor-pointer flex gap-3 justify-center items-center ${
              pathname === "/dashboard/settings" ? "bg-[#0e161b]" : ""
            }`}
          >
            <FontAwesomeIcon icon={faGear} />
            <div>Settings</div>
          </Link>
          <div
            className="w-[200px] text-left py-2 px-3 hover:bg-[#0e161b] rounded-lg text-[#E5E8EB] font-medium cursor-pointer flex gap-3 justify-center items-center"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            <div>Logout</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
