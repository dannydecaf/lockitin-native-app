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
    <SafeAreaView style={tailwind("flex1")}>
      {/* Header */}
      <View>
        <TouchableOpacity style={tailwind("absolute left 5 top-3")}>
          <Image style={tailwind("h-10 w-10 rounded-full")} source={{ uri: user.photoURL }} referrerPolicy="no-referrer"/>
        </TouchableOpacity>
      </View>
      {/* End of Header */}
      <Text style={tailwind("text-red-800")}>I am the HomeScreen</Text>
      <View>
      <TouchableOpacity style={[tailwind("justify-center items-center w-52 bg-indigo-800 p-4 rounded-3xl"), { marginHorizontal: "45%"},]} onPress={() => navigation.navigate("Chat")}>
      <Text style={tailwind("font-semibold text-center color-white")}>Go to Chats</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[tailwind("justify-center items-center w-52 bg-indigo-800 p-4 rounded-3xl"), { marginHorizontal: "45%"},]} onPress={logout}>
      <Text style={tailwind("font-semibold text-center color-white")}>Logout</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;