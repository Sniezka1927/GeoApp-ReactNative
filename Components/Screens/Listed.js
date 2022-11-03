import { View, Text, StyleSheet, FlatList, Switch } from "react-native";
import Button from "../UI/Button";
import * as Location from "expo-location";
import * as Font from "expo-font";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Listed = ({ route, navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [positions, setPositions] = useState([{"latitude": 50.0458276, "longitude": 19.9812548, "timestamp": 1667411208458}]);
  const [fontLoaded, setFontLoaded] = useState(false);

  const componentDidMount = async () => {
    await Font.loadAsync({
      myfont: require("../../assets/font/opensans.ttf"), // Uwaga: proszę w nazwie fonta nie używać dużych liter
    });
    Location.requestForegroundPermissionsAsync();
    setFontLoaded(true);
    getAllData();
  };

  const getAllData = async () => {
    let keys = await AsyncStorage.getAllKeys();
    let stores = await AsyncStorage.multiGet(keys);
    let maps = stores.map((result, i, store) => {
      let key = store[i][0];
      let value = store[i][1];
      return { key: key, value: value };
    });
    setPositions(maps);
    console.log(positions);
  };

  if (!fontLoaded) componentDidMount();

  const getPosition = async () => {
    let pos = await Location.getCurrentPositionAsync({});
    const position = {
      timestamp: pos.timestamp,
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
    console.log(position);
    // getAllData();
    await setData(position);
  };

  const setData = async (position) => {
    await AsyncStorage.setItem(
      `${position.timestamp}`,
      JSON.stringify(position)
    );
    getAllData();
  };

  const getData = async (position) => {
    let val = await AsyncStorage.getItem(`${position.timestamp}`);
    console.log(val);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button text={"add position"} clickFunction={getPosition}></Button>
        <Button text={"remove all positions"}></Button>
      </View>
      <View style={styles.buttonContainer}>
        <Button text={"check map"}></Button>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#fff" : "#fff"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <View style={styles.positionsContainer}>
        <FlatList
          style={styles.list}
          data={positions}
          renderItem={(pos) => {
            <View style={styles.listItem}>
              <Text style={styles.text}>
                {JSON.parse(pos.item.value).timestamp}
              </Text>
              <Text style={styles.text}>
                {JSON.parse(pos.item.value).latitude}
              </Text>
              <Text style={styles.text}>
                {JSON.parse(pos.item.value).longitude}
              </Text>
            </View>;
          }}
        ></FlatList>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "red",
  },
  positionsContainer: {
    flex: 10,
    backgroundColor: "yellow",
    borderWidth: 10,
    margin: 15,
    width: 150,
    alignItems: "center",
  },
  list: {
    flex: 1,
    backgroundColor: "red",
  },
  listItem: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    flexDirection: "row",
    margin: 30,
    borderWidth: 2,
    borderRadius: 25,
  },
  text: {
    color: "#fff",
    fontSize: 82,
  },
});

export default Listed;
