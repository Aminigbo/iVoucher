import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider, StatusBar } from "native-base";
import Home from "./src/home";
import { createStackNavigator } from "@react-navigation/stack";
import { Color } from "./src/global-components/colors";
import Support from "./src/support/contact";
import Scan from "./src/home/scan";
import Notification from "./src/home/notifications";
import { HomeIcon, NotificationIcon, UserIcon, VoucherIcon } from "./src/global-components/icons";
import { Animated, AppState, Dimensions, PermissionsAndroid, Platform, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
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
import KycOnboarding from "./src/auth/screens/kyc-onboarding";
import BankTransfer from "./src/voucher/send-to-bank";
import SearchBanks from "./src/voucher/search-banks";
import PocketVoucherTransfer from "./src/voucher/send-to-pv";
import TransactionDetails from "./src/home/view-transaction";
import { HandleFPN } from "./src/utilities/messaging-service";
import { CreditCard, Ticket, User2 } from "lucide-react-native";
import Card from "./src/home/card";
import Voucher from "./src/voucher/voucher";
import ResolveToken from "./src/voucher/resolve-token";
import TransferScreen from "./src/voucher/amount-page";
import KYCForm from "./src/auth/screens/kyc-form";
import Persona from "./src/profile/perona";
import Address from "./src/profile/address";
import VoucherDetails from "./src/voucher/voucher-details";
import TransactionReceipt from "./src/home/receipt";
import MerchantQr from "./src/profile/merchant-qr";
import TermsAndConditions from "./src/home/terms";
import CompleteVerification from "./src/home/complete-verification";
import ClaimCard from "./src/home/claim-card";
import { appState } from "./src/state";
import CreatePin from "./src/auth/screens/create-pin";

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
    name: 'Card',
    screen: Card,
  },
];

const { width, height } = Dimensions.get('window');

function App() {


  const [isConnected, setIsConnected] = useState(false);
  const { User, Initialized } = appState()

  useEffect(() => {
    const handleConnectivityChange = isConnectedNow => {
      // console.log("Internet connection ", isConnectedNow.isConnected)
      setIsConnected(isConnectedNow.isConnected);
      if (isConnectedNow.isConnected == true) {
        // SplashScreen.hide();
      }
    };

    Platform.OS == "android" && HandleFPN();
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    // Check initial network state
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
      // console.log("Internet connection ", state.isConnected)
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
                  <User2 status={focused} />
                </>
              }
              // else if (route.name === 'Vouchers') {
              //   return <>
              //     <Ticket color="grey" status={focused} />
              //   </>
              // }
              else if (route.name === 'Cards') {
                return <>
                  <CreditCard color="grey" status={focused} />
                </>
              }

            },
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 15,
              fontWeight: 300,
              // marginBottom: Platform.OS == "ios" ? -10 : 10
            },
            tabBarStyle: [
              {
                // elevation: 2,
                // shadowColor: '#000',
                // shadowOffset: {
                //   width: 0,
                //   height: 4,
                // },
                // shadowOpacity: 0.25,
                // shadowRadius: 2,
                // backgroundColor: Colors.accent,
                height: Platform.OS === "ios" ? 75 : 65,
                // width: '85%',
                // alignSelf: 'center',
                // marginBottom: 30,
                // borderRadius: 20,
                paddingTop: Platform.OS === "ios" ? 5 : 0,
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
            }} name="Cards" component={Card} options={{ header: () => null, tabBarLabel: "Card" }} />

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
        {/* <Animated.View
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
        /> */}
      </>
    )
  }

  return <>
    {console.log(Initialized == null)}
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

          // initialRouteName="Onboarding"
          initialRouteName={Initialized == null ? "Onboarding" : "Biometrics"}
          screenOptions={({ route }) => ({
            animation: "fade_from_bottom",
            header: () => null,
            headerStyle: {
              backgroundColor: "red",
            },

          })}
        >
          <Stack.Screen name="Home" component={HomeStacks} options={{ header: () => null }} screenOptions={{ height }} />
          <Stack.Screen name="Persona" component={Persona} options={{ header: () => null }} />
          <Stack.Screen name="Address" component={Address} options={{ header: () => null }} />
          <Stack.Screen name="MerchantQr" component={MerchantQr} options={{ header: () => null }} />
          <Stack.Screen name="Voucher" component={Voucher} options={{ header: () => null }} />
          <Stack.Screen name="Voucher-details" component={VoucherDetails} options={{ header: () => null }} />
          <Stack.Screen name="Resolve-token" component={ResolveToken} options={{ header: () => null }} />
          <Stack.Screen name="Send-to-bank" component={BankTransfer} options={{ header: () => null }} />
          <Stack.Screen name="Send-to-pv" component={PocketVoucherTransfer} options={{ header: () => null }} />
          <Stack.Screen name="Transaction-receipt" component={TransactionReceipt} options={{ header: () => null }} />
          <Stack.Screen name="Amount-page" component={TransferScreen} options={{ header: () => null }} />
          <Stack.Screen name="Search-banks" component={SearchBanks} options={{ header: () => null }} />
          <Stack.Screen name="Support" component={Support} options={{ header: () => null }} />
          <Stack.Screen name="Scan" component={Scan} options={{ header: () => null }} />
          <Stack.Screen name="Notifications" component={Notification} options={{ header: () => null }} />
          <Stack.Screen name="view-transaction" component={TransactionDetails} options={{ header: () => null }} />
          <Stack.Screen name="Onboarding" component={Initialized == null ? Onboarding : Biometrics} options={{ header: () => null }} />
          <Stack.Screen name="Biometrics" component={Biometrics} options={{ header: () => null }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ header: () => null }} />
          <Stack.Screen name="kyc-onboarding" component={KycOnboarding} options={{ header: () => null }} />
          <Stack.Screen name="kyc-form" component={KYCForm} options={{ header: () => null }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ header: () => null }} />
          <Stack.Screen name="Enter-otp" component={VerifyOtpScreen} options={{ header: () => null }} />
          <Stack.Screen name="Request-otp" component={RequestOTP} options={{ header: () => null }} />
          <Stack.Screen name="Reset-pwd" component={ResetPwdScreen} options={{ header: () => null }} />
          <Stack.Screen name="service-reset-pwd" component={ServiceResetPwdScreen} options={{ header: () => null }} />
          <Stack.Screen name="terms" component={TermsAndConditions} options={{ header: () => null }} />
          <Stack.Screen name="Complete-verification" component={CompleteVerification} options={{ header: () => null }} />
          <Stack.Screen name="Claim-card" component={ClaimCard} options={{ header: () => null }} />
          <Stack.Screen name="Create-pin" component={CreatePin} options={{ header: () => null }} />
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