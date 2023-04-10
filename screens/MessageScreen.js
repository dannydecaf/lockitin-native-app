import {
  View,
  SafeAreaView,
  TextInput,
  Button,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  FlatList,
  Text,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import useAuth from "../hooks/useAuth";
import { useRoute } from "@react-navigation/core";
import { useTailwind } from "tailwindcss-react-native";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "@firebase/firestore";
import { db } from "../firebase";

const MessageScreen = () => {
  const tailwind = useTailwind();
  const { user } = useAuth();
  const { params } = useRoute();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const { matchDetails } = params;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "matches", matchDetails.id, "messages"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })).reverse()
        )
    );

    return () => unsubscribe();
  }, [matchDetails, db]);

  const sendMessage = () => {
    addDoc(collection(db, "matches", matchDetails.id, "messages"), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      photoURL: matchDetails.users[user.uid].photoURL,
      message: input,
    });

    setInput("");
  };

  return (
    <SafeAreaView style={tailwind("flex-1")}>
      <Header
        title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tailwind("flex-1")}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            data={messages}
            style={tailwind("pl-4")}
            keyExtractor={(item) => item.id}
            renderItem={({ item: message }) => {
                if (message.userId === user.uid) {
                  return (
                    <View
                      key={message.id}
                      style={[
                        tailwind(
                          "bg-indigo-800 rounded-lg rounded-tr-none px-5 py-3 mx-3 my-3"
                        ),
                        {
                          alignSelf: "flex-start",
                          marginLeft: "auto",
                        },
                      ]}
                    >
                      <Text style={tailwind("font-bold text-white")}>
                        {message.message}
                      </Text>
                    </View>
                  );
                } else {
                  return (
                    <View
                      key={message.id}
                      style={[
                        tailwind(
                          "bg-black rounded-lg rounded-tl-none px-5 py-3 mx-3 my-3"
                        ),
                        {
                          alignSelf: "flex-start",
                          marginLeft: 55,
                        },
                      ]}
                    >
                      <Image
                        source={{ uri: message.photoURL }}
                        style={[
                            tailwind("h-12 w-12 rounded-full absolute top-0"),
                          { left: -55 },
                        ]}
                      />
                      <Text style={tailwind("font-bold text-white")}>
                        {message.message}
                      </Text>
                    </View>
                  );
                }
              }}
            />
          </TouchableWithoutFeedback>
        <View
          style={tailwind(
            "flex-row justify-between items-center border-t border-gray-200 px-5 py-2"
          )}
        >
          <TextInput
            style={tailwind("h-10 text-lg outline-none")}
            placeholder="Message..."
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />
          <Button onPress={sendMessage} title="Send" color="#03a9f4" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreen;
