import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import Header from "../components/Header";
import ChatList from "../components/ChatList";

const ChatScreen = () => {
  return (
    <SafeAreaView>
      <Header title="Chat" /> // render the Header component with a "Chat" title
      prop
      <ChatList /> // render the ChatList component
    </SafeAreaView>
  );
};

export default ChatScreen;
