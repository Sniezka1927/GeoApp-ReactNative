import { View, Text, StyleSheet, FlatList, Switch } from "react-native";
import { useState } from "react";
import * as Font from "expo-font";

const ListedLocations = (props) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const componentDidMount = async () => {
    await Font.loadAsync({
      myfont: require("../../assets/font/opensans.ttf"), // Uwaga: proszę w nazwie fonta nie używać dużych liter
    });
    setFontLoaded(true);
  };
  componentDidMount();

  const pos = JSON.parse(props.pos.value);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    const id = pos.id;
    props.clickFunction(id);
  };

  if (props.switchHandler === true && isEnabled === false) toggleSwitch();

  return (
    <View style={styles.listContainer}>
      <View style={styles.listItem}>
        <Text style={styles.text}>Timestamp: {pos.timestamp}, </Text>
        <Text style={styles.text}>Latitude: {pos.latitude}, </Text>
        <Text style={styles.text}>Longitude: {pos.longitude}</Text>
      </View>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#fff" : "#fff"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    flexDirection: "row",
    margin: 30,
    padding: 15,
    borderWidth: 2,
    borderRadius: 25,
  },
  listItem: {
    flexDirection: "column",
  },
  text: {
    fontFamily: "myfont",
  },
});
export default ListedLocations;
