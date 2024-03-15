import { useState, useEffect } from "react";
import { ref, get, update } from "firebase/database";
import { database } from "../../../backend/firebase";
import { useNavigate } from "react-router-dom";

const Settings = ({ user }) => {
  const userId = (user && user.uid) || null;
  const [name, setName] = useState("");
  const [gainOrLose, setgainOrLose] = useState("");
  const [vegNonveg, setvegNonveg] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setgender] = useState("");
  const navigate = useNavigate();

  // Fetch user data upon component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !userId) return;

      const userRef = ref(database, `users/${userId}/onboardData`);
      const snapshot = await get(userRef);
      const data = snapshot.val();

      if (data) {
        setName(data.name || "");
        setgainOrLose(data.gainOrLose || "");
        setvegNonveg(data.vegNonveg || "");
        setHeight(data.height || "");
        setWeight(data.weight || "");
        setAge(data.age || "");
        setgender(data.gender || "");
      }
    };

    fetchUserData();
  }, [user, userId]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();

    // Update Firebase data
    try {
      console.log(`users/${userId && userId}/onboardData`);
      const userRef = ref(database, `users/${userId && userId}/onboardData`);
      await update(userRef, {
        height,
        weight,
        age,
        gender,
        gainOrLose,
        vegNonveg,
        name,
      });
      window.scrollTo(0, 0);
      navigate("/dashboard");
      console.log("Hello");
      // ... rest of your success logic (e.g., show confirmation message)
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  // ... rest of your component code (form and input fields)

  return (
    <div className="w-[90%] h-fit relative flex flex-col items-center justify-center bg-[#23323d] p-5 px-10 mt-6 rounded-xl shadow-lg shadow-black">
      <div className=" w-[50%] px-1 py-1  z-20 mt-3 mb-12  ">
        <div className="text-2xl font-medium text-[#E5E8EB] py-3">
          Update your preferences
        </div>
        <form className="w-full" onSubmit={handleSaveSettings}>
          <div className=" w-full flex flex-col justify-center items-center bg-[#1a2329] rounded-xl shadow-lg shadow-black">
            <div className="w-full flex flex-col justify-center  rounded-3xl px-8 py-2">
              <div className="mt-3 ">
                <div className="flex flex-col">
                  <label className="pb-1 font-medium text-[#E5E8EB]">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    className="bg-transparent px-3 py-2 border border-[#E5E8EB] rounded-lg outline-none text-sm font-medium text-[#E5E8EB]"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <h1 className="text-lg text-[#E5E8EB] font-medium text-left ">
                  What's your primary goal?
                </h1>
                <div className="mt-3  flex flex-row font-[500]  gap-2">
                  <label className="flex justify-center items-center gap-3 px-2 py-1 w-fit rounded-lg border border-[#E5E8EB]">
                    <input
                      type="radio"
                      value="weightloss"
                      checked={gainOrLose === "weightloss"}
                      onChange={(e) => setgainOrLose(e.target.value)}
                      className="form-radio w-3 text-black "
                    />
                    <span className="text-sm font-medium text-[#c0c1c2]">
                      Weight Loss
                    </span>
                  </label>
                  <label className="flex gap-3 px-2 py-1 w-fit rounded-lg border border-[#E5E8EB]">
                    <input
                      type="radio"
                      value="weightgain"
                      checked={gainOrLose === "weightgain"}
                      onChange={(e) => setgainOrLose(e.target.value)}
                      className="form-radio w-3 text-black "
                    />
                    <span className="text-sm font-medium text-[#c0c1c2]">
                      Weight Gain
                    </span>
                  </label>
                </div>
              </div>
              <div className=" mt-3">
                <h1 className="text-lg text-[#E5E8EB] font-[600] relative  left-0 text-left ">
                  What's your preferences?
                </h1>
                <div className="mt-3  flex flex-row font-[500]  gap-2">
                  <label className="flex justify-center items-center gap-3 px-2 py-1 w-fit rounded-lg border border-[#E5E8EB]">
                    <input
                      type="radio"
                      value="veg"
                      checked={vegNonveg === "veg"}
                      onChange={(e) => setvegNonveg(e.target.value)}
                      className="form-radio w-3 text-black"
                    />
                    <span className="text-sm font-medium text-[#c0c1c2]">
                      Veg
                    </span>
                  </label>
                  <label className="flex gap-3 px-2 py-1 w-fit rounded-lg border border-[#E5E8EB]">
                    <input
                      type="radio"
                      value="nonveg"
                      checked={vegNonveg === "nonveg"}
                      onChange={(e) => setvegNonveg(e.target.value)}
                      className="form-radio w-3 text-black"
                    />
                    <span className="text-sm font-medium text-[#c0c1c2]">
                      Non-Veg
                    </span>
                  </label>
                  <label className="flex justify-center items-center gap-3 px-2 py-1 w-fit rounded-lg border border-[#E5E8EB]">
                    <input
                      type="radio"
                      value="vegan"
                      checked={vegNonveg === "vegan"}
                      onChange={(e) => setvegNonveg(e.target.value)}
                      className="form-radio w-3 text-black "
                    />
                    <span className="text-sm font-medium text-[#c0c1c2]">
                      Vegan
                    </span>
                  </label>
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-3">
                <div className="flex flex-col">
                  <label className="pb-1 font-medium text-[#E5E8EB]">
                    Height(cm):
                  </label>
                  <input
                    type="number"
                    id="name"
                    value={height}
                    className="bg-transparent px-3 py-2 border border-[#E5E8EB] rounded-lg outline-none text-sm font-medium text-[#E5E8EB]"
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="pb-1 font-medium text-[#E5E8EB]">
                    Weight(kg):
                  </label>
                  <input
                    type="number"
                    id="name"
                    value={weight}
                    className="bg-transparent px-3 py-2 border border-[#E5E8EB] rounded-lg outline-none text-sm font-medium text-[#E5E8EB]"
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="pb-1 font-medium text-[#E5E8EB]">
                    Age:
                  </label>
                  <input
                    type="number"
                    id="name"
                    value={age}
                    className="bg-transparent px-3 py-2 border border-[#E5E8EB] rounded-lg outline-none text-sm font-medium text-[#E5E8EB]"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div>
                  <h1 className="text-lg pb-1 text-[#E5E8EB] font-medium text-left ">
                    Gender:
                  </h1>
                  <div className="flex flex-row font-[500]  gap-2">
                    <label className="flex justify-center items-center gap-3 px-2 py-1 w-fit rounded-lg border border-[#E5E8EB]">
                      <input
                        type="radio"
                        value="male"
                        checked={gender === "male"}
                        onChange={(e) => setgender(e.target.value)}
                        className="form-radio w-3 text-black "
                      />
                      <span className="text-sm font-medium text-[#c0c1c2]">
                        Male
                      </span>
                    </label>
                    <label className="flex gap-3 px-2 py-1 w-fit rounded-lg border border-[#E5E8EB]">
                      <input
                        type="radio"
                        value="female"
                        checked={gender === "female"}
                        onChange={(e) => setgender(e.target.value)}
                        className="form-radio w-3 text-black "
                      />
                      <span className="text-sm font-medium text-[#c0c1c2]">
                        Female
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="bg-[#f5c754] hover:bg-[#f89f2b] px-3 py-2 rounded-lg font-medium cursor-pointer  md:block text-center my-4"
              >
                Update Details
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
