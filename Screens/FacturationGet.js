import {React,useState,useEffect} from 'react';
import {Alert,View,Text,Image,SafeAreaView,TextInput,Button, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import { Icon } from 'react-native-elements';
import * as RNFS from 'react-native-fs';
import { DataTable,Provider } from 'react-native-paper';


export default function FacturationGet({navigation})
{
    const[date,setDate] = useState('');
    const[client_id,setClient_id]=useState(0);
    const[products,setProducts]=useState([]);
    const[token,setToken]=useState('');
    const[total,setTotal]=useState(0);
    const path = RNFS.DocumentDirectoryPath + '/token.txt';
    const config = {
        headers: { Authorization: token }
    };

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
                        }).catch(error=>{
                            console.info(error);
                        })
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