import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider, StatusBar } from "native-base";
import Home from "./src/home";
import { createStackNavigator } from "@react-navigation/stack";
import { Color } from "./src/global-components/colors";
import Topup from "./src/voucher/topup";
import Merchants from "./src/voucher/add-merchant";
import Merchantprofile from "./src/voucher/merchants";
import CreateToken from "./src/voucher/create-token";
import ResolveToken from "./src/voucher/resolve-token";
import Support from "./src/support/contact";
import Scan from "./src/home/scan";
import Notification from "./src/home/notifications";
import { HomeIcon, NotificationIcon, UserIcon, VoucherIcon } from "./src/global-components/icons";
import { Animated, AppState, Dimensions, PermissionsAndroid, Platform, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import AllMerchants from "./src/voucher/all-merchants";
import Profile from "./src/profile";
import LoginScreen from "./src/auth/screens/login";
import RegisterScreen from "./src/auth/screens/signup";
import Onboarding from "./src/auth/screens/onboarding";
import VerifyOtpScreen from "./src/auth/screens/enter-otp";
import RequestOTP from "./src/auth/screens/request-otp";
import ResetPwdScreen from "./src/auth/screens/reset-pwd";
import NetInfo from '@react-native-community/netinfo';
import ServiceResetPwdScreen from "./src/support/change-password";
import SplashScreen from "react-native-splash-screen";
import Biometrics from "./src/auth/screens/biometrics";

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

const navTheme = DefaultTheme;
const Colors = Color()
navTheme.colors.background = Colors.light;

const tabs = [
  {
    name: 'Home',
    screen: Home,
  },
  {
    name: 'Search',
    screen: Home,
  },
  {
    name: 'Favorite',
    screen: Home,
  },
];

const { width, height } = Dimensions.get('window');

function App() {


  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleConnectivityChange = isConnectedNow => {
      console.log("Internet connection ", isConnectedNow.isConnected)
      setIsConnected(isConnectedNow.isConnected);
      if (isConnectedNow.isConnected == true) {
        // SplashScreen.hide();
      }
    };

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    // Check initial network state
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
      console.log("Internet connection ", state.isConnected)
    });

    return () => {
      // Unsubscribe from network state changes on component unmount
      unsubscribe();
    };
  }, []);


  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
      const permissionStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS, // Change this to the appropriate permission
        {
          title: 'Notification Permission',
          message: 'This app needs access to your notifications.',
          buttonPositive: 'OK',
        }
      );
      if (permissionStatus === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied', PermissionsAndroid.RESULTS);
        // Linking.openSettings();
      }
    } else {
      const permissionStatus = await check(PERMISSIONS.IOS.NOTIFICATIONS);
      if (permissionStatus === RESULTS.DENIED) {
        const result = await request(PERMISSIONS.IOS.NOTIFICATIONS);
        if (result === RESULTS.GRANTED) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied', permissionStatus);
        }
      } else {
        console.log('Notification permission already granted');
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);

    // RequestUserPermission()
    // requestNotificationPermission();

  }, [])





  const offsetAnimation = React.useRef(new Animated.Value(0)).current;
  const headerColor = '#fffdfb'


  const HomeStacks = () => {
    return (
      <>
        <Tab.Navigator
          // tabBar={props => <MyTabBar {...props} />}

          initialRouteName="Dashboard"
          screenOptions={({ route }) => ({
            headerStyle: {
              backgroundColor: headerColor,
            },
            tabBarIcon: ({ focused, color, size }) => {

              if (route.name === 'Dashboard') {
                return <>
                  <HomeIcon status={focused} />
                </>
              }
              else if (route.name === 'Profile') {
                return <>
                  <UserIcon status={focused} />
                </>
              }
              else if (route.name === 'Vouchers') {
                return <>
                  <VoucherIcon status={focused} />
                </>
              }

            },
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 13,
              fontWeight: 300,
              marginBottom: Platform.OS == "ios" ? -10 : 10
            },
            tabBarStyle: [
              {
                display: "flex",
                // backgroundColor:"red",
                height: Platform.OS == "ios" ? 70 : 70,
                borderTopColor: "#fff",
                elevation: 0
              },
              null
            ]
            // tabBarShowLabel: false,


          })}
        >
          <Tab.Screen name="Dashboard" component={Home} options={{ header: () => null, tabBarLabel: "Home" }}
            listeners={{
              focus: () => {
                Animated.spring(offsetAnimation, {
                  toValue: 0 * (width / tabs.length),
                  useNativeDriver: true,
                }).start();
              },
            }}
          />
          <Tab.Screen
            listeners={{
              focus: () => {
                Animated.spring(offsetAnimation, {
                  toValue: 1 * (width / tabs.length),
                  useNativeDriver: true,
                }).start();
              },
            }} name="Vouchers" component={AllMerchants} options={{ header: () => null, tabBarLabel: "Vouchers" }} />
          <Tab.Screen
            listeners={{
              focus: () => {
                Animated.spring(offsetAnimation, {
                  toValue: 2 * (width / tabs.length),
                  useNativeDriver: true,
                }).start();
              },
            }} name="Profile" component={Profile} options={{ header: () => null, tabBarLabel: "Account" }} />


        </Tab.Navigator>
        <Animated.View
          style={[
            styles.indicator,
            {
              transform: [
                {
                  translateX: offsetAnimation,
                },
              ],

            },
          ]}
        />
      </>
    )
  }

  return <>

    <StatusBar
      animated={true}
      backgroundColor={Colors.white}
      barStyle="dark-content"
    // showHideTransition={statusBarTransition}
    // hidden={hidden}
    />
    <NativeBaseProvider>
      <NavigationContainer theme={navTheme}  >
        {/* <Stack.Navigator> */}
        <Stack.Navigator
          // tabBar={props => <MyTabBar {...props} />}

          initialRouteName="Onboarding"
          screenOptions={({ route }) => ({
            header: () => null,
            headerStyle: {
              backgroundColor: "red",
            },

          })}
        >
          <Stack.Screen name="Home" component={HomeStacks} options={{ header: () => null }} />
          <Stack.Screen name="Topup" component={Topup} options={{ header: () => null }} />
          <Stack.Screen name="Merchants" component={Merchants} options={{ header: () => null }} />
          <Stack.Screen name="Merchant-profile" component={Merchantprofile} options={{ header: () => null }} />
          <Stack.Screen name="create-token" component={CreateToken} options={{ header: () => null }} />
          <Stack.Screen name="resolve-token" component={ResolveToken} options={{ header: () => null }} />
          <Stack.Screen name="Support" component={Support} options={{ header: () => null }} />
          <Stack.Screen name="Scan" component={Scan} options={{ header: () => null }} />
          <Stack.Screen name="Notifications" component={Notification} options={{ header: () => null }} />
          <Stack.Screen name="Onboarding" component={Onboarding} options={{ header: () => null }} />
          <Stack.Screen name="Biometrics" component={Biometrics} options={{ header: () => null }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ header: () => null }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ header: () => null }} />
          <Stack.Screen name="Enter-otp" component={VerifyOtpScreen} options={{ header: () => null }} />
          <Stack.Screen name="Request-otp" component={RequestOTP} options={{ header: () => null }} />
          <Stack.Screen name="Reset-pwd" component={ResetPwdScreen} options={{ header: () => null }} />
          <Stack.Screen name="service-reset-pwd" component={ServiceResetPwdScreen} options={{ header: () => null }} />

        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>

  </>

}

export default App;

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 20,
    left: width / tabs.length / 2 - 5,
    bottom: 50,
    backgroundColor: Colors.dark,
    zIndex: 100,
  },
});