import {
  equalTo,
  get,
  onValue,
  orderByChild,
  query,
  ref,
  set,
} from "firebase/database";
import { useEffect, useState } from "react";
import { database, storage } from "../../../backend/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faTableCells,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import loader from "../../assets/loading.gif";
import { useDropzone } from "react-dropzone";

const convertDate = (createdAt) => {
  const date = new Date(createdAt);

  // Get the hour and minute
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  // Convert the month number to its abbreviation
  const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(date);

  // Get the day of the month
  const dayOfMonth = date.getDate();

  // Format the output
  const formattedDate = `${hour}:${minute} ${monthAbbreviation} ${dayOfMonth}`;
  return formattedDate;
};

const Profile = ({ user }) => {
  const userId = (user && user.uid) || null;
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editOpen, seteditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [newBio, setNewBio] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      const userRef = ref(database, `users/${userId}/onboardData/name`);

      onValue(userRef, (snapshot) => {
        setName(snapshot.val());
      });
    };

    fetchUserName();
  }, [userId]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) return;

      const postsRef = query(
        ref(database, "posts"),
        orderByChild("author"),
        equalTo(userId)
      );

      onValue(postsRef, (snapshot) => {
        const fetchedPosts = [];
        snapshot.forEach((childSnapshot) => {
          const post = childSnapshot.val();
          fetchedPosts.push(post);
        });

        // Sort the fetched posts by createdAt
        const orderedPosts = fetchedPosts.sort(
          (a, b) => b.createdAt - a.createdAt
        );

        setPosts(orderedPosts);
      });
    };

    fetchPosts();
  }, [userId]);

  const onDrop = async (acceptedFiles) => {
    // setLoading(true);
    const file = acceptedFiles[0];
    setImageFile(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const bioData = [
    "Savoring flavors from around the globe! ",
    "Coffee, code, and creating things. ☕️️",
    "Always up for an adventure! ️✈️",
    "Bookworm by day, coder by night. ",
    "Music is my therapy. ",
  ];

  const imagePaths = [
    "https://static.vecteezy.com/system/resources/previews/014/171/236/non_2x/cute-animals-forest-farm-domestic-polar-in-cartoon-style-giraffe-elephant-crab-rabbit-fox-chick-deer-hippo-lion-zebra-free-vector.jpg",
    "https://static.vecteezy.com/system/resources/previews/014/171/204/non_2x/cute-animals-forest-farm-domestic-polar-in-cartoon-style-giraffe-elephant-crab-rabbit-fox-chick-deer-hippo-lion-zebra-free-vector.jpg",
    "https://static.vecteezy.com/system/resources/previews/014/171/205/non_2x/cute-animals-forest-farm-domestic-polar-in-cartoon-style-giraffe-elephant-crab-rabbit-fox-chick-deer-hippo-lion-zebra-free-vector.jpg",
    "https://static.vecteezy.com/system/resources/previews/014/171/170/non_2x/cute-animals-forest-farm-domestic-polar-in-cartoon-style-giraffe-elephant-crab-rabbit-fox-chick-deer-hippo-lion-zebra-free-vector.jpg",
    "https://static.vecteezy.com/system/resources/previews/014/171/209/non_2x/cute-animals-forest-farm-domestic-polar-in-cartoon-style-giraffe-elephant-crab-rabbit-fox-chick-deer-hippo-lion-zebra-free-vector.jpg",
    "https://static.vecteezy.com/system/resources/previews/014/171/189/non_2x/cute-animals-forest-farm-domestic-polar-in-cartoon-style-giraffe-elephant-crab-rabbit-fox-chick-deer-hippo-lion-zebra-free-vector.jpg",
  ];

  const generateRandomProfile = async () => {
    const randomBioIndex = Math.floor(Math.random() * bioData.length);
    const randomImageIndex = Math.floor(Math.random() * imagePaths.length);

    const randomBio = bioData[randomBioIndex];
    const randomImagePath = imagePaths[randomImageIndex];

    const bioRef = ref(database, `users/${userId}/profile`);
    await set(bioRef, { bio: randomBio, imagePath: randomImagePath });

    return { bio: randomBio, imagePath: randomImagePath };
  };

  useEffect(() => {
    if (!userId) return;

    const bioRef = ref(database, `users/${userId}/profile`);

    // Using onValue to listen for changes in real time
    const unsubscribe = onValue(bioRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setBio(data.bio);
        setProfileImage(data.imagePath || "");
      } else {
        // If there's no data, generate random profile (this will also trigger onValue again once data is set)
        generateRandomProfile().then((randomProfile) => {
          setBio(randomProfile.bio);
          setProfileImage(randomProfile.imagePath || "");
        });
      }
    });

    // Clean up the listener when the component unmounts or the userId changes
    return () => unsubscribe();
  }, [userId]);

  // const handleImageChange = (event) => {  for image upload type file
  //   const file = event.target.files[0];
  //   setImageFile(file);
  // };

  const handleSaveChanges = async () => {
    setLoading(true);
    if (imageFile) {
      await uploadProfileImage();
    }
    if (newBio.trim() !== "") {
      await updateBio();
    }
    seteditOpen(false);
    setLoading(false);
  };

  const uploadProfileImage = async () => {
    const storageRef = storage.ref();
    const imageRef = storageRef.child(
      `profile_images/${userId}/${imageFile.name}`
    );

    await imageRef.put(imageFile);
    const imageUrl = await imageRef.getDownloadURL();
    setProfileImage(imageUrl);
    const updates = {};
    updates[`users/${userId}/profile/imagePath`] = imageUrl;
    const pathRef = ref(database, `users/${userId}/profile/imagePath`);
    await set(pathRef, imageUrl);
  };

  const updateBio = async () => {
    const bioRef = ref(database, `users/${userId}/profile/bio`);
    await set(bioRef, newBio);
    setBio(newBio);
  };

  const truncateContent = (content) => {
    const maxLength = 200; // Set the maximum length of characters
    if (content.length <= maxLength) {
      return content;
    } else {
      const truncatedContent = content.substring(0, maxLength) + "...";
      return truncatedContent;
    }
  };

  const [expandedPostId, setExpandedPostId] = useState(null);

  const toggleExpand = (postId) => {
    if (postId === expandedPostId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
    }
  };
  // console.log(profileImage, bio);
  if (!profileImage) {
    return <img src={loader} width={100} />;
  }
  return (
    <div className="w-[90%] h-fit relative bg-[#23323d] p-5 px-10 mt-6 rounded-xl shadow-lg shadow-black">
      <div className="flex justify-start items-center gap-8">
        <div className="">
          <img
            src={
              profileImage
                ? profileImage
                : "https://cdn.pixabay.com/photo/2012/04/13/21/07/user-33638_640.png"
            }
            alt="Profile picture"
            className="w-28 h-28 object-cover bg-slate-500 rounded-full "
          />
        </div>
        <div className="flex flex-col justify-start gap-3">
          <div className="flex justify-start items-center gap-5">
            <div className="text-[#E5E8EB] font-medium">{name}</div>
            <div
              className="flex justify-center items-center cursor-pointer gap-2 px-3 py-2 bg-[#0e161b] w-fit rounded-lg text-[#E5E8EB] font-medium"
              onClick={() => seteditOpen(true)}
            >
              Edit Profile
            </div>
          </div>
          <div className="text-sm  font-medium text-[#a9a9aa]">{bio}</div>
        </div>
      </div>
      <hr className="my-8" />
      <div className="flex justify-center items-center gap-2 px-4 py-2 bg-[#0e161b] w-fit mb-3 rounded-lg text-[#E5E8EB] font-medium">
        <FontAwesomeIcon icon={faTableCells} />
        <div>POSTS</div>
      </div>
      <div className="flex w-full justify-center items-start gap-5">
        <div className="flex flex-col w-[60%]">
          {posts.length == 0 && (
            <div className="bg-[#0e161b] rounded-lg px-5 mb-3 py-5 w-full text-[#E5E8EB] font-medium">
              No Posts Available
            </div>
          )}
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-[#0e161b] rounded-lg px-5 mb-3 pb-5 pt-2 w-full relative text-[#E5E8EB] font-medium"
            >
              <div className="text-[11px] text-gray-400 absolute top-2 right-3">
                {convertDate(post.createdAt)}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-start gap-3 items-center">
                  <img
                    src={post.image}
                    alt="userImage"
                    className="w-10 h-10 object-cover bg-slate-500 rounded-full"
                  />
                  <span>{post.name}</span>
                </div>
                {post.postImage && (
                  <div className="w-full">
                    <img
                      src={post.postImage}
                      alt="post-image"
                      className="w-full object-cover"
                    />
                  </div>
                )}
                <p className="text-sm text-[#a9a9aa]">
                  {expandedPostId === post.id
                    ? post.content
                    : truncateContent(post.content)}
                  {post.content.length > 200 && (
                    <span
                      className="text-blue-500 cursor-pointer hover:text-blue-700 px-1"
                      onClick={() => toggleExpand(post.id)}
                    >
                      {expandedPostId === post.id ? "Read less" : "Read more"}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center items-center sticky top-10 w-[40%]">
          <div className="bg-[#0e161b] w-[85%] h-fit rounded-lg mx-10 pb-5 text-[#E5E8EB] font-medium overflow-hidden flex flex-col p-5 justify-start items-center shadow-lg shadow-gray-950">
            Create your post from recent blogs
            <hr className="w-[70%] my-3" />
            <a
              href="https://www.indianhealthyrecipes.com/"
              className="text-gray-400 hover:text-[#E5E8EB] cursor-pointer py-2"
            >
              Indian Healthy Recipes
            </a>
            <a
              href="https://myfoodstory.com/"
              className="text-gray-400 hover:text-[#E5E8EB] cursor-pointer py-2"
            >
              My Food Story
            </a>
            <a
              href="https://masalaandchai.com/"
              className="text-gray-400 hover:text-[#E5E8EB] cursor-pointer py-2"
            >
              Masala and Chai
            </a>
            <a
              href="https://blog.pureindianfoods.com/"
              className="text-gray-400 hover:text-[#E5E8EB] cursor-pointer py-2"
            >
              Pure Indian Foods
            </a>
            <a
              href="https://theurbantandoor.com/"
              className="text-gray-400 hover:text-[#E5E8EB] cursor-pointer py-2"
            >
              The Urban Tandoor
            </a>
          </div>
        </div>
      </div>
      {editOpen && (
        <div className="absolute top-10 w-[90%] h-fit rounded-xl bg-[#324552] px-10 py-10 shadow-2xl shadow-black">
          <div
            className="absolute top-3 right-5 "
            onClick={() => seteditOpen(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="cursor-pointer" />
          </div>
          {/* <div className="flex flex-col justify-start gap-2">   image input type file
            <div className="text-lg font-medium text-[#E5E8EB]">
              Change Photo
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              className="outline-none bg-[#0e161b] text-[#E5E8EB] font-medium rounded-lg px-3 py-2"
            />
          </div> */}
          <div className="text-lg font-medium text-[#E5E8EB] pb-2">
            Change Photo
          </div>
          <div
            className="w-[50%] h-[120px] flex justify-center cursor-pointer items-center p-5 bg-slate-400 rounded-xl"
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
                <p className="font-medium text-center flex flex-col justify-center items-center">
                  Drag &apos;N&apos; drop profile image here,
                  <br /> or <br />
                  <span className="border border-black bg-slate-200 w-fit px-3 py-1 rounded-lg">
                    Select File
                  </span>
                </p>
              </div>
            )}
          </div>
          <p className="font-bold">
            {imageFile ? imageFile.name : "No Choosen File"}
          </p>
          <div className="flex flex-col mt-3 justify-start gap-2">
            <div className="text-lg font-medium text-[#E5E8EB]">Change Bio</div>
            <input
              type="text"
              placeholder={bio}
              value={newBio}
              maxLength={100}
              onChange={(e) => setNewBio(e.target.value)}
              className="outline-none bg-[#0e161b] text-[#E5E8EB] font-medium rounded-lg px-3 py-2 mb-3"
            />
          </div>
          <button
            onClick={handleSaveChanges}
            className="bg-[#f5c754] hover:bg-[#f89f2b] w-fit px-3 py-2 rounded-lg font-medium cursor-pointer text-center mt-2"
          >
            {loading ? (
              <div className="flex">
                <p>saving...</p> <img src={loader} width={30} />
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
