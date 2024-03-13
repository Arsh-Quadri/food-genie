import facebook from "../assets/facebook.png";
import twitter from "../assets/twitter.png";
import insta from "../assets/instagram.png";

const Footer = () => {
  return (
    <div className="pt-5 bg-[#121c24] flex justify-center items-center">
      <div className="w-[70vw] flex flex-col justify-center items-center gap-4 py-5">
        <div className="flex flex-wrap justify-center items-center font-[500] text-[#E5E8EB] gap-5 md:gap-10 lg:gap-20">
          <div className="cursor-pointer">About</div>
          <div className="cursor-pointer">Community</div>
          <div className="cursor-pointer">Host</div>
          <div className="cursor-pointer">Support</div>
          <div className="cursor-pointer">Trust & Safety</div>
        </div>
        <div className="flex justify-center items-center gap-5">
          <img
            src={facebook}
            alt=""
            className="cursor-pointer white-icon mr-1"
          />
          <img src={twitter} alt="" className="cursor-pointer white-icon" />
          <img src={insta} alt="" className="cursor-pointer white-icon" />
        </div>
        <div className="font-[500] text-[#E5E8EB]">2024 FoodGenie, Inc.</div>
      </div>
    </div>
  );
};

export default Footer;
