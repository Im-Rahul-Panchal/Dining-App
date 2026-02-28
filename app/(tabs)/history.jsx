import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const History = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  useEffect(() => {
    const init = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        const guest = await AsyncStorage.getItem("isGuest");

        setUserEmail(email);
        setIsGuest(guest === "true");

        // Logged-in user → fetch bookings
        if (email && guest !== "true") {
          const bookingQuery = query(
            collection(db, "bookings"),
            where("email", "==", email),
          );

          const snapshot = await getDocs(bookingQuery);

          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setBookings(data);
        }
      } catch (error) {
        console.error("Fetch bookings error:", error);
        Alert.alert("Error", "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // 🔄 Loading
  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  // 🚫 Guest OR not logged in
  if (isGuest || !userEmail) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-lg text-center">
          Please sign in to view your booking history
        </Text>
      </SafeAreaView>
    );
  }

  // 📭 No bookings
  if (bookings.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-lg">No bookings found</Text>
      </SafeAreaView>
    );
  }

  // 📋 Booking list
  return (
    <SafeAreaView className="flex-1 p-4">
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="border border-gray-300 rounded-lg p-4 mb-3">
            <Text className="font-bold text-lg">{item.restaurant}</Text>
            <Text>Date: {new Date(item.date).toDateString()}</Text>
            <Text>Guests: {item.guests}</Text>
            <Text>Slot: {item.slot}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default History;
