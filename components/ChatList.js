import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useTailwind } from "tailwindcss-react-native";
import { db } from "../firebase";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import useAuth from "../hooks/useAuth";
import ChatRow from "./ChatRow";

const ChatList = () => {
  // state for storing the matches
  const [matches, setMatches] = useState([]);
  // get the authenticated user
  const { user } = useAuth();
  // get the tailwind styles
  const tailwind = useTailwind();

  // listen for changes in the matches collection
  useEffect(
    () =>
      onSnapshot(
        // get the matches where the current user's ID is included in the "usersMatched" field
        query(
          collection(db, "matches"),
          where("usersMatched", "array-contains", user.uid)
        ),
        // map the query snapshot to an array of match objects
        (snapshot) =>
          setMatches(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    [user]
  );

  return (
    // check if there are any matches, and display them in a FlatList
    matches.length > 0 ? (
      <FlatList
        style={tailwind("h-full")}
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatRow matchDetails={item} />}
      />
    ) : (
      // if there are no matches, display a message
      <View style={tailwind("p-5")}>
        <Text style={tailwind("text-center text-lg")}>
          You currently have no matches...
        </Text>
      </View>
    )
  );
};

export default ChatList;
