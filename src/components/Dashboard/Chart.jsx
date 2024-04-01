import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ meals, caloriesMaintain, demomeals }) => {
  const [breakfast, setBreakfast] = useState({ name: "", calories: 0 });
  const [lunch, setLunch] = useState({ name: "", calories: 0 });
  const [dinner, setDinner] = useState({ name: "", calories: 0 });

  const breakfastData =
    (meals && meals.breakfast && meals.breakfast.breakfast) ||
    demomeals.breakfast.breakfast.map((recipe) => recipe);

  const lunchData =
    (meals && meals.lunch && meals.lunch.lunch) ||
    demomeals.lunch.lunch.map((recipe) => recipe);
  const dinnerData =
    (meals && meals.dinner && meals.dinner.dinner) ||
    demomeals.dinner.dinner.map((recipe) => recipe);

  const totalCalories = breakfast.calories + lunch.calories + dinner.calories;

  const option = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#E5E8EB" } },
    },
    scales: {
      y: {
        ticks: { color: "#E5E8EB" }, // Change y-axis tick text color
        grid: {
          color: "rgb(239, 239, 240,0.1)", // Change x-axis grid color to light gray
        },
      },
      x: {
        ticks: { color: "#E5E8EB" }, // Change x-axis tick text color
        grid: {
          color: "rgba(239, 239, 240,0.1)", // Change x-axis grid color to light gray
        },
      },
    },
  };
  const data = {
    labels: ["Calories Comparison"],
    datasets: [
      {
        label: "Total Calories you chose",
        data: [totalCalories],
        backgroundColor: "#33FF8D",
        color: "#E5E8EB",
      },
      {
        label: "Maintain weight Calories",
        data: [caloriesMaintain],
        backgroundColor: "#3339FF",
      },
    ],
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5 my-5">
        <div className="flex flex-col justify-center items-start gap-3  ">
          <div className="text-xl text-[#E5E8EB]">Choose your Breakfast</div>
          <div className="border bg-[#121c24] border-[#E5E8EB] px-2 text-[#E5E8EB] text-sm font-medium rounded-lg w-full">
            <select
              value={breakfast.name}
              onChange={(e) => {
                const selectedRecipe = breakfastData.find(
                  (recipe) => recipe.name === e.target.value
                );
                setBreakfast({
                  name: e.target.value,
                  calories: selectedRecipe ? selectedRecipe.calories : 0,
                });
              }}
              className="w-full bg-[#121c24] outline-none py-2 cursor-pointer"
            >
              <option value="">Select Breakfast</option>
              {breakfastData &&
                breakfastData.map((recipe, index) => (
                  <option value={recipe.name} key={index}>
                    {recipe.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start gap-3  ">
          <div className="text-xl text-[#E5E8EB]">Choose your Lunch</div>
          <div className="border bg-[#121c24] border-[#E5E8EB] px-2 text-[#E5E8EB] text-sm font-medium rounded-lg w-full">
            <select
              value={lunch.name}
              onChange={(e) => {
                const selectedRecipe = lunchData.find(
                  (recipe) => recipe.name === e.target.value
                );
                setLunch({
                  name: e.target.value,
                  calories: selectedRecipe ? selectedRecipe.calories : 0,
                });
              }}
              className="w-full bg-[#121c24] outline-none py-2 cursor-pointer"
            >
              <option value="">Select Lunch</option>
              {lunchData &&
                lunchData.map((recipe, index) => (
                  <option value={recipe.name} key={index}>
                    {recipe.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start gap-3  ">
          <div className="text-xl text-[#E5E8EB]">Choose your Dinner</div>
          <div className="border bg-[#121c24] border-[#E5E8EB] px-2 text-[#E5E8EB] text-sm font-medium rounded-lg w-full">
            <select
              value={dinner.name}
              onChange={(e) => {
                const selectedRecipe = dinnerData.find(
                  (recipe) => recipe.name === e.target.value
                );
                setDinner({
                  name: e.target.value,
                  calories: selectedRecipe ? selectedRecipe.calories : 0,
                });
              }}
              className="w-full bg-[#121c24] outline-none py-2 cursor-pointer"
            >
              <option value="">Select Dinner</option>
              {dinnerData &&
                dinnerData.map((recipe, index) => (
                  <option value={recipe.name} key={index}>
                    {recipe.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      <div className="w-full mt-10 text-2xl py-3 text-center font-medium text-[#E5E8EB]">
        Total Calories in Recipes vs Maintain weight Calories
      </div>
      <Bar options={option} data={data} className="mb-5" />
    </>
  );
};

export default Chart;
