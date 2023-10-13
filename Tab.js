import ClientAdd from './Screens/ClientAdd';
import FacturationGet from './Screens/FacturationGet';
import Login from './Screens/Login';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const T = createBottomTabNavigator();
export default function Tab()
{
    return(
        <NavigationContainer>
        
            <T.Navigator
                initialRouteName='login'
                screenOptions={({route})=>({
                tabBarIcon:({focused,color,size})=>{
                let iconName;
                let rn=route.name;
                if(rn === 'login')
                {
                    iconName=focused?'laptop':'laptop-outline'
                }
                if(rn === 'client')
                {
                    iconName=focused?'home':'home-outline'
                }
                else if(rn === 'facturation')
                {
                    iconName=focused?'list':'list-outline'
                }
                return <Ionicons name={iconName} size={size} color={color}/>
                },
                headerShown:false

                })}>

                <T.Screen name="login" component={Login}/>
                <T.Screen name="client" component={ClientAdd} />
                <T.Screen name="facturation" component={FacturationGet} />
      </T.Navigator>
      </NavigationContainer>
        
    )
}