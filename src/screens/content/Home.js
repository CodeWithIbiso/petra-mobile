import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {capitalizeFirstLetter} from '../../components/elements/utility';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import theme from '../../theme';
import {generateLoadingData, handleScrollEventFunc} from '../../utils';
import LinearGradient from 'react-native-linear-gradient';
import {Divider} from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {GET_POPULAR_SPOTS, GET_SPOTS} from '../../graphql/queries';
import {useLazyQuery} from '@apollo/client';
import {setUserSelectedSpot} from '../../store/user';
import navigationNames from '../../navigationNames';
import {addAppSpots, setScrollDirection} from '../../store/app';
import {SpotListCard} from '../../components/elements/SpotComponents';

const Ratings = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: theme.colors.light,
          fontWeight: 'bold',
          marginRight: 5,
        }}>
        5.26
      </Text>
      <View style={{flexDirection: 'row'}}>
        <FontAwesome name={'star'} size={10} color={'gold'} />
        <FontAwesome name={'star-half-full'} size={10} color={'gold'} />
        <FontAwesome name={'star-o'} size={10} color={'gold'} />
        <FontAwesome name={'star-o'} size={10} color={'gold'} />
      </View>
    </View>
  );
};

const Header = ({themeStyle}) => {
  const navigation = useNavigation();
  const user = useSelector(state => state?.user?.user);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            borderWidth: 3,
            borderColor: theme.colors.cardLight,
            backgroundColor: themeStyle.bgColor,
            height: 30,
            width: 30,
            borderRadius: 50,
            marginRight: 5,
            overflow: 'hidden',
          }}>
          {!user?.image ? (
            <FontAwesome5
              color={theme.colors.cardLight}
              name="user-alt"
              size={25}
              style={{zIndex: -10}}
            />
          ) : (
            <Image
              resizeMode="cover"
              style={{height: 25, width: 25}}
              source={{uri: user?.image}}
            />
          )}
        </View>
        <Text
          style={{
            color: themeStyle.primaryText,
          }}>
          {capitalizeFirstLetter(user?.username)}
        </Text>
      </View>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={20} color={themeStyle?.primaryText} />
      </TouchableOpacity>
    </View>
  );
};
const TopRatedSpots = ({themeStyle}) => {
  const reduxPopularSpots = useSelector(state => state?.app?.popularSpots);
  const appTheme = useSelector(state => state?.app?.theme);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {width} = useWindowDimensions();
  const isFocused = useIsFocused();
  const [topRatedSpots, setTopRatedSpots] = useState(reduxPopularSpots);

  const [fetchPopularSpots] = useLazyQuery(GET_POPULAR_SPOTS, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });
  const handleFetchPopularSpots = async () => {
    await fetchPopularSpots({
      onCompleted: response => {
        setTopRatedSpots(response.getPopularSpots);
      },
      onError: error => {},
    });
  };
  useEffect(() => {
    if (isFocused) {
      setTopRatedSpots(reduxPopularSpots);
      handleFetchPopularSpots();
    }
  }, [isFocused]);

  const tempData = generateLoadingData(5);

  const [spotWidth, spotHeight, spotBorderRadius] = [
    width / 1.35,
    width + 10,
    30,
  ];

  const TopRatedSpotsList = () => {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {topRatedSpots?.length > 0
          ? topRatedSpots?.map((spot, index) => (
              <View key={index}>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setUserSelectedSpot(topRatedSpots[index]));
                    navigation.navigate(navigationNames.Spot);
                  }}
                  key={index}
                  style={{
                    marginTop: 10,
                    marginLeft: 10,
                    marginRight: topRatedSpots?.length - 1 == index ? 20 : 0,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      borderColor: 'transparent',
                      borderWidth: 3,
                    }}>
                    <Image
                      key={index}
                      resizeMode="cover"
                      style={{
                        width: spotWidth,
                        height: spotHeight,
                        borderRadius: spotBorderRadius,
                        alignSelf: 'center',
                      }}
                      source={{uri: spot.image}}
                    />

                    <LinearGradient
                      style={{
                        position: 'absolute',
                        height: spotHeight,
                        width: spotWidth,
                        borderRadius: spotBorderRadius,
                      }}
                      colors={['transparent', 'rgba(0,0,0, 0.2)']}>
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          backgroundColor: 'rgba(0,0,0, 0.2)',
                          width: spotWidth,
                          height: spotHeight / 3.5,
                          paddingHorizontal: 10,
                          paddingVertical: 10,
                        }}>
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            alignSelf: 'flex-start',
                          }}>
                          <Text
                            style={{
                              color: theme.colors.light,
                              fontWeight: 'bold',
                              marginBottom: 10,
                              alignSelf: 'flex-start',
                            }}>
                            {spot.title}
                          </Text>
                        </View>

                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              color: theme.colors.light,
                              alignSelf: 'flex-start',
                            }}>
                            {spot.location.name.slice(0, 100)}
                            {spot.location.name.length > 100 && '...'}
                          </Text>
                        </View>
                        <Ratings />
                      </View>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          : tempData.map((_, index) => (
              <SkeletonPlaceholder
                speed={2000}
                key={index}
                borderRadius={4}
                backgroundColor={
                  appTheme == 'light' ? theme.colors.card : 'transparent'
                }>
                <View
                  key={index}
                  style={{
                    height: spotHeight,
                    width: spotWidth,
                    borderRadius: spotBorderRadius,
                    borderWidth: 1,
                    borderColor: themeStyle.primaryText,
                    marginLeft: 10,
                  }}>
                  <View style={{position: 'absolute', bottom: 10, left: 5}}>
                    <View
                      style={{
                        width: 40,
                        height: 15,
                        borderWidth: 1,
                        borderColor: themeStyle.card,
                      }}
                    />
                    <View
                      style={{
                        width: 90,
                        height: 15,
                        marginTop: 5,
                        borderWidth: 1,
                        borderColor: themeStyle.card,
                      }}
                    />
                  </View>
                </View>
              </SkeletonPlaceholder>
            ))}
      </ScrollView>
    );
  };
  return (
    <View>
      <Divider
        style={{
          width,
          height: 10,
          marginTop: 10,
          marginBottom: 10,
          backgroundColor: themeStyle.card,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}>
        <Text
          style={{
            color: themeStyle.primaryText,
            fontWeight: 'bold',
          }}>
          Top rated
        </Text>
        <Text
          onPress={() => navigation.navigate(navigationNames.Spots)}
          style={{
            color: themeStyle.primaryText,
            fontWeight: 'bold',
          }}>
          More
        </Text>
      </View>
      <TopRatedSpotsList />
      <Divider
        style={{
          width,
          height: 20,
          marginTop: 20,
          backgroundColor: themeStyle.card,
        }}
      />
    </View>
  );
};
const SpotsNearYou = ({themeStyle, spotsNearYou}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const appTheme = useSelector(state => state?.app?.theme);

  const {width} = useWindowDimensions();
  const handleViewLayout = (event, index) => {
    viewRefs.current[index] = event.nativeEvent.layout.y;
  };
  const tempData = generateLoadingData(5);

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 10,
          paddingHorizontal: 20,
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            color: themeStyle?.primaryText,
            fontWeight: 'bold',
          }}>
          Spots near you
        </Text>
      </View>
      <Divider
        style={{
          width,
          height: 1,
          marginBottom: 10,
          backgroundColor: themeStyle.card,
        }}
      />
      <View>
        {spotsNearYou?.length > 0
          ? spotsNearYou?.map((spot, index) => {
              return (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(setUserSelectedSpot(spot));
                      navigation.navigate(navigationNames.Spot);
                    }}>
                    <SpotListCard
                      isEligibleForEdit={false}
                      loading={false}
                      themeStyle={themeStyle}
                      key={index}
                      spot={spot}
                      index={index}
                    />
                  </TouchableOpacity>
                </View>
              );
            })
          : tempData?.map((_, index) => {
              return (
                <SkeletonPlaceholder
                  speed={2000}
                  borderRadius={4}
                  key={index}
                  backgroundColor={
                    appTheme == 'light' ? theme.colors.card : 'transparent'
                  }>
                  <View
                    style={{
                      height: 90,
                      width: width - 20,
                      marginBottom: 10,
                      alignSelf: 'center',
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: themeStyle.primaryText,
                      marginLeft: 10,
                      paddingTop: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 10,
                    }}>
                    <View
                      style={{
                        width: 70,
                        height: 70,
                        borderWidth: 1,
                        borderColor: themeStyle.card,
                      }}
                    />
                    <View
                      style={{
                        width: 50,
                        height: 15,
                        marginTop: 5,
                        borderWidth: 1,
                        borderColor: themeStyle.card,
                      }}
                    />
                  </View>
                </SkeletonPlaceholder>
              );
            })}
      </View>
    </View>
  );
};

