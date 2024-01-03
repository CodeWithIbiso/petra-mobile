import React, {useState, useRef, useLayoutEffect} from 'react';
import {View, Platform, PermissionsAndroid} from 'react-native';
import LottieView from 'lottie-react-native';

import MapView, {Marker, Polyline} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {GOOGLE_MAPS_API_KEY} from '@env';
import theme from '../../theme';
import assets from '../../assets';

const CustomMapComponent = ({destination, setDuration}) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [origin, setOrigin] = useState(null);
  const [lineCoordinates, setLineCoordinates] = useState([]);
  const mapRef = useRef(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        }
      } catch (err) {}
    } else if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('whenInUse').then(authorization => {
        if (authorization === 'granted') {
          getCurrentLocation();
        }
      });
    }
  };

  const getCurrentLocation = () => {
    setPermissionGranted(true);
    Geolocation.getCurrentPosition(
      position => {
        var ORIGIN = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setOrigin(ORIGIN);
        fetchDirections(ORIGIN, destination);
      },
      error => {},
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const fetchDirections = async (origin, destination) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}`,
      );
      const result = await response.json();
      if (result.status === 'OK') {
        // Set duration state
        const durationText = result.routes[0].legs[0].duration.text;
        setDuration(durationText);

        const points = result.routes[0].overview_polyline.points;
        const decodedPoints = decodePolyline(points);
        // show streets
        setLineCoordinates(decodedPoints);
        // zoom in
        zoomToDirections(decodedPoints);
      }
    } catch (error) {}
  };

  const decodePolyline = polyline => {
    const points = [];
    let index = 0;
    const len = polyline.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const deltaLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += deltaLat;

      shift = 0;
      result = 0;
      do {
        b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const deltaLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += deltaLng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return points;
  };

  const zoomToDirections = decodedPoints => {
    if (mapRef.current && decodedPoints.length > 0) {
      mapRef.current.fitToCoordinates(decodedPoints, {
        edgePadding: {top: 10, right: 10, bottom: 10, left: 10},
      });
    }
  };

  useLayoutEffect(() => {
    !permissionGranted && requestLocationPermission();
  }, [permissionGranted]);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <MapView
        ref={mapRef}
        style={{bottom: 0, left: 0, position: 'absolute', right: 0, top: 0}}
        initialRegion={{
          latitude: origin?.latitude,
          longitude: origin?.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}>
        {origin && (
          <Marker coordinate={origin}>
            <LottieView
              speed={0.3}
              style={{
                width: 100,
                height: 100,
              }}
              source={assets.mapsLocationPin}
              autoPlay={true}
              loop={true}
            />
          </Marker>
        )}
        {destination && (
          <Marker coordinate={destination} pinColor={theme.colors.red}>
            <LottieView
              speed={0.3}
              style={{
                width: 60,
                height: 60,
              }}
              source={assets.mapsLocationRedPin}
              autoPlay={true}
              loop={true}
            />
          </Marker>
        )}
        {lineCoordinates.length > 0 && (
          <Polyline
            coordinates={lineCoordinates}
            strokeWidth={5}
            strokeColor={theme.colors.darkblue}
          />
        )}
      </MapView>
    </View>
  );
};

export default CustomMapComponent;
