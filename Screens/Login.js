import {React,useState,useEffect,} from 'react';
import { useRoute } from "@react-navigation/native";
import {Alert,View,Text,Image,SafeAreaView,TextInput,Button, StyleSheet, TouchableOpacity} from "react-native";
import axios from 'axios';
import { Icon } from 'react-native-elements';
import { USBPrinter, NetPrinter, BLEPrinter } from 'react-native-thermal-receipt-printer';

// import printer from 'react-native-pos-printer';

export default function Login({navigation})
{
    const[online,setOnline]=useState(false);
    const[username,setUsername]=useState('');
    const[password,setPassword]=useState('');
    const[jwtToken,setJwtToken]=useState('');
    const[error,setError]=useState(false);
    const image=require('./logosvg/logo.jpg');
    var RNFS = require('react-native-fs');
    var path = RNFS.DocumentDirectoryPath + '/token.txt';

    const config = {
        headers: { Authorization: jwtToken }
    };

    useEffect(()=>{
        axios.get("https://spa-fq2z.onrender.com/api/v1/auth/user/get",config)
        .then(response=>{
            setOnline(response.data);
        })
        .catch(error=>{
            console.info(error);
        })
    })

    
    return(
        
        <SafeAreaView style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        <View style={{padding:20}}>
            <View style={{alignItems:"center",alignContent:"center"}}>
                <Image
            source={image}
            style={{width:300,height:300,backgroundColor:"#FFF",borderWidth:1,borderColor:"#FFF"}}/>
            </View>

            <Text style={{color:"#333",fontSize:20,fontWeight:500,margin:10}}>Login</Text>
            <View style={{flexDirection:"row",borderBottomColor:"#666",borderBottomWidth:1, padding:5}}>
                <Icon name="user" size={20} type="font-awesome" style={{marginTop:15}} />
                <TextInput 
                editable={online?false:true}
                style={styles.TextInput} 
                placeholder={error? "wrong credentials":"username"} 
                placeholderTextColor={error? "red":"black"}  
                onChangeText={setUsername}
                value={username}/>
            </View>
            <View style={{flexDirection:"row",borderBottomColor:"#666",borderBottomWidth:1, padding:5}}>
                <Icon name="lock" size={20} type="font-awesome" style={{marginTop:15}} />
                <TextInput 
                editable={online?false:true}
                style={styles.PasswordInput} 
                placeholder={error? "wrong credentials":"password"} 
                placeholderTextColor={error? "red":"black"} 
                secureTextEntry 
                onChangeText={setPassword}
                value={password}/>
            </View>
            <View style={{marginTop:10,flexDirection:"row",padding:5,alignItems:'center',alignSelf:'center'}}>
                <TouchableOpacity onPress={()=>{
                    BLEPrinter.init()
                    .then(()=>{
                        BLEPrinter.getDeviceList()
                        .then(devices=>{
                            console.log(devices);
                        })
                        .catch(error=>{
                            console.log(error);
                        })
                    })
                    
                    axios.post("https://spa-fq2z.onrender.com/api/v1/auth/cashier/login",
                    {
                        username:username,
                        password:password
                    })
                    .then(response=>{
                        response.data.accessToken.length > 20? navigation.navigate('client',{token:response.data.tokenType+response.data.accessToken}) : void(0);
                        setJwtToken(response.data.tokenType+response.data.accessToken);
                        RNFS.writeFile(path,response.data.tokenType+response.data.accessToken , 'utf8')
                            .then((success) => {
                                console.log('FILE WRITTEN!');
                                console.log(path);
                            })
                            .catch((err) => {
                                console.log(err.message);
                            });

                        setOnline(true);
                        console.log(jwtToken);
                        // setJwtToken("Bearer "+response.data.accessToken);
                        // console.log("jwt:\t"+jwtToken);
                        
                    })
                    .catch(error=>{
                        setError(true);
                        console.info(error);
                    })
                }}
                style={styles.Button}>
                    <Text style={{textAlign:"center",textAlignVertical:"center",marginTop:6,color:"#FFF"}}>Test Print</Text>
                </TouchableOpacity>
            </View>
            
            
        </View>
    </SafeAreaView>
)
}
const styles = StyleSheet.create({
TextInput:{
    marginLeft:5,
    color:"black",
    fontSize:12,
    fontStyle:"italic",
    width:"90%"
    
},
PasswordInput:{
    marginLeft:5,
    color:"black",
    fontSize:12,
    fontStyle:"italic",
    width:"90%"
    
},
Button:{
    backgroundColor:"#7D480B",
    borderColor:"#7D480B",
    borderWidth:1,
    borderRadius:20,
    width:80,
    height:40,
    alignSelf:"center",
    alignItems:"center",
    alignContent:"center",
    textAlign:"center",
    textAlignVertical:"center"
}
})