import { useState, useEffect } from "react";
import {
  endBefore,
  get,
  limitToLast,
  onValue,
  orderByKey,
  query,
  ref,
  startAfter,
} from "firebase/database";
import { database } from "../../../backend/firebase";
import loader from "../../assets/loading.gif";
import { useSpring, animated } from "react-spring";

const Community = ({ user }) => {
  const userId = (user && user.uid) || null;
  const postsRef = ref(database, "posts");
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  const calc = (x, y) => [
    -(y - window.innerHeight / 2) / 20,
    (x - window.innerWidth / 2) / 20,
    1,
  ];
  const trans = (x, y, s) =>
    `perspective(800px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 20, tension: 400, friction: 50 },
  }));

  // infinite scroll in posts
  useEffect(() => {
    const fetchInitialPosts = async () => {
      setIsLoading(true); // Start loading
      const postsQuery = query(postsRef, orderByKey(), limitToLast(5)); // Fetch the last 5 posts

      onValue(postsQuery, (snapshot) => {
        const fetchedPosts = [];
        snapshot.forEach((childSnapshot) => {
          const post = { id: childSnapshot.key, ...childSnapshot.val() };
          fetchedPosts.unshift(post); // Prepend to keep newer posts at the top
        });
        setPosts(fetchedPosts);
        setLastVisiblePost(fetchedPosts[fetchedPosts.length - 1]?.id || null);
        setIsLoading(false); // End loading
      });
    };

    fetchInitialPosts();
  }, []);

  const [lastVisiblePost, setLastVisiblePost] = useState(null);
  const fetchMorePosts = async () => {
    if (isLoading || !lastVisiblePost) return;
    setIsLoading(true);
    const morePostsQuery = query(
      postsRef,
      orderByKey(),
      endBefore(lastVisiblePost), // Adjust the query to fetch older posts before the last visible post
      limitToLast(5)
    );

    onValue(morePostsQuery, (snapshot) => {
      const fetchedPosts = [];
      snapshot.forEach((childSnapshot) => {
        const post = { id: childSnapshot.key, ...childSnapshot.val() };
        fetchedPosts.unshift(post); // Ensure newer posts are at the top
      });
      if (fetchedPosts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
        setLastVisiblePost(fetchedPosts[fetchedPosts.length - 1]?.id);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.offsetHeight &&
        !isLoading
      ) {
        fetchMorePosts();
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, lastVisiblePost]);

  //normal post fetching
  // useEffect(() => {
  //   const unsubscribe = onValue(postsRef, (snapshot) => {
  //     const fetchedPosts = snapshot.val() || {};
  //     const orderedPosts = Object.values(fetchedPosts).sort(
  //       (a, b) => b.createdAt - a.createdAt
  //     );
  //     setPosts(orderedPosts);
  //   });

  //   return () => unsubscribe();
  // }, []);
  useEffect(() => {
    const fetchUserBio = async () => {
      if (!userId) return;

      const bioRef = ref(database, `users/${userId}/profile`);
      const snapshot = await get(bioRef);
      if (snapshot.exists()) {
        setBio(snapshot.val().bio);
        setProfileImage(snapshot.val().imagePath || "");
      }
    };

    const fetchUserName = async () => {
      const userRef = ref(database, `users/${userId}/onboardData/name`);

      onValue(userRef, (snapshot) => {
        setName(snapshot.val());
      });
    };

    fetchUserName();

    fetchUserBio();
  }, [userId]);
  const convertDate = (createdAt) => {
    // console.log(createdAt);
    if (!createdAt) {
      console.error("Invalid or undefined date provided to convertDate");
      // Return a default value or handle this case as needed
      return "Date unavailable";
    }
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

  const truncateContent = (content) => {
    const maxLength = 200; // Set the maximum length of characters
    if (content.length <= maxLength) {
      return content;
    } else {
      const truncatedContent = content.substring(0, maxLength) + "...";
      return truncatedContent;
    }
  };

  // const [expandedPostId, setExpandedPostId] = useState(null);

  const toggleExpand = (postId) => {
    setExpandedPosts((prevExpandedPosts) => {
      const newExpandedPosts = new Set(prevExpandedPosts); // Create a copy of the current set
      if (newExpandedPosts.has(postId)) {
        newExpandedPosts.delete(postId); // Remove the post if it's already expanded
      } else {
        newExpandedPosts.add(postId); // Add the post if it's not expanded
      }
      return newExpandedPosts;
    });
  };

  if (posts.length == 0 && !profileImage) {
    return <img src={loader} width={100} className="" />;
  }
  return (
    <div className="w-[90%] h-fit relative bg-[#23323d] flex gap-5 p-10 mt-6 rounded-xl shadow-lg shadow-black">
      <div className="flex flex-col gap-3 w-[60%]">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-[#0e161b] rounded-lg px-5 pb-5 pt-2 relative text-[#E5E8EB] font-medium"
          >
            <div className="text-[11px] text-gray-400 absolute top-2 right-3">
              {post.createdAt && convertDate(post.createdAt)}
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

              <p className="text-sm text-[#a9a9aa] whitespace-pre-wrap">
                {expandedPosts.has(post.id)
                  ? post.content
                  : post.content && truncateContent(post.content)}
                {post.content && post.content.length > 200 && (
                  <span
                    className="text-blue-500 cursor-pointer hover:text-blue-700 px-1"
                    onClick={() => toggleExpand(post.id)}
                  >
                    {expandedPosts.has(post.id) ? "Read less" : "Read more"}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="loading-indicator flex justify-center items-center">
            <img src={loader} alt="Loading..." width={100} />
          </div>
        )}
      </div>
      <div className="flex flex-col items-end w-[40%]">
        <animated.div
          className="profile-card bg-[#0e161b] w-[70%] rounded-lg mx-10 pb-5 text-[#E5E8EB] font-medium overflow-hidden flex flex-col justify-center items-center sticky top-10 shadow-lg shadow-gray-950"
          onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
          onMouseLeave={() => set({ xys: [0, 0, 1] })}
          style={{
            transform: props.xys.to(trans),
          }}
        >
          <div className="relative mb-10 w-full flex justify-center items-center border border-b-2 border-gray-300 pb-4">
            <img
              src={
                profileImage
                  ? profileImage
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt=""
              className="w-full scale-125 h-[80px] object-cover blur-[8px] brightness-75 overflow-hidden "
            />
            <img
              src={
                profileImage
                  ? profileImage
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt=""
              className="w-28 h-28 object-cover rounded-full border-2 border-gray-300 absolute -bottom-10 shadow-[0_0px_20px_3px_rgba(0,0,0,0.9)] shadow-black"
            />
          </div>
          <h1 className="py-3">{name}</h1>
          <p className="w-[75%] text-center text-sm">{bio}</p>
        </animated.div>
      </div>
    </div>
  );
};

export default Community;
