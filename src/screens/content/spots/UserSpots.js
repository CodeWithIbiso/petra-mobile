import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import theme from '../../../theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import navigationNames from '../../../navigationNames';
import {setUserSelectedSpot, setUserSpots} from '../../../store/user';
import {useLazyQuery, useMutation} from '@apollo/client';
import {
  AuthModalFailed,
  AuthModalSuccess,
} from '../../../components/elements/utility';
import {SpotListCard} from '../../../components/elements/SpotComponents';
import {DELETE_SPOTS, GET_USER_SPOTS} from '../../../graphql/queries';

const HeaderSearchComponent = ({
  searchList,
  mutateSearchList,
  themeStyle,
  leftComponent,
  rightComponent,
}) => {
  const handleSearch = text => {
    const newData = searchList.filter(item =>
      item?.title?.toLowerCase()?.includes(text?.trim()?.toLowerCase()),
    );
    mutateSearchList(newData);
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
      }}>
      {leftComponent}
      <View
        style={{
          display: 'flex',
          height: 40,
          marginVertical: 0,
          marginHorizontal: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          borderRadius: 20,
          alignItems: 'center',
          paddingHorizontal: 10,
          flex: 1,
          backgroundColor: themeStyle.card,
        }}>
        <AntDesign
          style={{paddingRight: 5}}
          name="search1"
          size={15}
          color={themeStyle?.primaryText}
        />
        <TextInput
          style={{
            flex: 1,
            color: themeStyle?.primaryText,
          }}
          onChangeText={handleSearch}
          placeholder="Search..."
          placeholderTextColor={themeStyle?.primaryText}
          underlineColorAndroid="transparent"
        />
      </View>
      {rightComponent}
    </View>
  );
};

export default UserSpots = props => {
  const {width} = useWindowDimensions();
  const navigation = useNavigation();
  const user = useSelector(state => state?.user);
  const themeStyle = useSelector(state => state?.app?.themeStyle);
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const [modalShown, setModalShown] = useState(false);
  const userSpots = useSelector(state => state.user.userSpots);
  const [deleteIsEnabled, setDeleteIsEnabled] = useState(false);
  const [selectedSpots, setSelectedSpots] = useState({});
  const isFocused = useIsFocused();

  const [spots, setSpots] = useState(props?.route?.params?.spots || userSpots);

  const [getUserSpots] = useLazyQuery(GET_USER_SPOTS, {
    fetchPolicy: 'network-only',
  });
  const [deleteSpots] = useMutation(DELETE_SPOTS, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const fetchSpots = async () => {
    await getUserSpots({
      variables: {creator: user?.user?.id},
      onCompleted: res => {
        res = res?.getUserSpots;
        dispatch(setUserSpots(res));
        setSpots(res);
      },
      onError: err => {},
    });
  };
  const handleRemoveSelectedSpots = async () => {
    const selectedIds = Object.keys(selectedSpots).map(id => {
      if (selectedSpots[id]) return id;
    });
    await deleteSpots({
      variables: {
        input: {
          userId: user?.user?.id,
          spotIds: selectedIds,
        },
      },
      onCompleted: res => {
        res = res?.deleteSpots;
        if (res?.code == 200) {
          fetchSpots();
          setSuccess(true);
          setModalShown(true);
          handleRemoveSpotSelect();
        } else {
          setSuccess(false);
          setModalShown(false);
        }
      },
      onError: err => {},
    });
  };
  useEffect(() => {
    fetchSpots();
    !isFocused && deleteIsEnabled && handleRemoveSpotSelect();
  }, [isFocused]);

  const handleSpotClicked = spot => {
    const {id} = spot;
    if (deleteIsEnabled) {
      let selectedSpot = selectedSpots[id];
      if (!selectedSpot) {
        setSelectedSpots(s => ({...s, [id]: true}));
      } else {
        const newState = {...selectedSpots};
        delete newState[id];
        setSelectedSpots(newState);
      }
    } else {
      dispatch(setUserSelectedSpot(spot));
      navigation.navigate(navigationNames.Spot);
    }
  };

  const handleRemoveSpotSelect = () => {
    if (deleteIsEnabled) setSelectedSpots({});
    setDeleteIsEnabled(!deleteIsEnabled);
  };

  const handleEditSpot = spot => {
    navigation.navigate(navigationNames.SpotCreation, {spot});
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 45,
        backgroundColor: themeStyle.bgColor,
      }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderSearchComponent
          searchList={userSpots}
          mutateSearchList={setSpots}
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="chevron-back"
                size={20}
                color={themeStyle.primaryText}
              />
            </TouchableOpacity>
          }
          themeStyle={themeStyle}
        />
        {spots?.map((spot, index) => (
          <TouchableOpacity onPress={() => handleSpotClicked(spot)} key={index}>
            <SpotListCard
              deleteIsEnabled={deleteIsEnabled}
              isEligibleForEdit={true}
              handleEditSpot={handleEditSpot}
              spot={spot}
              index={index}
              themeStyle={themeStyle}
              isMarkedForDeletion={selectedSpots[spot.id]}
            />
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => navigation.navigate(navigationNames.SpotCreation)}
          style={{
            backgroundColor: themeStyle.card,
            width: width - 100,
            borderRadius: 50,
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 30,
            justifyContent: 'center',
            height: 60,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: themeStyle.primaryText,
              textAlign: 'center',
              marginRight: 5,
            }}>
            Create a spot
          </Text>
          <Entypo name="plus" size={20} color={themeStyle.primaryText} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRemoveSpotSelect}
          style={{
            backgroundColor: theme.colors.darkblue_dark,
            width: width - 100,
            borderRadius: 50,
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            height: 60,
            marginTop: 20,
            flexDirection: 'row',
          }}>
          <Ionicons
            name={'trash-outline'}
            size={15}
            color={theme.colors.light}
          />
          <Text
            style={{
              color: theme.colors.light,
              textAlign: 'center',
              marginLeft: 5,
            }}>
            {deleteIsEnabled ? 'Cancel Deletion' : 'Remove a spot'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRemoveSelectedSpots}
          style={{
            backgroundColor: theme.colors.lightRed,
            display: Object.keys(selectedSpots).length > 0 ? 'flex' : 'none',
            width: width - 100,
            borderRadius: 50,
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 100,
            justifyContent: 'center',
            height: 60,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: theme.colors.red,
              textAlign: 'center',
              marginLeft: 5,
            }}>
            Remove spots
          </Text>
        </TouchableOpacity>
        {success ? (
          <AuthModalSuccess
            modalShown={modalShown}
            setModalShown={setModalShown}
          />
        ) : (
          <AuthModalFailed
            modalShown={modalShown}
            setModalShown={setModalShown}
          />
        )}
      </ScrollView>
    </View>
  );
};
