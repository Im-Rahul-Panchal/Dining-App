import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

const profile = () => {
  const auth = getAuth();

  const [userEmail, setUserEmail] = useState(null);
  useEffect(() => {
    const fetchUserEmail = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      setUserEmail(email);
    };
    fetchUserEmail();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("userEmail");
      setUserEmail(null);
      Alert.alert("Logged Out", "You have been logged out successfully");
      router.push("/login");
    } catch (error) {
      Alert.alert("Error while Logging out", error);
    }
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <View className="flex-1 justify-center items-center bg-[#f7f5d2]">
      <Text className="text-xl text-gray mb-6 p-2 font-bold">User profile</Text>
      {userEmail ? (
        <>
          <Text className="text-lg text-gray mb-6 p-2 ">
            Email : {userEmail}
          </Text>
          <TouchableOpacity className="rounded-xl p-2 mt-5">
            <Text
              className="font-semibold text-xl text-center text-white bg-pink-500 rounded-lg p-3"
              onPress={handleLogout}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity className="rounded-xl p-2 mt-5">
            <Text
              className="font-semibold text-xl text-center text-white bg-pink-500 rounded-lg p-3"
              onPress={handleSignup}
            >
              Signup
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default profile;
