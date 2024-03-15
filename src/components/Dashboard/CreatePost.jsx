import { useEffect, useState } from "react";
import { database } from "../../../backend/firebase";
import { onValue, push, ref, set } from "firebase/database";

const CreatePost = ({ user }) => {
  const userId = (user && user.uid) || null;
  const [content, setContent] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      const userRef = ref(database, `users/${userId}/onboardData/name`); // Replace with your logic to get user ID

      // Option 1: Fetch name once on mount
      // const snapshot = await get(userRef);
      // setName(snapshot.val());

      // Option 2: Listen for name updates (optional)
      onValue(userRef, (snapshot) => {
        setName(snapshot.val());
      });
    };

    fetchUserName();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content) {
      alert("Please enter post content.");
      return;
    }

    try {
      await createPost(content); // Call the createPost function
      setContent(""); // Clear the input field after successful post creation

      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const createPost = async (content) => {
    const timestamp = Date.now(); // Get the current timestamp

    const newPost = {
      content,
      author: userId,
      name: name,
      createdAt: timestamp,
      // Other relevant post data (e.g., likes, comments)
    };

    // Generate a unique post ID using a reliable library like `nanoid`

    // Create a reference to the location where the new post will be stored
    const postRef = await push(ref(database, "posts")); // Push to posts collection
    const newPostId = postRef.key;

    // Write the post data to the database (handle potential errors gracefully)
    try {
      await set(postRef, { ...newPost, id: newPostId });
    } catch (error) {
      console.error("Error writing post to database:", error);
      throw error; // Re-throw the error to allow the `handleSubmit` function to handle it
    }
    return newPostId;
  };
  return (
    <div className="w-[90%] h-fit relative bg-[#23323d] p-5 px-10 mt-6 rounded-xl shadow-lg shadow-black">
      <div className="text-2xl w-full font-medium py-3 text-[#E5E8EB]">
        CreatePost
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          rows={10}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Create a new post..."
          className="w-full bg-transparent outline-none text-[#E5E8EB] border border-[#E5E8EB] px-2 py-1 rounded-lg"
        />
        <button
          type="submit"
          className="text-sm font-medium bg-[#F5C754] hover:bg-[#ffcb48] px-3 py-1 rounded-lg mt-3"
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
