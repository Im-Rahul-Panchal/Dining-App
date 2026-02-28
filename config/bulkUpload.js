import { collection, doc, setDoc } from "firebase/firestore";
import { restaurants } from "../store/restaurants";
import { db } from "./firebaseConfig";

const restaurantData = restaurants;

export const uploadData = async () => {
  try {
    // Loop through each restaurant and upload to Firestore
    for (let i = 0; i < restaurantData.length; i++) {
      const restaurant = restaurantData[i];
      const docRef = doc(collection(db, "restaurants"), `restaurant_${i + 1}`);
      await setDoc(docRef, restaurant);
      console.log(`Uploaded restaurant_${i + 1} successfully.`);
    }
  } catch (error) {
    console.error("Error uploading restaurant data: ", error);
  }
};
