// screens/LoginScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BackIcon } from '../../global-components/icons';
import { HStack } from 'native-base';
import { Color } from '../../global-components/colors';
import { RequestOtpController } from '../controllers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../global-components/input';
import { CustomButtons } from '../../global-components/buttons';

const Colors = Color()
export default function RequestOTP({ navigation }) {

    const [loading, setloading] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const handleRequestOTP = () => {
        Keyboard.dismiss()
        setloading(!loading)
        RequestOtpController({
            setloading,
            Alert,
            navigation,
            email,
        })
    }
    return (
        <SafeAreaView flex={1} style={{ backgroundColor: "#fff" }} >
            <View style={styles.container}>
                <HStack alignItems="flex-start" justifyContent="flex-start" mb={20} >
                    <TouchableOpacity onPress={() => navigation.replace("Login")}>
                        <BackIcon />
                    </TouchableOpacity>
                </HStack>

                <Text style={styles.welcomeText}>Forgot password</Text>
                <Text style={styles.orText}>If you have an account with us, an OTP will be sent to your email.</Text>

                {/* <TextInput style={styles.input} placeholder="Enter your email" onChangeText={setEmail} /> */}

                <Input
                    Placeholder="example@email.com"
                    Label
                    LabelText="Enter your Email"
                    onChange={setEmail}
                />
            </View>

            <View style={{ padding: 20 }}> 

                <CustomButtons
                    text="Proceed"
                    primary
                    Loading={loading} 
                    callBack={handleRequestOTP}
                />

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
    welcomeText: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, },
    input: { width: '100%', padding: 15, marginVertical: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5 },
    forgotPassword: { alignSelf: 'flex-end', marginVertical: 10 },
    loginButton: { backgroundColor: '#000', paddingVertical: 15, width: '100%', alignItems: 'center', borderRadius: 5, marginVertical: 10 },
    loginButtonText: { color: '#FFF', fontWeight: 'bold' },
    orText: { marginBottom: 20, marginTop: -10 },
    socialButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '60%' },
    registerText: { color: Colors.dark, marginTop: 20, textAlign: "center" },
});
