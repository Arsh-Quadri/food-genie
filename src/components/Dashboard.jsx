import { Route, Routes } from "react-router-dom";
import DashboardMain from "./Dashboard/DashboardMain";
import Sidebar from "./Dashboard/Sidebar";
import Community from "./Dashboard/Community";
import Profile from "./Dashboard/Profile";
import CreatePost from "./Dashboard/CreatePost";
import Settings from "./Dashboard/Settings";
import Chatbot from "./Dashboard/Chatbot";
import { useState } from "react";
import chatbot from "../assets/chatbot.gif";
import RecipeDetails from "./Dashboard/RecipeDetails";

const Dashboard = ({ user, setRecipe, recipe }) => {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [pathname, setPathname] = useState("/dashboard");

  console.log(pathname);
  return (
    <div>
      <div className="w-full flex justify-center py-5 bg-[#121c24]">
        <div className="left sticky top-0 w-[20%] left-0 h-full ">
          <Sidebar pathname={pathname} setPathname={setPathname} />
        </div>
        <div className="right w-[80%] right-0 h-fit flex justify-center items-start">
          {chatbotOpen && (
            <Chatbot setChatbotOpen={setChatbotOpen} user={user} />
          )}
          <div className="fixed bottom-10 right-10 object-cover cursor-pointer z-10 ">
            <img
              src={chatbot}
              alt=""
              className="w-[70px] h-[70px] rounded-full shadow-md shadow-gray-300"
              onClick={() => setChatbotOpen(!chatbotOpen)}
            />
          </div>

          <Routes>
            <Route
              path="/*"
              element={<DashboardMain user={user} setRecipe={setRecipe} />}
            />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/settings" element={<Settings />} />
            {recipe && (
              <Route
                path={`/recipes/${recipe.name}`}
                element={<RecipeDetails recipe={recipe} />}
              />
            )}
            {/* {!recipe && (
              <Navigate to="/dashboard" replace />
            ) : (
              <RecipeDetails recipe={recipe} />
            )} */}
          </Routes>
          {/* <DashboardMain /> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
