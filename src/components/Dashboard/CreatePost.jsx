import { useEffect, useState } from "react";
import { database, storage } from "../../../backend/firebase";
import { onValue, push, ref, set } from "firebase/database";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ user }) => {
  const userId = (user && user.uid) || null;
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [image, setImage] = useState("");
  const navigate = useNavigate();
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

    const imageRef = ref(database, `users/${userId}/profile/imagePath`);

    // Using onValue to listen for changes in real time
    const unsubscribe = onValue(imageRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setImage(data || "");
      }
    });

    // Clean up the listener when the component unmounts or the userId changes

    fetchUserName();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (imageFile) {
      const storageRef = storage.ref();
      const fileName = `${Date.now()}_${imageFile.name}`;
      const imageRef = storageRef.child(`posts_images/${userId}/${fileName}`);

      const uploadImage = async () => {
        try {
          await imageRef.put(imageFile);
          const pImageUrl = await imageRef.getDownloadURL();
          setPostImageUrl(pImageUrl);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      };

      uploadImage();
    }
  }, [imageFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content) {
      alert("Please enter post content.");
      return;
    }

    try {
      await createPost(content); // Call the createPost function
      setContent(""); // Clear the input field after successful post creation
      setImageFile(null);
      setPostImageUrl("");
      navigate("/dashboard/community");
      // alert("Post created successfully!");
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
      postImage: postImageUrl,
      image: image,
      // Other relevant post data (e.g., likes, comments)
    };

    // Generate a unique post ID using a reliable library like `nanoid`

    // Create a reference to the location where the new post will be stored
    const postRef = await push(ref(database, "posts")); // Push to posts collection
    const newPostId = postRef.key;

    // const updates = {};
    // updates[`users/${userId}/profile/imagePath`] = imageUrl;
    const pathRef = ref(database, `posts/${newPostId}/postimage`);
    await set(pathRef, postImageUrl);

    // Write the post data to the database (handle potential errors gracefully)
    try {
      await set(postRef, { ...newPost, id: newPostId });
    } catch (error) {
      console.error("Error writing post to database:", error);
      throw error; // Re-throw the error to allow the `handleSubmit` function to handle it
    }
    return newPostId;
  };

  const onDrop = async (acceptedFiles) => {
    // setLoading(true);
    const file = acceptedFiles[0];
    setImageFile(file);
    // if (imageFile) {
    //   const storageRef = storage.ref();
    //   const imageRef = storageRef.child(`posts_images/${imageFile.name}`);

    //   await imageRef.put(imageFile);
    //   const pImageUrl = await imageRef.getDownloadURL();
    //   console.log(pImageUrl);

    //   setPostImageUrl(pImageUrl);
    // }
    // setLoading(false);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div className="w-[90%] h-fit relative bg-[#23323d] p-5 px-10 mt-6 rounded-xl shadow-lg shadow-black">
      <div className="text-2xl w-full font-medium py-3 text-[#E5E8EB]">
        CreatePost
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex w-full gap-10 mb-3">
          <div
            className="w-[50%] h-[150px] flex justify-center cursor-pointer items-center p-5 bg-slate-400 rounded-xl"
            {...getRootProps()}
          >
            <input {...getInputProps()} className="" />

            {isDragActive ? (
              <p className="font-medium text-xl">Drop the image here ...</p>
            ) : (
              <div className="flex gap-4 justify-center items-center">
                <FontAwesomeIcon
                  icon={faCloudArrowUp}
                  className="text-[80px] text-[#23323d]"
                />
                <div className="font-medium text-center flex flex-col justify-center items-center">
                  Drag &apos;N&apos; drop profile image here,
                  <br /> or <br />
                  <div className="border border-black w-fit px-3 py-1 rounded-lg bg-slate-200">
                    Select File
                  </div>
                </div>
              </div>
            )}
          </div>

          {postImageUrl && (
            <div className="w-[50%]">
              <p className="font-medium overflow-x-hidden text-sm pb-2 text-[#E5E8EB]">
                {imageFile ? imageFile.name : "No Choosen File"}
              </p>
              <img
                src={postImageUrl}
                alt="post-image"
                className="rounded-lg h-[123px]"
              />
            </div>
          )}
        </div>
        <textarea
          value={content}
          rows={5}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Create a new post..."
          className="w-full bg-transparent scrollbar-none outline-none text-[#E5E8EB] border border-[#E5E8EB] px-2 py-1 rounded-lg"
        />
        <button
          type="submit"
          className="font-medium bg-[#F5C754] hover:bg-[#ffcb48] px-3 py-1.5 rounded-lg mt-3"
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
