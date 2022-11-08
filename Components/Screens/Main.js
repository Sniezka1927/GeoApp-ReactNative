import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Font from "expo-font";
import { useState } from "react";

const Main = ({ route, navigation }) => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const componentDidMount = async () => {
    await Font.loadAsync({
      myfont: require("../../assets/font/opensans.ttf"), // Uwaga: proszę w nazwie fonta nie używać dużych liter
    });
    setFontLoaded(true);
  };
  componentDidMount();

  const enterApp = () => {
    navigation.navigate("Listed", { importedFont: "myfont" });
  };

  return (
    <View style={styles.container}>
      {fontLoaded ? (
        <View style={styles.container}>
          <TouchableOpacity onPress={enterApp}>
            <Text style={styles.title}>Geo App</Text>
          </TouchableOpacity>

          <Text style={styles.ad}>
            Find your location and save it with google maps
          </Text>
        </View>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#448aff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#0031ca",
    fontSize: 72,
    fontFamily: "myfont",
  },
  ad: {
    color: "#3d5afe",
    fontSize: 26,
    margin: 10,
    fontFamily: "myfont",
  },
});

export default Main;
