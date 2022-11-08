import MapView from "react-native-maps";
const Map = ({ route, navigation }) => {
  const positions = route.params.positions;
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: positions[0].latitude,
        longitude: positions[0].longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      }}
    >
      {positions.map((singlePos) => {
        if (singlePos === undefined) return;
        return (
          <MapView.Marker
            key={singlePos.timestamp}
            coordinate={{
              latitude: singlePos.latitude,
              longitude: singlePos.longitude,
            }}
            title={`${singlePos.id}`}
            description={`${singlePos.timestamp}`}
          />
        );
      })}
    </MapView>
  );
};

export default Map;
