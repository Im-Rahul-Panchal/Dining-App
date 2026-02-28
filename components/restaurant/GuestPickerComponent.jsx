import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const GuestPickerComponent = ({selectedNumber, setSelectedNumber}) => {

  const decrement = () => {
    if(selectedNumber > 1) {
      setSelectedNumber(selectedNumber - 1)      
    }
  }
  const increment = () => {
    if(selectedNumber < 10) {
      setSelectedNumber(selectedNumber + 1)      
    }
  }

  return (
    <View className="flex flex-row items-center justify-center text-gray rounded-lg gap-2">
      <TouchableOpacity onPress={decrement} className="rounded">
        <Text className="text-gray-500 text-lg border border-[gray] rounded-l-lg px-3">-</Text> 
      </TouchableOpacity>

      <Text className="px-3 text-gray-500 text-lg border border-[gray] bg-[#f5f5f5]">
        {selectedNumber}
      </Text>

      <TouchableOpacity onPress={increment} className="rounded">
        <Text className="text-gray-500 text-lg border border-[gray] rounded-r-lg px-3">+</Text> 
      </TouchableOpacity>
    </View>
  )
}

export default GuestPickerComponent
