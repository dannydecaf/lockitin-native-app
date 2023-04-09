import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/core";
import { useTailwind } from "tailwindcss-react-native";

const MatchScreen = () => {
  const tailwind = useTailwind();
  const navigation = useNavigation();
  const { params } = useRoute();

  const { loggedInProfile, userSwiped } = params;

  return (
    <View style={[tailwind("h-full bg-indigo-800 pt-20"), { opacity: 0.89 }]}>
      <View style={tailwind("justify-center px-10 pt-20")}>
        <Image 
        style={tailwind("h-20 w-full")}
        source={require("../assets/match text (2).png")} />
      </View>

      <Text style={tailwind("text-white text-center mt-5")}>
        You and {userSwiped.displayName} have matched!
      </Text>

      <View style={tailwind("flex-row justify-evenly mt-5")}>
        <Image
          style={tailwind("h-32 w-32 rounded-full")}
          resizeMode="contain"
          source={{
            uri: loggedInProfile.photoURL,
          }}
        />
        <Image
          style={tailwind("h-32 w-32 rounded-full")}
          source={{
            uri: userSwiped.photoURL,
          }}
        />
      </View>

      <TouchableOpacity style={tailwind("bg-white m-5 px-10 py-8 rounded-full mt-20")}
      onPress={() => {
        navigation.goBack();
        navigation.navigate("Chat");
      }}>
        <Text style={tailwind("text-center")}>Send a Message</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MatchScreen;
