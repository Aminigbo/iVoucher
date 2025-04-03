import React, { useRef, useState } from "react";
import { StatusBar, View, Dimensions, TouchableOpacity, Platform, PermissionsAndroid } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { Text } from "native-base";
import { Onboarding1, Onboarding2, Onboarding3 } from "../../assets/svgs";
import { CustomButtons } from "../../global-components/buttons";
import { appState } from "../../state";

const { width } = Dimensions.get("window");

// Custom Dot Component for Indicators
const CustomDot = ({ selected }) => {
    return (
        <View
            style={{
                width: selected ? 16 : 8,
                height: 8,
                borderRadius: 4,
                marginHorizontal: 4,
                backgroundColor: selected ? "blue" : "#D0D0D0",
            }}
        />
    );
};




const OnboardingScreen = ({ navigation }) => {
    const onboardingRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);
    const { User, Initialized } = appState()


    const requestNotificationPermission = async (to) => {
        if (Platform.OS == "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                    {
                        title: 'Blake',
                        message:
                            'iVoucher needs access to ' +
                            'send you notification',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // console.log('You can use the camera');
                    to == "Login" ? navigation.replace("Login") : navigation.replace("Register")
                } else {
                    to == "Login" ? navigation.replace("Login") : navigation.replace("Register")
                    // requestNotificationPermission(to) 
                }
            } catch (err) {
                console.warn(err);
            }
        } else {
            // const permissionStatus = await check(PERMISSIONS.IOS.NOTIFICATIONS);
            // if (permissionStatus === RESULTS.DENIED) {
            //     const result = await request(PERMISSIONS.IOS.NOTIFICATIONS);
            //     if (result === RESULTS.GRANTED) {
            //         console.log('Notification permission granted');
            //     } else {
            //         console.log('Notification permission denied', permissionStatus);
            //     }
            // } else {
            //     console.log('Notification permission already granted');
            //     to == "Login" ? navigation.replace("Login") : navigation.replace("Register")
            // }
            to == "Login" ? navigation.replace("Login") : navigation.replace("Register")
        }
    };


    // return (
    return Initialized != null ? navigation.replace("Biometrics") : (
        <>
            <StatusBar barStyle="dark-content" />
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                {/* Skip Button at Top Right */}
                <TouchableOpacity
                    onPress={() => navigation.replace("Login")}
                    style={{
                        position: "absolute",
                        top: 50,
                        right: 20,
                        zIndex: 10,
                    }}
                >
                    <Text fontSize="md" color="blue.600">Skip</Text>
                </TouchableOpacity>

                <Onboarding
                    ref={onboardingRef}
                    onSkip={() => navigation.replace("Login")}
                    onDone={() => navigation.replace("Login")}
                    bottomBarHighlight={false}
                    showNext={false}
                    showSkip={false}
                    showDone={false}
                    pageIndexCallback={page => {
                        // console.log(page)
                        setCurrentPage(page)
                    }}
                    subTitleStyles={{
                        fontSize: 16,
                        fontWeight: "small",
                        color: "#000",
                        textAlign: "center",
                        marginBottom: 20,
                        paddingHorizontal: 20,
                    }}

                    DotComponent={CustomDot} // Use Custom Dot
                    pages={[
                        {
                            backgroundColor: "#fff",
                            image: <Onboarding1 />,
                            title: "Welcome to Pocket Voucher!",
                            subtitle: "Seamlessly generate vouchers, send money, and manage your funds—all in one place.",
                        },
                        {
                            backgroundColor: "#fff",
                            image: <Onboarding2 />,
                            title: "Send & Receive Money",
                            subtitle: "Instantly transfer funds with ease and security.",
                        },
                        {
                            backgroundColor: "#fff",
                            image: <Onboarding3 />,
                            title: "Create & Manage Vouchers",
                            subtitle: "Generate vouchers and keep track of your transactions effortlessly.",
                        },
                    ]}
                />

                {/* Custom buttons below the indicators */}
                <View style={{ width: width - 40, alignSelf: "center" }}>
                    <CustomButtons
                        primary
                        text={currentPage === 2 ? "Get Started" : "Next"}
                        width="100%"
                        style={{ marginTop: 50 }}
                        bgColor={currentPage === 2 ? "red.600" : "blue.700"}
                        callBack={() => {
                            if (currentPage === 2) {
                                navigation.replace("Login");
                            } else if (onboardingRef.current) {
                                onboardingRef.current.goNext();
                            }
                        }}
                    />
                </View>
            </View>
        </>
    );
};

export default OnboardingScreen;
