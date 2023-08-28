/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Dimensions,
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

import {Image, Video} from 'react-native-compressor';

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

  const [openCamera, SetOpenCamera] = useState(false);
  const [lastPhotoURI, setLastPhotoURI] = useState(null);
  const [lastVideoURI, setLastVideoURI] = useState('');

  var uriList: Array<string> = [''];

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

  const takeVideo = async () => {
    if (!micPermission) {
      const {status} = await Camera.requestMicrophonePermissionsAsync();
      if (status !== 'granted') {
        console.log('请开启麦克风权限');
        return;
      }
      return;
    }

    if (cameraRef.current) {
      console.log('开始录像');
      let photo = await cameraRef.current.recordAsync();
      console.log('视频地址', photo.uri);

      compressionVideoUri(photo.uri);
    }
  };

  const stopVideo = async () => {
    if (cameraRef.current) {
      console.log('停止录像');
      cameraRef.current.stopRecording();
    }
  };

  const compressionVideoUri = async (uri: string) => {
    const result = await Video.compress(
      uri,
      {
        compressionMethod: 'auto',
      },
      progress => {
        console.log('Compression Progress: ', progress);
      },
    );
    console.log('压缩视频', result);
    uriList.push(result);
    setLastVideoURI(result);
    openCameraShow();
    startVideo(result);
  };

  const compressionUri = async (uri: string) => {
    const result = await Image.compress(uri, {
      compressionMethod: 'auto',
    });
    console.log('压缩图片', result);
  };

  const videoAv = React.useRef(null);

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

  const startVideo = (uriShow: string) => {
    console.log('播放视频', uriShow);
    if (uriShow) {
      // videoAv.current.loadAsync(uriShow);
    }
  };

  const _onLoadStart = () => {
    console.log('ON LOAD START');
  };

  const _onLoad = status => {
    console.log('ON LOAD :', JSON.stringify(status));
  };

  const _onError = error => {
    console.log('ON ERROR :', error);
  };

  const _onFullscreenUpdate = event => {
    console.log('FULLSCREEN UPDATE :', JSON.stringify(event.fullscreenUpdate));
  };

  const _onReadyForDisplay = event => {
    const widestHeight =
      (DEVICE_WIDTH * event.naturalSize.height) / event.naturalSize.width;
    if (widestHeight > VIDEO_CONTAINER_HEIGHT) {
      // this.setState({
      //   videoWidth:
      //     (VIDEO_CONTAINER_HEIGHT * event.naturalSize.width) /
      //     event.naturalSize.height,
      //   videoHeight: VIDEO_CONTAINER_HEIGHT
      // });
    } else {
      // .setState({
      //   videoWidth: DEVICE_WIDTH,
      //   videoHeight:
      //     (DEVICE_WIDTH * event.naturalSize.height) / event.naturalSize.width
      // });
    }
  };

  useEffect(() => {
    init();
  });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={[backgroundStyle, styles.view]}>
      {openCamera ? (
        <Camera
          style={styles.camera}
          type={type}
          ref={cameraRef}
          onMountError={onMountError}
          onCameraReady={onCameraReady}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={openCameraShow}>
              <Text style={styles.text}>Close Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
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
              <Text style={{fontSize: 30, color: 'blue', alignSelf: 'center'}}>
                📸拍照
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',

                marginTop: 10,
              }}
              onPress={() => {
                takeVideo();
              }}>
              <Text style={{fontSize: 30, color: 'blue', alignSelf: 'center'}}>
                📸录像
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',

                marginTop: 10,
              }}
              onPress={() => {
                stopVideo();
              }}>
              <Text style={{fontSize: 30, color: 'blue', alignSelf: 'center'}}>
                停止录像
              </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <View style={styles.view}>
          <TouchableOpacity
            style={styles.buttonCenter}
            onPress={openCameraShow}>
            <Text style={styles.text}>Open Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonCenter} onPress={startVideo}>
            <Text style={styles.text}>播放视频</Text>
          </TouchableOpacity>
          <VideoAv
            ref={videoAv}
            source={{uri: lastVideoURI}}
            style={styles.video}
            onLoadStart={_onLoadStart}
            onLoad={_onLoad}
            onError={_onError}
            onFullscreenUpdate={_onFullscreenUpdate}
            onReadyForDisplay={_onReadyForDisplay}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
          />
        </View>
      )}
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
    backgroundColor: 'blue',
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
