import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity, useWindowDimensions} from 'react-native';
import theme from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function SpotNavigationHeader({spot, themeStyle}) {
  const {width} = useWindowDimensions();
  const navigation = useNavigation();
  return (
    <View
      style={{
        width,
        paddingHorizontal: 20,
        marginTop: 45,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 1,
      }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          backgroundColor: themeStyle.bgColor,
          borderRadius: 50,
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons
          name="chevron-back"
          size={15}
          color={themeStyle.primaryText}
        />
      </TouchableOpacity>
      <View
        style={{
          backgroundColor: theme.colors.darkblue_dark,
          alignItems: 'center',
          justifyContent: 'center',
          height: 40,
          paddingHorizontal: 10,
          width: width - 150,
          borderRadius: 50,
        }}>
        <Text
          style={{
            color: theme.colors.light,
          }}>
          {spot?.location?.name?.slice(0, 20)}
          {spot?.location?.name?.length > 20 ? '...' : ''}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: themeStyle.bgColor,
          borderRadius: 50,
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MaterialCommunityIcons
          name="heart"
          size={15}
          color={theme.colors.grey}
        />
      </TouchableOpacity>
    </View>
  );
}
