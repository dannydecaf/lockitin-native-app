import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import useAuth from "./hooks/useAuth";
import ChatScreen from "./screens/ChatScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import MatchScreen from "./screens/MatchScreen";
import MessageScreen from "./screens/MessageScreen";
import ModalScreen from "./screens/ModalScreen";

// Create a new stack navigator using createNativeStackNavigator.
const Stack = createNativeStackNavigator();

// Define the StackNavigator component.
const StackNavigator = () => {
  // Call the useAuth hook to get the current user.
  const { user } = useAuth();
  return (
    // Render the Stack.Navigator component with some options.
    <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    >
      {user ? ( // If there is a user logged in, render these screens.
        <>
        <Stack.Group>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Message" component={MessageScreen} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: "modal"}}>
        <Stack.Screen name="Modal" component={ModalScreen} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: "transparentModal"}}>
        <Stack.Screen name="Match" component={MatchScreen} />
        </Stack.Group>
        </>
      ) : ( // If there is no user logged in, render the LoginScreen.
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
