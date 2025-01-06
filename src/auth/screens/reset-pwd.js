// screens/LoginScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BackIcon } from '../../global-components/icons';
import { HStack, Stack } from 'native-base';
import { Color } from '../../global-components/colors';
import { ResetPwdController } from '../controllers';

const Colors = Color()
export default function ResetPwdScreen({ navigation, route }) {

    const [loading, setloading] = React.useState(false)
    const [data, setData] = React.useState(route.params.data)

    const [password, setPassword] = React.useState("")
    const [password2, setPassword2] = React.useState("")
    const handleLogin = () => {
        if (password != password2) {
            return Alert.alert("Error", "The password do not match")
        } else {
            setloading(!loading)
            let fcmToken = "febdvlejdwfcndwlscndwcndkwcndkscndksjcd"
            ResetPwdController({
                setloading,
                Alert,
                navigation,
                password,
                user: data.user,
                fcmToken
            })
        }
    }
    return (
        <>
            {console.log(data)}
            <View style={styles.container}>
                <HStack alignItems="flex-start" justifyContent="flex-start" mb={20} >

                </HStack>

                <Text style={styles.welcomeText}>Reset your password</Text>
                <TextInput style={styles.input} placeholder="Enter new password" onChangeText={setPassword} secureTextEntry />
                <TextInput style={styles.input} placeholder="Confirm new password" onChangeText={setPassword2} secureTextEntry />


            </View>

            <Stack style={{
                padding: 20,
                backgroundColor: '#FFF'
            }} >
                <TouchableOpacity onPress={handleLogin}
                    style={styles.loginButton}>
                    {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.loginButtonText}>Reset</Text>}

                </TouchableOpacity>
            </Stack>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
    welcomeText: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, },
    input: { width: '100%', padding: 15, marginVertical: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5 },
    forgotPassword: { alignSelf: 'flex-end', marginVertical: 10 },
    loginButton: { backgroundColor: '#000', paddingVertical: 15, width: '100%', alignItems: 'center', borderRadius: 5, marginVertical: 10 },
    loginButtonText: { color: '#FFF', fontWeight: 'bold' },
    orText: { marginVertical: 20 },
    socialButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '60%' },
    registerText: { color: Colors.dark, marginTop: 20, textAlign: "center" },
});
