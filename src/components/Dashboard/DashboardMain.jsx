import { get, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../backend/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import Recommend from "./Recommend";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Chart from "./Chart";
import { Link } from "react-router-dom";
import bmi from "../../assets/BMI2.png";

const DashboardMain = ({ user, setRecipe }) => {
  const userId = (user && user.uid) || null;
  const [onboardData, setOnboardData] = useState(null);
  const [meals, setMeals] = useState({});
  const [veg, setveg] = useState("");
  const [gainOrLose, setgainOrLose] = useState("");
  useEffect(() => {
    const fetchOnboardData = async () => {
      try {
        const userRef = ref(database, `users/${userId}/onboardData`);
        const snapshot = await get(userRef);
        const data = snapshot.val();
        if (data) {
          setOnboardData(data);
        }
      } catch (error) {
        console.error("Error fetching onboard data:", error);
      }
    };

    fetchOnboardData();
  }, [userId]);
  useEffect(() => {
    if (onboardData) {
      setveg(onboardData.vegNonveg);
      setgainOrLose(onboardData.gainOrLose);
    }
  }, [onboardData]);
  const calculateCalories = () => {
    if (onboardData) {
      const { age, height, weight, gainOrLose, vegNonveg } = onboardData;
      const heightInMeters = height / 100; // Convert height from cm to meters
      const weightInKg = parseFloat(weight);
      const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);
      const caloriesMaintain = Math.round(
        (88.362 + 13.397 * weight + 4.799 * height - 5.677 * age) * 1.2
      );

      const caloriesMildLoss = Math.round(caloriesMaintain - 250);
      const caloriesWeightLoss = Math.round(caloriesMaintain - 500);
      const caloriesExtremeLoss = Math.round(caloriesMaintain - 1000); // As per your formula
      const caloriesMildGain = Math.round(caloriesMaintain + 250);
      const caloriesToGain = Math.round(caloriesMaintain + 500);
      const caloriesExtremeGain = Math.round(caloriesMaintain + 1000);

      return {
        bmi,
        caloriesMaintain,
        caloriesMildLoss,
        caloriesWeightLoss,
        caloriesExtremeLoss,
        caloriesMildGain,
        caloriesToGain,
        caloriesExtremeGain,
        gainOrLose,
        vegNonveg,
      };
    }
    return null;
  };
  const calories = calculateCalories();
  const genAI = new GoogleGenerativeAI(
    "AIzaSyBVUl2nH45a7LBszSoQz6YshtzI5HbclKw"
  );

  async function regenerateAllData() {
    const MAX_RETRIES = 10; // Set a maximum number of retries
    const mealTypes = ["breakfast", "lunch", "dinner"];

    const mealCompletionStatus = {
      breakfast: false,
      lunch: false,
      dinner: false,
    };

    for (const mealType of mealTypes) {
      let attempt = 1;

      while (attempt <= MAX_RETRIES) {
        try {
          console.log("Processing", mealType);

          const model = genAI.getGenerativeModel({ model: "gemini-pro" });
          const prompt = generatePrompt(mealType); // Function to create meal-specific prompts
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const jsonResponse = response
            .text()
            .replace(/`json|`JSON|`/g, "")
            .trim();
          const parsedJSON = JSON.parse(jsonResponse);

          setMeals((prevMeals) => ({ ...prevMeals, [mealType]: parsedJSON }));
          const mealRef = ref(
            database,
            `users/${userId}/recommendData/${mealType}`
          );
          await set(mealRef, parsedJSON);

          mealCompletionStatus[mealType] = true;
          console.log("Completed", mealType);
          break; // Exit the inner loop on successful processing
        } catch (error) {
          if (
            error.response &&
            error.response.status === 500 &&
            !mealCompletionStatus[mealType]
          ) {
            console.warn(
              "API call failed (attempt:",
              attempt,
              ") for",
              mealType,
              ". Retrying..."
            );
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
            mealCompletionStatus[mealType] = false; // Reset completion status for retries
          } else {
            console.error("Non-500 error:", error);
            // Implement different retry or fallback logic
          }
        }

        attempt++;
      }

      if (attempt > MAX_RETRIES) {
        console.error("Failed to fetch data for", mealType, "after retries.");
      }
    }
  }

  // const regenerateAllData = async () => {
  //   try {
  //     const mealTypes = ["breakfast", "lunch", "dinner"];

  //     for (const mealType of mealTypes) {
  //       console.log("its run", mealType);
  //       const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  //       const prompt = generatePrompt(mealType); // Function to create meal-specific prompts
  //       const result = await model.generateContent(prompt);
  //       const response = await result.response;
  //       const jsonResponse = response
  //         .text()
  //         .replace(/`json|`JSON|`/g, "")
  //         .trim();
  //       const parsedJSON = JSON.parse(jsonResponse);

  //       setMeals((prevMeals) => ({ ...prevMeals, [mealType]: parsedJSON }));

  //       const mealRef = ref(
  //         database,
  //         `users/${userId}/recommendData/${mealType}`
  //       );
  //       await set(mealRef, parsedJSON);
  //       console.log("its complete", mealType);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const generatePrompt = (mealType) => {
    // ... (existing prompt logic)
    return `Generate a JSON object containing indian recipe suggestions for a meal plan. Include 5 recipes for ${mealType} of different types, respond unique and different recipes everytime. ${
      mealType != "breakfast" &&
      "major focus should be indian but you can add foreign food famous in india, If meal is sabji then people also eat roti with it (not in biriyani and other rice containing thing) avg person eats 4-5 roti, add this roti in your ingredients, take calories of each roti as 90 and also add 90*(count of calories of roti) to the total calories of meal(int roti only return integer values of roti and not any other text needed), don't take single roti as a meal,"
    }  Ensure that the calories of the ${mealType} should be respect to daily intake of 1976 calories. Each recipe should include the following attributes: name, ingredients (an array of objects with name and quantity attributes), method (description of the cooking process), and calories ${
      veg == "veg" && "generate only vegetarian food"
    } ${
      gainOrLose == "weightgain" &&
      "I want to gain weight so give the food reccomendation with more calories."
    } Make sure that the JSON structure follows the format (don't add any thing in json file that gives error in json.parser):

  //   {
  //     "${mealType}": [
  //       {
  //         "name": "Recipe Name",
  //         "ingredients": [
  //           {"name": "Ingredient Name", "quantity": "Ingredient Quantity"},
  //         ],
  //         "method": "Cooking Instructions",
  //         "calories": Caloric Value
  //       },
  //     ]
  //   }`;
  };

  return (
    <div className="w-[90%] h-fit relative bg-[#23323d] p-5 px-10 mt-6 rounded-xl shadow-lg shadow-black">
      <div className="flex justify-end gap-3">
        <div
          className="bg-[#F5C754] hover:bg-[#f89f2b] px-4 py-2 rounded-xl cursor-pointer w-fit text-black font-medium"
          onClick={() => regenerateAllData()}
        >
          Regenerate
        </div>
        <Link
          to="/dashboard/custom"
          className="bg-[#94a3ba] hover:bg-[#7b90ad] px-4 py-2 rounded-xl cursor-pointer w-fit text-black font-medium"
        >
          Make Custom
        </Link>
      </div>
      <hr className="w-full text-[#E5E8EB] my-4" />
      <img src={bmi} alt="" className="w-[40%] absolute top-20 right-10" />
      {/* <div className="text-[#8a8e90] underline">suggested</div> */}
      {calories && (
        <div className="">
          <div className="text-4xl py-2 font-medium text-[#E5E8EB]">
            BMI CALCULATOR
          </div>
          <div className="text-[#9ea3a4] font-medium">
            Body Mask Index(BMI):{" "}
          </div>
          <p className="text-4xl py-2 font-medium text-[#E5E8EB]">
            {calories.bmi} kg/m²
          </p>
          <div className="font-medium text-xl items-start px-3 py-2 bg-[#121c24] text-[#E5E8EB] rounded-lg my-2 w-fit">
            {calories.bmi >= 18.5 && calories.bmi <= 25 && (
              <div className="">Normal</div>
            )}
            {calories.bmi > 25 && calories.bmi <= 30 && (
              <div className="text-red-300">Overweight</div>
            )}
            {calories.bmi >= 30 && <div className="text-red-500">Obesity</div>}
            {calories.bmi <= 18.5 && (
              <div className="text-red-500">Under weight</div>
            )}
          </div>
          <div className="text-green-400 font-medium">
            Healthy BMI range: 18.5 kg/m² - 25 kg/m².
          </div>
          <div className="text-4xl py-2 pt-3 font-medium text-[#E5E8EB]">
            CALORIES CALCULATOR
          </div>
          <div className="font-medium text-[#9ea3a4]">
            The results show a number of daily calorie estimates that can be
            used as a guideline for how many calories to consume each day to
            maintain, lose, or gain weight at a chosen rate.
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 my-5">
            <div className="flex flex-col justify-center font-medium text-sm gap-2 items-start px-5 py-3 bg-[#121c24] text-[#E5E8EB] rounded-xl">
              <p className="text-[#9ea3a4]">Maintain weight</p>
              <p className="text-xl">{calories.caloriesMaintain} Calories</p>
              <div className="text-green-400">
                <FontAwesomeIcon icon={faArrowDown} /> -0 kg/week
              </div>
            </div>
            {calories.gainOrLose === "weightloss" ? (
              <>
                <div className="flex flex-col justify-center font-medium text-sm gap-2 items-start px-5 py-3 bg-[#121c24] text-[#E5E8EB] rounded-xl">
                  <p className="text-[#9ea3a4]">Mild weight loss</p>
                  <p className="text-xl">
                    {calories.caloriesMildLoss} Calories
                  </p>
                  <div className="text-green-400">
                    <FontAwesomeIcon icon={faArrowDown} /> -0.25 kg/week
                  </div>
                </div>
                <div className="flex flex-col justify-center font-medium text-sm gap-2 items-start px-5 py-3 bg-[#121c24] text-[#E5E8EB] rounded-xl">
                  <p className="text-[#9ea3a4]">weight loss</p>
                  <p className="text-xl">
                    {calories.caloriesWeightLoss} Calories
                  </p>
                  <div className="text-green-400">
                    <FontAwesomeIcon icon={faArrowDown} /> -0.5 kg/week
                  </div>
                </div>
                <div className="flex flex-col justify-center font-medium text-sm gap-2 items-start px-5 py-3 bg-[#121c24] text-[#E5E8EB] rounded-xl">
                  <p className="text-[#9ea3a4]">Extreme weight loss</p>
                  <p className="text-xl">
                    {calories.caloriesExtremeLoss} Calories
                  </p>
                  <div className="text-green-400">
                    <FontAwesomeIcon icon={faArrowDown} /> -1 kg/week
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col justify-center font-medium text-sm gap-2 items-start px-5 py-3 bg-[#121c24] text-[#E5E8EB] rounded-xl">
                  <p className="text-[#9ea3a4]">Mild weight gain</p>
                  <p className="text-xl">
                    {calories.caloriesMildGain} Calories
                  </p>
                  <div className="text-green-400">
                    <FontAwesomeIcon icon={faArrowUp} /> +0.25 kg/week
                  </div>
                </div>
                <div className="flex flex-col justify-center font-medium text-sm gap-2 items-start px-5 py-3 bg-[#121c24] text-[#E5E8EB] rounded-xl">
                  <p className="text-[#9ea3a4]">weight gain</p>
                  <p className="text-xl">{calories.caloriesToGain} Calories</p>
                  <div className="text-green-400">
                    <FontAwesomeIcon icon={faArrowUp} /> +0.5 kg/week
                  </div>
                </div>
                <div className="flex flex-col justify-center font-medium text-sm gap-2 items-start px-5 py-3 bg-[#121c24] text-[#E5E8EB] rounded-xl">
                  <p className="text-[#9ea3a4]">Extreme weight gain</p>
                  <p className="text-xl">
                    {calories.caloriesExtremeGain} Calories
                  </p>
                  <div className="text-green-400">
                    <FontAwesomeIcon icon={faArrowUp} /> +1 kg/week
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <div className="text-4xl py-2 pt-3 font-medium text-[#E5E8EB]">
        Recommended recipes
      </div>
      <Recommend
        user={user}
        setRecipe={setRecipe}
        meals={meals}
        setMeals={setMeals}
        generatePrompt={generatePrompt}
      />
      <div className="text-4xl py-2 pt-3 font-medium text-[#E5E8EB]">
        Choose your meal composition
      </div>
      <Chart
        meals={meals}
        caloriesMaintain={calories && calories.caloriesMaintain}
      />
    </div>
  );
};

export default DashboardMain;
