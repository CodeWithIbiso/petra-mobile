import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import theme from '../../theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useLazyQuery} from '@apollo/client';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {setUserSpots} from '../../store/user';
import navigationNames from '../../navigationNames';
import {GET_USER_SPOTS} from '../../graphql/queries';

const Header = ({themeStyle}) => {
  const navigation = useNavigation();
  return (
    <View style={{marginHorizontal: 0}}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 25,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={20}
            color={themeStyle.primaryText}
          />
        </TouchableOpacity>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate(navigationNames.SpotCreation)}>
            <MaterialIcons
              name="add-location-alt"
              size={20}
              color={themeStyle.primaryText}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(navigationNames.UserProfile)}>
            <FontAwesome5
              name="user-edit"
              size={15}
              style={{marginLeft: 20}}
              color={themeStyle.primaryText}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function Account() {
  const {width} = useWindowDimensions();
  const [totalSpots, setTotalSpots] = useState([]);
  const themeStyle = useSelector(state => state.app.themeStyle);
  const user = useSelector(state => state?.user);
  const [photo, setPhoto] = useState(user?.user?.image);
  const isFocused = useIsFocused();
  const {
    user: {username, id},
    userSpots,
  } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    setPhoto(user?.user?.image);
  }, [user]);

  const [getUserSpots, {}] = useLazyQuery(GET_USER_SPOTS, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });
  const fetchAllUserSpots = async () => {
    await getUserSpots({
      variables: {creator: id},
      onCompleted: res => {
        res = res?.getUserSpots;
        dispatch(setUserSpots(res));
        setTotalSpots(res);
      },
      onError: error => {},
    });
  };
  useEffect(() => {
    fetchAllUserSpots();
  }, [isFocused]);
  useLayoutEffect(() => {
    setTotalSpots(userSpots);
  }, [isFocused]);

  const SpotOptions = () => (
    <View style={{flex: 1, marginTop: 60}}>
      <TouchableOpacity
        onPress={() => navigation.navigate(navigationNames.SpotCreation)}
        style={{
          backgroundColor: themeStyle.card,
          width: width - 100,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
          height: 60,
          marginBottom: 20,
          flexDirection: 'row',
        }}>
        <Text
          style={{
            color: themeStyle.primaryText,
            textAlign: 'center',
            marginRight: 5,
          }}>
          Create a Spot
        </Text>
        <Entypo name="plus" size={20} color={themeStyle.primaryText} />
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          alignItems: totalSpots.length < 1 ? 'center' : 'flex-start',
          justifyContent: totalSpots.length < 1 ? 'flex-start' : 'flex-start',
        }}>
        {totalSpots.length == 0 ? (
          <View
            style={{
              alignItems: 'center',

              paddingHorizontal: 50,
              paddingVertical: 20,
              borderRadius: 50,
              justifyContent: 'center',
              flexDirection: 'row',
              backgroundColor: theme.colors.darkblue_dark,
              width: width - 100,
            }}>
            <Text
              style={{
                color: theme.colors.light,
                textAlign: 'center',
                marginRight: 5,
              }}>
              You have not created a Spot
            </Text>
          </View>
        ) : null}
        {totalSpots.length > 0 ? (
          <TouchableOpacity
            onPress={() => navigation.navigate(navigationNames.UserSpots)}
            style={{
              alignItems: 'center',
              width: width - 100,
              paddingHorizontal: 50,
              paddingVertical: 20,
              borderRadius: 50,
              justifyContent: 'center',
              backgroundColor: theme.colors.darkblue_dark,
            }}>
            <Text
              style={{
                color: theme.colors.light,
                textAlign: 'center',
              }}>
              Checkout My Spots
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
  const User = () => (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -60,
        zIndex: 500,
        position: 'absolute',
      }}>
      <View>
        <View
          style={{
            backgroundColor: themeStyle.card,
            height: 100,
            width: 100,
            borderRadius: 100,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 5,
            borderColor: themeStyle.bgColor,
          }}>
          {photo ? (
            () => {
              return (
                <Image
                  source={{uri: photo}}
                  resizeMode="cover"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 100,
                    backgroundColor: themeStyle.card,
                  }}
                />
              );
            }
          ) : (
            <FontAwesome5
              color={theme.colors.cardDark}
              name="user-alt"
              size={80}
              style={{zIndex: -10}}
            />
          )}
        </View>
        <View
          style={{
            width: 80,
            alignSelf: 'center',
            position: 'absolute',
            bottom: 0,
            borderWidth: 1,
            borderColor: themeStyle.bgColor,
            height: 10,
            backgroundColor: theme.colors.blue,
            borderRadius: 50,
          }}></View>
      </View>
      <Text
        style={{
          textAlign: 'center',
          marginTop: 5,
          color: themeStyle.primaryText,
        }}>
        {username}
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <EvilIcons
          name={'location'}
          size={12}
          color={theme.colors.red}
          style={{marginHorizontal: 2}}
        />
        <Text
          style={{
            color: themeStyle.primaryText,
          }}>
          23 Spots | Visited 12
        </Text>
      </View>
    </View>
  );
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 45,
        backgroundColor: themeStyle.card,
      }}>
      <Header themeStyle={themeStyle} />
      <View
        style={{
          flex: 1,
          marginTop: 150,
          paddingTop: 150,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          backgroundColor: themeStyle.bgColor,
          alignItems: 'center',
        }}>
        <User />
        <View
          style={{
            width: width - 100,

            marginTop: -30,
            marginBottom: 30,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <View>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 25,
                color: themeStyle.primaryText,
              }}>
              {totalSpots.length}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                color: themeStyle.primaryText,
              }}>
              spots
            </Text>
          </View>
          <View>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 25,
                color: themeStyle.primaryText,
              }}>
              120
            </Text>
            <Text
              style={{
                textAlign: 'center',
                color: themeStyle.primaryText,
              }}>
              likes
            </Text>
          </View>
          <View>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 25,
                color: themeStyle.primaryText,
              }}>
              34
            </Text>
            <Text
              style={{
                textAlign: 'center',
                color: themeStyle.primaryText,
              }}>
              saved
            </Text>
          </View>
        </View>
        <SpotOptions />
      </View>
    </View>
  );
}
