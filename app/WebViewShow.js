import React from 'react';
import {Text, View, TouchableOpacity, StatusBar} from 'react-native';
import {WebView} from 'react-native-webview';

class WebViewShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraPermission: false,
      url: '',
    };
  }

  async componentDidMount() {
    this.props.navigation.setOptions({title: '远程控制'});
    const {navigation, route} = this.props;
    const {url} = route.params;
    console.log('url', url);
    this.setState({url});
  }

  takePhoto = async () => {
    const pic = await this.camera.takePhoto();
    console.log('pic', pic);
  };

  render() {
    const {url} = this.state;
    console.log('url', url);
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#112233',
          height: '100%',
          width: '100%',
        }}>
        <WebView
          style={{backgroundColor: '#112233'}}
          bounces={false}
          overScrollMode="never"
          source={{uri: url}}
        />
        <StatusBar
          backgroundColor="#ff0000"
          translucent={true}
          hidden={true}
          animated={true}
        />
      </View>
    );
  }
}

export default WebViewShow;
