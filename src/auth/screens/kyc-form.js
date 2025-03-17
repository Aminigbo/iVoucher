// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform, Modal } from 'react-native';

import { Actionsheet, Box, Button, Center, FlatList, HStack, Icon, Stack, VStack } from 'native-base';
import { Color } from '../../global-components/colors';
import { LoginController } from '../controllers';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appState } from "../../state/index.js"
import messaging from '@react-native-firebase/messaging';
import { Camera, BadgeCheck, ArrowBigRight, IdCard, MapPinHouse, CircleCheck, VenusAndMars, Lock } from 'lucide-react-native';
import { BackIcon, KYCICon } from '../../global-components/icons.js';
import { BoldText, BoldText1 } from '../../global-components/texts.js';
import { Loader } from '../../global-components/loader.js';
import { Country } from '../../utilities/data.js';

const Colors = Color()
function KYCForm({ navigation }) {
    const [proceed, setproceed] = React.useState(false)
    const [proceedType, setproceedType] = React.useState("")
    const [gender, setgender] = React.useState(null)
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

                <HStack alignItems="center" justifyContent="flex-start" space={5} mb={16} >
                    <TouchableOpacity onPress={() => {
                        // navigation.replace("Onboarding")
                    }}>
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={styles.headerText}> Complete verification</Text>
                </HStack>


                {/* <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 }}>
                    Complete verification
                </Text> */}

                <View style={{}}>
                    <BoldText text="BVN" color="#000" />
                    <TextInput style={styles.input} placeholder="0000 0000 0000 00" onChangeText={setBvn} keyboardType='numeric' />

                    <BoldText text="Address" color="#000" style={{ marginTop: 15 }} />
                    <TextInput style={[styles.input]} placeholder="No. 14 wesham, woji, Rivers State." onChangeText={setaddress} />

                    <BoldText text="Postal code" color="#000" style={{ marginTop: 15 }} />
                    <TextInput style={[styles.input, {}]} placeholder="12345" onChangeText={setzipCode} />


                    <BoldText text="Gender" color="#000" style={{ marginTop: 15 }} />
                    <TouchableOpacity
                        onPress={() => {
                            setproceed(true)
                            setproceedType("gender")
                        }}
                        style={[styles.input, {}]}>
                        <BoldText text={gender ? gender : "Select Gender"} color={gender ? "#000" : "grey"} />
                    </TouchableOpacity>


                    <HStack space={4} >

                        <VStack style={{ flex: 1 }} >
                            <BoldText text="Country" color="#000" style={{ marginTop: 15 }} />
                            {/* <TextInput style={[styles.input, {}]} placeholder="Country" onChangeText={setcountry} /> */}
                            <TouchableOpacity
                                onPress={() => {
                                    setproceed(true)
                                    setproceedType("country")
                                }}
                                style={[styles.input, {}]}>
                                <BoldText text={country ? country.name : "Country"} color={country ? "#000" : "grey"} />
                            </TouchableOpacity>
                        </VStack>

                        <VStack style={{ flex: 1 }} >
                            <BoldText text="State" color="#000" style={{ marginTop: 15 }} />
                            {/* <TextInput style={[styles.input]} placeholder="State" onChangeText={setstate} /> */}
                            <TouchableOpacity
                                onPress={() => {
                                    setproceed(true)
                                    setproceedType("state")
                                }}
                                style={[styles.input, {}]}>
                                <BoldText text={state ? state.name : "State"} color={state ? "#000" : "grey"} />
                            </TouchableOpacity>

                        </VStack>
                        <VStack style={{ flex: 1 }} >
                            <BoldText text="City" color="#000" style={{ marginTop: 15 }} />
                            {/* <TextInput style={[styles.input, {}]} placeholder="City" onChangeText={setcity} /> */}
                            <TouchableOpacity
                                onPress={() => {
                                    setproceed(true)
                                    setproceedType("city")
                                }}
                                style={[styles.input, {}]}>
                                <BoldText text={city ? city : "City"} color={city ? "#000" : "grey"} />
                            </TouchableOpacity>
                        </VStack>
                    </HStack>



                    <TouchableOpacity
                        onPress={() => {
                            // setproceed(!proceed) 
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

            </SafeAreaView>

            <Actionsheet isOpen={proceed} onClose={() => {
                setproceed(!proceed)
            }}>
                <Actionsheet.Content>
                    <Stack style={{ width: "90%", paddingBottom: 50 }} space={5} >
                        {proceedType == "gender" &&
                            <>
                                <BoldText text="Select gender" color={gender ? "#000" : "grey"} />
                                <TouchableOpacity
                                    onPress={() => {
                                        setgender("MALE")
                                        setproceed(false)
                                    }}
                                    style={[styles.input, { width: "100%", justifyContent: "center", alignItems: "center" }]}>
                                    <BoldText text="Male" color="#000" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        setgender("FEMALE")
                                        setproceed(false)
                                    }}
                                    style={[styles.input, { width: "100%", justifyContent: "center", alignItems: "center" }]}>
                                    <BoldText text="Female" color="#000" />
                                </TouchableOpacity>
                            </>
                        }

                        {proceedType == "country" &&
                            <>
                                <BoldText text="Select country" color={"grey"} />

                                <Stack mb={10} >
                                    <FlatList
                                        data={Country}
                                        renderItem={({ item }) => <TouchableOpacity
                                            onPress={() => {
                                                setcountry(item)
                                                setproceed(false)
                                            }}
                                            style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
                                            <BoldText text={item.name} color={"grey"} />
                                        </TouchableOpacity>}
                                    />
                                </Stack>
                            </>
                        }

                        {proceedType == "state" &&
                            <>
                                <BoldText text="Select state" color={"grey"} />
                                <FlatList
                                    data={country.city}
                                    renderItem={({ item }) => <TouchableOpacity
                                        onPress={() => {
                                            setstate(item)
                                            setproceed(false)
                                        }}
                                        style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
                                        <BoldText text={item.name} color={"grey"} />
                                    </TouchableOpacity>}
                                />
                            </>
                        }

                        {proceedType == "city" &&
                            <>
                                <BoldText text="Select city" color={"grey"} />
                                <FlatList
                                    data={state.cities}
                                    renderItem={({ item }) => <TouchableOpacity
                                        onPress={() => {
                                            setcity(item)
                                            setproceed(false)
                                        }}
                                        style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
                                        <BoldText text={item} color={"grey"} />
                                    </TouchableOpacity>}
                                />
                            </>
                        }

                    </Stack>
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




export default KYCForm;



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
    headerText: { fontSize: 20, fontWeight: 'bold' },




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
    registerButton: { backgroundColor:Colors.dark, paddingVertical: 15, width: '90%', alignItems: 'center', borderRadius: 5, marginVertical: 10, marginTop: 50, height: 55, alignSelf: "center" },
    registerButtonText: { color: '#FFF', fontWeight: 'bold' },

});
