import { View, Text, StyleSheet, FlatList, Switch } from "react-native";
import Button from "../UI/Button";
import * as Location from "expo-location";
// import * as Font from "expo-font";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListedLocations from "./ListedLocations";
const Listed = ({ navigation }) => {
  const [positions, setPositions] = useState({
    positions: [],
    allEnabled: false,
  });

  useEffect(() => {
    getAllData();
    const authorizeLocation = async () => {
      await Location.requestForegroundPermissionsAsync();
    };
    authorizeLocation();
  }, []);

  const toggleSwitch = async () => {
    const adjustedPos = positions.positions.map((singlePos) => {
      let parsedPos = JSON.parse(singlePos.value);
      parsedPos.enabled = !parsedPos.enabled;
      singlePos.value = JSON.stringify(parsedPos);
      return singlePos;
    });
    setPositions({
      positions: adjustedPos,
      allEnabled: !positions.allEnabled,
    });
  };

  const getPosition = async () => {
    let pos = await Location.getCurrentPositionAsync({});
    const position = {
      id: Math.floor(Math.random() * 100),
      timestamp: pos.timestamp,
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      enabled: positions.allEnabled,
    };
    alert(JSON.stringify(position, null, 5));
    await setData(position);
  };

  const setData = async (position) => {
    await AsyncStorage.setItem(
      `${position.timestamp}`,
      JSON.stringify(position)
    );
    console.log(position, "55");
    let updatedPositions = positions.positions;
    updatedPositions.push(position);
    console.log(positions.positions, "58");

    setPositions({
      positions: updatedPositions,
      allEnabled: positions.allEnabled,
    });

    // getAllData();
  };

  const getAllData = async () => {
    let keys = await AsyncStorage.getAllKeys();
    let stores = await AsyncStorage.multiGet(keys);
    let maps = stores.map((result, i, store) => {
      let key = store[i][0];
      let value = store[i][1];
      return { key: key, value: value };
    });
    setPositions({
      positions: maps,
      allEnabled: positions.allEnabled,
    });
  };

  const clearData = async () => {
    await AsyncStorage.clear();
    setPositions({
      positions: [],
      allEnabled: false,
    });
  };

  const positionSwitchHandler = (id) => {
    const adjustedPos = positions.positions.map(async (singlePos) => {
      let parsedPos = JSON.parse(singlePos.value);
      console.log(parsedPos);
      if (parsedPos.id === id) {
        parsedPos.enabled = !parsedPos.enabled;
        singlePos.value = JSON.stringify(parsedPos);
      }
      return singlePos;
    });
    // setPositions(adjustedPos);
    console.log(adjustedPos);
    setPositions({
      positions: adjustedPos,
      allEnabled: positions.allEnabled,
    });
  };

  const displayMap = () => {
    const parsedPos = positions.positions.map((singlePos) => {
      return JSON.parse(singlePos.value);
    });
    console.log(parsedPos);
    console.log("-----------------------------------------");
    const enabledPos = parsedPos.map((singlePos) => {
      if (singlePos.enabled) return singlePos;
    });
    if (enabledPos.length >= 1 && enabledPos[0] !== undefined)
      navigation.navigate("Map", { positions: enabledPos });
    else alert("select any position to display them on Map.");
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
          thumbColor={positions.allEnabled ? "#fff" : "#fff"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={positions.allEnabled}
        />
      </View>

      <View style={styles.positionsContainer}>
        <FlatList
          style={styles.list}
          data={positions.positions}
          renderItem={(pos) => {
            return (
              <ListedLocations
                clickFunction={positionSwitchHandler}
                pos={pos.item}
                switchHandler={positions.allEnabled}
              ></ListedLocations>
            );
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
