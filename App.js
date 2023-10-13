import {React,useState,useEffect} from 'react';
import Tab from './Tab';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import {PaperProvider} from "react-native-paper";
import Login from './Screens/Login';
import { View } from 'react-native';
const Stack=createNativeStackNavigator();



export default function App()
{
    return(
            <PaperProvider>
                <Tab/>
            </PaperProvider>
            
        
           
    )
}
