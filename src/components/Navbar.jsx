import { Link, useNavigate } from "react-router-dom";
import { auth, database } from "../../backend/firebase";
import { useEffect, useState } from "react";
// import ham from "../assets/hamburger.png";
// import cross from "../assets/cross.png";
import logo from "../assets/logo2.png";
import { onValue, ref } from "firebase/database";

const Navbar = ({ user, setIsOnboardingCompleted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const userId = (user && user.uid) || null;
  const navigate = useNavigate();
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
              <div className="userimage flex gap-5 items-center">
                <img
                  src={
                    imageUrl
                      ? imageUrl
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt=""
                  className="w-10 h-10 object-cover rounded-full cursor-pointer"
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
                className="bg-[#F5C754] hover:bg-[#f89f2b] text-sm md:text-base px-2 md:px-4 py-1 md:py-2 rounded-xl md:rounded-2xl cursor-pointer md:block text-black"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="bg-[#29384C] hover:bg-[#212e3e] text-sm md:text-base px-3 md:px-4 py-1 md:py-2 rounded-xl md:rounded-2xl cursor-pointer md:block"
              >
                Login
              </Link>
            </>
          )}

          <div
            className="hamberger block md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* {!isOpen ? (
              <img
                src={ham}
                width={30}
                className="cursor-pointer white-icon"
                alt="hamburger"
              />
            ) : (
              <img
                src={cross}
                width={30}
                alt="cross"
                className="cursor-pointer white-icon"
              />
            )} */}
          </div>
        </div>
      </div>
      {/* {isOpen && (
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
      )} */}
    </>
  );
};

export default Navbar;
