import { useNavigation } from "@react-navigation/core";
import {
  Button,
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
import { AntDesign, Entypo, Ionicons, Fontisto } from "@expo/vector-icons";
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
  const [profiles, setProfiles] = useState([]);
  const swipeRef = useRef(null);

  useLayoutEffect(
    () =>
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (!snapshot.exists()) {
          navigation.navigate("Modal");
        }
      }),
    []
  );

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
          );
        }
      );
    };

    fetchCards();
    return unsub;
  }, [db]);

  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    console.log(`You swiped PASS on ${userSwiped.displayName}`);

    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };
  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await (
      await getDoc(doc(db, "users", user.uid))
    ).data();

    getDoc(doc(db, "users", userSwiped.id, "likes", user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          console.log(`Nice! You matched with ${userSwiped.displayName}`);

          setDoc(
            doc(db, "users", user.uid, "likes", userSwiped.id),
            userSwiped
          );

          setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });

          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });

        } else {
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
        <TouchableOpacity onPress={logout} style={tailwind("")}>
          <Image
            style={tailwind("h-10 w-10 rounded-full")}
            source={{ uri: user.photoURL }}
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            style={tailwind(
              "h-14 w-14 rounded-full border-2 border-indigo-800"
            )}
            source={require("../assets/lockitin-logo.jpg")}
          />
        </TouchableOpacity>

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
          onSwipedLeft={(cardIndex) => {
            console.log("Swipe PASS");
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            console.log("Swipe LIKE");
            swipeRight(cardIndex);
          }}
          backgroundColor={"#4FD0E9"}
          overlayLabels={{
            left: {
              title: "NAH",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "YEAH",
              style: {
                label: {
                  textAlign: "left",
                  color: "green",
                },
              },
            },
          }}
          renderCard={(card) =>
            card ? (
              <View key={card.id} style={tailwind("relative h-3/4 rounded-xl")}>
                <Image
                  style={tailwind("absolute top-0 h-full w-full rounded-xl")}
                  source={{ uri: card?.photoURL }}
                />

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
          onPress={() => swipeRef.current.swipeLeft()}
          style={tailwind(
            "items-center justify-center rounded-full w-16 h-16 bg-white border-2 border-indigo-800"
          )}
        >
          <Entypo name="cross" size={40} color="#283593" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
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
