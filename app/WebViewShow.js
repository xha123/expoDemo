import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';

class WebViewShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraPermission: false,
    };
  }

  async componentDidMount() {}

  takePhoto = async () => {
    const pic = await this.camera.takePhoto();
    console.log('pic', pic);
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <WebView source={{uri: 'https://192.168.1.198:8080'}} />
      </View>
    );
  }
}

export default WebViewShow;
