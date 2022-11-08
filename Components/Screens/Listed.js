import { View, Text, StyleSheet, FlatList, Switch } from "react-native";
import Button from "../UI/Button";
import * as Location from "expo-location";
// import * as Font from "expo-font";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListedLocations from "./ListedLocations";
const Listed = ({ route, navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  // const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    getAllData();
  }, []);

  const toggleSwitch = async () => {
    const adjustedPos = positions.map((singlePos) => {
      let parsedPos = JSON.parse(singlePos.value);
      parsedPos.enabled = !parsedPos.enabled;

      singlePos.value = JSON.stringify(parsedPos);
      return singlePos;
    });

    setPositions(adjustedPos);
    setIsEnabled((previousState) => !previousState);
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
  };

  const getPosition = async () => {
    let pos = await Location.getCurrentPositionAsync({});
    const position = {
      id: Math.floor(Math.random() * 100),
      timestamp: pos.timestamp,
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      enabled: isEnabled,
    };
    alert(JSON.stringify(position, null, 5));
    await setData(position);
  };

  const setData = async (position) => {
    await AsyncStorage.setItem(
      `${position.timestamp}`,
      JSON.stringify(position)
    );
    getAllData();
  };

  // const getData = async (position) => {
  //   let val = await AsyncStorage.getItem(`${position.timestamp}`);
  //   console.log(val);
  // };

  const clearData = async () => {
    await AsyncStorage.clear();
    setPositions([]);
  };

  const positionSwitchHandler = (id) => {
    const adjustedPos = positions.map((singlePos) => {
      let parsedPos = JSON.parse(singlePos.value);
      if (parsedPos.id === id) {
        parsedPos.enabled = !parsedPos.enabled;
        singlePos.value = JSON.stringify(parsedPos);
      }
      return singlePos;
    });
    setPositions(adjustedPos);
  };

  const displayMap = () => {
    const parsedPos = positions.map((singlePos) => {
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
            return (
              <ListedLocations
                clickFunction={positionSwitchHandler}
                pos={pos.item}
                switchHandler={isEnabled}
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
