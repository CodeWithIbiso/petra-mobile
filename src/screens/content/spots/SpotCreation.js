import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import parsePhoneNumber from 'libphonenumber-js';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PhoneInput from 'react-native-phone-number-input';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useMutation} from '@apollo/client';
import ImagePicker from 'react-native-image-crop-picker';
import {SelectList} from 'react-native-dropdown-select-list';
import currencyData from './currencyData';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import theme from '../../../theme';
import {GOOGLE_MAPS_API_KEY} from '@env';
import {
  AuthModalFailed,
  AuthModalSuccess,
  LinearGradientButton,
} from '../../../components/elements/utility';
import {MySpotCreationComponent} from '../../../components/elements/SpotComponents';
import {CREATE_UPDATE_SPOT} from '../../../graphql/queries';

const SpotCreationComponent = ({newSpot, setNewSpot, spotId}) => {
  const [selectCurrencyDropDownStatus, setSelectCurrencyDropDownStatus] =
    useState(false);
  const [createOrUpdateSpotFunction] = useMutation(CREATE_UPDATE_SPOT);
  const {width} = useWindowDimensions();
  const [contactNumber, setContactNumber] = useState(newSpot?.contactNumber);
  const [success, setSuccess] = useState(false);
  const [modalShown, setModalShown] = useState(false);

  const navigation = useNavigation();
  const [fieldErrors, setFieldErrors] = useState({
    title: false,
    description: false,
    category: false,
    contactNumber: false,
    location: false,
    image: false,
    video: false,
  });
  const themeStyle = useSelector(state => state?.app?.themeStyle);
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  const [isEditingPopularCategories, setIsEditingPopularCategories] =
    useState(false);
  const initialNewCategory = {
    name: '',
    image: '',
    isEditing: {
      status: false,
      index: 0,
    },
  };
  const initialNewPopularCategory = {
    name: '',
    image: '',
    currency: '',
    price: '',
    isEditing: {
      status: false,
      index: 0,
    },
  };
  const [newCategory, setNewCategory] = useState(initialNewCategory);
  const [saving, setSaving] = useState(false);
  const dimensions = useWindowDimensions();
  const [newPopularCategory, setNewPopularCategory] = useState(
    initialNewPopularCategory,
  );
  let navigateTimeOut;
  const isFocused = useIsFocused();

  const phoneInputRef = useRef(null);
  useEffect(() => {
    try {
      clearTimeout(navigateTimeOut);
    } catch (error) {}
  }, [isFocused]);

  useLayoutEffect(() => {
    try {
      const phoneNumber = newSpot?.contactNumber;
      // Parse the phone number
      const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
      // Extract the country code, country, and number
      const countryCode = `+${parsedPhoneNumber.countryCallingCode}`;
      const country = parsedPhoneNumber.country;
      const number = parsedPhoneNumber.nationalNumber;
      setContactNumber(number);
      phoneInputRef.current.state.number = number;
      phoneInputRef.current.state.code = country
        ? countryCode?.replaceAll('+', '')
        : '1';
      phoneInputRef.current.state.countryCode =
        !country || 'BS' ? 'US' : country;
    } catch (error) {}
  }, [newSpot?.contactNumber]);

  const openGalleryPhoto = async name => {
    try {
      await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then(async image => {
        image = {
          uri: image?.path,
          filename: image?.filename,
          mime: image?.mime,
        };
        if (name == 'category') {
          setNewCategory(newCategory => ({...newCategory, image: image}));
        } else if (name == 'popularCategory') {
          setNewPopularCategory(newPopularCat => ({
            ...newPopularCat,
            image: image,
          }));
        } else {
          setNewSpot(newSpot => ({...newSpot, image: image}));
        }
      });
    } catch (error) {}
  };
  const openGalleryVideo = async () => {
    try {
      await ImagePicker.openPicker({
        mediaType: 'video',
        minDuration: 10, // minimum duration of 10 seconds
        maxDuration: 60, // maximum duration of 60 seconds
        compressVideo: {
          quality: 'medium', //low medium high veryHigh
          bitrateMultiplier: 3,
          saveToCameraRoll: false,
          removeAudio: false,
        },
      }).then(video => {
        video = {
          uri: video?.path,
          filename: video?.filename,
          mime: video?.mime,
        };
        setNewSpot({...newSpot, video});
      });
    } catch (error) {}
  };
  const Category = useMemo(
    () =>
      ({
        category,
        index,
        isEditingCategories,
        deleteCategory,
        editCategory,
      }) => {
        return (
          <View
            style={{
              marginLeft: index == 0 ? 50 : 0,
              marginRight: index == newSpot?.categories?.length - 1 ? 100 : 5,
            }}>
            <View
              style={{
                display: isEditingCategories ? 'flex' : 'none',
                width: 100,
                position: 'absolute',
                top: -10,
                flexDirection: 'row',
                zIndex: 500,
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <TouchableOpacity
                onPress={() => deleteCategory(index)}
                style={{
                  backgroundColor: themeStyle.bgColor,
                  padding: 5,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: theme.colors.darkblue,
                }}>
                <MaterialCommunityIcons
                  name="trash-can"
                  size={20}
                  color={theme.colors.darkblue}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => editCategory(index)}
                style={{
                  backgroundColor: themeStyle.bgColor,
                  padding: 5,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: theme.colors.darkblue,
                }}>
                <MaterialCommunityIcons
                  name="pencil"
                  size={20}
                  color={theme.colors.darkblue}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: 140,
                width: 100,
                backgroundColor: theme.colors.darkblue,
                borderRadius: 35,
                alignItems: 'center',
              }}>
              <View style={{marginTop: 20}}>
                <Image
                  source={{uri: category?.image?.uri || category?.image}}
                  style={{
                    borderWidth: 3,
                    borderColor: theme.colors.light,
                    width: 80,
                    height: 80,
                    borderRadius: 50,
                    marginBottom: 5,
                  }}
                  resizeMode={'cover'}
                />
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  color: theme.colors.light,
                }}>
                {category?.name}
              </Text>
            </View>
          </View>
        );
      },
    [newSpot?.categories],
  );

  const PopularCategory = useMemo(
    () =>
      ({
        popularCategory,
        index,
        isEditingPopularCategories,
        deletePopularCategory,
        editPopularCategory,
      }) => {
        return (
          <View
            style={{
              marginLeft: index == 0 ? 50 : 0,
              marginRight:
                index == newSpot?.popularCategories?.length - 1 ? 100 : 5,
            }}>
            <View
              style={{
                display: isEditingPopularCategories ? 'flex' : 'none',
                width: 200,
                position: 'absolute',
                top: 5,
                flexDirection: 'row',
                zIndex: 500,
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <TouchableOpacity
                onPress={() => deletePopularCategory(index)}
                style={{
                  backgroundColor: themeStyle.bgColor,
                  padding: 5,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: theme.colors.darkblue,
                }}>
                <MaterialCommunityIcons
                  name="trash-can"
                  size={20}
                  color={theme.colors.darkblue}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => editPopularCategory(index)}
                style={{
                  backgroundColor: themeStyle.bgColor,
                  padding: 5,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: theme.colors.darkblue,
                }}>
                <MaterialCommunityIcons
                  name="pencil"
                  size={20}
                  color={theme.colors.darkblue}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: 280,
                width: 200,
                backgroundColor: theme.colors.darkblue,
                borderRadius: 60,
                alignItems: 'center',
              }}>
              <View style={{marginTop: 20}}>
                <Image
                  source={{
                    uri: popularCategory?.image?.uri || popularCategory?.image,
                  }}
                  style={{
                    borderWidth: 5,
                    borderColor: theme.colors.light,
                    width: 160,
                    height: 160,
                    borderRadius: 100,
                  }}
                  resizeMode={'cover'}
                />
              </View>
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: theme.colors.light,
                }}>
                {popularCategory?.name}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: theme.colors.light,
                  }}>
                  {popularCategory?.currency}
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 24,
                    color: theme.colors.light,
                  }}>
                  {popularCategory?.price}
                </Text>
              </View>
            </View>
          </View>
        );
      },
    [newSpot?.popularCategories],
  );

  {
    /* POPULAR CATEGORIES */
  }
  const addNewCategory = () => {
    if (newCategory?.isEditing?.status) {
      setNewSpot(newSpot => {
        let newCategoryObj = newCategory;
        delete newCategoryObj?.isEditing;
        let categories = [...newSpot?.categories];
        categories[newCategory?.isEditing?.index] = newCategoryObj;
        return {...newSpot, categories};
      });
    } else {
      setNewSpot(newSpot => {
        let newCategoryObj = newCategory;
        delete newCategoryObj?.isEditing;
        const categories = [...newSpot?.categories, newCategoryObj];
        return {...newSpot, categories};
      });
    }
    setNewCategory(initialNewCategory);
  };
  const deleteCategory = index => {
    setNewSpot(newSpot => {
      const categories = newSpot?.categories?.filter((_, i) => i != index);
      return {...newSpot, categories};
    });
    setNewCategory(initialNewCategory);
  };
  const editCategory = index => {
    const category = newSpot?.categories[index];
    setNewCategory({...category, isEditing: {status: true, index: index}});
  };
  {
    /* POPULAR CATEGORIES */
  }

  const addNewPopularCategory = () => {
    if (newPopularCategory?.isEditing?.status) {
      setNewSpot(newSpot => {
        let newPopularCategoryObj = newPopularCategory;
        delete newPopularCategoryObj?.isEditing;
        let popularCategories = [...newSpot?.popularCategories];
        popularCategories[newPopularCategory?.isEditing?.index] =
          newPopularCategoryObj;
        return {...newSpot, popularCategories};
      });
    } else {
      setNewSpot(newSpot => {
        let newPopularCategoryObj = newPopularCategory;
        delete newPopularCategoryObj?.isEditing;
        const popularCategories = [
          ...newSpot?.popularCategories,
          newPopularCategoryObj,
        ];
        return {...newSpot, popularCategories};
      });
    }
    setNewPopularCategory(initialNewPopularCategory);
  };
  const deletePopularCategory = index => {
    setNewSpot(newSpot => {
      const popularCategories = newSpot?.popularCategories?.filter(
        (_, i) => i != index,
      );
      return {...newSpot, popularCategories};
    });
    setNewPopularCategory(initialNewPopularCategory);
  };
  const editPopularCategory = index => {
    const popularCategory = newSpot?.popularCategories[index];
    setNewPopularCategory({
      ...popularCategory,
      isEditing: {status: true, index: index},
    });
  };

  const handleInputObject = obj => {
    if (
      obj.image &&
      typeof obj.image != 'object' &&
      obj.image.includes('http')
    ) {
      obj.image = {
        filename: '',
        mime: '',
        uri: obj.image,
      };
    }
    if (
      obj.video &&
      typeof obj.video != 'object' &&
      obj.video.includes('http')
    ) {
      obj.video = {
        filename: '',
        mime: '',
        uri: obj.video,
      };
    }
    if (obj.categories.length) {
      obj.categories = obj.categories.map(c => {
        let catObj = {...c};
        if (
          catObj?.image &&
          typeof catObj.image != 'object' &&
          catObj?.image.includes('http')
        ) {
          catObj.image = {
            filename: '',
            mime: '',
            uri: catObj.image,
          };
        }
        return catObj;
      });
    }
    if (obj.popularCategories.length) {
      obj.popularCategories = obj.popularCategories.map(popCat => {
        let popCatObj = {...popCat};
        if (
          popCatObj?.image &&
          typeof popCat.image != 'object' &&
          popCatObj?.image?.includes('http')
        ) {
          popCatObj.image = {
            filename: '',
            mime: '',
            uri: popCatObj.image,
          };
        }
        return popCatObj;
      });
    }
    return obj;
  };

  const handleSaveSpot = async () => {
    const fieldErrorKeys = Object.keys(fieldErrors);

    let errorValues = {...fieldErrors};
    fieldErrorKeys.map(key => {
      if (newSpot[key]) {
        if (key == 'location') {
          if (newSpot[key]?.name) {
            errorValues[key] = false;
          } else {
            errorValues[key] = true;
          }
        } else {
          if (key == 'image' || key == 'video') {
            let isMediaValid = '';
            if (typeof newSpot[key] == 'object' && 'uri' in newSpot[key]) {
              isMediaValid = newSpot[key]?.uri;
            } else {
              isMediaValid = newSpot[key];
            }
            if (newSpot[key]?.uri || isMediaValid) {
              errorValues[key] = false;
            } else {
              errorValues[key] = true;
            }
          } else {
            errorValues[key] = false;
          }
        }
      } else {
        errorValues[key] = true;
      }
    });
    setFieldErrors(errorValues);
    const fieldErrorValues = Object.values(errorValues).some(e => e == true);

    if (fieldErrorValues) return;
    setSaving(true);
    let obj = {...newSpot};
    try {
      obj = handleInputObject(obj);
      await createOrUpdateSpotFunction({
        variables: {
          input: {...obj},
        },
        onCompleted: response => {
          if (response?.createOrUpdateSpot?.code == 200) {
            setSuccess(true);
            setModalShown(true);
            navigateTimeOut = setTimeout(() => {
              navigation.goBack();
            }, 2000);
          } else {
            setSuccess(false);
            setModalShown(true);
          }
        },
        onError: error => {
          console.log({error});
        },
      });
      setSaving(false);
    } catch (error) {
      setSaving(false);
    }
  };

  const data = [
    {key: 'Shopping', value: 'Shopping'},
    {key: 'Tech', value: 'Tech'},
    {key: 'Religion', value: 'Religion'},
    {key: 'Finance', value: 'Finance'},
    {key: 'Services', value: 'Services'},
    {key: 'Sports', value: 'Sports'},
  ];

  const CustomInput = ({Input, mandatory, customIconStyle}) => {
    return (
      <View>
        {mandatory ? (
          <AntDesign
            name="exclamationcircleo"
            size={20}
            style={{
              position: 'absolute',
              right: 10,
              top: 10,
              ...customIconStyle,
            }}
          />
        ) : null}
        {Input}
      </View>
    );
  };
  const textInputStyle = {
    flex: 1,
    borderRadius: 15,
    paddingHorizontal: 20,
    borderColor: themeStyle.card,
    borderWidth: 1,
    height: 45,
    marginBottom: 10,
    color: themeStyle?.primaryText,
  };
  return (
    <SafeAreaView style={{backgroundColor: themeStyle.bgColor}}>
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: themeStyle.bgColor}}>
        {/* HEADER */}
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{position: 'absolute', left: 10}}>
            <Ionicons
              name="chevron-back"
              size={20}
              color={themeStyle.primaryText}
            />
          </TouchableOpacity>
          <Text
            style={{
              textAlign: 'center',
              alignSelf: 'center',
              fontSize: 18,
              fontWeight: 'bold',
              color: themeStyle.primaryText,
            }}>
            {spotId ? 'Edit Spot' : 'Create a Spot'}
          </Text>
        </View>
        <MySpotCreationComponent
          fieldErrors={fieldErrors}
          spot={newSpot}
          themeStyle={themeStyle}
          openGalleryVideo={openGalleryVideo}
          openGalleryPhoto={openGalleryPhoto}
        />
        <View
          style={{
            flex: 1,
            padding: 20,
          }}>
          {/* TITLES */}
          <View>
            <View style={{flex: 1, marginLeft: 0}}>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: 40,
                    backgroundColor: theme.colors.blue,
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    color: themeStyle.primaryText,
                    fontWeight: 'bold',
                  }}>
                  Overview
                </Text>
              </View>

              {CustomInput({
                Input: (
                  <TextInput
                    onChangeText={text => setNewSpot({...newSpot, title: text})}
                    style={textInputStyle}
                    value={newSpot?.title}
                    placeholder="Whats the spot name?"
                    placeholderTextColor={themeStyle?.grey}
                    underlineColorAndroid="transparent"
                  />
                ),
                mandatory: true,
                customIconStyle: {
                  color: fieldErrors.title
                    ? theme.colors.error
                    : themeStyle.card,
                },
              })}
              {CustomInput({
                Input: (
                  <TextInput
                    onChangeText={text =>
                      setNewSpot({...newSpot, description: text})
                    }
                    style={textInputStyle}
                    value={newSpot?.description}
                    placeholder="Describe the spot"
                    placeholderTextColor={themeStyle?.grey}
                    underlineColorAndroid="transparent"
                    multiline={false}
                  />
                ),
                mandatory: true,
                customIconStyle: {
                  color: fieldErrors.description
                    ? theme.colors.error
                    : themeStyle.card,
                },
              })}
              {CustomInput({
                Input: (
                  <SelectList
                    arrowicon={<></>}
                    closeicon={<></>}
                    setSelected={val => {
                      setNewSpot({...newSpot, category: val});
                    }}
                    data={data}
                    defaultOption={{
                      key: newSpot?.category || data[0]?.key,
                      value: newSpot?.category || data[0]?.value,
                    }}
                    searchicon={
                      <FontAwesome5
                        name="search"
                        size={10}
                        color={'#212121'}
                        style={{marginRight: 10}}
                      />
                    }
                    save="value"
                    boxStyles={{
                      ...textInputStyle,
                    }}
                    inputStyles={{
                      color: themeStyle.primaryText,
                    }}
                    dropdownTextStyles={{
                      color: themeStyle.primaryText,
                    }}
                  />
                ),
                mandatory: true,
                customIconStyle: {
                  color: fieldErrors.category
                    ? theme.colors.error
                    : themeStyle.card,
                },
              })}

              {CustomInput({
                Input: (
                  <PhoneInput
                    ref={phoneInputRef}
                    containerStyle={{
                      backgroundColor: 'transparent',
                      borderWidth: 1,
                      borderColor: themeStyle.card,
                      flex: 1,
                      width: dimensions.width - 40,
                      marginTop: 10,
                      color: themeStyle.primaryText,
                      borderRadius: 15,
                    }}
                    textInputProps={{
                      color: themeStyle.primaryText,
                    }}
                    codeTextStyle={{
                      color: themeStyle.primaryText,
                    }}
                    textContainerStyle={{
                      backgroundColor: 'transparent',
                      placeholderTextColor: themeStyle.primaryText,
                      borderColor: themeStyle.card,
                      borderLeftColor: theme.colors.grey,
                      borderLeftWidth: 1,
                      marginRight: 15,
                      color: themeStyle.primaryText,
                      flex: 1,
                    }}
                    defaultValue={contactNumber}
                    layout="first"
                    onChangeFormattedText={text => {
                      const phoneDigitsOnly = text.replace(/\D/g, ''); // Remove non-digits from the phone number
                      const maxDigits = 15;
                      // Enforce the maximum digit limit
                      if (phoneDigitsOnly.length <= maxDigits) {
                        setNewSpot({...newSpot, contactNumber: text});
                      }
                    }}
                    withDarkTheme={true}
                    withShadow
                  />
                ),
                mandatory: true,
                customIconStyle: {
                  color: fieldErrors.contactNumber
                    ? theme.colors.error
                    : themeStyle.card,
                  top: 25,
                },
              })}

              {CustomInput({
                Input: (
                  <GooglePlacesAutocomplete
                    placeholder={newSpot?.location?.name || 'Enter Address'}
                    debounce={1000}
                    onPress={(data, details = null) => {
                      const {lat: latitude, lng: longitude} =
                        details.geometry.location;
                      setNewSpot({
                        ...newSpot,
                        location: {
                          name: data.description,
                          latitude,
                          longitude,
                        },
                      });
                    }}
                    query={{
                      key: GOOGLE_MAPS_API_KEY,
                      language: 'en',
                      // components: 'country:us',
                      radius: 1000,
                    }}
                    textInputProps={{
                      placeholderTextColor: themeStyle.primaryText,
                      style: {
                        height: 45,
                        borderColor: themeStyle.card,
                        borderWidth: 1,
                        paddingRight: 30,
                        marginBottom: 10,
                        paddingHorizontal: 10,
                        borderRadius: 15,
                        flex: 1,
                        color: themeStyle.primaryText,
                      },
                    }}
                    styles={{
                      textInputContainer: {},
                      predefinedPlacesDescription: {
                        color: '#fff',
                      },
                      poweredContainer: {},
                      powered: {
                        color: themeStyle.primaryText,
                      },
                      listView: {
                        color: themeStyle.primaryText,
                      },
                      row: {
                        backgroundColor: themeStyle.bgColor,
                      },
                      container: {
                        marginTop: 10,
                        flex: 1,
                        zIndex: 1,
                        backgroundColor: themeStyle.bgColor,
                      },
                      listView: {
                        backgroundColor: themeStyle.bgColor,
                      },
                      description: {
                        color: themeStyle.primaryText,
                      },
                    }}
                    listViewDisplayed="auto"
                    fetchDetails
                    listUnderlayColor={themeStyle.primaryText}
                  />
                ),
                mandatory: true,
                customIconStyle: {
                  color: fieldErrors.location
                    ? theme.colors.error
                    : themeStyle.card,
                  top: 20,
                  zIndex: 2000000,
                },
              })}
              <TextInput
                onChangeText={text => setNewSpot({...newSpot, about: text})}
                style={{
                  ...textInputStyle,
                  height: 120,
                }}
                value={newSpot?.about}
                placeholder="Whats the spot about..."
                placeholderTextColor={themeStyle?.grey}
                underlineColorAndroid="transparent"
                multiline={true}
              />
            </View>
          </View>
          {/* CATEGORIES */}
          <View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
              }}>
              <View
                style={{
                  height: 10,
                  width: 10,
                  borderRadius: 40,
                  marginTop: 4,
                  backgroundColor: theme.colors.teal,
                  marginRight: 10,
                }}
              />
              <View style={{flex: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: themeStyle.primaryText,
                      fontWeight: 'bold',
                    }}>
                    Categories
                  </Text>
                  {newCategory?.name && newCategory?.image?.uri ? (
                    <AntDesign
                      style={{marginRight: 5}}
                      name="pluscircle"
                      size={23}
                      onPress={addNewCategory}
                      color={theme.colors.green}
                    />
                  ) : (
                    <AntDesign
                      style={{marginRight: 5}}
                      name="pluscircle"
                      size={23}
                      color={themeStyle.primaryText}
                    />
                  )}
                </View>
              </View>
            </View>
            <View>
              <TextInput
                onChangeText={text =>
                  setNewCategory({...newCategory, name: text})
                }
                style={textInputStyle}
                placeholder="Enter category name"
                placeholderTextColor={themeStyle?.grey}
                underlineColorAndroid="transparent"
                value={newCategory?.name}
              />
              <TouchableWithoutFeedback
                onPress={() => {
                  openGalleryPhoto('category');
                }}>
                <View
                  style={{
                    ...textInputStyle,
                    paddingRight: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: themeStyle?.primaryText,
                    }}>
                    Image : {newCategory?.image?.uri?.substring(0, 10) || ''}
                  </Text>
                  <FontAwesome
                    name="camera"
                    color={themeStyle.primaryText}
                    size={20}
                  />
                </View>
              </TouchableWithoutFeedback>
              <View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{
                    marginTop: 10,
                    paddingTop: 20,
                    width: width + 50,
                    marginLeft: -50,
                  }}>
                  {newSpot?.categories?.map((category, i) => (
                    <Category
                      deleteCategory={deleteCategory}
                      editCategory={editCategory}
                      category={category}
                      key={i}
                      index={i}
                      isEditingCategories={isEditingCategories}
                    />
                  ))}
                </ScrollView>
                {newSpot?.categories?.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setIsEditingCategories(!isEditingCategories);
                      newCategory?.isEditing?.status &&
                        setNewCategory(initialNewCategory);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <MaterialCommunityIcons
                      color={themeStyle.primaryText}
                      name="pencil"
                      size={20}
                    />
                    <Text
                      style={{
                        marginLeft: 5,
                        color: themeStyle.primaryText,
                      }}>
                      {isEditingCategories ? 'Stop editing' : 'Edit categories'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* POPULAR CATEGORIES */}
          <View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
              }}>
              <View
                style={{
                  height: 10,
                  width: 10,

                  borderRadius: 40,
                  marginTop: 4,
                  backgroundColor: theme.colors.blue,
                  marginRight: 10,
                }}
              />
              <View style={{flex: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: themeStyle.primaryText,
                      fontWeight: 'bold',
                    }}>
                    Popular Categories
                  </Text>
                  {newPopularCategory?.name &&
                  newPopularCategory?.image?.uri &&
                  newPopularCategory?.currency &&
                  newPopularCategory?.price ? (
                    <AntDesign
                      style={{marginRight: 5}}
                      name="pluscircle"
                      size={23}
                      onPress={addNewPopularCategory}
                      color={theme.colors.green}
                    />
                  ) : (
                    <AntDesign
                      style={{marginRight: 5}}
                      name="pluscircle"
                      color={themeStyle.primaryText}
                      size={23}
                    />
                  )}
                </View>
              </View>
            </View>
            <View>
              <TextInput
                onChangeText={text =>
                  setNewPopularCategory({...newPopularCategory, name: text})
                }
                style={textInputStyle}
                placeholder="Enter popular category name"
                placeholderTextColor={themeStyle?.grey}
                underlineColorAndroid="transparent"
                value={newPopularCategory?.name}
              />
              <TouchableWithoutFeedback
                onPress={() => {
                  openGalleryPhoto('popularCategory');
                }}>
                <View
                  style={{
                    ...textInputStyle,
                    paddingRight: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: themeStyle?.primaryText,
                    }}>
                    Image :{' '}
                    {newPopularCategory?.image?.uri?.substring(0, 10) || ''}
                  </Text>
                  <FontAwesome
                    name="camera"
                    color={themeStyle.primaryText}
                    size={20}
                  />
                </View>
              </TouchableWithoutFeedback>
              <TouchableOpacity
                onPress={() => {
                  setSelectCurrencyDropDownStatus(
                    !selectCurrencyDropDownStatus,
                  );
                }}
                style={{
                  ...textInputStyle,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: themeStyle?.primaryText,
                  }}>
                  {newPopularCategory?.currency
                    ? newPopularCategory?.currency
                    : 'Currency'}
                </Text>
              </TouchableOpacity>
              <SelectList
                arrowicon={<></>}
                closeicon={<></>}
                setSelected={country => {
                  const c = currencyData?.find(c => c?.country == country);
                  setNewPopularCategory({
                    ...newPopularCategory,
                    currency: c?.currency,
                  });
                }}
                notFoundText="No currency found"
                data={currencyData.map(c => ({...c, value: c.country}))}
                save="value"
                defaultOption={{key: '$', value: 'United States'}}
                dropdownShown={selectCurrencyDropDownStatus}
                searchicon={
                  <FontAwesome5
                    name="search"
                    size={10}
                    color={'#212121'}
                    style={{marginRight: 10}}
                  />
                }
                boxStyles={{
                  ...textInputStyle,
                }}
                inputStyles={{
                  color: themeStyle.primaryText,
                }}
                dropdownTextStyles={{
                  color: themeStyle.primaryText,
                }}
              />
              <TextInput
                onChangeText={text =>
                  setNewPopularCategory({...newPopularCategory, price: text})
                }
                style={textInputStyle}
                placeholder="Enter price or amount"
                placeholderTextColor={themeStyle?.grey}
                underlineColorAndroid="transparent"
                value={newPopularCategory?.price}
              />
              <View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{
                    marginTop: 10,
                    paddingTop: 20,
                    width: width + 50,
                    marginLeft: -50,
                  }}>
                  {newSpot?.popularCategories?.map((popularCategory, i) => (
                    <PopularCategory
                      deletePopularCategory={deletePopularCategory}
                      editPopularCategory={editPopularCategory}
                      popularCategory={popularCategory}
                      key={i}
                      index={i}
                      isEditingPopularCategories={isEditingPopularCategories}
                    />
                  ))}
                </ScrollView>
                {newSpot?.popularCategories?.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setIsEditingPopularCategories(
                        !isEditingPopularCategories,
                      );
                      newPopularCategory?.isEditing?.status &&
                        setNewPopularCategory(initialNewPopularCategory);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <MaterialCommunityIcons
                      name="pencil"
                      size={20}
                      color={themeStyle.primaryText}
                    />
                    <Text
                      style={{
                        marginLeft: 5,
                        color: themeStyle.primaryText,
                      }}>
                      {isEditingPopularCategories
                        ? 'Stop editing'
                        : 'Edit popular categories'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
        <View style={{marginVertical: 80}} />
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          width,
          alignItems: 'center',
          justifyContent: 'center',
          bottom: 30,
          flexDirection: 'row',
        }}>
        <LinearGradientButton
          title={'Save'}
          loading={saving}
          onPress={handleSaveSpot}
        />
      </View>
    </SafeAreaView>
  );
};

export default SpotCreation = navigation => {
  const publicKey = useSelector(state => state?.lock?.publicKey);
  const [spotId, setSpotId] = useState(null);
  const [newSpot, setNewSpot] = useState({
    title: '',
    description: '',
    category: '',
    about: '',
    location: {
      name: '',
      latitude: 0.0,
      longitude: 0.0,
    },
    categories: [],
    contactNumber: '',
    popularCategories: [],
    image: {
      uri: '',
      filename: '',
      mime: '',
    },
    video: {
      uri: '',
      filename: '',
      mime: '',
    },
    publicKey: publicKey,
  });

  useEffect(() => {
    try {
      if (navigation?.route?.params?.spot) {
        setNewSpot(navigation?.route?.params?.spot);
        setSpotId(navigation?.route?.params?.spot?.id);
      }
    } catch (error) {}
  }, []);

  return (
    <SpotCreationComponent
      spotId={spotId}
      setNewSpot={setNewSpot}
      newSpot={newSpot}
    />
  );
};
