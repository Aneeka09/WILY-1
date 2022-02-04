
import React from 'react';
import { StyleSheet, Text,View,Image } from 'react-native';
import Transaction from './screens/transaction'
import Search from './screens/search'
import {createBottomTabNavigator} from "react-navigation-tabs";
import {createAppContainer,createSwitchNavigator}from "react-navigation";
import LoginScreen from "./screens/login"
export default class App extends React.Component{
  render(){
  return (
    <AppContainer/>
  );
  }
}
const TabNavigator= createBottomTabNavigator({
  Transaction:Transaction,
  Search:Search
},{
defaultNavigationOptions:({navigation})=>({
  tabBarIcon:()=>{
    const routeName=navigation.state.routeName
    if(routeName==="Transaction"){
      return(
        <Image source={require("./assets/book.png")} style={{width:50,height:50}}></Image>
      )
    }
    else if(routeName==="Search"){
      return(
        <Image source={require("./assets/searchingbook.png")} style={{width:50,height:50}}></Image>
      )
    }
  }
})
})
const switchNavigator = createSwitchNavigator({
  LoginScreen:{screen: LoginScreen},
  TabNavigator:{screen: TabNavigator}
  })
const AppContainer= createAppContainer(switchNavigator)
