import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Font from "expo-font";
import { useState } from "react";

const Button = (props) => {
  const [fontLoaded, setFontLoaded] = useState(false);
  componentDidMount = async () => {
    await Font.loadAsync({
      myfont: require("../../assets/font/opensans.ttf"), // Uwaga: proszę w nazwie fonta nie używać dużych liter
    });
    setFontLoaded(true);
  };

  componentDidMount();

  return (
    <TouchableOpacity style={styles.button} onPress={props.clickFunction}>
      <View>
        <Text style={styles.text}>{props.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0288D1",
    color: "#fff",
    margin: 10,
    fontSize: 24,
    padding: 10,
    borderColor: "#0288D1",
    borderWidth: 1,
    borderRadius: 10,
  },
  text: {
    fontFamily: "myfont",
  },
});

export default Button;
