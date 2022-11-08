import { View, Text, StyleSheet, Image, Switch } from "react-native";
import { useState } from "react";
import * as Font from "expo-font";
import globe from "../../assets/globe.png";
const ListedLocations = (props) => {
  const pos = JSON.parse(props.pos.value);
  const [isEnabled, setIsEnabled] = useState(pos.isEnabled);
  const [fontLoaded, setFontLoaded] = useState(false);
  const componentDidMount = async () => {
    await Font.loadAsync({
      myfont: require("../../assets/font/opensans.ttf"), // Uwaga: proszę w nazwie fonta nie używać dużych liter
    });
    setFontLoaded(true);
  };
  componentDidMount();

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    props.clickFunction(pos.timestamp);
  };

  if (props.switchHandler === true && isEnabled === false) toggleSwitch();

  return (
    <View style={styles.listContainer}>
      <View style={styles.listItem}>
        <View style={styles.imageCont}>
          <Image style={styles.image} source={globe} />
        </View>
        <View style={styles.dataCont}>
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
    flexDirection: "row",
  },
  text: {
    fontFamily: "myfont",
  },
  image: {
    width: 60,
    height: 60,
  },
  imageCont: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    // marginRight: 10,
  },
  dataCont: {
    flexDirection: "column",
    // padding: 5,
    flex: 3,
  },
});
export default ListedLocations;
