import {useNavigation} from '@react-navigation/native';
import {View, Text, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../../theme';
import navigationNames from '../../navigationNames';
import {setSplashHasShown} from '../../store/app';

export const SplashNavigationHeader = ({position}) => {
  const user = useSelector(state => state?.user?.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleNavigate = () => {
    dispatch(setSplashHasShown());

    navigation.navigate(
      user?.token ? navigationNames?.BottomNavigation : navigationNames.Login,
    );
  };
  return (
    <View
      style={{
        marginHorizontal: 25,
        marginTop: position == 'one' ? 15 : 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        {position != 'one' && (
          <Ionicons name="chevron-back" size={20} color={theme.colors.dark} />
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNavigate}>
        <Text
          style={{
            fontWeight: 'bold',
          }}>
          Skip
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default function AuthBackArrowHeader() {
  const navigation = useNavigation();
  const themeStyle = useSelector(state => state?.app?.themeStyle);

  return (
    <View style={{justifyContent: 'center'}}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons
          name="chevron-back"
          size={20}
          color={themeStyle.primaryText}
        />
      </TouchableOpacity>
    </View>
  );
}
