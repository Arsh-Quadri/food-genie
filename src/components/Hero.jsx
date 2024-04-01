// import { Link } from "react-router-dom";
import { Link } from "react-router-dom";
import hero from "../assets/Hero.jpg";
// import card from "../assets/card.png";
import personalisedmealplan from "../assets/personalised.jpg";
import cfi from "../assets/cfi.jpeg";
import iff from "../assets/IFF2.jpg";
import chatbot from "../assets/chatbot.jpeg";
import crs from "../assets/CRS2.jpg";
import cmb from "../assets/CMB2.jpg";
import Accordion from "./Accordion";

const Hero = () => {
  const items = [
    {
      title: "What is FoodGenie and what does it do?",
      content: `[Your App Name] is a food suggestion web app powered by AI. It helps you achieve health goals with personalized diet plans, shape improvement tools, nutritional guidance, and allergy-friendly options.`,
    },
    {
      title: "How is FoodGenie different from other food suggestion apps?",
      content: `Our app goes beyond basic calorie counting. It personalizes plans based on your goals, health conditions, and preferences. Unique features include shape-focused guidance with photo upload and meal analysis.
    `,
    },
    {
      title: "How does the AI personalize my diet plan?",
      content: `FoodGenie considers your goals (weight loss, muscle gain, etc.), health conditions (allergies, diseases), and preferences (favorite foods, dietary restrictions) to create a customized plan.`,
    },
    {
      title: "Can I adjust my personalized plan if needed",
      content: `Yes, you can easily adjust your personalized plan by updating your goals, preferences, and tracking your progress to allow the AI to adapt your plan accordingly.
    `,
    },
    {
      title: "What are some upcoming features for the app?",
      content: `We're constantly innovating! We're exploring features like AR-enabled portion visualization, a user-generated recipe community, and integration with health wearables for even more personalized adjustments..
    `,
    },
  ];
  return (
    <>
      <div className="bg-[#121c24] w-full flex flex-col justify-center items-center relative ">
        <div className="w-[80vw] relative mt-8 flex justify-center items-center">
          <img
            src={hero}
            alt=""
            className="relative z-10 w-full object-cover rounded-lg h-[40vh] sm:h-[50vh] md:h-[80vh] brightness-[60%]"
          />
          <div className="absolute top-[-5%] left-[3%] w-full h-full flex flex-col justify-end items-start z-20 pb-[4%]">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-[500] text-white">
              Welcome to FoodGenie
            </h1>
            <p className="text-white font-[500] mt-[1%] text-base sm:text-lg mb-3">
              Upgrade your diet, Upgrade your life
            </p>
            <Link
              to="/signup"
              className="bg-[#F5C754] hover:bg-[#f89f2b] px-4 py-2 font-[500] rounded-lg cursor-pointer hidden md:block text-black"
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="flex flex-col w-[80vw] relative mt-8 text-[#E5E8EB]">
          <div className="text-left text-4xl font-[500] relative">
            Discover something new
          </div>
          <div className="text-left relative text-xl mt-3">
            Get inspired by the world of food. From local favorites to the
            best-kept secrets, enjoy a varity of choise
          </div>
        </div>
        <div className="feature flex flex-col w-[80vw] relative mt-8 text-[#E5E8EB]">
          <div className="cards relative grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 lg:gap-11">
            <div className="card min-w-[100px] w-full flex flex-col justify-center items-start">
              <div className="h-[80%]">
                <img
                  src={personalisedmealplan}
                  alt=""
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>
              <div className="font-[500] mt-2 h-[20%]">
                Personalized Meal Plans
              </div>
            </div>
            <div className="card min-w-[100px] w-full flex flex-col justify-center items-start">
              <div className="h-[80%]">
                <img
                  src={cfi}
                  alt=""
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>
              <div className="font-[500] mt-2 h-[20%] ">
                Comprehensive Food Info
              </div>
            </div>
            <div className="card min-w-[100px] w-full flex flex-col justify-center items-start">
              <div className="h-[80%]">
                <img
                  src={iff}
                  alt=""
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>
              <div className="font-[500] mt-2 h-[20%] ">Indian Food Focus</div>
            </div>
            <div className="card min-w-[100px] w-full flex flex-col justify-center items-start">
              <div className="h-[80%]">
                <img
                  src={chatbot}
                  alt=""
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>
              <div className="font-[500] mt-2 h-[20%] ">Chatbot Assistant</div>
            </div>
            <div className="card min-w-[100px] w-full flex flex-col justify-center items-start">
              <div className="h-[80%]">
                <img
                  src={cmb}
                  alt=""
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>
              <div className="font-[500] mt-2 h-[20%] ">
                Custom Meal Builder
              </div>
            </div>
            <div className="card min-w-[100px] w-full  flex flex-col justify-center items-start">
              <div className="h-[80%]">
                <img
                  src={crs}
                  alt=""
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>
              <div className="font-[500] mt-2 h-[20%] ">
                Community Recipe Sharing
              </div>
            </div>
          </div>
        </div>
        <div className="text-3xl font-medium pt-6 pb-3 text-[#E5E8EB] m-auto w-[80%]">
          Frequently asked questions
        </div>
        <Accordion items={items} />
      </div>
    </>
  );
};

export default Hero;
