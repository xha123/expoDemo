import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {
  useCameraDevice,
  Camera,
  useCameraPermission,
  getCameraFormat,
} from 'react-native-vision-camera';

class CameraShow extends React.Component {
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
    this.setState({cameraPermission, microphonePermission});
  }

  takePhoto = async () => {
    const pic = await this.camera.takePhoto();
    console.log('pic', pic);
  };

  render() {
    const devices = Camera.getAvailableCameraDevices();
    const device = devices.find(d => d.position === 'back');
    const {cameraPermission} = this.state;
    if (!cameraPermission) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>没有相机权限</Text>
        </View>
      );
    }
    return (
      <View style={{flex: 1}}>
        <Text>Home Screen1</Text>
        <Camera
          ref={ref => {
            this.camera = ref;
          }}
          style={{width: '100%', height: 200}}
          device={device}
          isActive={true}
          photo={true}
        />
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity
            style={{marginTop: 10, marginBottom: 10}}
            onPress={() => {
              this.takePhoto();
            }}>
            <Text>拍照</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default CameraShow;
