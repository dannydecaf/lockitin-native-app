import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import useAuth from "../hooks/useAuth";
import { useTailwind } from "tailwindcss-react-native";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";

const ChatRow = ({ matchDetails }) => {
  const tailwind = useTailwind();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
  }, [matchDetails, user]);

  return (
    <TouchableOpacity
      style={[
        tailwind(
          "flex-row item-center py-3 px-5 bg-white -mx-3 my-1 rounded-lg"
        ),
        styles.cardShadow,
      ]}
    >
      <Image
        style={tailwind("rounded-full h-16 w-16 mr-4")}
        source={{ uri: matchedUserInfo?.photoURL }}
      />
    </TouchableOpacity>
  );
};

export default ChatRow;

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
