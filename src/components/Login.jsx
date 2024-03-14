import { useEffect, useState } from "react";
import google from "../assets/Google.png";
import { auth } from "../../backend/firebase.js";
import { Link, useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

const Login = ({ isOnboardingCompleted }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isOnboardingCompleted !== null) {
      isOnboardingCompleted ? navigate("/dashboard") : navigate("/onboard");
    }
  }, [isOnboardingCompleted]);

  console.log(isOnboardingCompleted);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    console.log(isOnboardingCompleted + "hello");
    console.log("Hi");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // {
      //   isOnboardingCompleted ? navigate("/dashboard") : navigate("/onboard");
      // }
    } catch (error) {
      alert(error.message);
      console.log(error);
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent successfully. Check your inbox.");
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  };
  return (
    <div className="bg-[#121c24] w-full flex flex-col justify-center items-center relative ">
      <div className="sm:w-[85%] md:w-[50%] lg:w-[34%] bg-[#23323d] shadow-lg shadow-black relative mt-8 mb-4 flex flex-col justify-center p-5 px-10 rounded-xl">
        <h1 className="text-3xl font-[750] text-[#F5C754] relative py-5 left-0 text-left">
          Login or create an account
        </h1>
        <div className="mt-3">
          <h1 className="text-md font-[600] relative text-[#E5E8EB] left-0 text-left mb-1">
            Email address
          </h1>
          <input
            type="email"
            value={email}
            className="bg-transparent outline-none placeholder-[#9ea3a4] text-[#E5E8EB] pl-2 py-2 w-full rounded-xl border border-[#E8DECF] "
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-3">
          <h1 className="text-md font-[600] relative text-[#E5E8EB] left-0 text-left">
            Password
          </h1>
          <input
            type="password"
            value={password}
            className="bg-transparent outline-none placeholder-[#9ea3a4] text-[#E5E8EB] pl-2 py-2 w-full rounded-xl border border-[#E8DECF] "
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <h1
          className="text-sm text-slate-200 font-[500] relative  left-0 cursor-pointer text-center m-auto w-fit py-2 mt-3"
          onClick={handleForgotPassword}
        >
          Forgot password?
        </h1>
        <div
          className="bg-[#F5C754] hover:bg-[#ddb348] font-[600] px-4 py-3 rounded-xl cursor-pointer  md:block text-center mt-3"
          onClick={(e) => handleSignIn(e)}
        >
          Log in
        </div>
        <div
          className="bg-slate-200 hover:bg-slate-300 flex justify-center items-center font-[600] px-4 py-2 rounded-xl cursor-pointer text-center mt-3 gap-2"
          onClick={handleGoogleSignIn}
        >
          <img src={google} alt="" />
          <div>Continue with Google</div>
        </div>
        <h1 className="text-sm text-slate-200 font-[500] relative  left-0 text-center py-3 cursor-pointer ">
          Don`t have an account?
        </h1>
        <Link
          to="/signup"
          className="bg-slate-200 hover:bg-slate-300 flex justify-center items-center font-[600] px-4 py-2 rounded-xl cursor-pointer text-center gap-2 mb-5"
        >
          <div>Sign up</div>
        </Link>
      </div>
    </div>
  );
};

export default Login;
