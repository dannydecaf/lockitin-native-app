import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";

const AuthContext = createContext({});

// Call maybeCompleteAuthSession to check if there's an uncompleted auth session
WebBrowser.maybeCompleteAuthSession();

// Google configuration for authentication
const config = {
  iosClientId:
    "367382106570-gfcgfuf29dffkdgem3m9d6aqf3hbr0aj.apps.googleusercontent.com",
  androidClientId:
    "367382106570-uqcbvm5jfcddk75990hb3av8i5dluap5.apps.googleusercontent.com",
  expoClientId:
    "367382106570-ekh9rif5d6hacl7gruusjlcs8icnhhb7.apps.googleusercontent.com",
  webClientId:
    "367382106570-ekh9rif5d6hacl7gruusjlcs8icnhhb7.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
};

export const AuthProvider = ({ children }) => {
  // Use Google authentication request and store the response and error
  const [resquest, response, promptAsync] = Google.useAuthRequest(config);
  const [error, setError] = useState();
  const [user, setUser] = useState();
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Check the user authentication state on mount
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }

      setLoadingInitial(false);
    });
  }, []);

  // Sign in with Google if the response is successful and store the user credentials,
  // otherwise set the error state
  useEffect(() => {
    console.log("response", response);
    console.log("error", error);
    if (response?.type === "success") {
      const { idToken, accessToken } = response?.authentication;
      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      signInWithCredential(auth, credential);
    } else {
      setError(response?.error);
    }

    setLoading(false);
  }, [response]);

  // Logout the user, reset the navigation stack to the Login screen, and handle errors
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Memoize the auth context value to avoid unnecessary re-renders
  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      logout,
      signInWithGoogle: () => {
        setLoading(true);
        promptAsync({ useProxy: false, showInRecents: true });
      },
    }),
    [user, loading, error]
  );

  // Render the AuthContext Provider with the memoized value
  return (
    <AuthContext.Provider value={memoedValue}>
        {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
    return useContext(AuthContext);
}