import { GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect, useState } from "react";
import { database } from "../../../backend/firebase";
import { get, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

const Recommend = ({ user, setRecipe, meals, setMeals, generatePrompt }) => {
  const userId = (user && user.uid) || null;
  // const [meals, setMeals] = useState({});
  const genAI = new GoogleGenerativeAI(
    "AIzaSyBVUl2nH45a7LBszSoQz6YshtzI5HbclKw"
  );

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
          console.log(cachedData);
          if (cachedData) {
            console.log("backend data");
            setMeals((prevMeals) => ({ ...prevMeals, [mealType]: cachedData }));
          } else {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = generatePrompt(mealType); // Function to create meal-specific prompts
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const jsonResponse = response
              .text()
              .replace(/`json|`JSON|`/g, "")
              .trim();
            try {
              const parsedJSON = JSON.parse(response.text());
              console.log("gemini data");
              setMeals((prevMeals) => ({
                ...prevMeals,
                [mealType]: parsedJSON,
              }));
              if (userId) {
                await set(mealRef, parsedJSON);
              }
            } catch (error) {
              console.log(error.message);
            }
          }
        }
        console.log("gemini completed");
      } catch (error) {
        console.error(error);
      }
    }

    fetchOrGenerateData();
  }, [userId]);

  // console.log(meals);
  // Function to generate meal-specific prompts
  // const generatePrompt = (mealType) => {
  //   // ... (existing prompt logic)
  //   return `Generate a JSON object containing indian recipe suggestions for a meal plan. Include 5 recipes for ${mealType} of different types, respond unique and different recipes everytime. ${
  //     mealType == "dinner" &&
  //     "major focus should be indian but you can add foreign food famous in india"
  //   } Ensure that the calories of the ${mealType} should be respect to daily intake of 1976 calories. Each recipe should include the following attributes: name, ingredients (an array of objects with name and quantity attributes), method (description of the cooking process), and calories. Make sure that the JSON structure follows the format:
  //   {
  //     "${mealType}": [
  //       {
  //         "name": "Recipe Name",
  //         "ingredients": [
  //           {"name": "Ingredient Name", "quantity": "Ingredient Quantity"},
  //           ...
  //         ],
  //         "method": "Cooking Instructions",
  //         "calories": Caloric Value
  //       },
  //       ...
  //     ]
  //   }`;
  // };

  //Regenrate

  // breakfast names
  const breakfastNames =
    meals.breakfast && meals.breakfast.breakfast.map((recipe) => recipe);
  const [showBreakfast, setShowBreakfast] = useState(false);
  const lunchNames = meals.lunch && meals.lunch.lunch.map((recipe) => recipe);
  const [showLunch, setShowLunch] = useState(false);
  const dinnerNames =
    meals.dinner && meals.dinner.dinner.map((recipe) => recipe);
  const [showDinner, setShowDinner] = useState(false);
  // const toggleBreakfastVisibility = () => {
  //   setShowBreakfast((prevState) => !prevState);
  // };
  const navigate = useNavigate();

  const handleClick = (recipe) => {
    setRecipe(recipe);
    window.scrollTo(0, 0);
    navigate(`/dashboard/recipes/${recipe.name}`);
  };
  return (
    <div className="flex justify-center w-full gap-3 mb-5">
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
