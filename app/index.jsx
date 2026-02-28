import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/logo.png";
import logo1 from "../assets/images/logo3.jpg";

export default function RootLayout() {
  const router = useRouter();

  const handleGuest = async () => {
    await AsyncStorage.multiRemove(["userFullName", "userEmail"]);
    await AsyncStorage.setItem("isGuest", "true");
    router.push("/home");
  };

  return (
    <SafeAreaView className="bg-white">
      <StatusBar barStyle={"light-content"} backgroundColor={"#ffffff"} />
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="m-2 flex justify-center items-center">
          <Image source={logo} style={{ width: 400, height: 300 }} />
          <View className="w-3/4">
            <TouchableOpacity
              className="bg-pink-200 rounded-xl p-4 my-4"
              onPress={() => router.push("/signup")}
            >
              <Text className="font-semibold text-xl text-center">Sign-up</Text>
            </TouchableOpacity>
            <Link href="/home" asChild>
              <TouchableOpacity
                onPress={handleGuest}
                className="bg-slate-50 border border-gray-300 rounded-xl p-4 my-1"
              >
                <Text className="font-semibold text-xl text-center text-pink-500">
                  Guest User
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View>
            <Text className="text-center text-2xl font-semibold mt-6 text-pink-600">
              <View className="border-b-2 border-pink-400 p-2 m-1 w-20" />{" "}
              {"  "} or{" "}
              <View className="border-b-2 border-pink-400 p-2 m-1 w-20" />
            </Text>
          </View>
          <TouchableOpacity
            className="flex flex-row items-center gap-2"
            onPress={() => router.push("/login")}
          >
            <Text className="text-center text-lg font-semibold mt-6 text-yellow-600">
              Login as Existing User
            </Text>
            <Text className="text-lg font-semibold mt-6 text-pink-700 underline">
              Log-in
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1">
          <Image
            source={logo1}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
