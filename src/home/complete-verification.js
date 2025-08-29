import React, { useState, useCallback, useRef } from 'react';
import { Text, HStack, Select, CheckIcon, Stack, } from 'native-base';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { BoldText, } from '../global-components/texts';
import { BackIcon } from '../global-components/icons';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateTransactionRef, ImagePicker, FlutterwaveKey } from '../utilities';
import { appState } from '../state';
import { Loader } from '../global-components/loader';
import { CustomButtons } from '../global-components/buttons';
import PayWithFlutterwave from 'flutterwave-react-native';
import { CreateMedicardController, FetchMedicardController } from './service';
import { FetchUserInfoService } from '../auth/service';


const Colors = Color()

function CompleteVerification({ navigation }) {

    const [PickedImage, setPickedImage] = React.useState({ status: false })
    const [claimCard, setclaimCard] = useState(false)
    const [cardType, setCardType] = React.useState("")
    // 
    const [dd, setDD] = React.useState("")
    const [mm, setMM] = React.useState("")
    const [yy, setYY] = React.useState("")
    const [nin, setNIN] = React.useState("")
    const [cardHolder, setCardHolder] = React.useState("")
    const [Loading, setLoading] = React.useState(false)
    const [loadingText, setLoadingText] = React.useState("")
    const [cardPin, setCardPin] = React.useState("")
    let { User, login } = appState()
    let paystackWebViewRef = useRef(null)

    const fetchUserInfo = useCallback(async () => {
        console.log("updating your info")
        setLoading(prev => ({ ...prev, userData: true }));

        FetchUserInfoService(User.uid)
            .then(response => {
                if (response) {
                    login({
                        ...response,
                        refreshToken: User.refreshToken,
                        accessToken: User.accessToken,
                    });
                    console.log(User)
                } else {
                    Alert.alert("Error", "An error occured");
                }
                setLoading(prev => ({ ...prev, userData: false }));
                navigation.goBack()
            })
            .catch(error => {
                console.log(error);
                setLoading(prev => ({ ...prev, userData: false }));
            });
    }, [User, login]);




    async function CreateMedicardHandler(data) {
        setLoading(true)
        setLoadingText("Creating Medicard")
        const response = await CreateMedicardController(User.uid, cardHolder, cardType, User.health_id, cardPin)
        if (response.success) return fetchUserInfo()
        setLoading(false)
        console.log(response)
    }


    const handleOnRedirect = (data) => {
        console.log(data);
        CreateMedicardHandler(data)
    };


    return !User ? navigation.replace("Login") : (
        // return (
        <>
            {/* {console.log(User.health_id)} */}

            <SafeAreaView style={{
                backgroundColor: "#fff", display: "flex", flex: 1,
                padding: 15
            }} >

                <HStack alignItems="center" justifyContent="flex-start" space={5} >
                    <TouchableOpacity >
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={styles.welcomeText}>
                        Identity verification
                    </Text>
                </HStack>


                <Stack style={{
                    marginTop: 30
                }} >
                    {/* <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 }}>
                        Complete your identity verification
                    </Text> */}
                    <View style={{ padding: 15, width: "100%", marginTop: 30 }}>

                        <BoldText text="What name should be on your Medicard?" color="#000" />
                        <TextInput
                            // maxLength={11}
                            style={styles.input}
                            placeholderTextColor="grey"
                            placeholder="eg. John Doe" onChangeText={setCardHolder} />

                        <BoldText text="What type of Medicard do you want?" color="#000" style={{ marginTop: 25 }} />

                        {/* <HStack space={4} justifyContent="space-between" >
                            <TextInput placeholderTextColor="grey" maxLength={4} style={[styles.input, { flex: 1 }]} placeholder="YYYY" keyboardType='numeric' onChangeText={setYY} />
                            <TextInput placeholderTextColor="grey" maxLength={2} style={[styles.input, { flex: 1 }]} placeholder="MM" keyboardType='numeric' onChangeText={setMM} />
                            <TextInput placeholderTextColor="grey" maxLength={2} style={[styles.input, { flex: 1 }]} placeholder="DD" keyboardType='numeric' onChangeText={setDD} />
                        </HStack> */}
                        <Select
                            style={[styles.input, { fontSize: 17, fontWeight: 500, color: "#000", borderWidth: 0 }]}
                            selectedValue={cardType}
                            minWidth="200" accessibilityLabel="Choose Service"
                            placeholder="Select card type" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                            }} mt={1} onValueChange={itemValue => {
                                setCardType(itemValue)
                            }} borderWidth={0}>
                            <Select.Item label={`Black Medicard`} value="Black Medicard" />
                            <Select.Item label={`Blue Medicard`} value="Blue Medicard" />
                            <Select.Item label={`Silver Medicard`} value="Silver Medicard" />
                        </Select>


                        {/* <BoldText text="Upload a copy of your ID" color="#000" style={{ marginTop: 40 }} />
                        <TouchableOpacity
                            onPress={() => {
                                ImagePicker({
                                    setPickedImage
                                })
                            }}
                            style={{
                                // backgroundColor: gender == "MALE" ? "grey" : "#fff",
                                borderWidth: 0.4,
                                borderColor: "grey",
                                paddingVertical: 30,
                                marginTop: 10,
                                borderRadius: 10,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: "grey" }}>
                                {PickedImage.status == true ? "File selected" : "Select file"}
                            </Text>
                            {PickedImage.status == true ?
                                <CheckCircle color="green" size={40} /> : <UploadCloud size={40} />}
                        </TouchableOpacity> */}

                        <BoldText style={{ marginTop: 35 }} text="Choose a pin for your Medicard" color="#000" />
                        <TextInput
                            maxLength={4}
                            style={styles.input}
                            placeholderTextColor="grey"
                            placeholder="eg. 1234" onChangeText={setCardPin} />

                        <Text style={{ fontSize: 12, color: "grey", marginTop: 10 }}>
                            Your pin will be used to access your Medicard
                        </Text>


                    </View>
                </Stack>


            </SafeAreaView>

            <PayWithFlutterwave
                onRedirect={handleOnRedirect}
                options={{
                    tx_ref: generateTransactionRef(),
                    authorization: FlutterwaveKey,
                    amount: 1000,
                    currency: 'NGN',
                    customer: {
                        email: User?.email,
                        name: User?.name,
                    },
                    meta: {
                        consumer_id: User?.uid,
                    },
                    payment_options: 'card, banktransfer, ussd, mobile_money',
                }}
                customButton={(props) => (
                    <TouchableOpacity
                        style={[styles.signInButton, props.isInitializing && styles.signInButtonDisabled]}
                        onPress={() => {
                            if (!cardHolder || !cardType || !cardPin) {
                                Alert.alert("Error", "Please fill all fields")
                                return
                            }
                            props.onPress()
                        }}
                        // onPress={saveSosCredit}
                        isBusy={props.isInitializing}
                        disabled={props.disabled}>
                        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Claim Medicard</Text>
                    </TouchableOpacity>
                )}
            />


            <Loader loading={Loading} text={loadingText} />

        </>
    );
}




export default CompleteVerification;


const styles = StyleSheet.create({

    input: {
        padding: 15,
        marginVertical: 10,
        borderColor: '#ddd', borderBottomWidth: 1, borderRadius: 5, width: "100%",
        color: "#000"
    },


    registerButton: { backgroundColor: Colors.dark, paddingVertical: 15, width: '90%', alignItems: 'center', borderRadius: 5, marginVertical: 10, marginTop: 50, height: 55, alignSelf: "center" },
    registerButtonText: { color: '#FFF', fontWeight: 'bold' },
    welcomeText: { fontSize: 20, fontWeight: 'bold', },

    signInButton: {
        backgroundColor: Colors.primary,
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginVertical: 40,
        minHeight: 50,
        justifyContent: 'center',
        width: "90%",
        alignSelf: "center"
    },
    signInButtonDisabled: {
        opacity: 0.7,
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

});
