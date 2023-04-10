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
import React, { useState, useEffect, Fragment } from "react";
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

  // Extract `matchDetails` from the `params` object
  const { matchDetails } = params;

  // Define an effect hook that listens to updates to the messages collection in the database
  useEffect(() => {
    // Set up a listener on the messages collection for the current match
    const unsubscribe = onSnapshot(
      query(
        collection(db, "matches", matchDetails.id, "messages"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) =>
        // When the listener fires, update the `messages` state variable
        setMessages(
          snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .reverse()
        )
    );

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [matchDetails, db]);

  // Define a function that sends a new message to the database
  const sendMessage = () => {
    addDoc(collection(db, "matches", matchDetails.id, "messages"), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      photoURL: matchDetails.users[user.uid].photoURL,
      message: input,
    });

    // Clear the input field after sending the message
    setInput("");
  };

  // Render the MessageScreen component
  return (
    <SafeAreaView style={tailwind("flex-1")}>
      {/* Render the Header component with the name of the matched user */}
      <Header
        title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName}
      />

      {/* Render a keyboard avoiding view with a flatlist of messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tailwind("flex-1")}
        keyboardVerticalOffset={10}
      >
        {/* Allow the user to dismiss the keyboard by tapping outside the text input */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {/* Render a FlatList to display the messages */}
          <FlatList
            data={messages}
            style={tailwind("pl-4")}
            keyExtractor={(item) => item.id}
            renderItem={({ item: message }) => {
              // Check if the current user sent the message
              const isCurrentUser = message.userId === user.uid;
              return (
                <View
                  key={message.id}
                  style={[
                    tailwind(
                      `rounded-lg px-5 py-3 mx-3 my-3 ${
                        isCurrentUser
                          ? "bg-indigo-800 rounded-tr-none self-end ml-auto"
                          : "bg-black rounded-tl-none"
                      }`
                    ),
                    {
                      alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                      marginLeft: isCurrentUser ? "auto" : 55,
                    },
                  ]}
                >
                  {!isCurrentUser && (
                    <Image
                      source={{ uri: message.photoURL }}
                      style={[
                        tailwind("h-12 w-12 rounded-full absolute top-0"),
                        { left: -55 },
                      ]}
                    />
                  )}

                  <Text style={tailwind("font-bold text-white")}>
                    {message.message}
                  </Text>
                  <Fragment>
                    <Text style={tailwind("text-xs text-gray-400 mt-1")}>
                      {new Date(message.timestamp?.toDate()).toLocaleString()}
                    </Text>
                  </Fragment>
                </View>
              );
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
