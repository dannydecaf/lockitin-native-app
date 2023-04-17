import { useNavigation } from "@react-navigation/core";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useTailwind } from "tailwindcss-react-native";
import { Entypo, Fontisto } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import {
  doc,
  onSnapshot,
  collection,
  setDoc,
  query,
  where,
  getDocs,
  getDoc,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "../firebase";
import generateId from "../lib/generatedId";

const HomeScreen = () => {
  const tailwind = useTailwind();
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [profiles, setProfiles] = useState([]); // initialize state variables for profiles and setProfiles functions
  const swipeRef = useRef(null); // initialize a reference to the Swiper component

  useLayoutEffect(
    () =>
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (!snapshot.exists()) {
          navigation.navigate("Modal");
        }
      }),
    []
  );
  // useLayoutEffect is called synchronously after all DOM mutations. In this case, it listens to the changes to the user object in the Firebase
  // database and navigates to the "Modal" screen if the user object does not exist. This runs only once, on initial render.

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const likes = await getDocs(
        collection(db, "users", user.uid, "likes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passedUserIds = passes.length > 0 ? passes : ["test"];
      const likedUserIds = likes.length > 0 ? likes : ["test"];

      console.log([...passedUserIds, ...likedUserIds]);

      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUserIds, ...likedUserIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
              .slice(0, 5) // add this to limit the number of profiles to 5
          );
        }
      );
    };

    // useEffect hook is called asynchronously after initial render and after every update. It fetches profiles that have not been passed or liked
    // by the current user, sets the fetched profiles in state variable called "profiles", and unsubscribes from the snapshot listener after execution.

    fetchCards();
    return unsub;
  }, [db]); // useEffect hook only runs when "db" changes.

  const swipeLeft = (cardIndex) => {
    // Check if there's no more profiles to swipe
    if (!profiles[cardIndex]) return;

    // Get the profile that the user swiped left on
    const userSwiped = profiles[cardIndex];

    // Log that the user swiped left on the profile
    console.log(`You swiped PASS on ${userSwiped.displayName}`);

    // Save the profile to the user's "passes" collection in Firebase Firestore
    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };
  const swipeRight = async (cardIndex) => {
    // Check if there's no more profiles to swipe
    if (!profiles[cardIndex]) return;

    // Get the profile that the user swiped right on
    const userSwiped = profiles[cardIndex];

    // Get the current user's profile from Firebase Firestore
    const loggedInProfile = await (
      await getDoc(doc(db, "users", user.uid))
    ).data();

    // Check if the user swiped right on someone who already liked them
    getDoc(doc(db, "users", userSwiped.id, "likes", user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          // If there's a match, log it and save the profiles to the "matches" collection in Firebase Firestore
          console.log(`Nice! You matched with ${userSwiped.displayName}`);

          setDoc(
            doc(db, "users", user.uid, "likes", userSwiped.id),
            userSwiped
          );

          setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });

          // Navigate to the "Match" screen with the logged-in profile and the matched profile as props
          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });
        } else {
          // If there's no match, log that the user swiped right on the profile and save the profile to the user's "likes" collection in Firebase Firestore
          console.log(
            `You swiped on ${userSwiped.displayName} (${userSwiped.job})`
          );
          setDoc(
            doc(db, "users", user.uid, "likes", userSwiped.id),
            userSwiped
          );
        }
      }
    );
  };

  return (
    <SafeAreaView style={tailwind("flex-1")}>
      {/* Header */}
      <View style={tailwind("flex-row items-center justify-between px-5")}>
        {/* User profile picture */}
        <TouchableOpacity onPress={logout} style={tailwind("")}>
          <Image
            style={tailwind("h-10 w-10 rounded-full")}
            source={{ uri: user.photoURL }}
            referrerPolicy="strict-origin-when-cross-origin"
          />

          {/* App logo */}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            style={tailwind(
              "h-14 w-14 rounded-full border-2 border-indigo-800"
            )}
            source={require("../assets/lockitin-logo.jpg")}
          />
        </TouchableOpacity>

        {/* Chat icon */}
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Fontisto name="hipchat" size={30} color="#283593" />
        </TouchableOpacity>
      </View>

      {/* End of Header */}

      {/* Cards */}
      <View style={tailwind("flex-1 -mt-6")}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          // When a user swipes left, call swipeLeft function and log the action
          onSwipedLeft={(cardIndex) => {
            console.log("Swipe PASS");
            swipeLeft(cardIndex);
          }}
          // When a user swipes right, call swipeRight function and log the action
          onSwipedRight={(cardIndex) => {
            console.log("Swipe LIKE");
            swipeRight(cardIndex);
          }}
          // Background color of the cards
          backgroundColor={"#4FD0E9"}
          // Text overlay labels
          overlayLabels={{
            left: {
              title: "NAH!",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "YEAH!",
              style: {
                label: {
                  textAlign: "left",
                  color: "green",
                },
              },
            },
          }}
          // Render the cards
          renderCard={(card) =>
            card ? (
              // If there is a card, show the card
              <View key={card.id} style={tailwind("relative h-3/4 rounded-xl")}>
                {/* Card image */}
                <Image
                  style={tailwind("absolute top-0 h-full w-full rounded-xl")}
                  source={{ uri: card?.photoURL }}
                />

                {/* Card details */}
                <View
                  style={[
                    tailwind(
                      "absolute bottom-0 bg-white w-full flex-row justify-between items-center h-20 px-6 py-2 rounded-b-xl"
                    ),
                    styles.cardShadow,
                  ]}
                >
                  <View style={tailwind("")}>
                    <Text style={tailwind("text-xl font-bold")}>
                      {card?.displayName}
                    </Text>
                    <Text>{card?.job}</Text>
                  </View>
                  <Text style={tailwind("text-2xl font-bold")}>{card.age}</Text>
                </View>
              </View>
            ) : (
              // If there are no more cards, show a message and an icon
              <View
                style={[
                  tailwind(
                    "relative bg-white h-3/4 rounded-xl justify-center items-center"
                  ),
                  styles.cardShadow,
                ]}
              >
                <Text style={tailwind("font-bold pb-5")}>
                  No more matches available!
                </Text>

                <Image
                  style={tailwind("h-1/3 w-full")}
                  resizeMode="contain"
                  height={100}
                  width={100}
                  source={require("../assets/tumbleweed-icon.png")}
                />
              </View>
            )
          }
        />
      </View>

      <View style={tailwind("flex flex-row justify-evenly")}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()} // call swipeLeft() function when the button is pressed
          style={tailwind(
            "items-center justify-center rounded-full w-16 h-16 bg-white border-2 border-indigo-800"
          )}
        >
          <Entypo name="cross" size={40} color="#283593" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()} // call swipeRight() function when the button is pressed
          style={tailwind(
            "items-center justify-center rounded-full w-16 h-16 bg-indigo-800 border-2 border-white"
          )}
        >
          <Entypo name="check" size={40} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
