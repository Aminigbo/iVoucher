import React from 'react';
import { Text, VStack, HStack, Stack, Input, } from 'native-base';
import { Alert, Keyboard, StyleSheet, TextInput, } from 'react-native';
import { BackIcon } from '../global-components/icons';

import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButtons } from '../global-components/buttons';
import { ResolveTokenService } from './services';
import { Loader } from '../global-components/loader';
import { appState } from '../state';

const Colors = Color()

function ResolveToken({ navigation, route }) {

    const { login, User } = appState()
    const [token, settoken] = React.useState("")
    const [loading, setLoading] = React.useState(false)



    const handleDeactivateToken = () => {
        if (token.length > 5) {
            Keyboard.dismiss()
            setLoading(true)
            ResolveTokenService(token, User.id)
                .then(response => {
                    setLoading(false)

                    if (response.success == false) {
                        Alert.alert("Error", response.message)
                        settoken("")
                    } else {
                        login({
                            ...User,
                            merchants: response.data.merchants
                        })
                        settoken("")
                        Alert.alert("Success", response.message, [
                            {
                                onPress: () => {
                                    // console.log(response.data.merchants.filter(e=> e.id == data.id))
                                    navigation.pop()
                                },
                                text: "Done"
                            }
                        ])
                    }

                })
                .catch(error => {
                    Alert.alert("Error", "A network error occured")
                    setLoading(false)
                    settoken("")
                })
        }
    }



    return (
        <>
            <SafeAreaView style={{
                backgroundColor: "#fff", flex: 1
            }} >
                <HStack space={7} bg="#fff" alignItems="center" paddingVertical={18} pt={6} pb={6} p={2}>
                    <BackIcon />
                    <Text fontSize="lg" fontWeight="bold">Resolve Genesis voucher token</Text>
                </HStack>

                <VStack space={4}>
                    <VStack bg="white" shadow={0.1} marginVertical={0}>

                        <HStack p={3} justifyContent="center" alignItems="center" >

                            <TextInput
                                onChangeText={settoken}
                                value={token}
                                style={[styles.input, { fontSize: 17, }]}
                                w={{ md: "95%" }}
                                // height={70}
                                flex={5}
                                rounded={10}
                                justifyContent="center"
                                placeholder='Enter token here'
                                // InputLeftElement={<SearchAlt />}
                                size={25} color="black.400" />

                        </HStack>




                    </VStack>

                </VStack>

            </SafeAreaView>


            <Stack p={5} bgColor="#fff" >
                <CustomButtons callBack={handleDeactivateToken}
                    primary={token.length > 5 ? true : false} Loading={false}
                    LoadingText="Please wait..."
                    width="100%" height={58} text="Resolve Token" />
            </Stack>


            <Loader loading={loading} />
        </>
    );
}



export default ResolveToken;


const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    paymentBtns: {

        // backgroundColor: Colors.primary,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginVertical: 3,
        width: "90%",
        borderWidth: 1,
        height: 55,
        // marginTop: 30,
        // marginBottom: 30,


    },

    input: { width: '100%', padding: 15, marginVertical: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5 },
});
