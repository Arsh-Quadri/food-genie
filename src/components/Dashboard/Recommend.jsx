import { useEffect, useState } from "react";
import { database } from "../../../backend/firebase";
import { get, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";

const Recommend = ({
  user,
  setRecipe,
  meals,
  setMeals,
  demomeals,
  setNewUser,
}) => {
  const userId = (user && user.uid) || null;

  useEffect(() => {
    async function fetchOrGenerateData() {
      try {
        const mealTypes = ["breakfast", "lunch", "dinner"];

        for (const mealType of mealTypes) {
          const mealRef = ref(
            database,
            `users/${userId}/recommendData/${mealType}`
          );
          const snapshot = await get(mealRef);
          const cachedData = snapshot.val();

          if (cachedData) {
            // console.log("Using cached data for", mealType);
            setMeals((prevMeals) => ({ ...prevMeals, [mealType]: cachedData }));
            setNewUser(false);
          } else {
            // If no cached data, call regenerateAllData
            setNewUser(true);
            // console.log("No cached data for", mealType, ", regenerating...");
            // Note: You may need to adjust this call depending on how regenerateAllData works,
            // e.g., if it needs to be called per meal type or just once.
          }
        }
        // console.log("Data fetching or generation completed");
      } catch (error) {
        console.error(error);
      }
    }

    fetchOrGenerateData();
  }, [userId]);

  // breakfast names
  const breakfastNames =
    (meals && meals.breakfast && meals.breakfast.breakfast) ||
    demomeals.breakfast.breakfast.map((recipe) => recipe);

  const [showBreakfast, setShowBreakfast] = useState(false);
  const lunchNames =
    (meals && meals.lunch && meals.lunch.lunch) ||
    demomeals.lunch.lunch.map((recipe) => recipe);
  const [showLunch, setShowLunch] = useState(false);
  const dinnerNames =
    (meals && meals.dinner && meals.dinner.dinner) ||
    demomeals.dinner.dinner.map((recipe) => recipe);
  const [showDinner, setShowDinner] = useState(false);
  const navigate = useNavigate();

  const handleClick = (recipe) => {
    setRecipe(recipe);
    window.scrollTo(0, 0);
    navigate(`/dashboard/recipes/${recipe.name}`);
  };
  return (
    <div className="flex flex-col sm:flex-row justify-center w-full gap-3 mb-5">
      <div className="flex flex-col w-full h-fit gap-3">
        <div
          className="relative bgimage bg-cover cursor-pointer w-full h-32 mt-2 bg-center  rounded-xl"
          onClick={() => setShowBreakfast(!showBreakfast)}
        >
          <div className="absolute inset-0 flex justify-center items-center">
            <p className="text-black text-2xl font-bold">Breakfast</p>
          </div>
        </div>
        <div
          className={`top-[100%] text-[#E5E8EB] flex overflow-hidden flex-col text-center gap-3 font-medium transition-all duration-500 ${
            showBreakfast ? `h-[300px]` : `h-[0.01px] `
          }`}
        >
          {breakfastNames &&
            breakfastNames.map((recipe, index) => (
              <div
                className={`px-3 py-2 border border-[#9ea3a4] cursor-pointer mx-1 hover:bg-[#121c24] rounded-lg ${
                  showBreakfast ? `` : ``
                }`}
                key={index}
                onClick={() => handleClick(recipe)}
              >
                {recipe.name}
              </div>
            ))}
        </div>
      </div>
      <div className="flex flex-col w-full h-fit gap-3">
        <div
          className="relative bgimage bg-cover cursor-pointer w-full h-32 mt-2 bg-center  rounded-xl"
          onClick={() => setShowLunch(!showLunch)}
        >
          <div className="absolute inset-0 flex justify-center items-center">
            <p className="text-black text-2xl font-bold">Lunch</p>
          </div>
        </div>
        <div
          className={`top-[100%] text-[#E5E8EB] flex overflow-hidden flex-col text-center gap-3 font-medium transition-all duration-500 ${
            showLunch ? `h-[300px]` : `h-[0.01px] `
          }`}
        >
          {lunchNames &&
            lunchNames.map((recipe, index) => (
              <div
                className={`px-3 py-2 border border-[#9ea3a4] cursor-pointer mx-1 hover:bg-[#121c24] rounded-lg`}
                key={index}
                onClick={() => handleClick(recipe)}
              >
                {recipe.name}
              </div>
            ))}
        </div>
      </div>
      <div className="flex flex-col w-full h-fit gap-3">
        <div
          className="relative bgimage bg-cover cursor-pointer w-full h-32 mt-2 bg-center  rounded-xl"
          onClick={() => setShowDinner(!showDinner)}
        >
          <div className="absolute inset-0 flex justify-center items-center">
            <p className="text-black text-2xl font-bold">Dinner</p>
          </div>
        </div>
        <div
          className={`top-[100%] text-[#E5E8EB] flex overflow-hidden flex-col text-center gap-3 font-medium transition-all duration-500 ${
            showDinner ? `h-[300px]` : `h-[0.01px] `
          }`}
        >
          {dinnerNames &&
            dinnerNames.map((recipe, index) => (
              <div
                className={`px-3 py-2 border border-[#9ea3a4] cursor-pointer mx-1 hover:bg-[#121c24] rounded-lg`}
                key={index}
                onClick={() => handleClick(recipe)}
              >
                {recipe.name}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Recommend;
