import {
  View,
  StyleSheet,
  FlatList,
  Switch,
  ActivityIndicator,
} from "react-native";
import Button from "../UI/Button";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListedLocations from "./ListedLocations";
const Listed = ({ navigation }) => {
  const [loaded, setLoaded] = useState(false);
  const [allLocations, setAllLocations] = useState({
    positions: [],
    allEnabled: false,
  });

  useEffect(() => {
    getAllData(allLocations.allEnabled);
    const authorizeLocation = async () => {
      await Location.requestForegroundPermissionsAsync();
    };
    authorizeLocation();
    setLoaded(true);
  }, []);

  const toggleMainSwitch = async () => {
    allLocations.positions.map(async (position) => {
      let currentPositionValue = JSON.parse(position.value);
      if (currentPositionValue.isEnabled === false) return;
      currentPositionValue.isEnabled = true;
      position.value = currentPositionValue;
      await AsyncStorage.setItem(
        `${position.key}`,
        JSON.stringify(position.value)
      );
    });
    await getAllData(!allLocations.allEnabled);
  };

  const getPosition = async () => {
    let pos = await Location.getCurrentPositionAsync({});
    const position = {
      id: Math.floor(Math.random() * 100),
      timestamp: pos.timestamp,
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      isEnabled: allLocations.allEnabled,
    };
    alert(JSON.stringify(position, null, 5));
    await setData(position);
    await getAllData(allLocations.allEnabled);
  };

  const setData = async (position) => {
    await AsyncStorage.setItem(
      `${position.timestamp}`,
      JSON.stringify(position)
    );
  };

  const getAllData = async (switchBool) => {
    let keys = await AsyncStorage.getAllKeys();
    let stores = await AsyncStorage.multiGet(keys);
    let maps = stores.map((result, i, store) => {
      let key = store[i][0];
      let value = store[i][1];
      return { key: key, value: value };
    });
    console.log("66", maps);
    console.log("---------------------------");
    setAllLocations({
      positions: maps,
      allEnabled: switchBool,
    });
  };

  const clearData = async () => {
    await AsyncStorage.clear();
    setAllLocations({
      positions: [],
      allEnabled: allLocations.allEnabled,
    });
    alert("All locations cleared!");
  };

  const positionSwitchHandler = async (key) => {
    allLocations.positions.map(async (position) => {
      let currentPositionValue = position.value;
      if (JSON.parse(currentPositionValue).timestamp === key) {
        currentPositionValue = JSON.parse(currentPositionValue);
        currentPositionValue.isEnabled = !currentPositionValue.isEnabled;
        await AsyncStorage.setItem(
          `${key}`,
          JSON.stringify(currentPositionValue)
        );
      }
    });
    await getAllData(allLocations.allEnabled);
  };

  const displayMap = async () => {
    console.log("displaying map");

    const selectedPositions = allLocations.positions.map((position) => {
      if (JSON.parse(position.value).isEnabled) return position;
    });

    const filteredPositions = selectedPositions.filter(function (element) {
      return element !== undefined;
    });
    console.log("119", filteredPositions);
    if (filteredPositions.length > 0)
      navigation.navigate("Map", { locations: filteredPositions });
    else alert("Select position or positions to view them on map");
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button text={"add position"} clickFunction={getPosition}></Button>
        <Button
          text={"remove all positions"}
          clickFunction={clearData}
        ></Button>
      </View>
      <View style={styles.buttonContainer}>
        <Button text={"check map"} clickFunction={displayMap}></Button>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={allLocations.allEnabled ? "#fff" : "#fff"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleMainSwitch}
          value={allLocations.allEnabled}
        />
      </View>

      <View style={styles.positionsContainer}>
        {loaded ? (
          <FlatList
            style={styles.list}
            data={allLocations.positions}
            renderItem={(pos) => {
              return (
                <ListedLocations
                  clickFunction={positionSwitchHandler}
                  pos={pos.item}
                  switchHandler={allLocations.allEnabled}
                ></ListedLocations>
              );
            }}
          ></FlatList>
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
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
  },
  positionsContainer: {
    flex: 10,
    margin: 15,
    alignItems: "center",
  },
  list: {
    flex: 1,
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
