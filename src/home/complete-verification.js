import React, { useState } from 'react';
import { Text, HStack } from 'native-base';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { BoldText, } from '../global-components/texts';
import { BackIcon } from '../global-components/icons';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImagePicker } from '../utilities';
import { appState } from '../state';
import { Loader } from '../global-components/loader';
import { CustomButtons } from '../global-components/buttons';
import { CheckCircle, UploadCloud } from 'lucide-react-native';


const Colors = Color()

function CompleteVerification({ navigation }) {

    const [PickedImage, setPickedImage] = React.useState({ status: false })
    const [claimCard, setclaimCard] = useState(false)

    // 
    const [dd, setDD] = React.useState("")
    const [mm, setMM] = React.useState("")
    const [yy, setYY] = React.useState("")
    const [nin, setNIN] = React.useState("")

    let { User, Loading, VerifyNIN, loadingText } = appState()


    return !User ? navigation.replace("Login") : (
        // return (
        <>
            {/* {console.log(User.UsdBal)} */}

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


                <ScrollView style={{
                    marginTop: 30
                }} >
                    {/* <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 }}>
                        Complete your identity verification
                    </Text> */}
                    <View style={{ padding: 15, width: "100%", marginTop: 30 }}>

                        <BoldText text="Enter your NIN" color="#000" />
                        <TextInput
                            maxLength={11}
                            style={styles.input}
                            placeholderTextColor="grey"
                            placeholder="0 0 0   0 0 0 0   0 0 0 0" onChangeText={setNIN} keyboardType='numeric' />

                        <BoldText text="Your date of birth" color="#000" style={{ marginTop: 25 }} />

                        <HStack space={4} justifyContent="space-between" >
                            <TextInput placeholderTextColor="grey" maxLength={4} style={[styles.input, { flex: 1 }]} placeholder="YYYY" keyboardType='numeric' onChangeText={setYY} />
                            <TextInput placeholderTextColor="grey" maxLength={2} style={[styles.input, { flex: 1 }]} placeholder="MM" keyboardType='numeric' onChangeText={setMM} />
                            <TextInput placeholderTextColor="grey" maxLength={2} style={[styles.input, { flex: 1 }]} placeholder="DD" keyboardType='numeric' onChangeText={setDD} />
                        </HStack>


                        <BoldText text="Upload a copy of your ID" color="#000" style={{ marginTop: 40 }} />
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
                        </TouchableOpacity>


                    </View>
                </ScrollView>

                <CustomButtons
                    callBack={() => {
                        setclaimCard(false)
                        let data = {
                            nin, yy, mm,
                            dd, PickedImage
                        }
                        VerifyNIN(data, setclaimCard, navigation)
                    }}
                    primary
                    width="95%"
                    text="Submit" />

            </SafeAreaView>


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

});
