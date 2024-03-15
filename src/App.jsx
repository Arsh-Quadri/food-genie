import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Hero from "./components/Hero";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Onboard from "./components/Onboard"; // Import the Onboard component
import Dashboard from "./components/Dashboard"; // Import the Dashboard component
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { auth, database } from "../backend/firebase";
import { ref, onValue } from "firebase/database";
import Footer from "./components/Footer";

function App() {
  const [user, setUser] = useState(null);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(null);
  const [recipe, setRecipe] = useState();
  console.log(isOnboardingCompleted);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      console.log(user + " user");
      if (user) {
        console.log(user.uid + " user.uid");
        checkOnboardingStatus(user.uid);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const checkOnboardingStatus = async (userId) => {
    try {
      const userRef = ref(database, `users/${userId}/onboardData`);
      onValue(userRef, (snapshot) => {
        try {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            console.log(userData.isOnboardingCompleted + "check app");
            // console.log(userData?.userId?.isOnboardingCompleted + " data");
            setIsOnboardingCompleted(userData?.isOnboardingCompleted); //
          } else {
            console.log("No data found for user:", userId);
            setIsOnboardingCompleted(false);
            // Handle the case where data for the user doesn't exist
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Handle error gracefully
        }
      });
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    }
  };

  return (
    <BrowserRouter>
      <Navbar user={user} setIsOnboardingCompleted={setIsOnboardingCompleted} />
      <Routes>
        <Route
          path="/"
          element={
            user && isOnboardingCompleted ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Hero />
            )
          }
        />
        <Route
          path="/login"
          element={<Login isOnboardingCompleted={isOnboardingCompleted} />}
        />
        {/* <Route
          path="/about"
          element={<About/>}
        /> */}
        <Route
          path="/signup"
          element={<Signup isOnboardingCompleted={isOnboardingCompleted} />}
        />
        {/* <Route path="/onboard" element={<Onboard user={user} />} /> */}
        <Route
          path="/onboard"
          element={
            user && isOnboardingCompleted ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Onboard user={user} />
            )
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <Dashboard user={user} setRecipe={setRecipe} recipe={recipe} />
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
