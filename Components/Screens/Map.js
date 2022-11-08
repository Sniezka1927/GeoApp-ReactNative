import MapView from "react-native-maps";
const Map = ({ route, navigation }) => {
  const allLocations = route.params.locations;
  const firstLocation = JSON.parse(route.params.locations[0].value);
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: firstLocation.latitude,
        longitude: firstLocation.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      }}
    >
      {allLocations.map((singleLocation) => {
        const locationValue = JSON.parse(singleLocation.value);
        return (
          <MapView.Marker
            key={locationValue.timestamp}
            coordinate={{
              latitude: locationValue.latitude,
              longitude: locationValue.longitude,
            }}
            title={`${locationValue.id}`}
            description={`${locationValue.timestamp}`}
          />
        );
      })}
    </MapView>
  );
};

export default Map;
