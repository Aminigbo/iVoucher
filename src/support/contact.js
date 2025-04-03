import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Box, Text, VStack, Pressable, Icon, HStack, Divider, ScrollView } from "native-base";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackIcon } from "../global-components/icons";
import { Color } from "../global-components/colors";
import { CustomButtons } from "../global-components/buttons";

const Colors = Color()

const faqData = [
    { question: "What is reddit?", answer: "Reddit is a social media platform where users can share content and engage in discussions." },
    { question: 'What does the name "reddit" mean?', answer: 'It\'s (sort of) a play on words - "I read it on reddit".' },
    { question: "How is a submission's score determined?", answer: "A submission's score is based on upvotes and downvotes." },
    { question: "Why does a dot sometimes show up where the score should be?", answer: "A dot appears when the score is hidden due to voting fuzzing." },
    { question: "I made a mistake in my submission title, how can I edit it?", answer: "You cannot edit a title after posting. Consider deleting and reposting." },
    { question: "What is that number next to usernames? And what is karma?", answer: "That number represents karma, which is earned through upvotes on posts and comments." },
    { question: "Why should I try to accumulate karma?", answer: "Karma reflects your contributions and can unlock features on Reddit." },
    { question: "What can I do to get my submissions noticed?", answer: "Engage with the community, post in the right subreddit, and use good titles." },
];

const Support = ({ navigation, route }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);
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
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff"}}>
            <HStack space={7} bg="#fff" alignItems="center" paddingVertical={18} pt={6} pb={6} p={2}>
                <BackIcon />
                <Text fontSize="lg" fontWeight="bold">FAQs</Text>
            </HStack>


            <ScrollView style={{ paddingHorizontal: 15 }} >
                <VStack mt={5} space={3}>
                    {faqData.map((item, index) => (
                        <Box key={index} borderRadius="md" p={3} bg="gray.100" >
                            <Pressable
                                onPress={() =>
                                    setExpandedIndex(expandedIndex === index ? null : index)
                                }
                                flexDirection="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Text flex={1} style={{ marginRight: 16, color: Colors.dark }} fontWeight="bold">{item.question}</Text>
                                <Icon
                                    as={expandedIndex === index ? ChevronUp : ChevronDown}
                                    size={5}
                                    color="black"
                                />
                            </Pressable>
                            {expandedIndex === index && (
                                <Text mt={2} color="gray.600">
                                    {item.answer}
                                </Text>
                            )}
                        </Box>
                    ))}
                </VStack>

                <Divider style={{ marginVertical: 30, backgroundColor: "lightgray", height: 0.4 }} />

                <VStack bg="#F2F5F7" shadow={0.1} style={{
                    // marginHorizontal: 15, 
                    padding: 6
                }} >
                    <Text fontSize="lg" fontWeight="bold" p={3} mb={4}>
                        Talk to us
                    </Text>
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
                            placeholderTextColor={Colors.dark}
                        />

                    </HStack>
                </VStack>

                <CustomButtons callBack={handleSubmitSupport}
                    primary Loading={loading}
                    LoadingText="Creating token..."
                    width="100%" height={58} text="Send" />


            </ScrollView>
        </SafeAreaView>
    );
};

export default Support;

const styles = StyleSheet.create({
    container: {
        borderBottomColor: '#000',
        borderBottomWidth: 1,
    },
    textInput: {
        padding: 10,
    },
});
