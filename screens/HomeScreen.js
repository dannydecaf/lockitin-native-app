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
import React, { useLayoutEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import { useTailwind } from "tailwindcss-react-native";
import { AntDesign, Entypo, Ionicons, Fontisto } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";

const dummyData = [
  {
    firstName: "Dan",
    lastName: "Coffey",
    job: "Computer Science Student",
    photoURL:
      "https://scontent.fdub2-4.fna.fbcdn.net/v/t1.6435-9/36823147_10155540870781787_4694057813217902592_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=ntDCSLjijXoAX_z2Rlz&_nc_ht=scontent.fdub2-4.fna&oh=00_AfByVste8PgoEPxhIFTvxeGTiuEFpBTZjmzNuKWqv5fnkA&oe=6457CD5E",
    age: 33,
    id: 123,
  },
  {
    firstName: "Claire",
    lastName: "Johnson",
    job: "Full Stack Developer",
    photoURL:
      "https://images.pexels.com/photos/388517/pexels-photo-388517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    age: 31,
    id: 456,
  },
  {
    firstName: "Danielle",
    lastName: "Smith",
    job: "Product Manager",
    photoURL:
      "https://images.pexels.com/photos/1130623/pexels-photo-1130623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    age: 36,
    id: 789,
  },
];

const HomeScreen = () => {
  const tailwind = useTailwind();
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const swipeRef = useRef(null);

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
            style={tailwind("h-14 w-14 rounded-full")}
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
          cards={dummyData}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={() => {
            console.log("Swipe PASS");
          }}
          onSwipedRight={() => {
            console.log("Swipe LIKE");
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
          renderCard={(card) => (
            <View key={card.id} style={tailwind("relative h-3/4 rounded-xl")}>
              <Image
                style={tailwind("absolute top-0 h-full w-full rounded-xl")}
                source={{ uri: card.photoURL }}
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
                    {card.firstName}
                  </Text>
                  <Text>
                    {card.job}
                  </Text>
                </View>
                <Text style={tailwind("text-2xl font-bold")}>{card.age}</Text>
              </View>
            </View>
          )}
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
