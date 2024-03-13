// import { Link } from "react-router-dom";
import hero from "../assets/Hero.png";
import card from "../assets/card.png";
import search from "../assets/search.png";
import Accordion from "./Accordion";

const Hero = () => {
  const items = [
    { title: "Item 1", content: "Content for item 1" },
    { title: "Item 2", content: "Content for item 2" },
    { title: "Item 3", content: "Content for item 3" },
    { title: "Item 4", content: "Content for item 4" },
  ];
  return (
    <>
      {/* <div className="text-xl"> This is Hero page</div>
      <div className="flex gap-5">
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </div> */}
      <div className="bg-[#121c24] w-full flex flex-col justify-center items-center relative ">
        <div className="w-[80vw] relative mt-8 flex justify-center items-center">
          <img
            src={hero}
            alt=""
            className="relative z-10 w-full object-cover rounded-lg h-[60vh] md:h-[80vh] brightness-[60%]"
          />
          <div className="absolute top-[-5%] left-[3%] w-full h-full flex flex-col justify-end items-start z-20">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-[500] text-white">
              Welcome to Rentify
            </h1>
            <p className="text-white font-[500] mt-[1%] sm:text-lg">
              The world`s best selection of homes, experiences, and places
            </p>
            <form className="w-full">
              <div className="search w-[90%] sm:w-[60%] md:w-[50%] flex justify-between items-center gap-3 bg-[#FCFAF7] px-3 py-2 rounded-2xl mt-[4%]">
                <div className="flex justify-center items-center">
                  <img src={search} alt="" />
                  <input
                    type="text"
                    className="bg-transparent outline-none placeholder-[#9C784A] pl-4 w-[28vw]"
                    placeholder="Looking for something?"
                    // onChange={(e) => setSearch(e.target.value)}
                    // value={search}
                  />
                </div>
                <div
                  // onClick={handleSubmit}
                  className="bg-[#F28F0D] hover:bg-[#ffa42e] font-[500] px-3 py-2 rounded-lg cursor-pointer"
                >
                  Search
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="flex flex-col w-[80vw] relative mt-8 text-[#E5E8EB]">
          <div className="text-left text-5xl font-[500] relative">
            Discover something new
          </div>
          <div className="text-left relative text-2xl mt-3">
            Get inspired by the world of food. From local favorites to the
            best-kept secrets, enjoy a varity of choise
          </div>
        </div>
        <div className="feature flex flex-col w-[80vw] relative mt-8 text-[#E5E8EB]">
          <div className="cards relative grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 lg:gap-11">
            <div className="card min-w-[100px] flex flex-col justify-center items-start">
              <img src={card} alt="" className="w-full" />
              <div className="font-[500] mt-2">Restaurant</div>
              <div className="">this is description</div>
            </div>
            <div className="card min-w-[100px] flex flex-col justify-center items-start">
              <img src={card} alt="" className="w-full" />
              <div className="font-[500] mt-2 ">Dish</div>
              <div className="">this is description</div>
            </div>
            <div className="card min-w-[100px] flex flex-col justify-center items-start">
              <img src={card} alt="" className="w-full" />
              <div className="font-[500] mt-2 ">Cuisine</div>
              <div className="">this is description</div>
            </div>
            <div className="card min-w-[100px] flex flex-col justify-center items-start">
              <img src={card} alt="" className="w-full" />
              <div className="font-[500] mt-2 ">Dine in</div>
              <div className="">this is description</div>
            </div>
            <div className="card min-w-[100px] flex flex-col justify-center items-start">
              <img src={card} alt="" className="w-full" />
              <div className="font-[500] mt-2 ">Take on</div>
              <div className="">this is description</div>
            </div>
            <div className="card min-w-[100px] flex flex-col justify-center items-start">
              <img src={card} alt="" className="w-full" />
              <div className="font-[500] mt-2 ">Delevery</div>
              <div className="">this is description</div>
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
