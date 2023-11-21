/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  NativeModules,
  Image,
} from 'react-native';

import {Camera, CameraType} from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import {Video as VideoAv, ResizeMode} from 'expo-av';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';

class CameraOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraPermission: false,
      microphonePermission: false,
    };
  }

  async componentDidMount() {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    const microphonePermission = await Camera.getMicrophonePermissionStatus();
    console.log('权限', cameraPermission, microphonePermission);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    this.setState({cameraPermission, microphonePermission, backgroundStyle});
  }

  openCameraShow = () => {
    if (this.state.isOpenCamera) {
      this.setState({isOpenCamera: false});
    } else {
      this.setState({isOpenCamera: true});
    }
  };

  toggleCameraType = () => {
    this.setState({
      type:
        this.state.type === CameraType.back
          ? CameraType.front
          : CameraType.back,
    });
  };

  onMountError = () => {
    console.log('camera回调出错');
  };
  onCameraReady = () => {
    console.log('camera  相机预览时调用的回调');
  };

  takePhoto = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      console.log('图片地址', photo.uri);
    }
  };

  takeVideo = async () => {
    if (!this.microphonePermission) {
      const {status} = await Camera.requestMicrophonePermissionsAsync();
      if (status !== 'granted') {
        console.log('请开启麦克风权限');
        return;
      }
    }

    if (this.camera) {
      console.log('开始录像');
      let photo = await this.camera.recordAsync();
      console.log('视频地址', photo.uri);
      this.setState({videoUri: photo.uri});
    }
  };

  stopVideo = async () => {
    if (this.camera) {
      console.log('停止录像');
      this.camera.stopRecording();
    }
  };

  startVideo = uriShow => {
    console.log('播放视频', uriShow);
    if (uriShow) {
      this.videoAv.loadAsync(uriShow);
    }
  };

  onLoadStart = () => {
    console.log('ON LOAD START');
  };

  onLoad = status => {
    console.log('ON LOAD :', JSON.stringify(status));
  };

  onError = error => {
    console.log('ON ERROR :', error);
  };

  onFullscreenUpdate = event => {
    console.log('FULLSCREEN UPDATE :', JSON.stringify(event.fullscreenUpdate));
  };

  fps = async () => {
    const imgPath = 
      `${FileSystem.documentDirectory}ENT_FILE/image/local/${Date.now()}.png`;

    const url =
      'https://lan-storage.sdndc.cn/35/70/ab/67/7b/86930b8ea4f2cd4cad0ae5e53caae59b.mp4?e=-S14kqnCScb_rEMzTSRKZw&z=1700575195';

    this.getfps(url, imgPath, '00:00:15.20');
  };

  /**
   * 通过视频截取视频帧
   * @param {视频地址} uri
   * @param {输出视频帧地址} imgPath
   * @param {视频帧时间 00:00:01.00} time
   */
  getfps = async (uri, imgPath, time) => {
    console.log('视频地址 ', uri);
    console.log('视频帧地址 ', imgPath);
    console.log('视频帧时间 ', time);

    FFmpegKit.executeAsync(
      `-ss ${time} -i ${uri} -vframes 1  ${imgPath}`,
      async session => {
        const returnCode = await session.getReturnCode();
        console.log('视频帧 returnCode', returnCode);
        if (ReturnCode.isSuccess(returnCode)) {
          // SUCCESS
          console.log('视频帧 SUCCESS', imgPath);
          this.setState({imgPath});
        } else if (ReturnCode.isCancel(returnCode)) {
          // CANCEL
          console.log('视频帧 CANCEL');
        } else {
          // ERROR
          console.log('视频帧 ERROR');
        }
      },
    );
  };

  render() {
    const {
      cameraPermission,
      backgroundStyle,
      isOpenCamera,
      type,
      videoUri,
      imgPath,
    } = this.state;
    if (!cameraPermission) {
      return (
        <View style={[backgroundStyle, styles.view]}>
          {isOpenCamera ? (
            <View style={styles.view}>
              <Camera
                style={styles.camera}
                type={type}
                ref={ref => {
                  this.camera = ref;
                }}
                onMountError={this.onMountError}
                onCameraReady={this.onCameraReady}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.openCameraShow}>
                  <Text style={styles.text}>Close Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.toggleCameraType}>
                  <Text style={styles.text}>Flip Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10,
                  }}
                  onPress={() => {
                    this.takePhoto;
                  }}>
                  <Text
                    style={{fontSize: 30, color: 'blue', alignSelf: 'center'}}>
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
                    this.takeVideo();
                  }}>
                  <Text
                    style={{fontSize: 30, color: 'blue', alignSelf: 'center'}}>
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
                    this.stopVideo();
                  }}>
                  <Text
                    style={{fontSize: 30, color: 'blue', alignSelf: 'center'}}>
                    停止录像
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.view}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.openCameraShow}>
                <Text style={styles.text}>Open Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonCenter}
                onPress={() => {
                  this.startVideo(videoUri);
                }}>
                <Text style={styles.text}>播放视频</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonCenter}
                onPress={() => {
                  this.fps();
                }}>
                <Text style={styles.text}>截取视频帧</Text>
              </TouchableOpacity>
              <VideoAv
                ref={ref => {
                  this.videoAv = ref;
                }}
                source={{uri: videoUri}}
                style={styles.video}
                onLoadStart={this.onLoadStart}
                onLoad={this.onLoad}
                onError={this.onError}
                onFullscreenUpdate={this.onFullscreenUpdate}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping={false}
              />
              <Image
                style={{
                  height: 150,
                  width: 200,
                  backgroundColor: '#f0f0f0',
                  alignSelf: 'center',
                }}
                source={{uri: imgPath}}
              />
            </View>
          )}
        </View>
      );
    }
  }
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

export default CameraOne;
