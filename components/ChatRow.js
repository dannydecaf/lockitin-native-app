import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import useAuth from "../hooks/useAuth";
import { useTailwind } from "tailwindcss-react-native";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "@firebase/firestore";

const ChatRow = ({ matchDetails }) => {
  const tailwind = useTailwind();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);
  const [lastMessage, setLastMessage] = useState("");

  // This useEffect hook sets the matched user's info based on the matchDetails object passed as a prop.
  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
  }, [matchDetails, user]);

  // This useEffect hook listens for updates to the "messages" collection in Firebase and updates the lastMessage state.
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchDetails.id, "messages"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setLastMessage(snapshot.docs[0]?.data()?.message)
      ),
    [matchDetails, db]
  );

  // This component renders the UI for an individual chat row in the list of chats.
  return (
    <TouchableOpacity
      style={[
        tailwind(
          "flex-row items-center py-3 px-5 bg-white -mx-3 my-1 rounded-lg"
        ),
        styles.cardShadow,
      ]}
      onPress={() =>
        navigation.navigate("Message", {
          matchDetails,
        })
      }
    >
      <Image
        style={tailwind("rounded-full h-16 w-16 mr-4")}
        source={{ uri: matchedUserInfo?.photoURL }}
      />

      <View>
        <Text style={tailwind("text-lg font-semibold")}>
          {matchedUserInfo?.displayName}
        </Text>
        <Text>{lastMessage || "Say Hi!"}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow;

const styles = StyleSheet.create({
  // This style object sets up the card shadow for the chat row.
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