const Home = () => {
  const themeStyle = useSelector(state => state?.app?.themeStyle);
  const reduxSpots = useSelector(state => state?.app?.spots);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const scrollViewRef = useRef();
  const offset = useRef(0);
  const direction = useRef('up');

  const [spotsNearYou, setSpotsNearYou] = useState(reduxSpots);

  const [fetchSpots] = useLazyQuery(GET_SPOTS, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const FetchSpotsNearYou = () => {
    fetchSpots({
      onCompleted: response => {
        const spotsFromDb = response?.getSpots;
        spotsFromDb && setSpotsNearYou(spotsFromDb);
        spotsFromDb && dispatch(addAppSpots(spotsFromDb));
      },
      onError: error => {},
    });
  };

  useEffect(() => {
    isFocused && FetchSpotsNearYou();
  }, [isFocused]);

  const handleScroll = event => {
    handleScrollEventFunc({
      event,
      direction,
      offset,
      dispatch,
      setScrollDirection,
    });
  };

  return (
    <View
      style={{flex: 1, backgroundColor: themeStyle?.bgColor, paddingTop: 45}}>
      <ScrollView
        onScroll={handleScroll}
        ref={scrollViewRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        <Header themeStyle={themeStyle} />
        <TopRatedSpots themeStyle={themeStyle} />
        <SpotsNearYou spotsNearYou={spotsNearYou} themeStyle={themeStyle} />
      </ScrollView>
    </View>
  );
};

export default Home;
