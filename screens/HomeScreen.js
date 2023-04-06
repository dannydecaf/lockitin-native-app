import { useNavigation } from '@react-navigation/core';
import { Button, View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useLayoutEffect } from 'react'
import useAuth from "../hooks/useAuth";
import { useTailwind } from 'tailwindcss-react-native';

const HomeScreen = () => {
  const tailwind = useTailwind();
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  console.log(user)

  return (
    <SafeAreaView style={tailwind("flex")}>
      {/* Header */}
      <View>
        <TouchableOpacity>
          <Image style={tailwind("h-10 w-10 rounded-full")} source={{ uri: user.photoURL }} referrerPolicy="no-referrer"/>
        </TouchableOpacity>
      </View>
      {/* End of Header */}
      <Text style={tailwind("text-red-800")}>I am the HomeScreen</Text>
      <Button title="Go to Chats" onPress={() => navigation.navigate("Chat")} />
      <Button title="Logout" onPress={logout} />
    </SafeAreaView>
  );
};

export default HomeScreen;