// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform, Modal } from 'react-native';

import { Actionsheet, Box, Button, Center, HStack, Icon, Stack, VStack } from 'native-base';
import { Color } from '../../global-components/colors';
import { LoginController } from '../controllers';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appState } from "../../state/index.js"
import messaging from '@react-native-firebase/messaging';
import { Camera, BadgeCheck, ArrowBigRight, IdCard, MapPinHouse, CircleCheck } from 'lucide-react-native';
import { KYCICon } from '../../global-components/icons.js';
import { BoldText, BoldText1 } from '../../global-components/texts.js';
import { Loader } from '../../global-components/loader.js';

const Colors = Color()
function KycOnboarding({ navigation }) {
    const [proceed, setproceed] = React.useState(false)
    const [gender, setgender] = React.useState("")
    const [bvn, setBvn] = React.useState("22222222222")
    const [address, setaddress] = React.useState("")
    const [state, setstate] = React.useState("")
    const [city, setcity] = React.useState("")
    const [country, setcountry] = React.useState("")
    const [zipCode, setzipCode] = React.useState("")
    const [modalVisible, setModalVisible] = useState(false);



    let { User, Loading, VerifyKYC } = appState()

    React.useEffect(() => {

    }, [])

    // return User.kyc ? navigation.replace("Home") : (
    return (
        <>
            {/* {console.log(User.kyc)} */}
            <SafeAreaView style={styles.container}>

                <Center marginTop={19} >
                    <KYCICon />
                </Center>

                <VStack flex={1} bg="white" py={8} alignItems="center">
                    {/* Title and Description */}
                    <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
                        Verifying your identity
                    </Text>
                    <Text style={{ fontSize: 15, textAlign: 'center', color: '#6B7280', marginBottom: 20 }}>
                        We We need this information to complete your KYC process
                    </Text>

                    {/* ID Card Section */}
                    <Box bg="gray.100" p={4} rounded="xl" mb={4} w="100%" mt={4}>
                        <HStack space={3} alignItems="flex-start">
                            <Icon as={<IdCard />} size={6} color={Colors.primary} />
                            <VStack paddingRight={5}>
                                <Text style={{ fontSize: 16, fontWeight: '600' }}>Bank verification number</Text>
                                <Text style={{ fontSize: 14, color: '#6B7280' }}>Your bank identification number (BVN) is required for only verification purpose</Text>
                            </VStack>
                        </HStack>
                    </Box>


                    {/* Selfie Section */}
                    <Box bg="gray.100" p={4} rounded="xl" mb={6} w="100%" mt={4}>
                        <HStack space={3} alignItems="flex-start">
                            <Icon as={<MapPinHouse />} size={6} color={Colors.primary} />
                            <VStack paddingRight={5}>
                                <Text style={{ fontSize: 16, fontWeight: '600' }}>Gender verification</Text>
                                <Text style={{ fontSize: 14, color: '#6B7280' }}>Only Male and Female available</Text>
                            </VStack>
                        </HStack>
                    </Box>


                    {/* Selfie Section */}
                    <Box bg="gray.100" p={4} rounded="xl" mb={6} w="100%" mt={4}>
                        <HStack space={3} alignItems="flex-start">
                            <Icon as={<MapPinHouse />} size={6} color={Colors.primary} />
                            <VStack paddingRight={5}>
                                <Text style={{ fontSize: 16, fontWeight: '600' }}>Residential address</Text>
                                <Text style={{ fontSize: 14, color: '#6B7280' }}>We need to verify your address,city,state,country and zip_code.</Text>
                            </VStack>
                        </HStack>
                    </Box>

                    {/* Security Notice */}
                    <Text style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 12 }}>
                        🔒 Your information is for verification purpose and will be encrypted in transit.
                    </Text>

                </VStack>
                {/* Get Started Button */}
                <Button
                    onPress={() => {
                        // navigation.navigate("kyc")
                        setproceed(!proceed)
                    }}
                    style={{ backgroundColor: Colors.dark }} rounded="2xl" py={4} _text={{ fontSize: 16, fontWeight: 'bold' }}>
                    Proceed
                </Button>

            </SafeAreaView>

            <Actionsheet isOpen={proceed} onClose={() => {
                setproceed(!proceed)
            }}>
                <Actionsheet.Content>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 }}>
                        Complete verification
                    </Text>
                    <View style={{ padding: 15, width: "100%" }}>
                        <BoldText text="Enter your BVN" color="#000" />
                        <TextInput style={styles.input} placeholder="1234567890" onChangeText={setBvn} keyboardType='numeric' />
                        <BoldText text="Enter your address" color="#000" style={{ marginTop: 15 }} />
                        <HStack space={4} >
                            <TextInput style={[styles.input, { flex: 2 }]} placeholder="21 express avenu" onChangeText={setaddress} />
                            <TextInput style={[styles.input, {}]} placeholder="zip_code" onChangeText={setzipCode} />
                        </HStack>
                        <HStack space={4} >
                            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Country" onChangeText={setcountry} />
                            <TextInput style={[styles.input, { flex: 1 }]} placeholder="State" onChangeText={setstate} />
                            <TextInput style={[styles.input, { flex: 1 }]} placeholder="City" onChangeText={setcity} />
                        </HStack>


                        <BoldText text="Select your gender" color="#000" style={{ marginTop: 30, marginBottom: 10 }} />
                        <HStack space={10} style={{
                            justifyContent: "space-between",
                        }} >
                            <TouchableOpacity
                                onPress={() => {
                                    setgender("MALE")
                                }}
                                style={[styles.selectBtn, {
                                    backgroundColor: gender == "MALE" ? "grey" : "#fff",
                                    borderWidth: gender == "MALE" ? 0 : 1,
                                }]}>
                                <BoldText text="Male" color={gender != "MALE" ? "grey" : "#fff"} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setgender("FEMALE")
                                }}
                                style={[styles.selectBtn, {
                                    backgroundColor: gender == "FEMALE" ? "gray" : "#fff",
                                    borderWidth: gender == "FEMALE" ? 0 : 1,
                                }]}>
                                <BoldText text="Female" color={gender != "FEMALE" ? "gray" : "#fff"} />
                            </TouchableOpacity>

                        </HStack>

                        <TouchableOpacity
                            onPress={() => {
                                setproceed(!proceed)
                                let data = {
                                    address, bvn, gender,
                                    state, city, country, zipCode
                                }
                                VerifyKYC(data, setModalVisible)
                            }}
                            style={[{
                                marginTop: 80,
                                borderRadius: 10,
                                paddingVertical: 17,
                                // width: 100,
                                alignItems: "center",
                                backgroundColor: Colors.dark,
                            }]}>
                            <BoldText text="Submit" color="#fff" />
                        </TouchableOpacity>

                    </View>
                </Actionsheet.Content>
            </Actionsheet>

            <Loader loading={Loading} />


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.overlay}>
                    <View style={styles.modalView}>
                        <CircleCheck size={150} strokeWidth={0.8} color={Colors.dark} />

                        <BoldText1
                            size={20}
                            color={Colors.dark}
                            style={{
                                textAlign: "center"
                            }}
                            text="KYC has been completed successfully."
                        />

                        <TouchableOpacity style={styles.registerButton} onPress={() => {
                            setModalVisible(false);
                            navigation.replace("Home")
                        }} >
                            {Loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.registerButtonText}>Set your secured pin</Text>}
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        </>
    );
}




export default KycOnboarding;



const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#FFF', display: "flex" },
    input: { padding: 15, marginVertical: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5 },
    selectBtn: {
        borderRadius: 10,
        paddingVertical: 10,
        // width: 100,
        alignItems: "center",
        flex: 1
    },




    // =====

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: "80%",
        // height: 300,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    registerButton: { backgroundColor: '#000', paddingVertical: 15, width: '90%', alignItems: 'center', borderRadius: 5, marginVertical: 10, marginTop: 50, height: 55, alignSelf: "center" },
    registerButtonText: { color: '#FFF', fontWeight: 'bold' },

});
