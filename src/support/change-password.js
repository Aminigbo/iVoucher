// screens/LoginScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BackIcon } from '../global-components/icons';
import { HStack, Stack } from 'native-base';
import { Color } from '../global-components/colors';
import { ChangePasswordAlt } from '../auth/service';
import { connect } from 'react-redux';
import { User } from '../redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appState } from '../state';

const Colors = Color()

function ServiceResetPwdScreen({ navigation, route }) {
    const { User, login } = appState()
    const [loading, setloading] = React.useState(false)
    const [data, setData] = React.useState("route.params.data")

    const [password, setPassword] = React.useState("")
    const [password2, setPassword2] = React.useState("")
    const [password3, setPassword3] = React.useState("")

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
    return (
        <>
            <SafeAreaView style={{
                backgroundColor: "#fff", flex: 1
            }}  >
                {/* {console.log(data)} */}
                <View style={styles.container}>
                    <HStack space={7} bg="#fff" alignItems="center"
                        paddingVertical={18} pt={6} pb={6}  >
                        <BackIcon />
                        {/* <Text fontSize="lg" fontWeight="bold">Add merchant</Text> */}
                        <Text style={styles.welcomeText}>Reset your password</Text>
                    </HStack>



                    <Text color="gray.500">Old password</Text>
                    <TextInput style={styles.input} placeholder="Enter old password" onChangeText={setPassword} secureTextEntry />

                    <Text style={{ marginTop: 30 }} color="gray.500">New password</Text>
                    <TextInput style={[styles.input]} placeholder="Enter new password" onChangeText={setPassword2} secureTextEntry />

                    <Text style={{ marginTop: 10 }} color="gray.500">Confirm new password</Text>
                    <TextInput style={styles.input} placeholder="Confirm new password" onChangeText={setPassword3} secureTextEntry />


                </View>

                <Stack style={{
                    padding: 20
                }} >
                    <TouchableOpacity onPress={handleChangePwd}
                        style={styles.loginButton}>
                        {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.loginButtonText}>Reset</Text>}

                    </TouchableOpacity>
                </Stack>

            </SafeAreaView>
        </>
    );
}



export default ServiceResetPwdScreen;


const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
    welcomeText: { fontSize: 20, fontWeight: 'bold', },
    input: { width: '100%', padding: 15, marginVertical: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5 },
    forgotPassword: { alignSelf: 'flex-end', marginVertical: 10 },
    loginButton: { backgroundColor: '#000', paddingVertical: 15, width: '100%', alignItems: 'center', borderRadius: 5, marginVertical: 10 },
    loginButtonText: { color: '#FFF', fontWeight: 'bold' },
    orText: { marginVertical: 20 },
    socialButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '60%' },
    registerText: { color: Colors.dark, marginTop: 20, textAlign: "center" },
});
