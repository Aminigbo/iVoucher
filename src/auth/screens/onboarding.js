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
                backgroundColor: selected ? "#611336" : "#D0D0D0",
            }}
        />
    );
};




const OnboardingScreen = ({ navigation }) => {
    const onboardingRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);
    const { User, Initialized, Initialize } = appState()

 
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
                    <Text fontSize="md" color="#611336">Skip</Text>
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
                            title: "Welcome to Medicard",
                            subtitle: "Your comprehensive healthcare companion for managing medical records and expenses.",
                        },
                        {
                            backgroundColor: "#fff",
                            image: <Onboarding2 />,
                            title: "Seamless Medical Tracking",
                            subtitle: "Easily track and manage your medical history, prescriptions, and health insights.",
                        },
                        {
                            backgroundColor: "#fff",
                            image: <Onboarding3 />,
                            title: "Simplified Healthcare Management",
                            subtitle: "Connect with healthcare providers and manage your medical expenses effortlessly.",
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
                        bgColor={currentPage === 2 ? "red.600" : "#"}
                        callBack={() => {
                            if (currentPage === 2) {
                                // navigation.replace("Login");
                                navigation.replace("Login")
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
