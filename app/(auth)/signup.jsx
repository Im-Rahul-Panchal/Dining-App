import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { Formik } from "formik";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/logo.png";
import logo1 from "../../assets/images/logo4.jpg";
import validationSchema from "../../utils/authSchema";

const Signup = () => {
  const router = useRouter();

  const auth = getAuth();
  const db = getFirestore();

  const handleGuest = async () => {
    if (AsyncStorage.exists("isGuest")) {
      Alert.alert("You are already logged");
    }
    await AsyncStorage.setItem("isGuest", "true");
    router.push("/home");
  };

  const handleSignup = async (values) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );

    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name: values.name,
      email: user.email,
      uid: user.uid,
      createdAt: new Date(),
    });

    await AsyncStorage.multiRemove(["isGuest"]);
    await AsyncStorage.setItem("userEmail", values.email);
    await AsyncStorage.setItem("userFullName", values.name);

    router.push("/home");
  } catch (error) {
    Alert.alert("Signup Error", error.message);
  }
};


  return (
    <SafeAreaView className="bg-white">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="mb-2 flex justify-center items-center">
          <Image source={logo} style={{ width: 250, height: 150 }} />
          <Text className="text-3xl font-bold mb-4 text-pink-600">
            {`Let's Get Started!`}
          </Text>

          <View className="w-5/6 p-3">
            <Formik
              initialValues={{ name: "", email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSignup}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View className="w-full py-4 space-y-4">
                  <Text className={"text-pink-600 font-semibold text-lg"}>
                    Name
                  </Text>
                  <TextInput
                    className="border border-gray-400 rounded-xl p-4 text-lg"
                    placeholder="Enter your name"
                    keyboardType="default"
                    onChangeText={handleChange("name")}
                    value={values.name}
                    onBlur={handleBlur}
                  />
                  {errors.email && touched.email && (
                    <Text className="text-red-500 text-small mb-2">
                      {errors.name}
                    </Text>
                  )}
                  <Text className={"text-pink-600 font-semibold text-lg mt-3"}>
                    Email
                  </Text>
                  <TextInput
                    className="border border-gray-400 rounded-xl p-4 text-lg"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    onChangeText={handleChange("email")}
                    value={values.email}
                    onBlur={handleBlur}
                  />
                  {errors.email && touched.email && (
                    <Text className="text-red-500 text-small mb-2">
                      {errors.email}
                    </Text>
                  )}
                  <Text className={"text-pink-600 font-semibold text-lg mt-3"}>
                    Password
                  </Text>
                  <TextInput
                    className="border border-gray-400 rounded-xl p-4 text-lg"
                    placeholder="Enter your password"
                    secureTextEntry
                    onChangeText={handleChange("password")}
                    value={values.password}
                    onBlur={handleBlur}
                  />
                  {errors.password && touched.password && (
                    <Text className="text-red-500 text-small mb-2">
                      {errors.password}
                    </Text>
                  )}

                  <TouchableOpacity className="rounded-xl p-2 mt-5">
                    <Text
                      className="font-semibold text-xl text-center text-white bg-pink-500 rounded-lg p-3"
                      onPress={handleSubmit}
                    >
                      Signup
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
            <View className="flex items-center mt-1">
              <TouchableOpacity
                className="flex flex-row items-center gap-2"
                onPress={() => router.push("/login")}
              >
                <Text className="text-center text-lg font-semibold text-yellow-600">
                  Login as Existing User
                </Text>
                <Text className="text-lg font-semibold text-pink-700 underline">
                  Log-in
                </Text>
              </TouchableOpacity>
              <Text className="text-center text-2xl font-semibold mt-3 text-pink-600">
                <View className="border-b-2 border-pink-400 p-2 m-1 w-24" />{" "}
                {"  "} or{" "}
                <View className="border-b-2 border-pink-400 p-2 m-1 w-24" />
              </Text>
              <TouchableOpacity
                className="flex flex-row items-center gap-2 mt-4"
                onPress={handleGuest}
              >
                <Text className="text-center text-lg font-semibold text-yellow-600">
                  Become a
                </Text>
                <Text className="text-lg font-semibold text-pink-700 underline">
                  {" "}
                  Guest User
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="flex-1">
          <Image
            source={logo1}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>

        <StatusBar barStyle={"light-content"} backgroundColor={"#ffffff"} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
