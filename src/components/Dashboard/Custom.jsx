import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";

const Custom = () => {
  const [jsonData, setjsonData] = useState({});
  const [breakfast, setBreakfast] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setDinner] = useState("");
  const [loading, setLoading] = useState(false);
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GENAI_KEY);
  const handleGenerate = async () => {
    setLoading(true);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `This is my breakfast ${breakfast}, this is lunch ${lunch}, this is dinner ${dinner} calculate calories, protein, carb, fat for each breaktfast, luch, and dinner. add all this things as json formate and return Json file ** don't add any comments **
    
    example json file is given below:

    {
      "meals": [
        {
          "meal": "Breakfast",
          "food": "Bread and Butter",
          "calories": 250,
          "protein": 5,
          "carbs": 40,
          "fat": 10
        },
        {
          "meal": "Lunch",
          "food": "Palak Paneer",
          "calories": 300,
          "protein": 15,
          "carbs": 20,
          "fat": 15
        },
        {
          "meal": "Dinner",
          "food": "Butter Chicken",
          "calories": 400,
          "protein": 20,
          "carbs": 30,
          "fat": 20
        }
      ]
    }
    `; // Function to create meal-specific prompts
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonResponse = response
      .text()
      .replace(/`json|`JSON|`/g, "")
      .trim();

    try {
      const parsedJSON = JSON.parse(jsonResponse);
      setjsonData(parsedJSON);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total values
  const totalCalories = jsonData.meals
    ? jsonData.meals.reduce((acc, meal) => acc + meal.calories, 0)
    : 0;
  const totalProteins = jsonData.meals
    ? jsonData.meals.reduce((acc, meal) => acc + meal.protein, 0)
    : 0;
  const totalCarbs = jsonData.meals
    ? jsonData.meals.reduce((acc, meal) => acc + meal.carbs, 0)
    : 0;
  const totalFats = jsonData.meals
    ? jsonData.meals.reduce((acc, meal) => acc + meal.fat, 0)
    : 0;

  return (
    <div className="w-full sm:w-[90%] h-fit bg-[#23323d] p-5 sm:p-10  sm:mt-6 rounded-xl shadow-none sm:shadow-lg shadow-black">
      <div className="text-2xl font-medium text-[#E5E8EB]">
        Your Personalized Nutrition Hub
      </div>
      <div className="flex flex-col w-full mt-5 justify-center items-center">
        <div className="flex flex-col w-full">
          <div className="font-medium text-[#E5E8EB] py-2">
            Add your Breakfast:
          </div>
          <input
            type="text"
            value={breakfast}
            placeholder="bread butter (4 pcs)..."
            onChange={(e) => setBreakfast(e.target.value)}
            className="bg-transparent px-3 py-2 border border-[#E5E8EB] rounded-lg outline-none text-sm font-medium text-[#E5E8EB]"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="font-medium text-[#E5E8EB] py-2">Add your Lunch:</div>
          <input
            type="text"
            value={lunch}
            placeholder="Palak paneer (2 serves) with 4 chapati..."
            onChange={(e) => setLunch(e.target.value)}
            className="bg-transparent px-3 py-2 border border-[#E5E8EB] rounded-lg outline-none text-sm font-medium text-[#E5E8EB]"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="font-medium text-[#E5E8EB] py-2">
            Add your Dinner:
          </div>
          <input
            type="text"
            value={dinner}
            placeholder="Aloo matar (1 serve) with 3 chapati..."
            onChange={(e) => setDinner(e.target.value)}
            className="bg-transparent px-3 py-2 border border-[#E5E8EB] rounded-lg outline-none text-sm font-medium text-[#E5E8EB]"
          />
        </div>
      </div>
      <button
        onClick={handleGenerate}
        className="bg-[#f5c754] hover:bg-[#f89f2b] px-3 py-2 rounded-lg font-medium w-[120px] cursor-pointer  md:block text-center my-4"
      >
        {loading ? "Generating..." : "Generate"}
      </button>
      <hr className="my-5" />
      {/* {JSON.stringify(jsonData, null, 2)} */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 my-5">
        {jsonData.meals &&
          jsonData.meals.map((recipe) => (
            <div
              className="flex flex-col justify-center font-medium text-sm gap-2 items-start px-5 py-3 bg-[#121c24] text-[#E5E8EB] rounded-xl"
              key={recipe.meal}
            >
              <div className="text-[#9ea3a4]">{recipe.meal} Details</div>
              <div className="text-xl">{recipe.calories} Calories</div>
              <div className="flex flex-wrap gap-2">
                <div className="text-sm px-2 py-0.5 bg-slate-700 rounded-md">
                  <span>Protein:</span> {recipe.protein}g
                </div>
                <div className="text-sm px-2 py-0.5 bg-slate-700 rounded-md">
                  <span>Carbs:</span> {recipe.carbs}g
                </div>
                <div className="text-sm px-2 py-0.5 bg-slate-700 rounded-md">
                  <span>Fat:</span> {recipe.fat}g
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* Total nutrition section */}
      <div className="text-2xl text-[#E5E8EB] mb-4">
        Total Nutrition Summary
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col text-[#9ea3a4] bg-[#121c24] px-5 py-3 rounded-xl text-sm">
          <div className="text-base sm:text-lg">Total Calories:</div>
          <div className="text-[#E5E8EB] text-lg sm:text-xl">
            {totalCalories} Calories
          </div>
        </div>
        <div className="flex flex-col text-[#9ea3a4] bg-[#121c24] px-5 py-3 rounded-xl text-sm">
          <div className="text-base sm:text-lg">Total Proteins:</div>
          <div className="text-[#E5E8EB] text-lg sm:text-xl">
            {totalProteins}g
          </div>
        </div>
        <div className="flex flex-col text-[#9ea3a4] bg-[#121c24] px-5 py-3 rounded-xl text-sm">
          <div className="text-base sm:text-lg">Total Carbs:</div>
          <div className="text-[#E5E8EB] text-lg sm:text-xl">{totalCarbs}g</div>
        </div>
        <div className="flex flex-col text-[#9ea3a4] bg-[#121c24] px-5 py-3 rounded-xl text-sm">
          <div className="text-base sm:text-lg">Total Fats:</div>
          <div className="text-[#E5E8EB] text-lg sm:text-xl">{totalFats}g</div>
        </div>
      </div>
    </div>
  );
};

export default Custom;
