import {React,useState,useEffect} from 'react';
import {Alert,View,Text,Image,SafeAreaView,TextInput,Button, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import { Icon } from 'react-native-elements';
import * as RNFS from 'react-native-fs';
import { DataTable,Provider } from 'react-native-paper';
// import { USBPrinter, NetPrinter, BLEPrinter} from 'react-native-thermal-receipt-printer';
import { COMMANDS,BLEPrinter,ColumnAlignment } from 'react-native-thermal-receipt-printer-image-qr';
import RNFetchBlob from 'rn-fetch-blob';


export default function FacturationGet({navigation})
{
    const[date,setDate] = useState('');
    const[facture,setFacture]=useState('');
    const[client_id,setClient_id]=useState(0);
    const[products,setProducts]=useState([]);
    const[token,setToken]=useState('');
    const[total,setTotal]=useState(0);
    
    const path = RNFS.DocumentDirectoryPath + '/token.txt';
    const config = {
        headers: { Authorization: token }
    };
    const toPrint=()=>{
        
            return(
                <View>
                    <DataTable style={{}}>
<Text style={{color:"black"}}>
       Total:  {total}XAF
      </Text>
      <DataTable.Header style={{marginHorizontal:5}}>
        <DataTable.Title> <Text style={{color:"black"}}>Name</Text></DataTable.Title>
        <DataTable.Title numeric ><Text style={{color:"black"}}>Cost</Text></DataTable.Title>
        <DataTable.Title numeric ><Text style={{color:"black"}}>Date</Text></DataTable.Title>
        <DataTable.Title numeric><Text style={{color:"black"}}>Client id</Text></DataTable.Title>
        <DataTable.Title numeric><Text style={{color:"black"}}>employee id</Text></DataTable.Title>
      </DataTable.Header>
      {products.slice(from, to).map((p) => (
        <DataTable.Row key={p.id} style={{marginHorizontal:10,padding:15}}>
          <DataTable.Cell > <Text style={{color:"black"}}>{p.name}</Text></DataTable.Cell>
          <DataTable.Cell numeric><Text style={{color:"black"}}>{p.cost}</Text></DataTable.Cell>
          <DataTable.Cell numeric><Text style={{color:"black"}}>{p.dateTime}</Text></DataTable.Cell>
          <DataTable.Cell numeric><Text style={{color:"black"}}>{p.client_id}</Text></DataTable.Cell>
          <DataTable.Cell numeric><Text style={{color:"black"}}>{p.employee_id}</Text></DataTable.Cell>
        </DataTable.Row>
      ))}
      </DataTable>
                </View>
            )
    }
    

    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([2, 3, 4]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
   );
   
   const from = page * itemsPerPage;
   const to = Math.min((page + 1) * itemsPerPage, products.length);

   useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  function getFacturation()
  {
    RNFS.readFile(path, 'utf8')
                        .then((result) => {
                          
                          setToken(result);
                          console.log(token);
                        })
                        .catch((err) => {
                          console.log(err.message, err.code);
                        });

                        axios.get(`https://spa-fq2z.onrender.com/api/v1/facturation/${Number(client_id)}/see/${date}`,config)
                        .then(response=>{
                            
                            console.log(response.data.products);
                            setProducts(response.data.products);
                            setTotal(response.data.total);
                           
                            const fs = RNFetchBlob.fs;
                            let imagePath = null;

                            RNFetchBlob.config({
                              fileCache: true
                            })
                              .fetch("GET", "https://i.postimg.cc/dV1cRh6c/logo.jpg")
                              .then(resp => {
                                imagePath = resp.path();
                                // console.log(imagePath)

                                
                                return resp.readFile("base64");
                                
                              })
                              .then(base64Data => {
                                // console.log("image in base64"+base64Data);
                                
                                // BLEPrinter.printImageBase64(base64Data,{imageWidth:300,imageHeight:300});
                                return fs.unlink(imagePath);
                              });
                        
                            const BOLD_ON = COMMANDS.TEXT_FORMAT.TXT_BOLD_ON;
                            const TEXT_SIZE=COMMANDS.TEXT_FORMAT.TXT_WIDTH[1];
                            const BOLD_OFF = COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF;
                            
                              let columnAlignment = [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT];
                              let columnWidth = [46 - (7 + 12), 6,6]
                              const header = ['Product \t', 'Price \t','Date \t']
                                        const printer = {
                                            device_name: "BluetoothPrint",
                                            inner_mac_address: "66:11:22:33:44:55"
                                          };
                                          
                                          BLEPrinter.init();
                                          BLEPrinter.connectPrinter(printer.inner_mac_address);
                                          
                                            // BLEPrinter.printImageBase64("iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACwElEQVR4nO2YT4hPURTHr3PmmYU/oSQWdiLlX5KFUogyIvmz8Cf5t8SGrGQWiixFGqWI/Oac22gkZkWyU6SRKAsiJZphfr93zhsy+T2950emZqb3e/e9N5v3qbt7797zPefce889xpSUlJSUlJQkxNbmI+kFZH2NJAGy1oDlObKcMbd19ki/eBVZbFzATt1o2kNwmqQ9hMhIJBlC1nDEQSpAejj+/k7fFCR/O7A+QtKL6Re2XyYjaTXymov9SHJlVMN5+ACSZ8jy848o+WRsdYbDwtr2n4cuGxtis3OAld1JjcfhEen3rC41t6rTsVPWpRIAVo4M8w7L3aY8EoYTkORt88bLELB2AetjJP3qWVmUTgDLsREm/4hW1if5v4WCFam8z3+HfEcbbDFpQQo2j5qrLN2my18wpgNIDzgI6Gshf5VxIj4NVMYIdR1I7kVCTU/YmiiCSTczyy6TBY1zO8mitUbenkAra01XbR6w7E0dgU5/WyYCzI1wErK+ccvlNAJ0g7PtQLIHSPd5FV0GLL1FCvDSnjyj5jDJYGECSOpR5J0FRBdJ4anD8SX2ymQFsDwpXoR0ZCbAs8Hyf7VJcRFoM1mCJDsLE0Hab2w40WRNVBYAy9P8Bcg5kwdIwVa0uglJriHJj5yMHzSVYE5OAvRSAZv3vMkN689E1s85ps4Hc7N/an4Con1QCVYi67ccPP8raYnuTlSkkT7MUgBYPW2KJrofgLQdWB84ps716OVWuIBoUWA9iKQDTsbb5t/ZbvSErWB1P7C+cDC8DqSncvW8R7okSpMW8lej9XcA6UlguY+kvmPKvEOSNSZ3ugemIcvZRgctg2NSq7HXsyiTm6Iis4DkOLC+THXCsPQCydHIIWbcsf5CsHoISa7GZXbU84k7d1KP7weS93E7kKUjbhPawbnjbXJJSUlJSUmJyZHfxnHsrRJKPnUAAAAASUVORK5CYII=");
                                            // BLEPrinter.printText(`<img src="https://i.postimg.cc/LnrW26Gx/logo.jpg">`);
                                            BLEPrinter.printText("---------------");
                                          BLEPrinter.printText("Product \t \t \t \t \t Price \t \t Date \t");
                                          for (var i in products) {
                                            const p =products[i];
                                            BLEPrinter.printText("|"+p.name +"|"+ p.cost+"FCFA"+ "|"+ p.dateTime+"|");
                                            BLEPrinter.printText("\n \n \n");
                                            console.log("name of the product is"+p.name);
                                            
                                          
                                          
                                          }
                                          
                                          BLEPrinter.printText("<B>Total:"+total+"FCFA </B>");
                                          BLEPrinter.printText("----------------");


                        }).catch(error=>{
                            console.info(error);
                        })
                        return products;
  }


    return(
        <SafeAreaView>
            <View>
                <Calendar
                onDayPress={day=>{
                    setDate(day.dateString);
                    Alert.alert(day.dateString);
                    console.log(day.dateString);
                }}/>
            </View>
            
            <View style={{flexDirection:"row",borderColor:"#666",borderWidth:1, padding:5,
             marginVertical:30,marginHorizontal:20,borderRadius:30,width:"30%"}}>
                    <Icon name="user" size={20} type="font-awesome" style={{marginTop:15}} />
                    <TextInput
                        keyboardType='numeric' 
                        style={styles.TextInput} 
                        placeholder="client code"
                        placeholderTextColor="black"
                        onChangeText={setClient_id}
                        value={client_id}
                    />
            </View>
            <View style={{marginTop:0,flex:0,padding:5,alignItems:'center',alignSelf:'center'}}>
                    <TouchableOpacity style={styles.Button}
                    onPress={()=>{
                        getFacturation();
                        // const printBill = () => {
                        //     const data =  getFacturation();
                            
                        //     // Format data into table format
                        //     let table = '';
                        //     data.forEach((item, index) => {
                        //       table += "\n \n \n \n \n \n"+`${index+1}. ${item.name} - ${item.dateTime}\n`;
                        //     });
                          
                        //     // Print table using BLEPrinter
                        //     BLEPrinter.printBill(table);
                        //   }
                        //   printBill();
                    }}>
                        <Text style={{textAlign:"center",textAlignVertical:"center",marginTop:6,color:"#FFF"}}>Get Products</Text>
                    </TouchableOpacity>
                </View>
                

                <ScrollView showsVerticalScrollIndicator>
                <DataTable style={{}}>
<Text style={{color:"black"}}>
       Total:  {total}XAF
      </Text>
      <DataTable.Header style={{marginHorizontal:5}}>
        <DataTable.Title> <Text style={{color:"black"}}>Name</Text></DataTable.Title>
        <DataTable.Title numeric ><Text style={{color:"black"}}>Cost</Text></DataTable.Title>
        <DataTable.Title numeric ><Text style={{color:"black"}}>Date</Text></DataTable.Title>
        <DataTable.Title numeric><Text style={{color:"black"}}>Client id</Text></DataTable.Title>
        <DataTable.Title numeric><Text style={{color:"black"}}>employee id</Text></DataTable.Title>
      </DataTable.Header>
      {products.slice(from, to).map((p) => (
        <DataTable.Row key={p.id} style={{marginHorizontal:10,padding:15}}>
          <DataTable.Cell > <Text style={{color:"black"}}>{p.name}</Text></DataTable.Cell>
          <DataTable.Cell numeric><Text style={{color:"black"}}>{p.cost}</Text></DataTable.Cell>
          <DataTable.Cell numeric><Text style={{color:"black"}}>{p.dateTime}</Text></DataTable.Cell>
          <DataTable.Cell numeric><Text style={{color:"black"}}>{p.client_id}</Text></DataTable.Cell>
          <DataTable.Cell numeric><Text style={{color:"black"}}>{p.employee_id}</Text></DataTable.Cell>
        </DataTable.Row>
      ))}
      <DataTable.Pagination
        page={page}
        
        numberOfPages={Math.ceil(products.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${products.length}`}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        showFastPaginationControls
        selectPageDropdownLabel={'Rows per page'}
      />
      
</DataTable>

                </ScrollView>



{/* <ScrollView horizontal>


                <SafeAreaView
                style={{width:"100%"}}
                vertical
                >
                    <Text style={{color:"black"}}>
                       Total: {total} FCFA
                    </Text>
                {
                    products.map((p,index)=>{
                        return(
                            <SafeAreaView style={{flexDirection:"row",padding:5}} key={index}>
                                
                                <View style={{borderWidth:1,borderColor:"black",padding:5,marginHorizontal:2}}>
                                    <Text style={{color:"black"}}>
                                       Product Name: {p.name}
                                    </Text>
                                </View>
                                <View style={{borderWidth:1,borderColor:"black",padding:5,marginHorizontal:2}}>
                                    <Text style={{color:"black"}}>
                                       Product Cost: {p.cost} FCFA
                                    </Text>
                                </View>
                                <View style={{borderWidth:1,borderColor:"black",padding:5,marginHorizontal:2}}>
                                    <Text style={{color:"black"}}>
                                        Date: {p.dateTime}
                                    </Text>
                                </View>
                                <View style={{borderWidth:1,borderColor:"black",padding:5,marginHorizontal:2}}>
                                    <Text style={{color:"black"}}>
                                      Client id:  {p.client_id}
                                    </Text>
                                </View>
                                <View style={{borderWidth:1,borderColor:"black",padding:5,marginHorizontal:2}}>
                                    <Text style={{color:"black"}}>
                                      Employee id:  {p.employee_id}
                                    </Text>
                                </View>
                               
                                
                            </SafeAreaView>
                        )
                    })
                }
                </SafeAreaView>
                </ScrollView>
                
 */}
                
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
        width:"30%",
        height:40,
        alignSelf:"center",
        alignItems:"center",
        alignContent:"center",
        textAlign:"center",
        textAlignVertical:"center"
    },
    Table:{
        color:"black"
    }
    })