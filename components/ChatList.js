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
  const { user } = useAuth();
  const tailwind = useTailwind();

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches"),
          where("usersMatched", "array-contains", user.uid)
        ),
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
    matches.length > 0 ? (
    
    <FlatList
    style={tailwind("h-full")}
    data={matches}
    keyExtractor={item => item.id}
    renderItem={({item}) => <ChatRow matchDetails={item} />}
    />
    ) : (
      <View style={tailwind("p-5")}>
        <Text style={tailwind("text-center text-lg")}>
          You currently have no matches...
        </Text>
        </View>
    )
  );
};

export default ChatList;
