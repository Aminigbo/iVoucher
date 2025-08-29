import React, { useCallback, useEffect, useState } from 'react';
import { Text,  HStack,  Divider,  Overlay,  } from 'native-base';
import { Modal,  StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { BoldText, } from '../global-components/texts';
import { BackIcon } from '../global-components/icons';
 
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appState } from '../state';
import { Loader } from '../global-components/loader';
import { CustomButtons } from '../global-components/buttons';
import {  CheckCircle2Icon} from 'lucide-react-native';
import { DeactivateMedicardController } from './service';
 

const Colors = Color()

function DeactivateCard({ navigation, route }) {
    const [loadingText, setloadingText] = React.useState("")
    const [reason, setreason] = React.useState("")
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = React.useState(false)

    const { card_number } = route.params
    let { User } = appState()




    function DeactivateCardHandler() {
        setLoading(true) 
        DeactivateMedicardController(card_number, reason)
        .then(res => {
            if(res.success){
                setModalVisible(true)
            }
        })
        .finally(() => {
            setLoading(false)
        })
        .catch(err => {
            console.log("err", err)
        })
    }



    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            console.log("card_number", card_number)

        });

        return unsubscribe;

    }, [navigation]);



    return !User ? navigation.replace("Login") : (
        // return (
        <>

            <SafeAreaView style={{
                backgroundColor: "#fff", display: "flex", flex: 1,
                padding: 15, justifyContent: "space-between"
            }} >

                <View style={[{ width: "100%", }, styles.shadowBox]}>

                    <HStack style={styles.header} alignItems="center" space={10} >
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <BackIcon />
                        </TouchableOpacity>
                        <Text style={styles.welcomeText}>Deactivate Card</Text>
                    </HStack>

                    <HStack space={3} style={{
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 5,
                        padding: 10,
                        marginBottom: 20,
                        width: "100%",
                    }} >
                        <TextInput style={{ fontWeight: 300, color: "#000", width: "80%", borderBottomWidth: 0 }}
                            placeholder="Tell us why you are deactivating your card"
                            placeholderTextColor="grey"
                            onChangeText={setreason}
                            multiline={true}
                            autoFocus={true}
                        />
                    </HStack>

                </View>
                <CustomButtons
                    callBack={() => {
                        DeactivateCardHandler()
                         
                    }}
                    primary={reason.length > 0 && true}
                    opacity={reason.length < 1 ? 0.3 : 1}
                    text="Deactivate card"
                />

            </SafeAreaView>


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.overlay}>
                    <View style={styles.modalView}>
                        <CheckCircle2Icon size={150} strokeWidth={0.8} color={Colors.primary} />

                        <BoldText
                            size={18}
                            color={Colors.dark}
                            style={{
                                textAlign: "center"
                            }}
                            text="Request submitted successfully"
                        />

                        <Divider my={7} />

                        <HStack space={4} style={{
                            alignItems: "center",
                            paddingHorizontal: 10
                        }} >

                            <Text fontSize="lg" fontWeight="light" color={Colors.dark}>
                                Your request to deactivate your medicard has been sent successfully.
                            </Text>
                        </HStack>

                        <TouchableOpacity style={styles.registerButton} onPress={() => {
                            navigation.pop()
                        }} >
                            <Text style={styles.registerButtonText}>Okay</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

            <Loader loading={loading}
            // text={loadingText} 
            />

        </>
    );
}




export default DeactivateCard;


const styles = StyleSheet.create({

    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    header: {
        marginBottom: 30
    },




    registerButton: { backgroundColor: Colors.dark, paddingVertical: 15, width: '90%', alignItems: 'center', borderRadius: 5, marginVertical: 10, marginTop: 50, height: 55, alignSelf: "center" },
    registerButtonText: { color: '#FFF', fontWeight: 'bold' },
    // Modal
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: "85%",
        // height: 300,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
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

});
