import React from 'react';
import { Text, Box, IconButton, VStack, HStack, Icon, Button, ScrollView, Stack, Divider, AddIcon, Input } from 'native-base';
import { Alert, Keyboard, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { BoldText1 } from '../global-components/texts';
import { AcceptanceIcon, BackIcon, Eye, FastIcon, HelpCenterIcon, InIcon, MerchantIcon, NotificationIcon, OutIcon, ScanIcon, SecureIcon, SendVoucherIcon, ShopIcon, VoucherIcon } from '../global-components/icons';
import VoucherComponent from '../global-components/voucher-component';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButtons } from '../global-components/buttons';
import { SubmitSupportModel } from '../home/service';

const Colors = Color()

export default function Support({ route, navigation }) {
    const [Search, setSearch] = React.useState("")
    const [data, setdata] = React.useState(route.params.user)
    const [loading, setLoading] = React.useState()

    function handleSubmitSupport() {
        Keyboard.dismiss()
        setLoading(true)
        SubmitSupportModel(data, Search)
            .then(response => {
                if (response.success == false) {
                    Alert.alert("Error", response.error)
                } else {
                    Alert.alert("Success", response.message, [
                        {
                            onPress: () => { navigation.pop(); setSearch("") }
                        }
                    ])
                }
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                Alert.alert("Error", "An error occured")
            })
    }


    return (
        <>
            <SafeAreaView bg="#fff" style={{
                display: "flex",
                flex: 1
            }} >
                <HStack space={7} bg="#fff" alignItems="center" paddingVertical={18} pt={6} pb={6} p={2}>
                    <BackIcon />
                    <Text fontSize="lg" fontWeight="bold">Talk to us</Text>
                </HStack>

                <ScrollView bg="#fff"  >
                    <VStack space={4}>
                        <VStack bg="#F2F5F7" shadow={0.1} style={{
                            marginHorizontal: 18,
                            marginTop: 10,
                            padding: 6
                        }} >

                            <HStack  >

                                <TextInput
                                    editable
                                    height={90}
                                    multiline
                                    numberOfLines={4}
                                    maxLength={200}
                                    onChangeText={text => setSearch(text)}
                                    value={Search}
                                    placeholder='Do you have a complain for us?'
                                    style={styles.textInput}
                                />

                            </HStack>
                        </VStack>


                        <Stack mb={10} mt={5} p={5} >
                            {/* Promotions */}
                            <Box>
                                <HStack alignItems="center" >
                                    <FastIcon />
                                    <VStack ml={2} >
                                        <Text fontWeight="bold">Instant access</Text>
                                        <Text color="gray.500">Our services are easily accessible</Text>
                                    </VStack>
                                </HStack>

                                <HStack alignItems="center" mt={5}>
                                    <SecureIcon />
                                    <VStack ml={2} >
                                        <Text fontWeight="bold">Safe and Reliable</Text>
                                        <Text color="gray.500">You don't need to worry about security.</Text>
                                    </VStack>
                                </HStack>

                                <HStack alignItems="center" mt={5} >
                                    <AcceptanceIcon />
                                    <VStack ml={2} >
                                        <Text fontWeight="bold">Online and Offline Merchants acceptance</Text>
                                        <Text color="gray.500">Over +10000 vendors all over the country</Text>
                                    </VStack>
                                </HStack>
                            </Box>
                        </Stack>


                    </VStack>
                </ScrollView>

            </SafeAreaView>

            <Stack p={10} bgColor="#fff" >
                <CustomButtons callBack={handleSubmitSupport}
                    primary Loading={loading}
                    LoadingText="Creating token..."
                    width="100%" height={58} text="Send" />
            </Stack>

        </>
    );
}


const styles = StyleSheet.create({
    container: {
        borderBottomColor: '#000',
        borderBottomWidth: 1,
    },
    textInput: {
        padding: 10,
    },
});