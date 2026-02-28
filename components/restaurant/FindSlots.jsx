import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { Formik } from "formik";
import { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../config/firebaseConfig";
import validationSchema from "../../utils/guestFormSchema";

const FindSlots = ({
  slots,
  selectedSlot,
  setSelectedSlot,
  selectedNumber,
  date,
  restaurant,
}) => {
  const [slotVisible, setSlotVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setSlotVisible((prev) => !prev);
  };

  const handleSlotPress = (slot) => {
    setSelectedSlot((prev) => (prev === slot ? null : slot));
  };

  const handleBooking = async () => {
    const userFullName = await AsyncStorage.getItem("userFullName");
    const userEmail = await AsyncStorage.getItem("userEmail");
    const guestStatus = await AsyncStorage.getItem("isGuest");

    if (userFullName && userEmail && !guestStatus) {
      await addDoc(collection(db, "bookings"), {
        fullName: userFullName,
        email: userEmail,
        slot: selectedSlot,
        date: date.toISOString(),
        guests: selectedNumber,
        restaurant,
      });

      Alert.alert("Success", "Booking Successful!");
      router.push("/home");
      return;
    }

    setModalVisible(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      await addDoc(collection(db, "bookings"), {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        slot: selectedSlot,
        date: date.toISOString(),
        guests: selectedNumber,
        restaurant,
      });

      Alert.alert("Success", "Booking Successful!");
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Booking failed!");
      console.log(error);
    }
  };

  return (
    <View className="flex-1">
      {/* Buttons */}
      <View className={`flex ${selectedSlot ? "flex-row" : "flex-col"}`}>
        <View className={selectedSlot ? "flex-1" : ""}>
          <TouchableOpacity onPress={handlePress}>
            <Text className="text-xl font-bold text-center p-3 m-2 bg-[#f49b33] rounded-lg">
              Find Slots
            </Text>
          </TouchableOpacity>
        </View>

        {selectedSlot && (
          <View className="flex-1">
            <TouchableOpacity onPress={handleBooking}>
              <Text className="text-white text-xl font-bold text-center p-3 m-2 bg-[#f49b33] rounded-lg">
                Book Slot
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Slots */}
      {slotVisible && (
        <View className="flex-wrap flex-row mx-2 p-3 bg-gray-300 rounded-lg">
          {slots.map((slot, index) => (
            <TouchableOpacity
              key={index}
              className={`m-2 p-2 bg-[#f49b33] rounded-lg ${
                selectedSlot && selectedSlot !== slot ? "opacity-50" : ""
              }`}
              onPress={() => handleSlotPress(slot)}
              disabled={selectedSlot && selectedSlot !== slot}
            >
              <Text className="text-white text-xl font-bold">{slot}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-[#00000080] justify-end">
          <View className="bg-white rounded-t-2xl px-6 py-6">
            <Ionicons
              name="close"
              size={28}
              color="#f49b33"
              onPress={() => setModalVisible(false)}
            />

            <Formik
              initialValues={{ fullName: "", phoneNumber: "" }}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View className="mt-4 space-y-3">
                  <Text className="text-pink-600 font-semibold text-lg">
                    Name
                  </Text>
                  <TextInput
                    className="border border-gray-400 rounded-xl p-4 text-lg"
                    placeholder="Enter full name"
                    value={values.fullName}
                    onChangeText={handleChange("fullName")}
                    onBlur={handleBlur("fullName")}
                  />
                  {errors.fullName && touched.fullName && (
                    <Text className="text-red-500">{errors.fullName}</Text>
                  )}

                  <Text className="text-pink-600 font-semibold text-lg">
                    Phone Number
                  </Text>
                  <TextInput
                    className="border border-gray-400 rounded-xl p-4 text-lg"
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                    value={values.phoneNumber}
                    onChangeText={handleChange("phoneNumber")}
                    onBlur={handleBlur("phoneNumber")}
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <Text className="text-red-500">{errors.phoneNumber}</Text>
                  )}

                  <TouchableOpacity
                    className="bg-pink-500 rounded-xl mt-5 p-3"
                    onPress={handleSubmit}
                  >
                    <Text className="text-white text-xl font-semibold text-center">
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FindSlots;
