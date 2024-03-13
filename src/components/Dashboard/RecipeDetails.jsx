import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const RecipeDetails = ({ recipe }) => {
  const navigate = useNavigate();
  return (
    <div className="w-[90%] h-fit bg-[#23323d] p-5 px-10 mt-6 rounded-xl shadow-lg shadow-black">
      <div
        className="absolute text-[#E5E8EB] text-xl cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </div>
      <div className="text-center text-3xl font-medium text-[#E5E8EB] ">
        {recipe.name}{" "}
        <span className="text-sm text-[#9ea3a4]">
          ( {recipe.calories} calories )
        </span>
      </div>
      <div className="text-2xl font-medium text-[#E5E8EB] py-3 mt-5">
        Ingredients
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {recipe &&
          recipe.ingredients.map((ingredient, index) => (
            <div
              className="flex items-center justify-around text-[#E5E8EB] font-medium bg-[#121c24] px-3 py-2 rounded-lg"
              key={index}
            >
              <div className="">{ingredient.name}</div>
              <div className="text-sm text-[#9ea3a4]">
                {ingredient.quantity}
              </div>
            </div>
          ))}
      </div>
      <div className="text-2xl font-medium text-[#E5E8EB] py-3 mt-5">
        Recipes
      </div>
      <div className="font-medium text-[#E5E8EB] pb-5">{recipe.method}</div>
    </div>
  );
};

export default RecipeDetails;
