// screens/LoginScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ArrowForward, BackIcon, CloseIcon, DeleteIcon, LogoutIcon, SmallBiometricIcon } from '../global-components/icons';
import { Actionsheet, Divider, HStack, QuestionIcon, ScrollView, Stack, Switch, VStack } from 'native-base';
import { Color } from '../global-components/colors';
import { ChangePasswordAlt, DeleteAccountService } from '../auth/service';
import { connect } from 'react-redux';
import { User } from '../redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appState } from '../state';
import { BoldText, BoldText1 } from '../global-components/texts';
import { LockIcon, LogOut, ShieldCheck, Trash } from 'lucide-react-native';
import { CustomButtons } from '../global-components/buttons';

const Colors = Color()

function ServiceResetPwdScreen({ navigation, route }) {
    const { User, login } = appState()
    const [loading, setloading] = React.useState(false)
    const [data, setData] = React.useState("route.params.data")

    const [password, setPassword] = React.useState("")
    const [password2, setPassword2] = React.useState("")
    const [password3, setPassword3] = React.useState("")
    const [bottomSheet, setbottomSheet] = React.useState(false)
    const [bottomSheetType, setbottomSheetType] = React.useState("")

    const handleChangePwd = () => {
        if (password3 != password2) {
            return Alert.alert("Error", "The password do not match")
        } else {
            if (password2.length < 6 || password3.length < 6) {
                Alert.alert("Error", 'Your new password length must be more than 6')
            } else {
                setloading(true)
                ChangePasswordAlt(User.email, password, password3, User.id)
                    .then(response => {
                        if (response.success == false) {
                            setloading(false)
                            Alert.alert("Error", 'The password you provided is incorrect')
                        } else {
                            Alert.alert("Success", "Password changed successfully, you need to login again.", [
                                {
                                    onPress: () => {
                                        login(null)
                                        setloading(false)
                                        navigation.replace('Login')
                                    }
                                }
                            ])
                        }
                    })
            }
        }
    }


    const handleDeleteAccount = () => {
        setloading(true)

        DeleteAccountService(User.id)
            .then(response => {

                if (response.success == false) {
                    setloading(false)
                    Alert.alert("Error", response.message)
                } else {
                    login(null)
                    // Initialize(null)
                    navigation.replace('Login')
                }

            })
            .catch(error => {
                Alert.alert("Error", "An error occured")
                setloading(false)
            })
    }

    return (
        <>
            <SafeAreaView style={{
                backgroundColor: "#fff", flex: 1
            }}  >
                <HStack mb={5} alignItems="center" justifyContent="flex-start" space={5} p={15} >
                    <TouchableOpacity onPress={() => navigation.replace("Onboarding")}>
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Security Center</Text>
                </HStack>

                <ScrollView>
                    <Stack mt={9} p={15} style={{ marginBottom: 20 }} bg={Colors.accent} borderRadius={10} mx={4} >

                        <Divider marginVertical={16} bgColor="gray.200" style={{ height: 0.4 }} />

                        <TouchableOpacity onPress={() => {
                            navigation.replace('Biometrics')
                        }} style={{ marginVertical: 5 }}  >
                            <HStack alignItems="center" justifyContent="space-between" >
                                <HStack space={4}>
                                    <LogOut size={20} color={Colors.primary} />
                                    <BoldText text="Logout" color={Colors.dark} />
                                </HStack>
                                <ArrowForward />
                            </HStack>
                        </TouchableOpacity>

                        <Divider marginVertical={16} bgColor="gray.200" style={{ height: 0.4 }} />

                        <TouchableOpacity onPress={() => {
                            setbottomSheet(true)
                        }} style={{ marginVertical: 5 }}  >
                            <HStack alignItems="center" justifyContent="space-between" >
                                <HStack space={4}>
                                    <LockIcon size={20} color={Colors.primary} />
                                    <BoldText text="Change password" color={Colors.dark} />
                                </HStack>
                                <ArrowForward />
                            </HStack>
                        </TouchableOpacity>

                        <Divider marginVertical={16} bgColor="gray.200" style={{ height: 0.4 }} />


                        <TouchableOpacity onPress={() => {
                            setbottomSheet(!bottomSheet)
                            setbottomSheetType("DEL-ACCOUNT")
                        }} style={{ marginVertical: 5 }}    >
                            <HStack alignItems="center" justifyContent="space-between" >
                                <HStack space={4}>
                                    <Trash size={20} color={Colors.primary} />
                                    <BoldText text="Delete account" color={Colors.dark} />
                                </HStack>
                                <ArrowForward />
                            </HStack>
                        </TouchableOpacity>

                    </Stack>


                </ScrollView>

            </SafeAreaView>


            <Actionsheet isOpen={bottomSheet} onClose={() => {
                setbottomSheet(!bottomSheet)
                setbottomSheetType("")
            }}>
                <Actionsheet.Content>
                    {bottomSheetType == "DEL-ACCOUNT" ? <>

                        <BoldText text="Your account and all your records with us will be wiped."
                            color={Colors.dark} style={{ marginTop: 10, padding: 20 }} />
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
                                        <Trash size={20} color={Colors.primary} />
                                        <VStack>
                                            <BoldText1 text="Delete account" color={Colors.primary} />
                                        </VStack>
                                    </HStack>
                                    <CloseIcon />
                                </HStack>
                            </TouchableOpacity>

                        </Stack>

                    </> :
                        <View style={styles.container}>
                            <Text color="gray.500">Old password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter old password"
                                onChangeText={setPassword}
                                secureTextEntry
                                placeholderTextColor={Colors.dark}
                            />

                            <Text style={{ marginTop: 30 }} color="gray.500">New password</Text>
                            <TextInput
                                placeholderTextColor={Colors.dark}
                                style={[styles.input]} placeholder="Enter new password"
                                onChangeText={setPassword2} secureTextEntry />

                            <Text style={{ marginTop: 10 }} color="gray.500">Confirm new password</Text>
                            <TextInput
                                placeholderTextColor={Colors.dark}
                                style={styles.input} placeholder="Confirm new password" onChangeText={setPassword3} secureTextEntry />

                            <CustomButtons
                                primary
                                text="Reset"
                                onPress={handleChangePwd}
                                loading={loading}
                            />

                        </View>
                    }
                </Actionsheet.Content>
            </Actionsheet>
        </>
    );
}



export default ServiceResetPwdScreen;


const styles = StyleSheet.create({
    container: { width: "100%", padding: 20 },
    welcomeText: { fontSize: 20, fontWeight: 'bold', },
    input: { width: '100%', padding: 15, marginVertical: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5 },
    forgotPassword: { alignSelf: 'flex-end', marginVertical: 10 },
    loginButton: { backgroundColor: '#000', paddingVertical: 15, width: '100%', alignItems: 'center', borderRadius: 5, marginVertical: 10 },
    loginButtonText: { color: '#FFF', fontWeight: 'bold' },
    orText: { marginVertical: 20 },
    socialButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '60%' },
    registerText: { color: Colors.dark, marginTop: 20, textAlign: "center" },
    headerText: { fontSize: 20, fontWeight: 'bold' },
});
