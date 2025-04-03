import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Box, Text, Checkbox, Button, HStack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackIcon } from "../global-components/icons";

const TermsAndConditions = ({ navigation }) => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <SafeAreaView flex={1} bg="white" style={{
            padding: 15
        }} >

            <HStack space={7} bg="#fff" p={2} style={{
                // justifyContent: "space-between",
                alignItems: "center",
                // marginHorizontal: 15,
                marginBottom:20
            }} >
                <BackIcon />

                <Text fontSize="xl" fontWeight="bold"  textAlign="center">
                    Card Terms & Conditions
                </Text>
                 
            </HStack>


            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                

                {[
                    { title: "1. Introduction", content: "These Terms & Conditions govern your use of the Pocket Voucher Virtual USD Card. By activating or using this card, you accept these terms." },
                    { title: "2. Eligibility", content: "Users must be at least 18 years old and complete KYC verification. Pocket Voucher reserves the right to deny access to users from sanctioned regions." },
                    { title: "3. Virtual Card Issuance & Use", content: "The card is issued in partnership with a licensed financial institution. It is valid only for online transactions and subscriptions." },
                    { title: "4. Funding", content: "Users can fund their virtual card via approved payment methods. Minimum and maximum limits apply." },
                    { title: "5. Fees & Charges", content: "Transaction fees, foreign exchange fees, and maintenance fees apply. Fee changes will be communicated in advance." },
                    { title: "6. Security & Fraud Prevention", content: "Users must not share their card details with third parties. Suspected fraud must be reported within 24 hours." },
                    { title: "7. Transaction Limits", content: "Limits are set per regulatory requirements. Exceeding limits may result in transaction failure." },
                    { title: "8. Refunds & Chargebacks", content: "Refund requests must be submitted within 30 days. Chargebacks may take up to 60 days to process." },
                    { title: "9. Dispute Resolution", content: "Users must contact support for disputes. Legal arbitration applies if a resolution is not met." },
                    { title: "10. User Responsibilities", content: "Users are responsible for ensuring account security. Misuse of the card may lead to account suspension." },
                    { title: "11. Account Suspension", content: "Pocket Voucher may suspend accounts for suspicious activities. Users will be notified before account restrictions." },
                    { title: "12. Data Privacy & Protection", content: "User data is protected under applicable data laws. Pocket Voucher does not share personal data with third parties without consent." },
                    { title: "13. Anti-Money Laundering (AML) Compliance", content: "Transactions are monitored for AML compliance. Suspected illegal activities will be reported to authorities." },
                    { title: "14. Termination & Card Expiry", content: "Virtual cards expire after a set period. Users can terminate their accounts upon request." },
                    { title: "15. Modifications to Terms", content: "Pocket Voucher may update terms as needed. Users will be notified of major changes." },
                    { title: "16. Limitation of Liability", content: "Pocket Voucher is not liable for losses due to user negligence or third-party service failures." },
                    { title: "17. Governing Law", content: "These terms are governed by applicable local laws and financial regulations." },
                    { title: "18. Customer Support", content: "Support is available via email, live chat, and in-app support." },
                    { title: "19. Third-Party Services", content: "Pocket Voucher partners with third-party financial institutions for card issuance." },
                    { title: "20. Contact Information", content: "For inquiries, contact Pocket Voucher’s support team via email or in-app chat." },
                    { title: "21. Transaction Monitoring", content: "Pocket Voucher actively monitors transactions for security and fraud prevention." },
                    { title: "22. Unauthorized Transactions", content: "Users must report unauthorized transactions within 48 hours for investigation." },
                    { title: "23. Currency Exchange", content: "Foreign exchange rates are determined by our banking partners and subject to fluctuations." },
                    { title: "24. Dormant Account Policy", content: "Inactive accounts for 12 months may be subject to additional fees or closure." },
                    { title: "25. Prohibited Uses", content: "The card cannot be used for illegal activities, gambling, or cryptocurrency transactions." },
                    { title: "26. Card Expiry & Renewal", content: "Virtual cards expire after a set period, with renewal options available." },
                    { title: "27. Liability for Third-Party Actions", content: "Pocket Voucher is not responsible for actions taken by merchants or financial institutions." },
                    { title: "28. Compliance with International Sanctions", content: "Users from sanctioned countries or individuals flagged by regulatory authorities may be restricted." },
                    { title: "29. Account Recovery & Password Reset", content: "Users can reset passwords via the app. Identity verification may be required." },
                    { title: "30. Agreement Acknowledgment", content: "By continuing, you confirm you have read and understood these terms." },
                ].map((section, index) => (
                    <Box key={index} mb={4}>
                        <Text fontSize="md" fontWeight="bold" mb={2}>{section.title}</Text>
                        <Text fontSize="md">{section.content}</Text>
                    </Box>
                ))}

            </ScrollView>

            {/* <Checkbox isChecked={isChecked} onChange={setIsChecked} mt={4}>
                I have read and agree to the Terms & Conditions.
            </Checkbox>

            <Button mt={4} isDisabled={!isChecked} onPress={() => navigation.goBack()}>
                Accept & Continue
            </Button> */}
        </SafeAreaView>
    );
};

export default TermsAndConditions;
