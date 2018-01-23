'use strict'

import React,{Component} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import TitleComponent from './TitleComponent.js';
import SelectorButton from './SelectorButton';
import {GRAY} from '../../styles/color.js';

export default class StatableSelectorGroup extends Component{
  constructor(props){
    super(props);

  }
  _selectedIndexChanged(index){

    this.props.onChanged(index)
  }
  _getContent(){

    var rows = Math.ceil(this.props.data.length / 3);//3 items in one row
    var roundRows = this.props.data.length / 3;
    var list = Array(rows).fill(1).map((item1,index1) => {
      var arr = this.props.data.slice(3*index1,3*index1+3);
      if(arr.length !== 3){
        arr = arr.concat(Array(3-arr.length).fill(null));
      }
      return (
        <View key={index1} style={{flex:1,flexDirection:'row',marginBottom:8}}>
          {
            arr.map((item,index)=>{
              var realIndex = 3*index1 + index;
              var marginRight = null;
              // console.warn(realIndex,index,index1);
              if(index % 3 !== 2){
                marginRight = {marginRight:17};
              }
              if (index1===rows-1 && this.props.data.length%3===1) {
                // console.warn('last rows',index1,rows);
                marginRight = {marginRight:40};
              }
              return (
                <SelectorButton
                  key={index}
                  style={marginRight}
                  text={item}
                  selected={this.props.selectedIndexes.includes(realIndex)}
                  onClick={()=>this._selectedIndexChanged(realIndex)} />
              )
            })
          }
        </View>
      )
    });

    return (
      <View style={styles.itemContainer}>
        {list}
      </View>);

  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.warn('nextProps',nextProps.selectedIndexes);
    if(nextProps.selectedIndexes === this.props.selectedIndexes){
      return false;
    }
    return true;
  }

  render() {

    return (
      <TitleComponent title={this.props.title}>
        {this._getContent()}
      </TitleComponent>

    );
  }
}

StatableSelectorGroup.propTypes = {
  title:PropTypes.string,
  text:PropTypes.string,
  data:PropTypes.array,
  selectedIndexes:PropTypes.object,//immutable
  onChanged:PropTypes.func,
}


var styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'column'
  },
  titleText:{
    fontSize:12,
    color:GRAY
  },
  inputWrapper:{
    borderColor:'gray',
    borderWidth:1,
  },
  itemContainer:{
    // backgroundColor:GRAY
  },

});
