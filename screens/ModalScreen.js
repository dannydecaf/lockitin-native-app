import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useTailwind } from "tailwindcss-react-native";
import useAuth from "../hooks/useAuth";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/core";
import { doc, serverTimestamp, setDoc } from "@firebase/firestore";
import { db } from "../firebase";
import Header from "../components/Header";

const ModalScreen = () => {
  const { params } = useRoute(); // Retrieve user data from the useAuth hook and navigation object from useNavigation hook
  const { user } = useAuth();
  const navigation = useNavigation();
  const tailwind = useTailwind();
  const [image, setImage] = useState("");
  const [job, setJob] = useState("");
  const [age, setAge] = useState("");

  // Check if any fields are empty
  const incompleteForm = !image || !job || !age;

  const updateUserProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image, // Update the photoURL field with the new image URL
      job: job,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View
      style={[
        tailwind("flex-1 items-center pt-1"),
        { backgroundColor: "transparent" },
      ]}
    >
      {/* Render the Header component */}
      <Header />
      {/* Render the logo image */}
      <Image
        style={tailwind("h-1/3 w-1/3")}
        resizeMode="contain"
        source={require("../assets/lockitin-modal.png")}
      />
      {/* Render the welcome message */}
      <Text style={tailwind("text-xl text-gray-500 p-2 font-bold")}>
        Welcome {user.displayName}!
      </Text>

      {/* Render the input field for the profile picture URL */}
      <Text style={tailwind("text-center p-4 font-bold text-indigo-800")}>
        Step 1: Your Profile Pic
      </Text>
      <TextInput
        value={image}
        onChangeText={setImage}
        style={tailwind("text-center text-xl pb-2")}
        placeholder="Enter your Profile Pic URL"
      />

      {/* Render the input field for the user's occupation */}
      <Text style={tailwind("text-center p-4 font-bold text-indigo-800")}>
        Step 2: Your Job
      </Text>
      <TextInput
        value={job}
        onChangeText={setJob}
        style={tailwind("text-center text-xl pb-2")}
        placeholder="Enter your occupation"
      />
      {/* Render the input field for the user's age */}
      <Text style={tailwind("text-center p-4 font-bold text-indigo-800")}>
        Step 3: Your Age
      </Text>
      <TextInput
        value={age}
        onChangeText={(text) => {
          // Remove any non-numeric characters from the input text
          const numericText = text.replace(/[^0-9]/g, "");
          // Set the state only if the resulting text is a valid number or an empty string
          if (numericText === "" || /^\d+$/.test(numericText)) {
            setAge(numericText);
          }
        }}
        style={tailwind("text-center text-xl pb-2")}
        placeholder="Enter your age"
        keyboardType="numeric"
        maxLength={2}
      />

      <TouchableOpacity
        disabled={incompleteForm}
        style={[
          tailwind("w-64 p-3 rounded-xl absolute bottom-10"),
          incompleteForm ? tailwind("bg-gray-400") : tailwind("bg-indigo-600"),
        ]}
        onPress={updateUserProfile}
      >
        <Text style={tailwind("text-center text-white text-xl")}>
          Update Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
