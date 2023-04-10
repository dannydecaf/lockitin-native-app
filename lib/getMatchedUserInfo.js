// This function takes two arguments:
// 1. `users`: an object containing user information, with the user's unique id as the key
// 2. `userLoggedIn`: a string representing the id of the currently logged in user

const getMatchedUserInfo = (users, userLoggedIn) => {
  // Create a shallow copy of the `users` object, to prevent modifying the original
  const newUsers = { ...users };
  // Remove the currently logged in user from the `newUsers` object
  delete newUsers[userLoggedIn];

  // Get the first key-value pair from the `newUsers` object as an array
  // (each key-value pair represents a user's id and their corresponding user object)
  const [id, user] = Object.entries(newUsers).flat();
  // Return an object with the matched user's id and the rest of their user information
  return {
    id,
    ...user,
  };
};

export default getMatchedUserInfo;
