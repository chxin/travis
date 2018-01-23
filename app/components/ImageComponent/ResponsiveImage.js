import React,{Component} from 'react';
var Device = require('./device');
var {
  ImageBackground
} = require('react-native');

// var ResponsiveImage = React.createClass({
//     setNativeProps: function(nativeProps) {
//         this._root.setNativeProps(nativeProps);
//     },
//     render: function () {
//         var width = Math.ceil(this.props.initWidth * Device.scale);
//         var height = Math.ceil(this.props.initHeight * Device.scale);
//         return (
//             <Image style={[{width:width,height: height}, this.props.style]}
//                    source={this.props.source}
//                    resizeMode={this.props.resizeMode}
//                    ref={component => this._root = component}>
//                 {this.props.children}
//             </Image>
//         );
//     }
// });
//
// module.exports = ResponsiveImage;


export default class TransformableImage extends Component {
  setNativeProps(nativeProps) {
      this._root.setNativeProps(nativeProps);
  }
  render() {
      var width = Math.ceil(this.props.initWidth * Device.scale);
      var height = Math.ceil(this.props.initHeight * Device.scale);
      return (
          <ImageBackground style={[{width:width,height: height}, this.props.style]}
                 source={this.props.source}
                 resizeMode={this.props.resizeMode}
                 ref={component => this._root = component}>
              {this.props.children}
          </ImageBackground>
      );
  }
}
