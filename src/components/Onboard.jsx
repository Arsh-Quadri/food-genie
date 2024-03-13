import { useState } from "react";
// import { getDatabase } from "firebase/compat/database";
// import firebase from "firebase/compat/app";
import { useNavigate } from "react-router-dom";
// import { database } from "../../backend/firebase";
import { ref, set } from "firebase/database";
import { database } from "../../backend/firebase";

const Onboard = ({ user }) => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setgender] = useState("");
  // const [veg, setVeg] = useState("");
  const navigate = useNavigate();
  //   const auth = getAuth(app);
  // const database = getDatabase(app);
  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get a reference to the Firebase Realtime Database
      //   const database = getDatabase();

      // Push the user's name and meal description to the database
      const newUserRef = ref(database, `users/${user.uid}/onboardData`);

      // Set the user data under the unique key.
      set(newUserRef, {
        height: height,
        weight: weight,
        age: age,
        gender: gender,
        isOnboardingCompleted: true,
      });

      // Reset form fields and show success message
      setHeight("");
      setWeight("");
      setAge("");
      setgender("");
      // setVeg("")
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div>
      <h1>Onboarding Page</h1>
      <form onSubmit={handleOnboardingSubmit}>
        <div>
          <label htmlFor="name">height:</label>
          <input
            type="text"
            id="name"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="name">weight:</label>
          <input
            type="text"
            id="name"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="name">age:</label>
          <input
            type="text"
            id="name"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="name">gender:</label>
          <input
            type="text"
            id="name"
            value={gender}
            onChange={(e) => setgender(e.target.value)}
          />
        </div>
        {/* <div>
          <label htmlFor="name">veg or nonveg:</label>
          <input
            type="text"
            id="name"
            value={gender}
            onChange={(e) => setgender(e.target.value)}
          />
        </div> */}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Onboard;
