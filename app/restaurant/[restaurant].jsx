import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePickerComponent from "../../components/restaurant/DatePickerComponent";
import FindSlots from "../../components/restaurant/FindSlots";
import GuestPickerComponent from "../../components/restaurant/GuestPickerComponent";
import { db } from "../../config/firebaseConfig";

const Restaurant = () => {
  const { restaurant } = useLocalSearchParams();

  const [restaurantData, setRestaurantData] = useState({});
  const [carouselData, setCarouselData] = useState({});
  const [slotsData, setSlotsData] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [date, setDate] = useState(new Date());
  const [selectedNumber, setSelectedNumber] = useState(2);

  const handleNextImage = () => {
    const carouselLength = carouselData[0].images.length;
    if (currentIndex < carouselLength - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }
    if (currentIndex === carouselLength - 1) {
      const nextIndex = 0;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const handlePrevImage = () => {
    const carouselLength = carouselData[0].images.length;
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
    }
    if (currentIndex === 0) {
      const prevIndex = carouselLength - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const flatListRef = useRef(null);

  const windowWidth = Dimensions.get("window").width;

  const carouselItem = ({ item }) => {
    return (
      <View
        style={{ width: windowWidth - 20, height: 200, margin: 10 }}
        className={"h-64 relative rounded-[25px] p-2 m-2"}
      >
        <View
          style={{
            position: "absolute",
            top: "50%",
            backgroundColor: "rgba(0,0,0,0.5)",
            right: "6%",
            borderRadius: 50,
            padding: 10,
            zIndex: 1,
          }}
        >
          <Ionicons
            name="arrow-forward"
            size={24}
            color="white"
            onPress={handleNextImage}
          />
        </View>
        <View
          style={{
            position: "absolute",
            top: "50%",
            backgroundColor: "rgba(0,0,0,0.5)",
            left: "6%",
            borderRadius: 50,
            padding: 10,
            zIndex: 1,
          }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="white"
            onPress={handlePrevImage}
          />
        </View>
        <View
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            left: "53%",
            bottom: 1,
            transform: [{ translateX: -50 }],
            zIndex: 10,
            borderRadius: 20,
          }}
        >
          {carouselData[0].images.map((_, i) => (
            <View
              key={i}
              className={`h-2 w-2 bg-white rounded-full p-1 mr-2 ${i === currentIndex && "h-3 w-3"}`}
            />
          ))}
        </View>
        <Image
          source={{ uri: item }}
          style={{
            borderRadius: 20,
            opacity: 0.9,
            padding: 10,
          }}
          className={"h-64 w-full"}
        />
      </View>
    );
  };

  const getRestaurantData = async () => {
    try {
      const restaurantQuery = query(
        collection(db, "restaurants"),
        where("name", "==", restaurant),
      );
      const restaurantSnapshot = await getDocs(restaurantQuery);
      if (restaurantSnapshot.empty) {
        console.log("No matching Restaurants");
      }

      for (const doc of restaurantSnapshot.docs) {
        const restaurantData = doc.data();
        setRestaurantData(restaurantData);

        const carouselQuery = query(
          collection(db, "carousel"),
          where("res_id", "==", doc.ref),
        );
        const carouselSnapshot = await getDocs(carouselQuery);
        const carouselImages = [];
        if (carouselSnapshot.empty) {
          console.log("No matching Carousels");
        }
        carouselSnapshot.forEach((doc) => {
          carouselImages.push(doc.data());
        });
        setCarouselData(carouselImages);

        const slotsQuery = query(
          collection(db, "slots"),
          where("ref_id", "==", doc.ref),
        );
        const slotsSnapshot = await getDocs(slotsQuery);
        const slotsData = [];
        if (slotsSnapshot.empty) {
          console.log("No matching Slots");
        }
        slotsSnapshot.forEach((doc) => {
          slotsData.push(doc.data());
        });
        setSlotsData(slotsData[0]?.slot);
      }
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  const handleLocation = async () => {
    const url = `https://www.google.com/maps/place/${restaurantData?.address}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
    // Linking.openURL(url);
    console.log("Location clicked");
  };

  useEffect(() => {
    getRestaurantData();
  }, []);

  return (
    <SafeAreaView
      style={[
        { backgroundColor: "#f7f5d2" },
        Platform.OS === "android" ? { paddingBottom: 2 } : 30,
      ]}
      className="flex-1"
    >
      <ScrollView className="w-full">
        <View className="flex-1 my-2 p-2">
          <Text className="text-xl text-[#b94d3a] mr-2 font-semibold">
            {restaurant}
          </Text>
          <View className="border-b border-[#b94d3a]" />
        </View>
        <View className="h-72 max-w-[98%]  rounded-lg overflow-hidden mx-auto">
          <FlatList
            ref={flatListRef}
            data={carouselData[0]?.images}
            renderItem={carouselItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            style={{ borderRadius: 25 }}
          />
        </View>
        <View className="flex-1 my-2 p-2 flex-row">
          <Ionicons
            onPress={handlePrevImage}
            name="location-sharp"
            size={24}
            color="gray"
          />
          <Text className="text-gray ml-1 font-semibold text-lg max-w-[75%]">
            {restaurantData?.address} |{"   "}
            <Text
              onPress={handleLocation}
              className={
                "text-[#b94d3a] ml-2 font-semibold text-xl underline flex items-center"
              }
            >
              Get directions
            </Text>
          </Text>
        </View>
        <View className="flex-1 p-2 flex-row">
          <Ionicons
            onPress={handlePrevImage}
            name="time"
            size={24}
            color="gray"
          />
          <Text className="text-gray ml-2 font-bold text-lg max-w-[55%]">
            {restaurantData?.opening}
            {"  "} - {"  "}
            {restaurantData?.closing}
          </Text>
        </View>
        <View className="flex-1 p-2 m-2 p-2 border border-gray-800 rounded-xl items-center">
          <View
            className={
              "flex-1 flex-row m-2 rounded-lg justify-end items-center"
            }
          >
            <View className="flex-1 flex-row gap-2">
              <Ionicons name="calendar" size={20} color="#f49b33" />
              <Text className="white ml-1 font-semibold text-lg ">
                Select Booking Date
              </Text>
            </View>
            <DatePickerComponent />
          </View>
          <View
            className={
              "flex-1 flex-row  rounded-lg justify-end items-center bg-gray-200 p-2 my-2"
            }
          >
            <View className="flex-1 flex-row gap-2">
              <Ionicons name="people" size={20} color="#f49b33" />
              <Text className="white ml-1 font-semibold text-lg ">
                Select number of Guests
              </Text>
            </View>
            <GuestPickerComponent
              selectedNumber={selectedNumber}
              setSelectedNumber={setSelectedNumber}
            />
          </View>
        </View>
        <View className="flex-1">
          <FindSlots
            restaurant={restaurant}
            date={date}
            selectedNumber={selectedNumber}
            slots={slotsData}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
          />
        </View>
      </ScrollView>
      <StatusBar barStyle={"light-content"} backgroundColor={"#f7f5d2"} />
    </SafeAreaView>
  );
};

export default Restaurant;
