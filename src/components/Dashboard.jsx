import { Route, Routes } from "react-router-dom";
import DashboardMain from "./Dashboard/DashboardMain";
import Sidebar from "./Dashboard/Sidebar";
import Community from "./Dashboard/Community";
import Profile from "./Dashboard/Profile";
import CreatePost from "./Dashboard/CreatePost";
import Settings from "./Dashboard/Settings";
import Custom from "./Dashboard/Custom";
import Chatbot from "./Dashboard/Chatbot";
import { useState } from "react";
import chatbot from "../assets/chatbot2.gif";
import RecipeDetails from "./Dashboard/RecipeDetails";

const Dashboard = ({ user, setRecipe, recipe }) => {
  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <div>
      <div className="w-full flex justify-center py-5 bg-[#23323d] sm:bg-[#121c24]">
        <div className="hidden md:block left sticky top-0 w-[20%] left-0 h-full ">
          <Sidebar />
        </div>
        <div className="right w-full sm:w-[90%] md:w-[80%] right-0 h-fit flex justify-center items-start">
          {chatbotOpen && (
            <Chatbot setChatbotOpen={setChatbotOpen} user={user} />
          )}
          <div className="fixed bottom-5 md:bottom-10 right-5 md:right-10 object-cover cursor-pointer z-10 ">
            <img
              src={chatbot}
              alt=""
              className="w-[60px] h-[60px] rounded-full object-cover shadow-md"
              onClick={() => setChatbotOpen(!chatbotOpen)}
            />
          </div>

          <Routes>
            <Route
              path="/*"
              element={<DashboardMain user={user} setRecipe={setRecipe} />}
            />
            <Route path="/community" element={<Community user={user} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/create-post" element={<CreatePost user={user} />} />
            <Route path="/settings" element={<Settings user={user} />} />
            <Route path="/custom" element={<Custom />} />
            {recipe && (
              <Route
                path={`/recipes/${recipe.name}`}
                element={<RecipeDetails recipe={recipe} />}
              />
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
