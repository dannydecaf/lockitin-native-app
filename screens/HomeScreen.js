import { useNavigation } from "@react-navigation/core";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useLayoutEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useTailwind } from "tailwindcss-react-native";
import { AntDesign, Entypo, Ionicons, Fontisto } from "@expo/vector-icons";

const HomeScreen = () => {
  const tailwind = useTailwind();
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  console.log(user);

  return (
    <SafeAreaView>
      {/* Header */}
      <View style={tailwind("flex-row items-center justify-between px-5")}>
        <TouchableOpacity onPress={logout} style={tailwind("")}>
          <Image
            style={tailwind("h-10 w-10 rounded-full")}
            source={{ uri: user.photoURL }}
            referrerPolicy="no-referrer"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={tailwind("h-14 w-14 rounded-full")}
            source={require("../assets/lockitin-logo.jpg")}
          />
        </TouchableOpacity>

        <TouchableOpacity style={tailwind("")}>
        <Fontisto name="hipchat" size={30} color="#283593" />
        </TouchableOpacity>
      </View>

      {/* End of Header */}
      <View style={tailwind("flex-row items-center justify-between px-5")}>
      <TouchableOpacity style={tailwind("w-52 bg-indigo-800 p-4 rounded-3xl")} onPress={() => navigation.navigate("Chat")}>
        <Text style={tailwind("font-semibold text-center color-white")}>
          Go to Chats
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={tailwind("w-52 bg-indigo-800 p-4 rounded-3xl")} onPress={logout}>
        <Text style={tailwind("font-semibold text-center color-white")}>
          Logout
        </Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
