import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const DatePickerComponent = () => {
  const [date, setDate] = useState(new Date());

  const handlePress = () => {
    DateTimePickerAndroid.open({
      value: date,
      mode: "date",
      accentColor: "#ced1288c",
      minimumDate: new Date(),
      maximumDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      onChange: (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          setDate(selectedDate);
        }
      },
    });
  };

  return (
    <View className="flex flex-row justify-between items-center mt-2 ml-5 rounded-lg">
      <TouchableOpacity onPress={handlePress}>
        <Text className="text-white bg-gray-500 font-bold text-base p-3 rounded-lg">
          {date.toDateString()}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DatePickerComponent;
