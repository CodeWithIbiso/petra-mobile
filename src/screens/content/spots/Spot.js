import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import {SpotNavigationHeader} from '../../../components/navigation/SpotNavigationHeader';
import BottomSheet from '@gorhom/bottom-sheet';

import {useSharedValue} from 'react-native-reanimated';
import theme from '../../../theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import navigationNames from '../../../navigationNames';
import {useSelector} from 'react-redux';
import CustomMapComponent from '../../../components/elements/CustomMapComponent';

const Categories = ({categories, themeStyle}) => {
  const {width} = useWindowDimensions();

  const handleCategories = ({category, index}) => {
    let containerHeight = (width * 1.2) / 4;

    let containerWidth = (width - 50) / 4;
    let imageSize = 55;
    return (
      <TouchableOpacity
        key={index}
        style={{
          height: containerHeight,
          marginRight: 10,
          backgroundColor: theme.colors.darkblue,
          justifyContent: 'center',
          width: containerWidth,
          alignItems: 'center',
          borderRadius: 35,
        }}>
        <View
          style={{
            backgroundColor: theme.colors.light,
            padding: 5,
            borderRadius: 100,
            marginTop: 30,
            marginBottom: 10,
          }}>
          <Image
            style={{width: imageSize, height: imageSize, borderRadius: 100}}
            source={{uri: category.image}}
            resizeMode="cover"
          />
        </View>
        <Text
          style={{
            marginBottom: 40,
            color: theme.colors.light,
          }}>
          {category?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{marginTop: 10}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 16,
            color: themeStyle.primaryText,
          }}>
          Categories
        </Text>
      </View>
      {categories.length > 0 ? (
        <ScrollView
          style={{marginTop: 10}}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {categories?.map((category, index) =>
            handleCategories({category, index, total: categories.length}),
          )}
        </ScrollView>
      ) : null}
    </View>
  );
};

const SheetContent = ({spot, themeStyle}) => {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();

  const dialNumber = () => {
    const phone = spot.contactNumber || '';
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${phone}`;
    } else {
      phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert(
            'Oops',
            'An error occured when trying to open your phone pad',
          );
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <Text
        style={{
          flexWrap: 'wrap',
          width: 200,
          alignSelf: 'center',
          textAlign: 'center',
          fontWeight: 'bold',
          color: themeStyle.primaryText,
          fontSize: 18,
        }}>
        {spot?.title}
      </Text>
      <Categories themeStyle={themeStyle} categories={spot?.categories} />
      <View style={{marginTop: 10, marginBottom: 100}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              color: themeStyle.primaryText,
            }}>
            Description
          </Text>
        </View>
        <Text
          style={{
            color: themeStyle.primaryText,
          }}>
          {spot?.description || 'This spot does not have a description'}
        </Text>
      </View>
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          position: 'absolute',
          bottom: 20,
          height: 60,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.darkblue,
            width: width - 90,
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 2,
            justifyContent: 'center',
            borderRadius: 50,
          }}>
          <Text
            onPress={dialNumber}
            style={{
              fontSize: 20,
              marginRight: 10,
              alignSelf: 'center',
              color: theme.colors.light,
            }}>
            Quick Call
          </Text>
          <Entypo name="phone" size={20} color={theme.colors.light} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(navigationNames.SpotProfile)}
          style={{
            backgroundColor: theme.colors.darkblue,
            alignItems: 'center',
            justifyContent: 'center',
            height: 60,
            width: 60,
            borderRadius: 100,
          }}>
          <FontAwesome5
            name="chevron-right"
            size={20}
            color={theme.colors.light}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const Spot = () => {
  const animatedIndex = useSharedValue(0);
  const bottomSheetRef = useRef(null);
  const selectedSpot = useSelector(state => state?.user?.selectedSpot);
  const [duration, setDuration] = useState('Calculating...');
  const themeStyle = useSelector(state => state.app.themeStyle);

  const [destination, setDestination] = useState({
    latitude: selectedSpot.location.latitude,
    longitude: selectedSpot.location.longitude,
  });

  const [spot, setSpot] = useState(selectedSpot);

  useEffect(() => {
    setSpot(selectedSpot);
  }, [selectedSpot]);

  const snapPoints = useMemo(() => ['20%', '70%']);

  const [rating, setRating] = useState(false);

  useLayoutEffect(() => {
    setDestination({
      latitude: spot.location.latitude,
      longitude: spot.location.longitude,
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <SpotNavigationHeader spot={spot} themeStyle={themeStyle} />
      {destination && (
        <CustomMapComponent
          duration={duration}
          setDuration={setDuration}
          setDestination={setDestination}
          destination={destination}
        />
      )}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        animatedIndex={animatedIndex}
        snapPoints={snapPoints}
        handleComponent={() => <View />}
        backgroundComponent={() => <View />}>
        <Image
          style={{
            height: 120,
            width: 120,
            borderRadius: 100,
            borderColor: themeStyle.bgColor,
            borderWidth: 10,
            alignSelf: 'center',
            marginBottom: -60,
            zIndex: 1,
            backgroundColor: theme.colors.cardLight,
          }}
          resizeMode="cover"
          source={{uri: spot?.image}}
        />
        <ScrollView
          style={{
            flex: 1,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            padding: 20,
            backgroundColor: themeStyle.bgColor,
          }}
          contentContainerStyle={{
            flex: 1,
          }}>
          <View
            style={{
              marginTop: 30,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => {
                setRating(!rating);
              }}>
              <FontAwesome
                name={rating ? 'star' : 'star-o'}
                size={20}
                color={'gold'}
              />
              <Text style={{color: themeStyle.primaryText}}>4.8</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name="timer"
                size={20}
                color={theme.colors.purple}
              />
              <Text style={{color: themeStyle.primaryText, marginLeft: 5}}>
                {duration}
              </Text>
            </TouchableOpacity>
          </View>
          <SheetContent spot={spot} themeStyle={themeStyle} />
        </ScrollView>
      </BottomSheet>
    </View>
  );
};

export default Spot;
