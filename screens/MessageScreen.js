import { View, Text, SafeAreaView, TextInput } from "react-native";
import React, { useState } from "react";
import Header from "../components/Header";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import useAuth from "../hooks/useAuth";
import { useRoute } from "@react-navigation/core";
import { useTailwind } from "tailwindcss-react-native";

const MessageScreen = () => {
    const tailwind = useTailwind();
    const {user} = useAuth();
    const {params} = useRoute();
    const [input, setInput] = useState("");

    const { matchDetails } = params;

    const sendMessage = () => {};

  return (
    <SafeAreaView>
      <Header title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName} callEnabled />
      <Text>Message Screen</Text>

      <View>
        <TextInput
        style={tailwind("h-10 text-lg")}
        placeholder="Message..."
        onChangeText={setInput}
        onSubmitEditing={sendMessage}
        value={input}
         />
      </View>
    </SafeAreaView>
  );
};

export default MessageScreen;
