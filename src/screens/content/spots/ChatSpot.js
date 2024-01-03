import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Buffer} from 'buffer';
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  TouchableHighlight,
} from 'react-native';
import theme from '../../../theme';
import RNFetchBlob from 'rn-fetch-blob';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';
import {useDispatch, useSelector} from 'react-redux';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import {
  onSnapshot,
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import forge from 'node-forge';
import CryptoJS from 'react-native-crypto-js';
import {useKeyboard} from '@react-native-community/hooks';
import * as RNRP from 'react-native-audio-recorder-player';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Sound from 'react-native-sound';
import ImagePicker from 'react-native-image-crop-picker';
import {useMutation} from '@apollo/client';

import {addChatData, updateChatData} from '../../../store/chats';
import {UPLOAD_FILE} from '../../../graphql/queries';
import {SpotNavigationHeader} from '../../../components/navigation/SpotNavigationHeader';
import {database} from '../../../utils/firebase/firebaseconfig';

const audioRecorderPlayer = new AudioRecorderPlayer();

export const readOnlineBase64File = async (url, type = 'image', decrypt) => {
  if (!url || !type || !decrypt) return null;
  let fileName = decodeURIComponent(url.substring(url.lastIndexOf('/') + 1));
  try {
    fileName = fileName.split('?')[0];
    let response = await fetch(url);
    response = await response.text();
    let filePath;
    if (type == 'audio') {
      filePath = `${RNFetchBlob.fs.dirs.CacheDir}/audio/AUD-${Date.now()}.m4a`; // ios is m4a
    } else {
      filePath = `${RNFetchBlob.fs.dirs.CacheDir}/images/IMG-${Date.now()}.jpg`;
    }
    const decryptedString = await decrypt(response);
    await RNFetchBlob.fs.writeFile(filePath, decryptedString, 'base64');
    return filePath;
  } catch (error) {
    return null;
  }
};
export const extractFileName = filePath => {
  try {
    let res = filePath?.split('/')?.splice(-1)[0];
    try {
      res = res?.split('?')[0];
    } catch (error) {}
    return res;
  } catch (error) {
    return 'File not found!';
  }
};
export const openGalleryPhoto = async () => {
  try {
    return await ImagePicker.openPicker({
      compressImageQuality: 0.8, //reduce image quality (range is 0 - 1)
      cropping: true,
    }).then(async image => {
      const filePath = `${
        RNFetchBlob.fs.dirs.CacheDir
      }/images/IMG-${Date.now()}.jpg`; // Path to save the converted audio file

      await RNFS.readFile(image.path, 'base64')
        .then(fileData => {
          // Write the contents to the new file in the destination folder
          return RNFS.writeFile(filePath, fileData, 'base64');
        })
        .then(async () => {
          // remove the entire image cropper path
          const imageCropperPath = image.path
            .split('/')
            ?.slice(0, -1)
            ?.join('/');
          await RNFS.unlink(imageCropperPath);
        })
        .catch(error => {});

      return filePath;
    });
  } catch (error) {}
};
export const convertBase64ToURL = async (
  fileUpload,
  base64String,
  fileName = null,
) => {
  try {
    const res = await fileUpload({
      variables: {
        input: {uri: base64String, filename: fileName, mime: null},
      },
      onCompleted: async response => {
        if (response?.uploadFile?.code == 200) {
          return response?.uploadFile?.url;
        }
        return null;
      },
      onError: error => {},
    });
    return res?.data?.uploadFile?.url;
  } catch (error) {}
};
export const convertFileToBase64 = async path => {
  try {
    try {
      let filePath = path.replace('file://', '');
      const base64Data = await RNFetchBlob.fs.readFile(filePath, 'base64');
      return base64Data;
    } catch (error) {}

    return base64Data;
  } catch (error) {}
};
export const convertFromBase64 = async (base64Data, type = 'audio') => {
  const base64String = base64Data.split(',')[1]; // Remove the data URL prefix
  try {
    let filePath = '';
    if (type == 'audio') {
      filePath = `${RNFetchBlob.fs.dirs.CacheDir}/audio/${Date.now()}.m4a`; // Path to save the converted audio file
    } else {
      filePath = `${RNFetchBlob.fs.dirs.CacheDir}/images/${Date.now()}.jpg`; // Path to save the converted audio file
    }
    await RNFetchBlob.fs.writeFile(filePath, base64String, 'base64');
    return filePath;
  } catch (error) {
    console.error('Error converting base64 to audio:', error);
  }
};
export const useBufferize = () => {
  const to = param => JSON.stringify(Buffer.from(param));
  const from = param => Buffer.from(JSON.parse(param).data).toString();
  return {
    to,
    from,
  };
};
export const ChatBox = props => {
  const {
    messages,
    handleSendMessage,
    setText,
    text,
    width,
    themeStyle,
    scrollViewRef,
    handleScrollToBottom,
    user,
    decrypt,
  } = props;
  const textInputRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const keyboard_ = useKeyboard();
  const [timerId, setTimerId] = useState(null);
  const [time, setTime] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    createMediaFolderIfItDoesNotExists('audio');
    createMediaFolderIfItDoesNotExists('images');
  }, []);

  // Enable playback in silence mode
  Sound.setCategory('Playback');

  const playLocalSound = url => {
    const sound = new Sound(url, '', error => {
      if (error) {
        Alert.alert('Failed to load the sound' + '\n' + error.message);
        return;
      }
      // Play the sound
      sound.play(success => {});
    });
  };

  const dirs = RNFetchBlob.fs.dirs;

  const getPathAndCurrentTime = () => {
    const currentTime_ = Date.now();
    const path = Platform.select({
      ios: `audio/${currentTime_}.m4a`,
      android: `${dirs.CacheDir}/audio/${currentTime_}.mp3`,
    });
    return {
      currentTime_,
      path,
    };
  };
  const audioSet = {
    AudioEncoderAndroid: RNRP.AudioEncoderAndroidType.AAC,
    AudioSourceAndroid: RNRP.AudioSourceAndroidType.MIC,
    AVModeIOS: RNRP.AVModeIOSOption.measurement,
    AVEncoderAudioQualityKeyIOS: RNRP.AVEncoderAudioQualityIOSType.low, // Choose a lower audio quality
    AVNumberOfChannelsKeyIOS: 1, // Use mono audio instead of stereo
    AVFormatIDKeyIOS: RNRP.AVEncodingOption.aac, // Use a lower-quality audio codec
    AVSampleRateKey: 22050, // Decrease the sample rate
  };
  const meteringEnabled = false;
  const onStartRecord = async () => {
    const {path} = getPathAndCurrentTime();
    await audioRecorderPlayer.startRecorder(path, audioSet, meteringEnabled);
    audioRecorderPlayer.addRecordBackListener(e => {
      const currentTime = Math.floor(Math.floor(e.currentPosition) / 1000);
      if (currentTime >= 104) {
        stopRecording();
      }
      return;
    });
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

    RNFS.stat(result)
      .then(async fileInfo => {
        handleSendMessage(fileInfo.path, 'audio');
      })
      .catch(error => {});
  };

  const handleUpdateMessageFile = (filePathResponse, message) => {
    const path = filePathResponse;
    const messageId = message.time;
    const spotId = message.spot.spotId;
    if (path && messageId && spotId) {
      dispatch(
        updateChatData({
          path,
          messageId,
          spotId,
        }),
      );
    }
  };
  const deleteFileFromSystem = async filePath => {
    const fileName = extractFileName(filePath);
    try {
      Alert.alert(
        'Are you sure you want to delete this file',
        fileName,
        [
          {text: 'Cancel', onPress: () => {}},
          {
            text: 'OK',
            onPress: async () => {
              await RNFS.unlink(filePath);
            },
          },
        ],
        {cancelable: false},
      );
    } catch (err) {}
  };

  const recordAudio = () => {
    startTimer();
    onStartRecord();
    setIsRecording(true);
  };

  const stopRecording = () => {
    stopTimer();
    setIsRecording(false);
    onStopRecord();
  };

  const handleTextInputFocus = () => {
    if (!showEmojiPicker) {
      textInputRef.current.focus();
      Keyboard.dismiss();
      setShowEmojiPicker(true);
    } else {
      setShowEmojiPicker(false);
      textInputRef.current.focus();
    }
  };
  useEffect(() => {
    if (keyboard_ && keyboard_.keyboardHeight) {
      setKeyboardHeight(keyboard_.keyboardHeight);
    }
  }, [keyboard_]);

  const startTimer = () => {
    setTimerId(Date.now());
  };

  const stopTimer = () => {
    setTimerId(null);
  };

  // timer config below
  useEffect(() => {
    if (timerId) {
      const intervalId = setInterval(() => {
        setTime(prevTime => prevTime + 1000);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timerId]);

  const formatTime = time => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        backgroundColor: themeStyle.bgColor,
        paddingHorizontal: 20,
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
      <ScrollView
        ref={scrollViewRef}
        onLayout={handleScrollToBottom}
        showsVerticalScrollIndicator={false}>
        {messages?.map((message, i) => {
          return (
            <View key={i}>
              {message?.content?.type == 'text' ? (
                <MessageBox
                  user={user}
                  message={message}
                  previousMessage={i == 0 ? null : messages[i - 1]}
                />
              ) : message?.content?.type == 'audio' ? (
                <AudioPlayer
                  deleteFileFromSystem={deleteFileFromSystem}
                  convertFromBase64={convertFromBase64}
                  time={time}
                  playLocalSound={playLocalSound}
                  user={user}
                  width={width}
                  message={message}
                  decrypt={decrypt}
                  handleUpdateMessageFile={handleUpdateMessageFile}
                />
              ) : (
                <ImageDisplay
                  deleteFileFromSystem={deleteFileFromSystem}
                  convertFromBase64={convertFromBase64}
                  time={time}
                  formatTime={formatTime}
                  user={user}
                  width={width}
                  message={message}
                  decrypt={decrypt}
                  handleUpdateMessageFile={handleUpdateMessageFile}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
      {/* TEXT INPUT */}
      <View style={{flexDirection: 'row'}}>
        {isRecording ? (
          <VoiceRecorder
            width={width}
            formatTime={formatTime}
            time={time}
            stopRecording={stopRecording}
          />
        ) : (
          <ChatTextInput
            handleSendMessage={handleSendMessage}
            width={width}
            setText={setText}
            text={text}
            textInputRef={textInputRef}
            handleTextInputFocus={handleTextInputFocus}
            themeStyle={themeStyle}
          />
        )}

        {text?.trim() == '' && !isRecording ? (
          <TouchableOpacity
            onPress={recordAudio}
            style={{
              position: 'absolute',
              right: -10,
              bottom: 5,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.darkblue_dark,
              height: 40,
              marginBottom: 15,
              width: 40,
              borderRadius: 50,
            }}>
            <MaterialCommunityIcons
              name="microphone"
              size={20}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={text?.trim() == ''}
            onPress={() => handleSendMessage()}
            style={{
              position: 'absolute',
              right: -10,
              bottom: 5,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.darkblue_dark,
              height: 40,
              marginBottom: 15,
              width: 40,
              borderRadius: 50,
            }}>
            <FontAwesome name="send" size={15} color={'white'} />
          </TouchableOpacity>
        )}
      </View>
      {/* EMOJI PICKER */}
      {showEmojiPicker ? (
        <View
          style={{
            height: keyboardHeight,
            width,
            marginLeft: -20,

            paddingBottom: 20,
          }}>
          <EmojiSelector
            showSectionTitles={false}
            showSearchBar={false}
            category={Categories.emotion}
            onEmojiSelected={emoji => setText(text => text + emoji)}
            columns={10}
          />
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
};
export const date_time = () => {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString('default', {month: 'long'});
  const year = now.getFullYear();
  const time = now.toLocaleTimeString('en-US', {hour12: true});

  const formattedDate = `${day}${getOrdinalSuffix(
    day,
  )}/${month}/${year} ${time}`;

  // Function to get the ordinal suffix for a given day
  function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  return formattedDate;
};
export const get_chat_time = dateString => {
  try {
    const [_, time_string, am_pm] = dateString?.split(' ');
    let time_str = time_string?.split(':');
    time_str = time_str[0] + ':' + time_str[1];

    const formattedTime = `${time_str}:${am_pm?.toUpperCase()}`;

    return formattedTime;
  } catch (error) {
    return '';
  }
};
const doesFileExist = filePath => {
  try {
    return RNFS.exists(filePath).then(res => res);
  } catch (error) {
    return false;
  }
};
const createMediaFolderIfItDoesNotExists = async path => {
  const folderPath = RNFS.CachesDirectoryPath + `/${path}`;
  try {
    const folderExists = await RNFS.exists(folderPath);

    if (!folderExists) {
      await RNFS.mkdir(folderPath);
    }
  } catch (error) {}
};
const isSameDay = (prevTimestamp, currentTimestamp) => {
  const previousDate = new Date(prevTimestamp);
  const currentDate = new Date(currentTimestamp);

  // Extract the date portion (day, month, and year) from the timestamps
  const previousDateString = previousDate.toLocaleDateString();
  const currentDateString = currentDate.toLocaleDateString();

  // Compare the date strings
  return previousDateString === currentDateString;
};
const ImageDisplay = ({
  convertFromBase64,
  message,
  width,
  user,
  deleteFileFromSystem,
  decrypt,
  handleUpdateMessageFile,
}) => {
  const [filePath, setFilePath] = useState(message?.content?.message);
  const [fileExistsCheck, setFileExistsCheck] = useState(true);
  const fileExistsCheckFunc = async path => {
    const fileExistsCheck_ = await doesFileExist(path);

    if (fileExistsCheck_) {
      setFilePath(path);
    } else {
      setFileExistsCheck(fileExistsCheck_);
    }
  };

  const handleImageInput = async () => {
    const res = await isPathValid(message?.content?.message);
    if (!res) {
      const filePathResponse = await readOnlineBase64File(
        message?.content?.message,
        'image',
        decrypt,
      );

      if (filePathResponse) {
        await fileExistsCheckFunc(filePathResponse);
        handleUpdateMessageFile(filePathResponse, message);
      }
    } else {
      fileExistsCheckFunc(message?.content?.message);
    }
  };
  useEffect(() => {
    handleImageInput();
  }, []);

  if (!message?.content?.message) return <></>;
  return (
    <View>
      {fileExistsCheck ? (
        <TouchableHighlight
          onLongPress={async () => {
            const audioFile = await convertFromBase64(
              message?.content?.message,
            );
            deleteFileFromSystem(audioFile);
          }}
          style={{
            alignSelf:
              message?.user?.userId != user?.id ? 'flex-start' : 'flex-end',
            borderRadius: 15,
            marginBottom: 5,
          }}>
          <View
            style={{
              backgroundColor:
                message?.user?.userId != user?.id
                  ? theme.colors.chatBoxColor2
                  : theme.colors.chatBoxColor1,
              borderRadius: 15,
              padding: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={{uri: `file://${filePath}`}}
              style={{minWidth: width / 1.5, minHeight: 300, borderRadius: 10}}
            />
            <Text
              style={{
                fontWeight: '200',
                alignSelf: 'flex-end',
                color: 'white',
                position: 'absolute',
                right: 10,
                bottom: 5,
                fontSize: 10,
              }}>
              {get_chat_time(message?.time)}
            </Text>
          </View>
        </TouchableHighlight>
      ) : (
        <TouchableHighlight
          onLongPress={async () => {
            const audioFile = await convertFromBase64(
              message?.content?.message,
            );
            deleteFileFromSystem(audioFile);
          }}
          style={{
            // flex: 1,
            alignSelf:
              message?.user?.userId != user?.id ? 'flex-start' : 'flex-end',
            borderBottomLeftRadius: message?.user?.userId != user?.id ? 10 : 15,
            borderBottomRightRadius:
              message?.user?.userId != user?.id ? 15 : 10,
            borderTopLeftRadius: message?.user?.userId != user?.id ? 0 : 15,
            borderTopRightRadius: message?.user?.userId != user?.id ? 15 : 0,
            // justifyContent: 'center',
            marginBottom: 5,
          }}>
          <View
            style={{
              borderBottomLeftRadius:
                message?.user?.userId != user?.id ? 10 : 15,
              borderBottomRightRadius:
                message?.user?.userId != user?.id ? 15 : 10,
              borderTopLeftRadius: message?.user?.userId != user?.id ? 0 : 15,
              borderTopRightRadius: message?.user?.userId != user?.id ? 15 : 0,
              backgroundColor: theme.colors.chatBoxColor1,
              padding: 5,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              width: width / 2,
              height: 60,
            }}>
            <MaterialCommunityIcons
              name="file-image-remove"
              size={20}
              color={theme.colors.grey}
            />
            <Text
              style={{
                fontWeight: '200',
                color: 'white',

                fontSize: 14,
                marginLeft: 5,
              }}>
              {extractFileName(message?.content?.message)}
            </Text>
            <Text
              style={{
                fontWeight: '200',
                alignSelf: 'flex-end',
                color: 'white',
                position: 'absolute',
                right: 10,
                bottom: 5,

                fontSize: 10,
              }}>
              {get_chat_time(message?.time)}
            </Text>
          </View>
        </TouchableHighlight>
      )}
    </View>
  );
};
async function isPathValid(path) {
  try {
    const stat = await RNFS.stat(path);
    return stat.isDirectory() || stat.isFile();
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Path does not exist
      return false;
    }
    return false;
  }
}
const AudioPlayer = ({
  convertFromBase64,
  message,
  width,
  user,
  playLocalSound,
  deleteFileFromSystem,
  decrypt,
  handleUpdateMessageFile,
}) => {
  const [filePath, setFilePath] = useState(message?.content?.message);
  const [fileExistsCheck, setFileExistsCheck] = useState(true);
  const fileExistsCheckFunc = async path => {
    const fileExistsCheck_ = await doesFileExist(path);

    if (fileExistsCheck_) {
      setFilePath(path);
    } else {
      setFileExistsCheck(fileExistsCheck_);
    }
  };

  const handleAudioInput = async () => {
    try {
      const res = await isPathValid(message?.content?.message);
      if (!res) {
        const filePathResponse = await readOnlineBase64File(
          message?.content?.message,
          'audio',
          decrypt,
        );
        if (filePathResponse) {
          fileExistsCheckFunc(filePathResponse);
          handleUpdateMessageFile(filePathResponse, message);
        }
      } else {
        fileExistsCheckFunc(message?.content?.message);
      }
    } catch (error) {}
  };
  useEffect(() => {
    handleAudioInput();
  }, []);
  const handlePlayRecording = async () => {
    await playLocalSound(filePath);
  };

  return (
    <View>
      {fileExistsCheck ? (
        <TouchableHighlight
          onLongPress={async () => {
            const audioFile = await convertFromBase64(filePath);
            deleteFileFromSystem(audioFile);
          }}
          style={{
            alignSelf:
              message?.user?.userId != user?.id ? 'flex-start' : 'flex-end',
            borderRadius: 15,
            marginBottom: 5,
          }}>
          <View
            style={{
              borderRadius: 15,
              backgroundColor:
                message?.user?.userId != user?.id
                  ? theme.colors.chatBoxColor2
                  : theme.colors.chatBoxColor1,
              paddingHorizontal: 10,
              paddingVertical: 5,
              flexDirection: 'row',
              alignItems: 'center',
              width: width / 2,
              height: 60,
            }}>
            <Ionicons
              onPress={handlePlayRecording}
              name="play-outline"
              size={20}
              color={
                message?.user?.userId == user?.id
                  ? theme.colors.chatBoxColor2
                  : theme.colors.chatBoxColor1
              }
            />
            <Text
              style={{
                position: 'absolute',
                fontWeight: '400',
                top: 5,
                right: 10,
                color:
                  message?.user?.userId == user?.id
                    ? theme.colors.chatBoxColor2
                    : theme.colors.chatBoxColor1,
                fontSize: 14,
              }}></Text>
            <View
              style={{
                flex: 1,
                marginHorizontal: 10,
              }}>
              <View
                style={{
                  backgroundColor:
                    message?.user?.userId == user?.id
                      ? theme.colors.chatBoxColor2
                      : theme.colors.chatBoxColor1,
                  flexDirection: 'row',
                  height: 5,
                }}>
                <View
                  style={{
                    height: 5,
                    flex: 1,
                    backgroundColor: theme.colors.blue,
                  }}
                />
              </View>
            </View>
            <Text
              style={{
                fontWeight: '200',
                alignSelf: 'flex-end',
                color:
                  message?.user?.userId == user?.id
                    ? theme.colors.chatBoxColor2
                    : theme.colors.chatBoxColor1,
                position: 'absolute',
                right: 10,
                bottom: 5,

                fontSize: 10,
              }}>
              {get_chat_time(message?.time)}
            </Text>
          </View>
        </TouchableHighlight>
      ) : (
        <TouchableHighlight
          style={{
            alignSelf:
              message?.user?.userId != user?.id ? 'flex-start' : 'flex-end',
            borderRadius: 15,
            marginBottom: 5,
          }}>
          <View
            style={{
              borderRadius: 15,
              backgroundColor:
                message?.user?.userId != user?.id
                  ? theme.colors.chatBoxColor2
                  : theme.colors.chatBoxColor1,
              paddingHorizontal: 10,
              paddingVertical: 5,
              flexDirection: 'row',
              alignItems: 'center',
              width: width / 2,
              height: 60,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcons
                color={theme.colors.grey}
                name={'microphone-off'}
                size={20}
              />
              <Text
                style={{
                  fontWeight: '400',
                  color: theme.colors.grey,
                }}>
                Audio file does not exist
              </Text>
            </View>
            <Text
              style={{
                fontWeight: '200',
                alignSelf: 'flex-end',
                color: 'white',
                position: 'absolute',
                right: 10,
                bottom: 5,

                fontSize: 10,
              }}>
              {get_chat_time(message?.time)}
            </Text>
          </View>
        </TouchableHighlight>
      )}
    </View>
  );
};
const MessageBox = ({message, user, previousMessage}) => {
  const doMessagesShareTheSameDate = previousMessage
    ? isSameDay(previousMessage?.time, message?.time)
    : false;
  if (doMessagesShareTheSameDate) edge = 15;
  let chatStyle = {
    flex: 1,
    alignSelf: message?.user?.userId != user?.id ? 'flex-start' : 'flex-end',
    backgroundColor:
      message?.user?.userId != user?.id
        ? theme.colors.chatBoxColor2
        : theme.colors.chatBoxColor1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 10,
    minWidth: 120,
    borderBottomLeftRadius: message?.user?.userId != user?.id ? 10 : 15,
    borderBottomRightRadius: message?.user?.userId != user?.id ? 15 : 10,
    borderTopLeftRadius: message?.user?.userId != user?.id ? 0 : 15,
    borderTopRightRadius: message?.user?.userId != user?.id ? 15 : 0,
  };
  const pt = 15;

  chatStyle.borderBottomLeftRadius = pt;
  chatStyle.borderBottomRightRadius = pt;
  chatStyle.borderTopLeftRadius = pt;
  chatStyle.borderTopRightRadius = pt;

  let textStyle = {
    fontWeight: '200',
    alignSelf: 'flex-end',
    color: message?.user?.userId == user?.id ? 'black' : 'white',
    fontSize: 10,
    position: 'absolute',
    right: 10,
    bottom: 5,
  };
  return (
    <View>
      <View style={chatStyle}>
        <Text
          style={{
            fontWeight: '400',
            color: message?.user?.userId == user?.id ? 'black' : 'white',
            marginRight: message?.user?.userId != user?.id ? 40 : 40,
            marginBottom: 5,
          }}>
          {message?.content?.message}
        </Text>

        <Text style={textStyle}>{get_chat_time(message?.time)}</Text>
      </View>
    </View>
  );
};
const VoiceRecorder = ({stopRecording, width, time, formatTime}) => {
  return (
    <View
      style={{
        marginTop: 5,
        alignItems: 'center',
        padding: 5,
        justifyContent: 'space-between',
        borderRadius: 30,
        borderWidth: 0,
        width: width - 65,
        marginLeft: -10,
        bottom: 0,
        marginBottom: 15,
        flexDirection: 'row',
        height: 50,
        backgroundColor: theme.colors.cardLight,
      }}>
      <TouchableOpacity
        onPress={stopRecording}
        style={{
          position: 'absolute',
          bottom: 5,
          left: 5,
          alignItems: 'center',
          justifyContent: 'center',
          height: 40,
          width: 40,
          borderRadius: 50,
        }}>
        <AntDesign name="close" size={20} color={theme.colors.dark} />
      </TouchableOpacity>
      {/* progress bar */}
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.cardDark,
          marginLeft: 40,
          flexDirection: 'row',
          marginRight: 10,
          height: 10,
        }}>
        <View
          style={{
            height: 10,
            flex: 1 * (time / 1000 / 100),
            backgroundColor: theme.colors.blue,
          }}
        />
      </View>
      {/* timer */}
      <Text
        style={{
          fontWeight: '400',
          marginRight: 10,
        }}>
        <View>
          <Text>{formatTime(time)}</Text>
        </View>
      </Text>
    </View>
  );
};
const ChatTextInput = ({
  handleTextInputFocus,
  setText,
  width,
  handleSendMessage,
  text,
  textInputRef,
  themeStyle,
}) => {
  const handleSendImage = async () => {
    const img = await openGalleryPhoto();
    img && handleSendMessage(img, 'image');
  };
  return (
    <View
      style={{
        marginTop: 5,
        alignItems: 'center',
        padding: 5,
        justifyContent: 'space-between',
        borderRadius: 30,
        borderWidth: 0,
        width: width - 65,
        marginLeft: -10,
        bottom: 0,
        marginBottom: 15,
        flexDirection: 'row',
        backgroundColor: themeStyle.card,
      }}>
      <TouchableOpacity
        onPress={handleTextInputFocus}
        style={{
          position: 'absolute',
          bottom: 5,
          left: 5,
          alignItems: 'center',
          justifyContent: 'center',
          height: 40,
          width: 40,
          borderRadius: 50,
        }}>
        <FontAwesome5 name="laugh" size={20} color={themeStyle.primaryText} />
      </TouchableOpacity>

      <TextInput
        ref={textInputRef}
        multiline
        value={text}
        onChangeText={text => {
          // remove non-ASCII characters from the input
          const asciiText = text.replace(/[^\x00-\x7F\uD800-\uDFFF]/g, '');
          setText(asciiText);
        }}
        style={{
          flex: 1,
          color: themeStyle.primaryText,
          paddingHorizontal: 0,
          fontSize: 14,
          marginHorizontal: 50,
          marginVertical: 5,
          minHeight: 30,
          maxHeight: 150,
        }}
        keyboardType="ascii-capable"
        placeholder="Write a message..."
        placeholderTextColor={themeStyle.primaryText}
        underlineColorAndroid="transparent"
      />
      <TouchableOpacity
        onPress={handleSendImage}
        style={{
          position: 'absolute',
          right: 5,
          bottom: 5,
          alignItems: 'center',
          justifyContent: 'center',
          height: 40,
          width: 40,
          borderRadius: 50,
        }}>
        <Feather name="paperclip" size={20} color={themeStyle.primaryText} />
      </TouchableOpacity>
    </View>
  );
};
const ChatContent = ({spot, themeStyle}) => {
  const {id: spotId, creator: ownerId} = spot;
  const dispatch = useDispatch();
  const userReduxChats = useSelector(state => state?.chats?.chats);
  const initMsgs = () => {
    try {
      return userReduxChats[spotId];
    } catch (error) {
      return [];
    }
  };
  const [fileUpload] = useMutation(UPLOAD_FILE);

  const {width, height} = useWindowDimensions();
  const [messages, setMessages] = useState();
  const [isFirestoreMessagesEmpty, setIsFirestoreMessagesEmpty] =
    useState(true);
  const [text, setText] = useState('');
  const user = useSelector(state => state?.user?.user);

  const scrollViewRef = useRef();

  const userId = user?.id;
  const publicKey = useSelector(state => state.lock.publicKey);

  const encryptedPrivateKey = useSelector(
    state => state.lock.encryptedPrivateKey,
  );
  const secretKey = useSelector(state => state.lock.secretKey);
  const splitStrFunction = (inputString, cutoff) => {
    function splitString(str, len) {
      const result = [];
      for (let i = 0; i < str.length; i += len) {
        result.push(str.substr(i, len));
      }
      return result;
    }
    return splitString(inputString, cutoff);
  };
  const bufferize = useBufferize();

  const encrypt = (_, receiverPublicKey) => {
    try {
      let plaintext = _;
      if (typeof _ != 'string') {
        plaintext = bufferize.to(JSON.stringify(plaintext));
      } else {
        plaintext = bufferize.to(_);
      }
      // Encrypt the plaintext with the public key using node-forge
      const pKey = receiverPublicKey;
      const decryptedPublicKey = CryptoJS.AES.decrypt(pKey, 'petra').toString(
        CryptoJS.enc.Utf8,
      );

      //   resulting to array of encrypted messages in chunks - each chunk is
      //  encrypted seperately
      const encrypted = [];
      splitStrFunction(plaintext, 190).map(string => {
        const response = forge.pki
          .publicKeyFromPem(decryptedPublicKey)
          .encrypt(string, 'RSA-OAEP', {
            md: forge.md.sha256.create(),
            mgf1: {
              md: forge.md.sha256.create(),
            },
          });
        encrypted.push(response);
      });
      return JSON.stringify(encrypted);
    } catch (error) {}
  };

  const decrypt = _ => {
    try {
      let encryptedMessage = _;
      if (_ != 'string') encryptedMessage = JSON.parse(_);
      const decryptedPrivateKey = CryptoJS.AES.decrypt(
        encryptedPrivateKey,
        secretKey,
      ).toString(CryptoJS.enc.Utf8);

      // decrypted will be an array of decrypted chunks (buffer)
      const decrypted = [];
      // Decrypt the encrypted text with the private key using node-forge
      encryptedMessage.map(message => {
        const response = forge.pki
          .privateKeyFromPem(decryptedPrivateKey)
          .decrypt(message, 'RSA-OAEP', {
            md: forge.md.sha256.create(),
            mgf1: {
              md: forge.md.sha256.create(),
            },
          });
        decrypted.push(response);
      });
      return bufferize.from(decrypted.join(''));
    } catch (error) {}
  };

  const handleSendMessage = async (path = null, type = null) => {
    try {

      // PREPARE / STRUCTURE DATA - STAGE -1
      const new_message_details = {
        user: {
          userId,
          name: `${user?.firstname} ${user?.lastname}`,
        },
        spot: {
          name: spot?.title,
          spotId: spotId,
          creator: ownerId,
        },
        time: date_time(),
        content: {
          type: path ? type : 'text',
          message: path ? path : text,
        },
      };
      let message = '';
      if (path) {
        const fileName = extractFileName(path);
        message = await convertFileToBase64(path);
        message = encrypt(message, spot.publicKey, 'owner');
        message = await convertBase64ToURL(fileUpload, message, fileName);
      } else {
        message = text;
      }

      let ownerMessageDetails = {
        user: {
          userId,
          name: `${user?.firstname} ${user?.lastname}`,
        },
        spot: {
          name: spot?.title,
          spotId: spotId,
          creator: ownerId,
        },
        time: date_time(),
        content: {
          type: path ? type : 'text',
          message: message,
        },
      };

      let userMessageDetails = {
        user: {
          userId,
          name: `${user?.firstname} ${user?.lastname}`,
        },
        spot: {
          name: spot?.title,
          spotId: spotId,
          creator: ownerId,
        },
        time: date_time(),
        content: {
          type: path ? type : 'text',
          message: path ? path : text,
        },
      };
      //   ENCRYPT MESSAGES - STAGE - 2

      ownerMessageDetails = encrypt(ownerMessageDetails, spot.publicKey);
      userMessageDetails = encrypt(userMessageDetails, publicKey);

      // SENDING TO FIREBASE STAGE - 3

      if (!isFirestoreMessagesEmpty) {
        // UPDATE OWNER
        updateDoc(
          doc(database, ownerId, spotId),
          {
            [userId]: arrayUnion(ownerMessageDetails),
          },
          {merge: true},
        )
          .then(res => res)
          .catch(err => {});

        // UPDATE USER
        updateDoc(
          doc(database, userId, spotId),
          {
            [userId]: arrayUnion(userMessageDetails),
          },
          {merge: true},
        )
          .then(res => res)
          .catch(err => {});
      } else {
        // SAVE FOR OWNER
        setDoc(
          doc(database, ownerId, spotId),
          {
            [userId]: [ownerMessageDetails],
          },
          {merge: true},
        )
          .then(res => {})
          .catch(err => {});

        // SAVE FOR USER
        setDoc(
          doc(database, userId, spotId),
          {
            [userId]: [userMessageDetails],
          },
          {merge: true},
        )
          .then(res => {})
          .catch(err => {});
      }
      //   UPDATE MESSAGES STATE - STAGE 4
      if (messages?.length) {
        setMessages(msgs => [...msgs, new_message_details]);
      } else {
        setMessages(() => [new_message_details]);
      }
    } catch (error) {
      console.log({error});
    }
  };
  useEffect(() => {
    scrollViewRef.current.scrollToEnd({animated: true});
    setText('');
  }, [messages]);

  useLayoutEffect(() => {
    setMessages(initMsgs() ?? []);
    const unsub = onSnapshot(doc(database, userId, spotId), doc => {
      let response = doc?.data();
      if (response) {
        if (Object.keys(response)?.length > 0) {
          setIsFirestoreMessagesEmpty(false);
        }
      }
      const onlineMessages = response?.[userId];
      try {
        const localMessages = userReduxChats[spotId];
        if (onlineMessages && onlineMessages?.length) {
          const newMessagesSlice =
            onlineMessages?.length - localMessages?.length;
          if (newMessagesSlice) {
            let newMessages = onlineMessages?.slice(-newMessagesSlice);
            newMessages = newMessages.map(r => JSON.parse(decrypt(r)));
            if (localMessages?.length) {
              setMessages([...localMessages, ...newMessages]);
            } else {
              setMessages(newMessages);
            }
            newMessages?.length &&
              dispatch(addChatData({spotId, message: newMessages}));
          }
        }
      } catch (error) {
        console.log({error});
      }
    });
    return () => unsub();
  }, []);

  const handleScrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({animated: false});
  };
  return (
    <ChatBox
      setMessages={setMessages}
      messages={messages}
      handleSendMessage={handleSendMessage}
      setText={setText}
      text={text}
      width={width}
      height={height}
      themeStyle={themeStyle}
      scrollViewRef={scrollViewRef}
      handleScrollToBottom={handleScrollToBottom}
      user={user}
      get_chat_time={get_chat_time}
      decrypt={decrypt}
    />
  );
};
{
  /* */
}
const ChatSpot = () => {
  const {width, height} = useWindowDimensions();
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
          height,
          position: 'absolute',
        }}
        resizeMode="cover"
        source={{uri: spot?.image}}
      />
      <View style={{flex: 0.3}} />
      <ChatContent spot={spot} themeStyle={themeStyle} />
    </View>
  );
};

export default ChatSpot;
