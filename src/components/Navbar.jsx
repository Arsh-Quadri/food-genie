import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../backend/firebase";
import { useState } from "react";
import ham from "../assets/hamburger.png";
import cross from "../assets/cross.png";
import logo from "../assets/logo2.png";

const Navbar = ({ user, setIsOnboardingCompleted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user
      console.log("User signed out successfully.");
      setIsOnboardingCompleted(null);
      navigate("/");
      // Handle successful sign-out (e.g., redirect to home page)
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div className="w-full bg-[#121c24] flex justify-between items-center h-[65px] pr-10 border-b border-[#A7A7A7]">
        <div className="flex justify-center items-center gap-10">
          <Link
            to="/"
            className="logo text-xl pl-10 font-[500] cursor-pointer text-[#E5E8EB]"
          >
            <img src={logo} className="w-28  imgcolor" />
          </Link>
        </div>
        <div className="flex justify-center items-center font-[500] gap-5 text-[#E5E8EB]">
          {/* <Link to="/dashboard" className="cursor-pointer hidden lg:block">
            Dashboard
          </Link> */}
          <div className="cursor-pointer hidden lg:block">How it works</div>
          <div className="cursor-pointer hidden md:block">Community</div>
          <div className="cursor-pointer hidden md:block">About Us</div>

          {user ? (
            <>
              <div className="userimage flex gap-5 items-center">
                <img
                  src="https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=1450"
                  alt=""
                  className="w-10 rounded-full cursor-pointer"
                />
                <div className="cursor-pointer" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-[#F5C754] hover:bg-[#f89f2b] px-4 py-2 rounded-2xl cursor-pointer hidden md:block text-black"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="bg-[#29384C] hover:bg-[#212e3e] px-4 py-2 rounded-2xl cursor-pointer hidden md:block"
              >
                Login
              </Link>
            </>
          )}

          <div
            className="hamberger block md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {!isOpen ? (
              <img
                src={ham}
                width={30}
                className="cursor-pointer"
                alt="hamburger"
              />
            ) : (
              <img
                src={cross}
                width={30}
                alt="cross"
                className="cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="sider w-full h-screen flex flex-col items-center justify-start mt-10 font-[500] gap-5 z-10">
          <div className="cursor-pointer">Messages</div>
          <div className="cursor-pointer">Wish List</div>
          <div className="bg-[#F28F0D] hover:bg-[#f89f2b] px-4 py-2 rounded-2xl cursor-pointer">
            List your property
          </div>
          <div className="flex mt-5 gap-5 justify-center items-center">
            <div className="">Login</div>
            <div className="font-[500] rounded-xl border border-[#F28F0D] text-[#F28F0D] px-3 py-2">
              Sign In
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
