import {React,useState,useEffect,} from 'react';
import { useRoute } from "@react-navigation/native";
import {Alert,View,Text,Image,SafeAreaView,TextInput,Button, StyleSheet, TouchableOpacity} from "react-native";
import axios from 'axios';
import { Icon } from 'react-native-elements';
import { COMMANDS,BLEPrinter,ColumnAlignment } from 'react-native-thermal-receipt-printer-image-qr';

// import { USBPrinter, NetPrinter, BLEPrinter } from 'react-native-thermal-receipt-printer';

export default function ClientAdd({navigation})
{
    
    const[username,setUsername]=useState('');
    const token = useRoute().params.token;
    const[id,setId]=useState(0);
    
    const image=require('./logosvg/logo.jpg');
    const config = {
        headers: { Authorization: token }
    };
    return(
        <SafeAreaView style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <View style={{padding:20}}>
                <View style={{alignItems:"center",alignContent:"center"}}>
                    <Image
                        source={image}
                        style={{width:300,height:300,backgroundColor:"#FFF",borderWidth:1,borderColor:"#FFF"}}
                    />
                </View>
                <Text style={{color:"#333",fontSize:20,fontWeight:500,margin:10}}>create new client</Text>
                <View style={{flexDirection:"row",borderBottomColor:"#666",borderBottomWidth:1, padding:5}}>
                    <Icon name="user" size={20} type="font-awesome" style={{marginTop:15}} />
                    <TextInput 
                        
                        style={styles.TextInput} 
                        placeholder="username"
                        placeholderTextColor="black"
                        onChangeText={setUsername}
                        value={username}
                    />
                </View>
                <View style={{marginTop:10,flexDirection:"row",padding:5,alignItems:'center',alignSelf:'center'}}>
                    <TouchableOpacity style={styles.Button}
                    onPress={()=>{
                        axios.post('https://spa-fq2z.onrender.com/api/v1/client/add',
                        {
                            name:username
                        },config)
                        .then(response=>{
                            const id=response.data.id
                            Alert.alert(`client \t ${username} \t added with number ${id}`);
                            setUsername('');
                            const o = Number(id);
                            setId(o);
                            const BOLD_ON = COMMANDS.TEXT_FORMAT.TXT_BOLD_ON;
                    
                
                                const printer = {
                                    device_name: "BluetoothPrint",
                                    inner_mac_address: "66:11:22:33:44:55"
                                  };
                                  BLEPrinter.init();
                                  BLEPrinter.connectPrinter(printer.inner_mac_address);
                                  
                                  BLEPrinter.printBill(`${BOLD_ON} ${id}`);
                              
                //             BLEPrinter.init();
                // BLEPrinter.getDeviceList()
                // .then(devices=>{
                //     console.log(devices);
                // });
                // const printer = {
                //     device_name: "BluetoothPrint",
                //     inner_mac_address: "66:11:22:33:44:55"
                //   };
                //   BLEPrinter.connectPrinter(printer.inner_mac_address);
                // //   BLEPrinter.printText(`\n \n \n \n \n \n \n \n \n \n ${id} \n \n \n \n \n \n \n \n \n \n`);
                //   BLEPrinter.printBill(`<C> HELLOOOOOOO ${id}</C>`)

                        })
                        .catch(error=>{
                            console.info(error);
                        })
                    }}>
                        <Text style={{textAlign:"center",textAlignVertical:"center",marginTop:6,color:"#FFF"}}>ADD</Text>
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