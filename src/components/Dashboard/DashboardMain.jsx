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
import loader from "../../assets/loading.gif";

const DashboardMain = ({ user, setRecipe }) => {
  const userId = (user && user.uid) || null;
  const [onboardData, setOnboardData] = useState(null);
  const [meals, setMeals] = useState({});
  const [newUser, setNewUser] = useState(false);
  const demomeals = {
    breakfast: {
      breakfast: [
        {
          calories: 250,
          ingredients: [
            { name: "Semolina (Rava)", quantity: "1 cup" },
            { name: "Onion", quantity: "1 small, chopped" },
            { name: "Green chilies", quantity: "2-3, chopped" },
            { name: "Mustard seeds", quantity: "1 tsp" },
            { name: "Cumin seeds", quantity: "1/2 tsp" },
            { name: "Curry leaves", quantity: "few" },
            { name: "Water", quantity: "2 cups" },
            { name: "Ghee or oil", quantity: "2 tbsp" },
          ],
          method:
            "Roast semolina in a pan until fragrant. Add oil, mustard seeds, cumin seeds, curry leaves, and green chilies. Sauté for a few minutes. Slowly add water while stirring continuously. Cook until the semolina absorbs all the water, becomes soft, and is cooked through.",
          name: "Rava Upma",
        },
        {
          calories: 200,
          ingredients: [
            { name: "Besan (Gram Flour)", quantity: "1 cup" },
            { name: "Water", quantity: "1 cup" },
            { name: "Green chilies", quantity: "1-2, chopped" },
            { name: "Onion", quantity: "1 small, chopped" },
            { name: "Coriander leaves", quantity: "1/4 cup, chopped" },
            { name: "Salt to taste" },
            { name: "Oil for greasing", quantity: "2-3 tsp" },
          ],
          method:
            "Whisk together besan, water, green chilies, onion, coriander leaves, and salt. Heat some oil in a pan and pour a ladle of batter onto it. Spread the batter to form a thin pancake. Cook on both sides until golden brown.",
          name: "Besan Chilla",
        },
        {
          calories: 220,
          ingredients: [
            { name: "Rolled Oats", quantity: "1 cup" },
            { name: "Yogurt", quantity: "1 cup" },
            { name: "Water", quantity: "1/4 cup" },
            { name: "Green chilies", quantity: "1-2, chopped" },
            { name: "Ginger", quantity: "1 inch, grated" },
            { name: "Salt to taste" },
            { name: "Fruit salt (Eno)", quantity: "1/2 tsp" },
            { name: "Oil for greasing", quantity: "1 tbsp" },
          ],
          method:
            "Grind rolled oats into a fine powder. Whisk together yogurt, water, green chilies, ginger, salt, and powdered oats. Add fruit salt and mix well. Pour the batter into a greased dish and steam for 15-20 minutes. Cut into pieces and serve.",
          name: "Oats Dhokla",
        },
        {
          calories: 220,
          ingredients: [
            { name: "Poha (Flattened Rice)", quantity: "1 cup" },
            { name: "Onion", quantity: "1 small, chopped" },
            { name: "Potato", quantity: "1 small, boiled and diced" },
            { name: "Carrot", quantity: "1/2 medium, grated" },
            { name: "Green peas", quantity: "1/4 cup" },
            { name: "Mustard seeds", quantity: "1 tsp" },
            { name: "Cumin seeds", quantity: "1/2 tsp" },
            { name: "Curry leaves", quantity: "few" },
            { name: "Oil", quantity: "2 tbsp" },
          ],
          method:
            "Rinse poha under water and drain. Heat oil in a pan and add mustard seeds, cumin seeds, and curry leaves. Sauté for a few minutes. Add onion, potato, carrot, and green peas. Cook until the vegetables are tender. Add poha, salt to taste, and mix well. Cook for a few minutes until poha is heated through.",
          name: "Vegetable Poha",
        },
        {
          calories: 280,
          ingredients: [
            { name: "Whole Wheat Flour", quantity: "2 cups" },
            { name: "Salt", quantity: "to taste" },
            { name: "Water", quantity: "as needed" },
            { name: "Green Peas", quantity: "1 cup" },
            { name: "Potato", quantity: "1 small, boiled and mashed" },
            { name: "Onion", quantity: "1 small, chopped" },
            { name: "Green chilies", quantity: "2-3, chopped" },
            { name: "Coriander leaves", quantity: "1/4 cup, chopped" },
            { name: "Oil for frying", quantity: "as needed" },
          ],
          method:
            "Make a dough using whole wheat flour, salt, and water. Divide the dough into small balls and roll out into circles. In a bowl, combine green peas, potato, onion, green chilies, coriander leaves, and salt to taste. Place a spoonful of the filling in the center of each circle and fold the edges to form a semi-circle. Crimp the edges to seal. Deep fry the kachoris in hot oil until golden brown.",
          name: "Matar Kachori",
        },
      ],
    },
    lunch: {
      lunch: [
        {
          calories: 650,
          ingredients: [
            { name: "Potatoes", quantity: "600 grams" },
            { name: "Cauliflower", quantity: "400 grams" },
            { name: "Onion", quantity: "1 large" },
            { name: "Garlic", quantity: "3-4 cloves" },
            { name: "Ginger", quantity: "1-inch piece" },
            { name: "Green Chili", quantity: "1-2" },
            { name: "Turmeric Powder", quantity: "1 teaspoon" },
            { name: "Red Chili Powder", quantity: "1 teaspoon" },
            { name: "Coriander Powder", quantity: "1 teaspoon" },
            { name: "Cumin Seeds", quantity: "1 teaspoon" },
            { name: "Oil", quantity: "2 tablespoons" },
            { name: "Coriander Leaves", quantity: "for garnish" },
            { name: "Roti", quantity: "4" },
          ],
          method:
            "1. Boil potatoes and cauliflower. 2. Heat oil in a pan, add cumin seeds, and let them crackle. 3. Add chopped onions, garlic, and ginger and cook until softened. 4. Add green chilies, turmeric, red chili powder, coriander powder, and salt. 5. Add boiled potatoes and cauliflower and stir. 6. Cover and cook for 10-15 minutes. 7. Garnish with coriander leaves.",
          name: "Aloo Gobi",
        },
        {
          calories: 680,
          ingredients: [
            { name: "Chickpeas", quantity: "500 grams" },
            { name: "Onion", quantity: "1 large" },
            { name: "Tomato", quantity: "2 medium" },
            { name: "Garlic", quantity: "3-4 cloves" },
            { name: "Ginger", quantity: "1-inch piece" },
            { name: "Cumin Seeds", quantity: "1 teaspoon" },
            { name: "Coriander Powder", quantity: "1 teaspoon" },
            { name: "Red Chili Powder", quantity: "1 teaspoon" },
            { name: "Turmeric Powder", quantity: "1 teaspoon" },
            { name: "Oil", quantity: "2 tablespoons" },
            { name: "Coriander Leaves", quantity: "for garnish" },
            { name: "Roti", quantity: "4" },
          ],
          method:
            "1. Soak chickpeas overnight. 2. Pressure cook chickpeas until tender. 3. Heat oil in a pan, add cumin seeds, and let them crackle. 4. Add chopped onions, garlic, and ginger and cook until softened. 5. Add chopped tomatoes and cook until mushy. 6. Add cumin powder, coriander powder, red chili powder, turmeric powder, and salt. 7. Add boiled chickpeas and stir. 8. Cover and cook for 20-25 minutes. 9. Garnish with coriander leaves.",
          name: "Chana Masala",
        },
        {
          calories: 700,
          ingredients: [
            { name: "Black Lentils", quantity: "500 grams" },
            { name: "Red Lentils", quantity: "250 grams" },
            { name: "Onion", quantity: "1 large" },
            { name: "Tomato", quantity: "2 medium" },
            { name: "Garlic", quantity: "3-4 cloves" },
            { name: "Ginger", quantity: "1-inch piece" },
            { name: "Cumin Seeds", quantity: "1 teaspoon" },
            { name: "Coriander Powder", quantity: "1 teaspoon" },
            { name: "Red Chili Powder", quantity: "1 teaspoon" },
            { name: "Turmeric Powder", quantity: "1 teaspoon" },
            { name: "Oil", quantity: "2 tablespoons" },
            { name: "Coriander Leaves", quantity: "for garnish" },
            { name: "Butter", quantity: "2 tablespoons" },
            { name: "Roti", quantity: "4" },
          ],
          method:
            "1. Soak lentils overnight. 2. Pressure cook lentils until tender. 3. Heat oil in a pan, add cumin seeds, and let them crackle. 4. Add chopped onions, garlic, and ginger and cook until softened. 5. Add chopped tomatoes and cook until mushy. 6. Add cumin powder, coriander powder, red chili powder, turmeric powder, and salt. 7. Add boiled lentils and stir. 8. Cover and cook for 20-25 minutes. 9. Mash some lentils to thicken the gravy. 10. Add butter and garnish with coriander leaves.",
          name: "Dal Makhani",
        },
        {
          calories: 670,
          ingredients: [
            { name: "Paneer", quantity: "500 grams" },
            { name: "Onion", quantity: "1 large" },
            { name: "Tomato", quantity: "2 medium" },
            { name: "Garlic", quantity: "3-4 cloves" },
            { name: "Ginger", quantity: "1-inch piece" },
            { name: "Cumin Seeds", quantity: "1 teaspoon" },
            { name: "Coriander Powder", quantity: "1 teaspoon" },
            { name: "Red Chili Powder", quantity: "1 teaspoon" },
            { name: "Turmeric Powder", quantity: "1 teaspoon" },
            { name: "Oil", quantity: "2 tablespoons" },
            { name: "Butter", quantity: "2 tablespoons" },
            { name: "Coriander Leaves", quantity: "for garnish" },
            { name: "Roti", quantity: "4" },
          ],
          method:
            "1. Cut paneer into cubes. 2. Heat oil in a pan, add cumin seeds, and let them crackle. 3. Add chopped onions, garlic, and ginger and cook until softened. 4. Add chopped tomatoes and cook until mushy. 5. Add cumin powder, coriander powder, red chili powder, turmeric powder, and salt. 6. Add paneer cubes and stir. 7. Cover and cook for 10-15 minutes. 8. Add butter and garnish with coriander leaves.",
          name: "Paneer Butter Masala",
        },
        {
          calories: 630,
          ingredients: [
            { name: "Potatoes", quantity: "200 grams" },
            { name: "Carrots", quantity: "200 grams" },
            { name: "Green Peas", quantity: "150 grams" },
            { name: "Cauliflower", quantity: "150 grams" },
            { name: "Onion", quantity: "1 large" },
            { name: "Garlic", quantity: "3-4 cloves" },
            { name: "Ginger", quantity: "1-inch piece" },
            { name: "Cumin Seeds", quantity: "1 teaspoon" },
            { name: "Coriander Powder", quantity: "1 teaspoon" },
            { name: "Red Chili Powder", quantity: "1/2 teaspoon" },
            { name: "Turmeric Powder", quantity: "1/2 teaspoon" },
            { name: "Oil", quantity: "2 tablespoons" },
            { name: "Coriander Leaves", quantity: "for garnish" },
            { name: "Roti", quantity: "4" },
          ],
          method:
            "1. Chop all the vegetables into small pieces. 2. Heat oil in a pan, add cumin seeds, and let them crackle. 3. Add chopped onions, garlic, and ginger and cook until softened. 4. Add chopped vegetables and stir. 5. Add cumin powder, coriander powder, red chili powder, turmeric powder, and salt. 6. Cover and cook for 10-15 minutes. 7. Garnish with coriander leaves.",
          name: "Mix Vegetable",
        },
      ],
    },
    dinner: {
      dinner: [
        {
          calories: 650,
          ingredients: [
            { name: "Paneer", quantity: "250 grams" },
            { name: "Onion", quantity: "1 medium" },
            { name: "Tomato", quantity: "2 medium" },
            { name: "Ginger-garlic paste", quantity: "1 tablespoon" },
            { name: "Butter", quantity: "2 tablespoons" },
            { name: "Heavy cream", quantity: "1/2 cup" },
            { name: "Cumin powder", quantity: "1 teaspoon" },
            { name: "Coriander powder", quantity: "1 teaspoon" },
            { name: "Garam masala", quantity: "1 teaspoon" },
            { name: "Salt", quantity: "to taste" },
            { name: "Rotis", quantity: 4 },
          ],
          method:
            "1. Heat butter in a pan and fry the paneer cubes until golden brown.\n2. Add onion and saute until translucent.\n3. Add tomato and cook until softened.\n4. Add ginger-garlic paste and saute for 1 minute.\n5. Add cumin powder, coriander powder, and garam masala and saute for another minute.\n6. Add heavy cream and bring to a boil.\n7. Add the fried paneer cubes and simmer for 5 minutes.\n8. Season with salt and serve hot with rotis.",
          name: "Paneer Butter Masala",
          roti: 4,
        },
        {
          calories: 600,
          ingredients: [
            { name: "Chana dal", quantity: "250 grams" },
            { name: "Onion", quantity: "1 medium" },
            { name: "Tomato", quantity: "2 medium" },
            { name: "Ginger-garlic paste", quantity: "1 tablespoon" },
            { name: "Cumin powder", quantity: "1 teaspoon" },
            { name: "Coriander powder", quantity: "1 teaspoon" },
            { name: "Garam masala", quantity: "1 teaspoon" },
            { name: "Salt", quantity: "to taste" },
            { name: "Rotis", quantity: 4 },
          ],
          method:
            "1. Soak chana dal overnight.\n2. Pressure cook the dal until tender.\n3. Heat oil in a pan and fry the onion until golden brown.\n4. Add tomato and cook until softened.\n5. Add ginger-garlic paste and saute for 1 minute.\n6. Add cumin powder, coriander powder, and garam masala and saute for another minute.\n7. Add the cooked dal, salt, and water to taste.\n8. Simmer for 15-20 minutes or until the desired consistency is reached.\n9. Serve hot with rotis.",
          name: "Chana Masala",
          roti: 4,
        },
        {
          calories: 550,
          ingredients: [
            { name: "Potatoes", quantity: "500 grams" },
            { name: "Cumin seeds", quantity: "1 teaspoon" },
            { name: "Green chilies", quantity: "2" },
            { name: "Ginger-garlic paste", quantity: "1 tablespoon" },
            { name: "Turmeric powder", quantity: "1/2 teaspoon" },
            { name: "Red chili powder", quantity: "1/2 teaspoon" },
            { name: "Coriander powder", quantity: "1/2 teaspoon" },
            { name: "Salt", quantity: "to taste" },
            { name: "Rotis", quantity: 4 },
          ],
          method:
            "1. Boil potatoes until tender.\n2. Peel and cut the potatoes into cubes.\n3. Heat oil in a pan and add cumin seeds.\n4. When the cumin seeds crackle, add green chilies and ginger-garlic paste.\n5. Saute for 1 minute.\n6. Add turmeric powder, red chili powder, and coriander powder and saute for another minute.\n7. Add the potato cubes, salt, and water to taste.\n8. Cook until the potatoes are evenly coated with the spices.\n9. Serve hot with rotis.",
          name: "Jeera Aloo",
          roti: 4,
        },
        {
          calories: 620,
          ingredients: [
            { name: "Spinach", quantity: "500 grams" },
            { name: "Paneer", quantity: "250 grams" },
            { name: "Onion", quantity: "1 medium" },
            { name: "Tomato", quantity: "2 medium" },
            { name: "Ginger-garlic paste", quantity: "1 tablespoon" },
            { name: "Cumin powder", quantity: "1 teaspoon" },
            { name: "Coriander powder", quantity: "1 teaspoon" },
            { name: "Garam masala", quantity: "1 teaspoon" },
            { name: "Salt", quantity: "to taste" },
            { name: "Rotis", quantity: 4 },
          ],
          method:
            "1. Blanch the spinach and puree it.\n2. Heat oil in a pan and fry the paneer cubes until golden brown.\n3. Add onion and saute until translucent.\n4. Add tomato and cook until softened.\n5. Add ginger-garlic paste and saute for 1 minute.\n6. Add cumin powder, coriander powder, and garam masala and saute for another minute.\n7. Add the spinach puree, salt, and water to taste.\n8. Simmer for 15-20 minutes or until the desired consistency is reached.\n9. Add the fried paneer cubes and serve hot with rotis.",
          name: "Palak Paneer",
          roti: 4,
        },
        {
          calories: 700,
          ingredients: [
            { name: "Urad dal", quantity: "250 grams" },
            { name: "Rajma", quantity: "250 grams" },
            { name: "Onion", quantity: "1 medium" },
            { name: "Tomato", quantity: "2 medium" },
            { name: "Ginger-garlic paste", quantity: "1 tablespoon" },
            { name: "Cumin powder", quantity: "1 teaspoon" },
            { name: "Coriander powder", quantity: "1 teaspoon" },
            { name: "Garam masala", quantity: "1 teaspoon" },
            { name: "Butter", quantity: "2 tablespoons" },
            { name: "Cream", quantity: "1/2 cup" },
            { name: "Salt", quantity: "to taste" },
            { name: "Rotis", quantity: 4 },
          ],
          method:
            "1. Soak urad dal and rajma overnight.\n2. Pressure cook the dal and rajma until tender.\n3. Heat butter in a pan and fry the onion until golden brown.\n4. Add tomato and cook until softened.\n5. Add ginger-garlic paste and saute for 1 minute.\n6. Add cumin powder, coriander powder, and garam masala and saute for another minute.\n7. Add the cooked dal and rajma, salt, and water to taste.\n8. Simmer for 15-20 minutes or until the desired consistency is reached.\n9. Add cream and serve hot with rotis.",
          name: "Dal Makhani",
          roti: 4,
        },
      ],
    },
  };
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
  const calories = onboardData && calculateCalories();
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GENAI_KEY);

  useEffect(() => {
    // ... (existing code to fetch onboardData and calculate calories)

    const fetchData = async () => {
      if (
        calories &&
        !meals.breakfast &&
        !meals.lunch &&
        !meals.dinner &&
        newUser
      ) {
        // Check if calories is available and meals haven't been generated yet
        await regenerateAllData(calories);
      }
    };

    fetchData();
  }, [userId, calories]); // Include calories in the dependency array
  async function regenerateAllData(calories) {
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
          // console.log("Processing", mealType);
          if (calories?.bmi) {
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
            // console.log("Completed", mealType);
            break; // Exit the inner loop on successful processing
          } else {
            // console.log("no calories");
          }
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
            setNewUser(false);
          } else {
            // console.error("Non-500 error:", error);
            // Implement different retry or fallback logic
          }
        }

        attempt++;
      }

      if (attempt > MAX_RETRIES) {
        console.warn("Failed to fetch data for", mealType, "after retries.");
      }
    }
  }

  const generatePrompt = (mealType) => {
    // ... (existing prompt logic)
    return `Generate a JSON object containing indian recipe suggestions for a meal plan. Include 5 recipes for ${mealType} of different types, respond unique and different indian recipes everytime. keep the name in two to three words, ${
      mealType != "breakfast" &&
      "major focus should be indian but you can add foreign food famous in india, If meal is sabji then people also eat roti with it (not in biriyani and other rice containing thing) avg person eats 4-5 roti, add this roti in your ingredients, take calories of each roti as 90 and also add 90*(count of rotis) so on avrage your calories of only rotis is 400 so total calories of meal should be more the 600 calories, to the total calories of meal(in roti only return integer values of roti and not any other text needed), single roti is not a meal,"
    } Ensure that the calories of the ${mealType} should be respect to daily intake of ${
      calories?.caloriesMaintain && calories.caloriesMaintain
    } calories.  Each recipe should include the following attributes: name, ingredients (an array of objects with name and quantity attributes)(no need to enclude each ingredients only include important), method (description of the cooking process, make it short and consize), and calories ${
      calories?.vegNonveg == "veg" &&
      "generate only vegetarian food  (veg food) don't add even single non-veg item."
    } ${
      calories?.gainOrLose == "weightgain" &&
      "give the food reccomendation which contains more calories more then my daily intake."
    }  Make sure that the JSON structure follows the format (***This Json file is going to use in production don't made any syntax error, don't add any comment just pure json***):

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
    <div className="w-full md:w-[90%] h-fit relative sm:bg-[#23323d] p-5 md:px-10 mt-0 sm:mt-6 rounded-xl shadow-none sm:shadow-lg shadow-black">
      <div className="flex justify-end gap-3">
        <div
          className="bg-[#F5C754] hover:bg-[#f89f2b] text-sm sm:text-base px-4 py-2 rounded-xl cursor-pointer w-fit text-black font-medium"
          onClick={() => regenerateAllData(calories)}
        >
          Regenerate
        </div>
        <Link
          to="/dashboard/custom"
          className="bg-[#94a3ba] hover:bg-[#7b90ad] text-sm sm:text-base px-4 py-2 rounded-xl cursor-pointer w-fit text-black font-medium"
        >
          Make Custom
        </Link>
      </div>
      <hr className="w-full text-[#E5E8EB] my-4" />
      <img
        src={bmi}
        alt=""
        className="w-[40%] min-w-[250px] sm:absolute top-20 right-10"
      />
      {/* <div className="text-[#8a8e90] underline">suggested</div> */}
      {calories ? (
        <div className="">
          <div className="text-3xl sm:text-4xl py-2 font-medium text-[#E5E8EB]">
            BMI CALCULATOR
          </div>
          <div className="text-[#9ea3a4] font-medium">
            Body Mass Index(BMI):{" "}
          </div>
          <p className="text-3xl sm:text-4xl py-2 font-medium text-[#E5E8EB]">
            {calories.bmi} kg/m²
          </p>
          <div className="font-medium text-base sm:text-xl items-start px-3 py-2 bg-[#121c24] text-[#E5E8EB] rounded-lg my-2 w-fit">
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
          <div className="text-green-400 text-sm sm:text-base font-medium">
            Healthy BMI range: 18.5 kg/m² - 25 kg/m².
          </div>
          <div className="text-3xl sm:text-4xl py-2 pt-3 font-medium text-[#E5E8EB]">
            CALORIES CALCULATOR
          </div>
          <div className="font-medium text-sm sm:text-base text-[#9ea3a4]">
            The results show a number of daily calorie estimates that can be
            used as a guideline for how many calories to consume each day to
            maintain, lose, or gain weight at a chosen rate.
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 my-5">
            <div className="flex flex-col justify-center font-medium text-sm gap-2 items-start px-3 sm:px-5 py-3 bg-[#121c24] text-[#E5E8EB] rounded-xl">
              <p className="text-[#9ea3a4] text-sm sm:text-base">
                Maintain weight
              </p>
              <p className="text-base sm:text-xl">
                {calories.caloriesMaintain} Calories
              </p>
              <div className="text-green-400 text-sm sm:text-base">
                <FontAwesomeIcon icon={faArrowDown} /> -0 kg/week
              </div>
            </div>
            {calories.gainOrLose === "weightloss" ? (
              <>
                <div className="flex flex-col justify-center font-medium text-sm gap-2 items-start px-3 sm:px-5 py-3 bg-[#121c24] text-[#E5E8EB] rounded-xl">
                  <p className="text-[#9ea3a4] text-sm sm:text-base">
                    Mild weight loss
                  </p>
                  <p className="text-base sm:text-xl">
                    {calories.caloriesMildLoss} Calories
                  </p>
                  <div className="text-green-400 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faArrowDown} /> -0.25 kg/week
                  </div>
                </div>
                <div className="flex flex-col justify-center font-medium text-sm gap-2 items-start px-3 sm:px-5 py-3 bg-[#121c24] text-[#E5E8EB] rounded-xl">
                  <p className="text-[#9ea3a4] text-sm sm:text-base">
                    weight loss
                  </p>
                  <p className="text-base sm:text-xl">
                    {calories.caloriesWeightLoss} Calories
                  </p>
                  <div className="text-green-400 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faArrowDown} /> -0.5 kg/week
                  </div>
                </div>
                <div className="flex flex-col justify-center font-medium text-sm gap-2 items-start px-3 sm:px-5 py-3 bg-[#121c24] text-[#E5E8EB] rounded-xl">
                  <p className="text-[#9ea3a4] text-sm sm:text-base">
                    Extreme weight loss
                  </p>
                  <p className="text-base sm:text-xl">
                    {calories.caloriesExtremeLoss} Calories
                  </p>
                  <div className="text-green-400 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faArrowDown} /> -1 kg/week
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col justify-center font-medium text-sm gap-2 items-start px-3 sm:px-5 py-3 bg-[#121c24] text-[#E5E8EB] rounded-xl">
                  <p className="text-[#9ea3a4] text-sm sm:text-base">
                    Mild weight gain
                  </p>
                  <p className="text-base sm:text-xl">
                    {calories.caloriesMildGain} Calories
                  </p>
                  <div className="text-green-400 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faArrowUp} /> +0.25 kg/week
                  </div>
                </div>
                <div className="flex flex-col justify-center font-medium text-sm gap-2 items-start px-3 sm:px-5 py-3 bg-[#121c24] text-[#E5E8EB] rounded-xl">
                  <p className="text-[#9ea3a4] text-sm sm:text-base">
                    weight gain
                  </p>
                  <p className="text-base sm:text-xl">
                    {calories.caloriesToGain} Calories
                  </p>
                  <div className="text-green-400 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faArrowUp} /> +0.5 kg/week
                  </div>
                </div>
                <div className="flex flex-col justify-center font-medium text-sm gap-2 items-start px-3 sm:px-5 py-3 bg-[#121c24] text-[#E5E8EB] rounded-xl">
                  <p className="text-[#9ea3a4] text-sm sm:text-base">
                    Extreme weight gain
                  </p>
                  <p className="text-base sm:text-xl">
                    {calories.caloriesExtremeGain} Calories
                  </p>
                  <div className="text-green-400 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faArrowUp} /> +1 kg/week
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="h-[100vh] flex justify-start">
          <img
            src={loader}
            alt=""
            className="w-20 h-20 mx-auto sm:ml-48 mt-0 sm:mt-20"
          />
        </div>
      )}
      <div className="text-3xl sm:text-4xl py-2 pt-3 font-medium text-[#E5E8EB]">
        Recommended recipes
      </div>
      <Recommend
        user={user}
        setRecipe={setRecipe}
        meals={meals}
        setMeals={setMeals}
        demomeals={demomeals}
        setNewUser={setNewUser}
      />
      <div className="text-3xl sm:text-4xl py-2 pt-3 font-medium text-[#E5E8EB]">
        Choose your meal composition
      </div>
      <Chart
        meals={meals}
        caloriesMaintain={calories && calories.caloriesMaintain}
        demomeals={demomeals}
      />
    </div>
  );
};

export default DashboardMain;
