import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/logo.png";
import { db } from "../../config/firebaseConfig";
// import { uploadData } from "../../config/bulkUpload";

const Home = () => {
  // useEffect(() => {
  //   uploadData();
  // }, []);
  const router = useRouter();

  const [restaurants, setRestaurants] = useState([]);

  const temp = async () => {
    const value = await AsyncStorage.getItem("isGuest");
    const email = await AsyncStorage.getItem("userEmail");
    console.log(value, email);
  };

  // const temp = async () => {
  //   const data = await AsyncStorage.getItem("userEmail");
  //   console.log(data);
  // };
  // temp();

  const getRestaurants = async () => {
    try {
      const q = query(collection(db, "restaurants"));
      const result = await getDocs(q);

      // Collect all docs first
      const restaurantsArray = result.docs.map((doc) => doc.data());
      setRestaurants(restaurantsArray);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
    getRestaurants();
    temp();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/restaurant/${item.name}`)}
      activeOpacity={0.8}
      className="mb-4 bg-transparent"
    >
      <View className="mr-4 w-64 bg-white rounded-lg shadow-lg overflow-hidden">
        <Image
          resizeMode="cover"
          source={{ uri: item.image }}
          className="w-full h-60 rounded-lg"
        />
        <View className="p-4">
          <Text className="text-xl font-bold mb-2 text-center mb-3">
            {item.name}
          </Text>
          <Text className="text-gray-600 text-center mb-2 font-semibold text-lg">
            Seating Capacity - {item.address}
          </Text>
          <Text className="text-gray-600 text-center mb-2 text-semibold text-lg underline">
            Opening - {item.opening} AM
          </Text>
          <Text className="text-gray-600 text-center mb-2 text-semibold text-lg underline">
            Closing - {item.closing} PM
          </Text>
          <Text className="text-gray-600 text-center text-md font-bold">
            Seating Capacity - {item.seats}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  return (
    <SafeAreaView
      style={[
        { backgroundColor: "#f7f5d2" },
        Platform.OS === "android" ? { paddingBottom: 2 } : 30,
      ]}
      className="flex-1"
    >
      <View className="flex items-center bg-[f7f5d2] pt-6">
        <View className="flex flex-row  w-11/12 py-4 px-4 my-3 items-center justify-between bg-white rounded-xl">
          <View className="flex flex-row items-center gap-2 ">
            <Text
              className={`text-3xl h-12 pt-[${Platform.OS === "android" ? 9 : 6}] align-middle text-[#2b2b2b] ml-20`}
            >
              Welcome to{""}
            </Text>
            <Image resizeMode="cover" className={"w-20 h-12"} source={logo} />
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }} stickyHeaderIndices={[0]}> */}

        <ImageBackground
          resizeMode="cover"
          className="my-4 w-full items-center justify-center h-80"
          source={require("../../assets/images/deals11.png")}
        >
          <View className="absolute bottom-20 w-full shadow-lg">
            <BlurView
              intensity={70}
              tint="dark"
              experimentalBlurMethod="dimezisBlurView"
              className="h-16 items-center justify-center"
            >
              <Text className="text-3xl font-bold text-white">
                Dine with us!
              </Text>
            </BlurView>
          </View>
        </ImageBackground>
        <View className="w-full px-4 mb-2">
          <Text className="text-3xl font-bold text-center mb-2">
            Available Discounted Restaurants 😋
          </Text>
        </View>
        {restaurants.length > 0 ? (
          <FlatList
            data={restaurants}
            renderItem={renderItem}
            horizontal
            contentContainerStyle={{ padding: 16 }}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
          />
        ) : (
          <ActivityIndicator animating={true} size="large" color="#2e95f5" />
        )}
        <View className="w-full px-4 mb-2">
          <Text className="text-3xl font-bold text-center mb-2">
            Our Restaurants 🍽️🍕🍖🥗
          </Text>
        </View>
        {restaurants.length > 0 ? (
          <FlatList
            data={shuffleArray(restaurants)}
            renderItem={renderItem}
            horizontal
            contentContainerStyle={{ padding: 16 }}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
          />
        ) : (
          <ActivityIndicator animating={true} size="large" color="#2e95f5" />
        )}
      </ScrollView>

      <StatusBar barStyle={"light-content"} backgroundColor={"#f7f5d2"} />
    </SafeAreaView>
  );
};

export default Home;
