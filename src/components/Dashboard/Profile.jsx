import { equalTo, onValue, orderByChild, query, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../backend/firebase";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const Profile = ({ user }) => {
  const userId = (user && user.uid) || null;
  const [name, setName] = useState("");
  const [bio, setbio] = useState("I am Busy...");
  const [profileImage, setProfileImage] = useState(null);
  const [posts, setPosts] = useState([]);

  // Fetch name upon component mount (or data change)
  useEffect(() => {
    const fetchUserName = async () => {
      const userRef = ref(database, `users/${userId}/onboardData/name`); // Replace with your logic to get user ID

      // Option 1: Fetch name once on mount
      // const snapshot = await get(userRef);
      // setName(snapshot.val());

      // Option 2: Listen for name updates (optional)
      onValue(userRef, (snapshot) => {
        setName(snapshot.val("I am Busy..."));
      });
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) return; // Ensure user ID is available

      const postsRef = query(
        ref(database, "posts"),
        orderByChild("author"),
        equalTo(userId) // Filter by creator ID
      );

      onValue(postsRef, (snapshot) => {
        const fetchedPosts = [];
        snapshot.forEach((childSnapshot) => {
          const post = childSnapshot.val();
          fetchedPosts.push(post);
        });
        setPosts(fetchedPosts);
      });
    };

    fetchPosts();
  }, [userId]);

  return (
    <div className="flex flex-col gap-3 w-[90%]">
      <div className="w-full h-fit relative bg-[#23323d] p-5 px-10 mt-6 rounded-xl shadow-lg shadow-black">
        <div className="flex justify-start items-center gap-4">
          <img
            src="https://cdn.pixabay.com/photo/2012/04/13/21/07/user-33638_640.png"
            alt="Profile picture"
            className="w-20 bg-slate-500 rounded-full "
          />
          <div className="text-[#E5E8EB] font-medium">{name}</div>
        </div>
        <div className=" mt-5 flex items-center w-full gap-3">
          <FontAwesomeIcon icon={faPen} className="text-[#E5E8EB]" />
          <input
            type="text"
            placeholder="Add your bio here..."
            value={bio}
            onChange={(e) => setbio(e.target.value)}
            className="bg-transparent px-2 py-1 w-full outline-none text-[#E5E8EB] font-medium border border-[#E5E8EB] rounded-lg"
          />
        </div>
      </div>
      <div className="w-full flex flex-col gap-3 h-fit relative bg-[#23323d] p-5 px-10 mt-6 rounded-xl shadow-lg shadow-black">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-slate-800 rounded-lg px-3 py-2 text-[#E5E8EB] font-medium"
          >
            <div className="flex flex-col gap-1">
              <div className="">{post.name}</div>
              <p className="text-sm ml-5 text-[#a9a9aa]">{post.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
