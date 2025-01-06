import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Or any icon library you're using
import { Color } from '../global-components/colors';
import { Actionsheet, ArrowForwardIcon, Box, Button, Center, Divider, HStack, QuestionIcon, Stack, Switch, VStack } from 'native-base';
import { AcceptanceIcon, ArrowForward, Avater, BiometricIcon, CloseIcon, DeleteIcon, FastIcon, HeartIcon, LogoutIcon, MiniShareIcon, QRcodeIcon, SecureIcon, SmallAvater, SmallBiometricIcon } from '../global-components/icons';
import { BoldText, BoldText1, BoldText2 } from '../global-components/texts';
import { DeleteAccountService } from '../auth/service';
import { Loader } from '../global-components/loader';
import { appState } from '../state';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import { ConfigBiometricController } from './service';
import ModalPop from '../global-components/modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handleBiometricAuth } from '../helpers/biometrics';


const Colors = Color()

function Profile({ navigation, }) {
    const { User, login, isBiometric, BiometricAuth, Initialize } = appState()
    const [bottomSheet, setbottomSheet] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [Key, setkey] = React.useState(null)
    const [biometricLoader, setbiometricLoader] = React.useState(false)

    const [modalData, setmodalData] = React.useState({
        isTrue: false,
        header: "",
        msg: "",
        callBack: null
    })


    const handleDeleteAccount = () => {
        setLoading(true)

        DeleteAccountService(User.id)
            .then(response => {

                if (response.success == false) {
                    setLoading(false)
                    Alert.alert("Error", response.message)
                } else {
                    login(null)
                    // Initialize(null)
                    navigation.replace('Login')
                }

            })
            .catch(error => {
                Alert.alert("Error", "An error occured")
                setLoading(false)
            })
    }



    // return (
    return !User ? navigation.replace("Login") : (

        <SafeAreaView style={styles.container}>
            {/* {console.log(isBiometric)} */}
            <View>
                <ScrollView contentContainerStyle={styles.optionsContainer}>
                    <Stack style={styles.header}>

                        <Center mt={3} style={{
                            // backgroundColor: "red",
                            justifyContent: "center",
                            alignItems: "center"
                        }} >
                            <SmallAvater />
                            <BoldText2 text={User.name} color={Colors.dark} style={{
                                marginTop: 30
                            }} />
                            <BoldText text={`@${User.id.slice(0, 17)}`} color={Colors.dark} />

                            <HStack mt={6} justifyContent="center" alignItems="center" space={4}>
                                {/* <BoldText2 text="Share Profile" color={Colors.primary} size={18} />
                                <MiniShareIcon /> */}

                            </HStack>
                        </Center>
                    </Stack>

                    <Divider />
                    <Stack mb={10} mt={5} >
                        {/* Promotions */}
                        <Box>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('Support', { user: User.id })
                            }} >
                                <HStack alignItems="center" justifyContent="space-between" >
                                    <HStack alignItems="center" >
                                        <FastIcon />
                                        <VStack ml={2} >
                                            <BoldText1 text="Talk to us" color={Colors.dark} />
                                            <Text color="gray.500">We respond as soon as possible</Text>
                                        </VStack>
                                    </HStack>
                                    <ArrowForward />
                                </HStack>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                navigation.navigate('service-reset-pwd')
                            }} >
                                <HStack alignItems="center" mt={10} justifyContent="space-between" >
                                    <HStack alignItems="center" >
                                        <SecureIcon />
                                        <VStack ml={2} >
                                            <BoldText1 text="Account settings" color={Colors.dark} />
                                            <Text color="gray.500">You can reset your password</Text>
                                        </VStack>
                                    </HStack>
                                    <ArrowForward />
                                </HStack>

                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                navigation.navigate('Vouchers')
                            }} >

                                <HStack alignItems="center" mt={10} justifyContent="space-between" >
                                    <HStack alignItems="center" >
                                        <AcceptanceIcon />
                                        <VStack ml={2} >
                                            <BoldText1 text="Deactivate voucher tokens" color={Colors.dark} />
                                            <Text color="gray.500">Select a merchant and see all the tokens.</Text>
                                        </VStack>
                                    </HStack>
                                    <ArrowForward />
                                </HStack>
                            </TouchableOpacity>
                        </Box>

                        <Stack mt={16} >

                            <TouchableOpacity onPress={() => {
                                handleBiometricAuth({
                                    setbiometricLoader,
                                    setkey,
                                    Key,
                                    isBiometric,
                                    BiometricAuth,
                                    message: isBiometric == false ? "Set Biometric auth" : "Disable Biometric auth",
                                })

                            }}  >
                                <HStack alignItems="center" justifyContent="space-between" >
                                    <HStack space={4}>
                                        <SmallBiometricIcon />
                                        <BoldText text="Enrol Biometric" color={Colors.dark} />
                                    </HStack>

                                    {biometricLoader == true ?
                                        <ActivityIndicator color={Colors.primary} /> :
                                        <Switch
                                            isDisabled={true}
                                            size="sm"
                                            // value={false}
                                            isChecked={isBiometric}
                                            // offTrackColor="red"
                                            // onTrackColor="grey"
                                            // onThumbColor="green.900"
                                            // offThumbColor="grey"
                                            colorScheme="primary"
                                        />
                                    }


                                </HStack>
                            </TouchableOpacity>

                            <Divider marginVertical={16} bgColor="gray.200" />

                            <TouchableOpacity   >
                                <HStack alignItems="center" justifyContent="space-between" >
                                    <HStack space={4}>
                                        <QuestionIcon style={{ color: Colors.primary }} />
                                        <BoldText text="FAQ" color={Colors.dark} />
                                    </HStack>
                                    <ArrowForwardIcon />
                                </HStack>
                            </TouchableOpacity>

                            <Divider marginVertical={16} bgColor="gray.200" />

                            <TouchableOpacity onPress={() => {
                                navigation.replace('Biometrics')
                                // if (isBiometric == true) {
                                //     navigation.replace('Biometrics')
                                // } else {
                                //     login(null)
                                // }
                            }}  >
                                <HStack alignItems="center" justifyContent="space-between" >
                                    <HStack space={4}>
                                        <LogoutIcon />
                                        <BoldText text="Logout" color={Colors.dark} />
                                    </HStack>
                                    <ArrowForwardIcon />
                                </HStack>
                            </TouchableOpacity>

                            <Divider marginVertical={16} bgColor="gray.200" />
                            <TouchableOpacity onPress={() => {
                                setbottomSheet(!bottomSheet)
                            }}  >
                                <HStack alignItems="center" justifyContent="space-between" >
                                    <HStack space={4}>
                                        <DeleteIcon />
                                        <BoldText text="Delete account" color={Colors.dark} />
                                    </HStack>
                                    <ArrowForwardIcon />
                                </HStack>
                            </TouchableOpacity>

                        </Stack>

                    </Stack>
                </ScrollView>
            </View>

            <Loader loading={loading} />

            <Actionsheet isOpen={bottomSheet} onClose={() => {
                setbottomSheet(!bottomSheet)
            }}>
                <Actionsheet.Content>


                    <BoldText text="Your account and all your records with us will be wiped." color={Colors.primary} style={{ marginTop: 10, padding: 20 }} />
                    <Stack mb={10} style={{
                        width: "100%",
                        padding: 15
                    }} >
                        <TouchableOpacity onPress={() => {
                            setbottomSheet(!bottomSheet)
                        }}  >
                            <HStack alignItems="center" justifyContent="space-between" backgroundColor={Colors.dark} style={{
                                padding: 20,
                                borderRadius: 10
                            }} >
                                <HStack space={4}>
                                    <VStack>
                                        <BoldText1 text="Don't delete account" color={Colors.white} />
                                    </VStack>
                                </HStack>
                                <CloseIcon />
                            </HStack>
                        </TouchableOpacity>


                        <TouchableOpacity onPress={() => {
                            setbottomSheet(!bottomSheet)
                            handleDeleteAccount()
                        }}  >
                            <HStack alignItems="center" justifyContent="space-between" style={{
                                padding: 20,
                                borderRadius: 10,
                                marginTop: 40
                            }} >
                                <HStack space={4}>
                                    <DeleteIcon />
                                    <VStack>
                                        <BoldText1 text="Delete account" color={Colors.primary} />
                                    </VStack>
                                </HStack>
                                <CloseIcon />
                            </HStack>
                        </TouchableOpacity>

                    </Stack>


                </Actionsheet.Content>
            </Actionsheet>


            <ModalPop open={modalData.isTrue}>
                <HStack space={3} style={{
                    borderRadius: 18,
                    paddingHorizontal: 15,
                    paddingVertical: 20,
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginTop: 40,
                }} >

                    <VStack flex={2} space={3} >
                        <BoldText2 color={modalData.type == "ERROR" ? Colors.primary : "green"} text={modalData.header} />
                        <Text>
                            {modalData.msg}
                        </Text>
                        <HStack alignItems="center" mt={5} space={5} >
                            <Button bg={Colors.white} size="sm" variant="outline" style={{
                                width: 120,
                                backgroundColor: Colors.lightGray,
                                height: 50
                            }}
                                onPress={() => {
                                    setmodalData({
                                        ...modalData,
                                        isTrue: false
                                    })
                                    modalData.callBack()
                                }}
                                colorScheme={Colors.primary} borderRadius="full">

                                <HStack justifyContent="space-around" alignItems="center" space={3} >
                                    <Text style={{ color: "green" }} fontSize="xs">{modalData.buttonText}</Text>
                                </HStack>
                            </Button>

                        </HStack>
                    </VStack>
                </HStack>

            </ModalPop>
        </SafeAreaView>
    );
}



export default Profile;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 20,
        // paddingTop: 40,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
    tier: {
        backgroundColor: '#fff8e1',
        marginLeft: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
    },
    tierText: {
        fontSize: 12,
        color: '#ffbf00',
    },
    settingsIcon: {
        padding: 5,
    },
    balanceSection: {
        marginTop: 20,
    },
    balanceText: {
        fontSize: 14,
        color: '#888',
    },
    balanceAmount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    },
    cashbackText: {
        fontSize: 12,
        color: Colors.primary,
        marginTop: 4,
    },
    securityCheck: {
        backgroundColor: '#34a853',
        borderRadius: 8,
        padding: 10,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    securityText: {
        color: '#fff',
        fontSize: 14,
    },
    turnOnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    optionsContainer: {
        padding: 20,
    },
    option: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    optionText: {
        fontSize: 16,
        color: '#000',
        flex: 1,
        marginLeft: 10,
    },
});
