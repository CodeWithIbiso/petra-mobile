import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';

import {
  Text,
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {Divider} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import theme from '../../theme';
import {LimitedText} from './utility';

export const CustomVideoPlayer = ({videoURI, style}) => {
  const {width} = useWindowDimensions();

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoPressed, setVideoPressed] = useState(false);
  const [progressBar, setProgressBar] = useState(false);
  const [currentTime_, setCurrentTime_] = useState(0);
  const isFocused = useIsFocused();
  const videoRef = useRef(null);
  const videoRefCurrentTime = useRef(null);
  const videoRefPlayableDuration = useRef(null);

  let timer = useRef(null);
  useEffect(() => {
    timer.current = setTimeout(() => {
      setProgressBar(false);
      setVideoPressed(false);
    }, 5000);
  }, []);

  useEffect(() => {
    if (!isFocused) {
      setIsPlaying(false);
      clearTimeout(timer.current);
    }
  }, [isFocused]);

  const controlClose = () => {
    videoPressed && clearTimeout(timer.current);
    if (videoPressed)
      timer.current = setTimeout(() => {
        setProgressBar(false);
        setVideoPressed(false);
      }, 5000);
  };

  const handleVideoPress = () => {
    clearTimeout(timer.current);
    if (!videoPressed)
      timer.current = setTimeout(() => {
        setProgressBar(false);
        setVideoPressed(false);
      }, 5000);
    setProgressBar(!videoPressed);
    setVideoPressed(!videoPressed);
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setProgressBar(false);
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [videoRef.current, videoPressed]);
  const handleRewindPress = async () => {
    controlClose();
    videoRef.current.seek(videoRefCurrentTime.current - 10);
  };
  const handleForwardPress = async () => {
    controlClose();
    videoRef.current.seek(videoRefCurrentTime.current + 10);
  };
  const handlePausePress = async () => {
    controlClose();
    setIsPlaying(!isPlaying);
  };

  const duration = videoRef.current
    ? Math.floor(videoRefPlayableDuration.current)
    : 0;
  return (
    <View>
      <TouchableWithoutFeedback onPress={handleVideoPress}>
        <View>
          <Video
            source={{
              uri: videoURI,
              type: 'video/mp4',
            }}
            style={{width, height: width + 20, ...style}}
            repeat={true}
            ref={videoRef}
            paused={!isPlaying}
            hideControlsTimerDuration={999999}
            controls={false}
            onProgress={cTime => {
              videoRefPlayableDuration.current = cTime.playableDuration;
              videoRefCurrentTime.current = cTime.currentTime;
              progressBar && setCurrentTime_(cTime.currentTime);
            }}
          />

          {progressBar && (
            <View
              style={{
                height: 80,
                width: width - 80,
                alignSelf: 'center',
                marginTop: -80,
              }}>
              <Slider
                style={{width: '100%'}}
                minimumValue={0}
                maximumValue={duration}
                value={currentTime_}
                disabled={true}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
      {videoPressed && (
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            top: width / 2,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={handleRewindPress}
            style={{
              backgroundColor: 'rgba(0,0,0, 0.50)',

              borderColor: theme.colors.lightGrey,
              borderWidth: 0.5,
              height: 35,
              width: 35,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialCommunityIcons
              name="rewind-10"
              size={20}
              color={theme.colors.lightGrey}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePausePress}
            style={{
              backgroundColor: 'rgba(0,0,0, 0.50)',
              height: 50,
              borderColor: theme.colors.lightGrey,
              borderWidth: 0.5,
              width: 50,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 15,
            }}>
            <MaterialCommunityIcons
              name={isPlaying ? 'pause' : 'play'}
              size={30}
              color={theme.colors.lightGrey}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleForwardPress}
            style={{
              backgroundColor: 'rgba(0,0,0, 0.50)',

              height: 35,
              width: 35,
              borderColor: theme.colors.lightGrey,
              borderWidth: 0.5,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialCommunityIcons
              name="fast-forward-10"
              size={20}
              color={theme.colors.lightGrey}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export const MySpotCreationComponent = ({
  spot,
  fieldErrors,
  openGalleryVideo,
  openGalleryPhoto,
}) => {
  const {width} = useWindowDimensions();
  const themeStyle = useSelector(state => state.app.themeStyle);

  return (
    <View style={{backgroundColor: themeStyle.bgColor, width: width}}>
      <Divider
        style={{
          width,
          height: 0,
          backgroundColor: themeStyle.card,
        }}
      />
      <View style={{backgroundColor: themeStyle.bgColor}}>
        <Divider
          style={{
            width,
            height: 1,
            backgroundColor: themeStyle.card,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 10,
          justifyContent: 'space-between',
          backgroundColor: themeStyle.bgColor,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={openGalleryPhoto}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              backgroundColor: themeStyle.card,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {spot?.image?.uri || spot.image ? (
              <Image
                source={{
                  uri:
                    typeof spot.image == 'string'
                      ? spot.image
                      : spot?.image?.uri,
                }}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 100,
                  backgroundColor: theme.colors.darkblue,
                  alignSelf: 'center',
                }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 100,
                  backgroundColor: themeStyle.bgColor,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {fieldErrors?.image ? (
                  <AntDesign
                    name="exclamationcircleo"
                    size={20}
                    color={theme.colors.error}
                  />
                ) : null}
              </View>
            )}
          </TouchableOpacity>
          <View style={{marginTop: 15}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
              }}>
              <LimitedText
                limit={15}
                text={spot?.title}
                style={{
                  color: themeStyle.primaryText,
                  fontWeight: 'bold',

                  fontSize: 14,
                }}
              />
              {spot?.title ? (
                <Octicons
                  name={'dash'}
                  size={10}
                  color={themeStyle.primaryText}
                  style={{marginHorizontal: 5}}
                />
              ) : null}
              {spot?.title ? (
                <LimitedText
                  limit={20}
                  text={'Title'}
                  style={{
                    color: theme.colors.blue,
                    fontWeight: 'bold',
                  }}
                />
              ) : null}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
              }}>
              <LimitedText
                limit={15}
                text={spot?.location?.name}
                style={{
                  color: themeStyle.primaryText,
                  fontWeight: 'bold',
                }}
              />

              {spot?.location?.name ? (
                <Octicons
                  name={'dash'}
                  size={10}
                  color={themeStyle.primaryText}
                  style={{marginHorizontal: 5}}
                />
              ) : null}
              {spot?.location?.name ? (
                <LimitedText
                  limit={20}
                  text={'Location'}
                  style={{
                    color: theme.colors.blue,
                    fontWeight: 'bold',

                    fontSize: 14,
                  }}
                />
              ) : null}
            </View>
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 10,
            padding: 5,
            paddingHorizontal: 10,
            borderRadius: 20,
            borderWidth: 3,
            borderColor: themeStyle.card,
          }}>
          <Text style={{color: themeStyle.primaryText, fontWeight: 'bold'}}>
            Preview
          </Text>
        </View>
      </View>
      <View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: width - 50,
            width: '100%',
          }}>
          <View
            style={{
              position: 'relative',
              backgroundColor: themeStyle.card,
              height: width - 50,
              width,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {spot?.video?.uri ||
            (spot?.video && typeof spot?.image != 'object') ? (
              <View style={{position: 'absolute'}}>
                <CustomVideoPlayer videoURI={spot?.video?.uri || spot?.video} />
              </View>
            ) : (
              <View
                style={{
                  width,
                  height: width / 2,
                  backgroundColor: themeStyle.bgColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={openGalleryVideo}
                  style={{
                    borderColor: theme.colors.cardDark,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {fieldErrors?.video ? (
                    <AntDesign
                      name="exclamationcircleo"
                      size={40}
                      color={theme.colors.error}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="play-circle-outline"
                      size={40}
                      color={themeStyle.primaryText}
                    />
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

          {spot?.video?.uri ? (
            <TouchableOpacity
              onPress={openGalleryVideo}
              style={{
                position: 'absolute',
                zIndex: 6000,
                top: 15,
                right: 10,
                backgroundColor: 'rgba(0,0,0, 0.50)',
                padding: 5,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: theme.colors.white,
              }}>
              <MaterialIcons name="edit" size={20} color={theme.colors.white} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: themeStyle.card,
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}>
          <LimitedText
            limit={22}
            text={spot?.description}
            style={{
              color: themeStyle.primaryText,
              fontWeight: '500',

              fontSize: 14,
            }}
          />
          {spot?.description ? (
            <Octicons
              name={'dash'}
              size={10}
              color={themeStyle.primaryText}
              style={{marginHorizontal: 5}}
            />
          ) : null}
          {spot?.description ? (
            <LimitedText
              limit={20}
              text={'Description'}
              style={{
                color: theme.colors.blue,
                fontWeight: 'bold',
              }}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
};

export const SpotListCard = ({
  spot,
  deleteIsEnabled,
  themeStyle,
  handleEditSpot,
  isMarkedForDeletion,
  isEligibleForEdit,
}) => {
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 10,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {deleteIsEnabled && (
          <View
            style={{
              height: 15,
              width: 15,
              borderRadius: 3,
              borderColor: theme.colors.grey,
              backgroundColor: isMarkedForDeletion
                ? theme.colors.grey
                : 'transparent',
              marginRight: 10,
              borderWidth: 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {isMarkedForDeletion && (
              <FontAwesome5 name="check" size={10} color={theme.colors.white} />
            )}
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
          }}>
          <View>
            <Image
              source={{uri: spot?.image}}
              style={{
                width: 70,
                height: 70,
                borderRadius: 15,
                borderWidth: 3,
                marginRight: 10,
                borderColor: themeStyle.card,
              }}
              resizeMode={'cover'}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <View>
              <Text
                style={{
                  color: themeStyle.primaryText,
                }}>
                {spot?.title}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontStyle: 'italic',
                  color: theme.colors.blue,
                }}>
                {spot?.category}
              </Text>
              <Text
                style={{
                  fontWeight: '200',
                  fontSize: 10,

                  color: themeStyle.primaryText,
                }}>
                {spot?.description}
              </Text>

              <Text
                style={{
                  color: themeStyle.primaryText,
                }}>
                <EvilIcons
                  name={'location'}
                  size={12}
                  color={theme.colors.red}
                  style={{marginRight: 2}}
                />
                {spot?.location?.name?.length > 35
                  ? spot?.location?.name.slice(0, 35) + '...'
                  : spot?.location?.name}
              </Text>
            </View>
            <View
              style={{alignItems: 'flex-end', position: 'absolute', right: 0}}>
              {isEligibleForEdit ? (
                <TouchableOpacity
                  onPress={() =>
                    deleteIsEnabled ? null : handleEditSpot(spot)
                  }
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 100,
                    backgroundColor: deleteIsEnabled
                      ? theme.colors.grey
                      : theme.colors.darkblue_dark,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <MaterialCommunityIcons
                    name="pencil"
                    size={20}
                    color={theme.colors.white}
                  />
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    height: 20,
                    paddingHorizontal: 5,
                    borderRadius: 5,
                    backgroundColor: themeStyle.card,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: theme.colors.red,
                    }}>
                    5 Mins
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          height: 1,
          marginTop: 10,
          marginBottom: 5,
          backgroundColor: themeStyle.card,
          marginLeft: 80,
        }}
      />
    </View>
  );
};
