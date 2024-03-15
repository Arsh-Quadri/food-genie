import { onValue, ref } from "firebase/database";
import { database } from "../../../backend/firebase";
import { useEffect, useState } from "react";

const Community = () => {
  const postsRef = ref(database, "posts");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const fetchedPosts = snapshot.val() || {}; // Handle potential null values
      const orderedPosts = Object.values(fetchedPosts).sort(
        (a, b) => b.createdAt - a.createdAt // Sort by descending createdAt
      );
      setPosts(orderedPosts);
    });

    return () => unsubscribe(); // Unsubscribe on unmount
  }, []);
  return (
    <div className="w-[90%] h-fit relative bg-[#23323d] flex flex-col gap-3 p-5 px-10 mt-6 rounded-xl shadow-lg shadow-black">
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
  );
};

export default Community;
