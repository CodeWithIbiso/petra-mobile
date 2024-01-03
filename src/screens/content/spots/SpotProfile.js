import React, {useEffect, useState} from 'react';
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';

import theme from '../../../theme';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import navigationNames from '../../../navigationNames';
import {useSelector} from 'react-redux';
import {CustomVideoPlayer} from '../../../components/elements/SpotComponents';
import {SpotNavigationHeader} from '../../../components/navigation/SpotNavigationHeader';

const PopularCategories = ({
  spot: {popularCategories: categories},
  themeStyle,
}) => {
  return (
    <View style={{marginTop: 30}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            marginLeft: 10,
            fontSize: 16,
            color: themeStyle.primaryText,
          }}>
          Popular Categories
        </Text>
      </View>
      <ScrollView
        style={{marginTop: 10}}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {categories.map((category, index) => (
          <View
            key={index}
            style={{
              height: 260,
              borderWidth: 0.3,
              marginLeft: index == 0 ? 5 : 0,
              backgroundColor: theme.colors.darkblue,
              marginRight: 10,
              justifyContent: 'center',
              width: 180,
              alignItems: 'center',
              borderRadius: 60,
            }}>
            <View
              style={{
                borderWidth: 0.3,
                borderColor: theme.colors.darkblue,
                backgroundColor: 'white',
                padding: 7,
                borderRadius: 100,
              }}>
              <Image
                style={{width: 150, height: 150, borderRadius: 100}}
                source={{uri: category?.image}}
                resizeMode="cover"
              />
            </View>
            <Text
              style={{
                fontWeight: '500',
                color: 'white',
                marginBottom: 10,
                fontSize: 18,
              }}>
              {category.title}
            </Text>
            <Text
              style={{
                fontWeight: '500',
                color: 'white',
                marginBottom: 10,
                fontSize: 16,
              }}>
              <Text style={{fontSize: 10}}>{category.currency}</Text>
              {category.price}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const SpotProfile = () => {
  const {width} = useWindowDimensions();
  const navigation = useNavigation();

  const user = useSelector(state => state?.user?.user);
  const selectedSpot = useSelector(state => state?.user?.selectedSpot);
  const themeStyle = useSelector(state => state?.app?.themeStyle);

  const [spot, setSpot] = useState(selectedSpot);

  useEffect(() => {
    setSpot(selectedSpot);
  }, [selectedSpot]);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <SpotNavigationHeader spot={spot} themeStyle={themeStyle} />

      <Image
        style={{
          width,
          height: width,
          position: 'absolute',
        }}
        resizeMode="cover"
        source={{uri: spot?.image}}
      />
      <View style={{flex: 0.3}} />
      <View
        style={{
          flex: 1,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          backgroundColor: themeStyle.bgColor,
        }}>
        {user?.id !== spot?.creator && (
          <TouchableOpacity
            style={[
              {
                backgroundColor: theme.colors.darkblue_dark,
                position: 'absolute',
                bottom: 50,
                right: 20,
                zIndex: 1,
                borderRadius: 20,
              },
            ]}
            onPress={() => navigation.navigate(navigationNames.ChatSpot)}>
            <View
              style={{
                height: 70,
                width: 70,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MaterialIcons name={'chat'} size={28} color={'white'} />
            </View>
          </TouchableOpacity>
        )}
        <View
          style={{
            flex: 1,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}>
          <View
            style={{
              width: 100,
              height: 5,
              borderRadius: 10,
              alignSelf: 'center',
              marginVertical: 15,
              backgroundColor: theme.colors.black,
            }}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <PopularCategories spot={spot} themeStyle={themeStyle} />
            <View
              style={{
                paddingHorizontal: 20,
                marginTop: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginVertical: 10,
                  marginRight: 40,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: themeStyle.primaryText,

                    fontSize: 16,
                  }}>
                  About Us
                </Text>
              </View>
              <Text
                style={{
                  fontWeight: '400',
                  color: themeStyle.primaryText,
                  fontSize: 14,
                }}>
                {spot.about}
              </Text>
            </View>

            <View
              style={{
                marginTop: 20,
                backgroundColor: themeStyle.card,
              }}>
              <CustomVideoPlayer videoURI={spot?.video?.uri || spot?.video} />
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default SpotProfile;
