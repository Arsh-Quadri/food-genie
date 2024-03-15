import { useEffect, useState } from "react";
import google from "../assets/Google.png";
import { Link, useNavigate } from "react-router-dom";
import aboutpanorama from "../assets/Aboutp3.jpg";

const About = () => {
  return (
    <div className="bg-[#121c24] w-full flex flex-col justify-center items-center relative">
      <div className=" relative bckimg2">
        {/* <img src={aboutpanorama} alt="About Panorama" className="w-full" /> */}
        <div className="z-50">
          <div className="text-Black p-4">
            <h1 className="text-3xl ml-5 font-[750]">About</h1>
          </div>
          <div className="w-[47%] px-5 mt-5 mb-12">
            <p className="mt-2 cursor-pointer font-[500] ml-6">
              At FoodGenie, we're dedicated to revolutionizing your relationship
              with food. Our AI-powered platform is designed to empower
              individuals, like you, to embrace a healthier lifestyle
              effortlessly. We understand that achieving your wellness goals can
              be daunting, which is why our team of AI specialists has curated a
              range of tools and resources to support you every step of the way.
              <br />
              <br />
              Whether you're looking to manage your weight, improve your
              nutrition, or simply explore new culinary delights, FoodGenie is
              your ultimate companion. Our BMI and calorie calculators provide
              personalized insights tailored to your unique needs, helping you
              make informed decisions about your health.
              <br />
              <br />
              But FoodGenie is more than just a tool; it's a community. Join us
              and connect with like-minded individuals who share your passion
              for wholesome living. Share your favorite recipes, discover new
              flavors, and inspire others on their journey to wellness.
              <br />
              <br />
              Together, let's savor the joy of wholesome eating and unlock the
              full potential of a balanced and fulfilling life. Indulge your
              senses. Nourish your body. Live your best life with FoodGenie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
