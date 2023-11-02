/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState, Component} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  Dimensions,
  Image,
  NativeModules,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {Video as VideoAv, ResizeMode} from 'expo-av';

import {Camera, CameraType} from 'expo-camera';

import Constants from 'expo-constants';
console.log('expo-constants', Constants.systemFonts);

import {Image as ImageCompressor, Video} from 'react-native-compressor';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';

import RNFS, {copyFile} from 'react-native-fs';

import {zip} from 'react-native-zip-archive';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createNativeStackNavigator();

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const LOADING_STRING = '... loading ...';
  const BUFFERING_STRING = '...buffering...';

  const LOOPING_TYPE_ALL = 0;

  const {width: DEVICE_WIDTH, height: DEVICE_HEIGHT} = Dimensions.get('window');
  const FONT_SIZE = 14;
  const VIDEO_CONTAINER_HEIGHT = (DEVICE_HEIGHT * 2.0) / 5.0 - FONT_SIZE * 2;

  const [type, setType] = useState(CameraType.back);
  const [permission] = Camera.useCameraPermissions();
  const [micPermission] = Camera.useMicrophonePermissions();

  const [openCamera, SetOpenCamera] = useState(true);
  const [lastPhotoURI, setLastPhotoURI] = useState(null);
  const [lastVideoURI, setLastVideoURI] = useState('');

  const isOpenCamera = useRef(false);

  const cameraRef = useRef(null);

  const init = async () => {
    if (!permission) {
      const {status} = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        console.log('请开启相机权限');
        return;
      }
    }
  };

  const openCameraShow = () => {
    if (isOpenCamera.current) {
      isOpenCamera.current = false;
      SetOpenCamera(false);
    } else {
      isOpenCamera.current = true;
      SetOpenCamera(true);
    }
  };

  const toggleCameraType = () => {
    setType(current =>
      current === CameraType.back ? CameraType.front : CameraType.back,
    );
  };

  const onMountError = () => {
    console.log('camera回调出错');
  };
  const onCameraReady = () => {
    console.log('camera  相机预览时调用的回调');
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync();
      setLastPhotoURI(photo.uri);
      console.log('图片地址', photo.uri);
      compressionUri(photo.uri);
    }
  };

  const compressionUri = async (uri: string) => {
    const result = await ImageCompressor.compress(uri, {
      compressionMethod: 'auto',
    });
    console.log('压缩图片', result);
  };

  var state = {
    showVideo: false,
    playbackInstanceName: LOADING_STRING,
    loopingType: LOOPING_TYPE_ALL,
    muted: false,
    playbackInstancePosition: null,
    playbackInstanceDuration: null,
    shouldPlay: false,
    isPlaying: false,
    isBuffering: false,
    isLoading: true,
    fontLoaded: false,
    shouldCorrectPitch: true,
    volume: 1.0,
    rate: 1.0,
    videoWidth: DEVICE_WIDTH,
    videoHeight: VIDEO_CONTAINER_HEIGHT,
    poster: false,
    useNativeControls: false,
    fullscreen: false,
    throughEarpiece: false,
  };

  useEffect(() => {
    init();
  });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  function camera({navigation}) {
    return (
      <View style={[backgroundStyle, styles.view]}>
        {openCamera ? (
          <View style={styles.view}>
            <Camera
              style={styles.camera}
              type={type}
              ref={cameraRef}
              onMountError={onMountError}
              onCameraReady={onCameraReady}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={openCameraShow}>
                <Text style={styles.text}>Close Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraType}>
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',

                  marginTop: 10,
                }}
                onPress={() => {
                  takePhoto();
                }}>
                <Text
                  style={{fontSize: 30, color: 'blue', alignSelf: 'center'}}>
                  📸拍照
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.view}>
            <TouchableOpacity style={styles.button} onPress={openCameraShow}>
              <Text style={styles.text}>Open Camera</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="camera" component={camera} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomePage({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('camera')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    height: '100%',
    width: '100%',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  video: {
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    width: 320,
    height: 200,
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    flexDirection: 'column',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    margin: 64,
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonCenter: {
    marginTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default App;
