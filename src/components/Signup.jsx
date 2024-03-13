import { useEffect, useState } from "react";
import google from "../assets/Google.png";
import { auth } from "../../backend/firebase.js";
import { Link, useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

const Signup = ({ isOnboardingCompleted }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (isOnboardingCompleted !== null) {
      isOnboardingCompleted ? navigate("/dashboard") : navigate("/onboard");
    }
  }, [isOnboardingCompleted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // {
      //   isOnboardingCompleted ? navigate("/dashboard") : navigate("/onboard");
      // }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup error: " + error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // {
      //   isOnboardingCompleted ? navigate("/dashboard") : navigate("/onboard");
      // }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className="bg-[#FCFAF7] w-full flex flex-col justify-center items-center relative ">
      <div className="sm:w-[85%] md:w-[50%] lg:w-[34%] relative mt-8 flex flex-col justify-center">
        <h1 className="text-3xl font-[750] relative py-5 left-0 text-left">
          Create an account
        </h1>
        <div className="mt-3">
          <h1 className="text-md font-[600] relative  left-0 text-left mb-1">
            Email address
          </h1>
          <input
            type="email"
            value={email}
            className="bg-transparent outline-none placeholder-[#9C784A] pl-2 py-2 w-full rounded-xl border-2 border-[#E8DECF] "
            placeholder="Email address"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="mt-3">
          <h1 className="text-md font-[600] relative  left-0 text-left">
            Password
          </h1>
          <input
            type="password"
            value={password}
            className="bg-transparent outline-none placeholder-[#9C784A] pl-2 py-2 w-full rounded-xl border-2 border-[#E8DECF] "
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button
          onClick={(e) => handleSubmit(e)}
          className="bg-[#F28F0D] hover:bg-[#f89f2b] font-[600] px-4 py-3 rounded-xl cursor-pointer  md:block text-center mt-5"
        >
          Sign Up
        </button>
        <div
          className="bg-[#F5EDE8] hover:bg-[#f3eae5] flex justify-center items-center font-[600] px-4 py-2 rounded-xl cursor-pointer text-center mt-5 gap-2"
          onClick={handleGoogleSignIn}
        >
          <img src={google} alt="" />
          <div>Continue with Google</div>
        </div>
        <h1 className="text-sm text-[#9C784A] font-[500] relative  left-0 text-center py-3 ">
          Already have an account?
        </h1>
        <Link
          to="/login"
          className="bg-[#F5EDE8] hover:bg-[#f3eae5] flex justify-center items-center font-[600] px-4 py-2 rounded-xl cursor-pointer text-center gap-2"
        >
          <div>Log in</div>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
