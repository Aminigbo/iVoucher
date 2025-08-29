import { Alert } from "react-native";
import { CardWithdrawalService, ConversionRateService, CreateCardService, FetchBanksModel, FetchTransactionModel, FundCardService, GetCardDetailsHistoryModel, InitiatePayout, LoginService, RegisterService, RequestOtpService, ResetPwdService, ResolveBankModel, UpdateKycModel, UpdateNINModel, VerifyAccountService, VerifyKYCService } from "../service";
import { FetchTransactionsModel } from "../../home/service";
import { supabase } from "../../../configurations/supabase-config";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signInWithCustomToken } from "firebase/auth";
import { getFirestore, doc, getDoc, collection } from "firebase/firestore";
import firebaseConfig from "../../../configurations/firebase";

// Check if Firebase app is already initialized
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(firebaseApp);

// initialize firestore
const db = getFirestore(firebaseApp);




export function LoginController({ setloading, Alert, navigation, email, password, fcmToken, login, setmodalData, modalData, Initialize }) {
    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            if (!userCredential.user) {
                return Alert.alert("Error", "Your account has been disabled. Please contact support.")
            }
            console.log("Done")
            if (userCredential.user.emailVerified == false) {
                RequestOtpService(email, userCredential.user.uid)
                    .then(response => {
                        setloading(false)
                        if (response.success == true) {
                            return navigation.navigate("Enter-otp", {
                                email: userCredential.user.email,
                                phone: userCredential.user.phoneNumber,
                                name: userCredential.user.displayName,
                                id: userCredential.user.uid,
                                signedOTP: response.data
                            })
                        } else {
                            // Handle unsuccessful OTP request
                        }
                    })
            }

            try {
                // Correctly fetch user document from Firestore
                const userDocRef = doc(db, "users", userCredential.user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const Data = userDocSnap.data()

                    if (!Data.kycVerified) return navigation.navigate("kyc-onboarding",
                        {
                            id: userCredential.user.uid,
                            email: userCredential.user.email,
                            phone: userCredential.user.phoneNumber,
                            name: userCredential.user.displayName,
                        }
                    )

                    const user = {
                        accessToken: userCredential.user.uid,
                        refreshToken: userCredential.user.refreshToken,
                        ...userCredential.user.user,
                        ...Data
                    }
                    // console.log(Data.uid)
                    login(user)
                    Initialize(Data.uid)
                    setloading(false)
                    navigation.replace("Home")
                } else {
                    console.log("No such user document!");
                }
            } catch (error) {
                console.error("Error fetching user document:", error);
            }

            setloading(false)
        })
        .catch(error => {
            setloading(false)
            console.log(error)
            return Alert.alert("Error", "Invalid email or password")
        })
}

// login with custom token
export function LoginWithCustomTokenController(customToken) {
    return signInWithCustomToken(auth, customToken)
}

export function RegisterController({ setloading, Alert, email, phone, name, pwd1, fcmToken, navigation }) {
    // console.log(email, phone, name, pwd1, fcmToken)
    RegisterService({ email, phone, name, pwd1, fcmToken })
        .then(response => {
            // console.log(response)
            if (response.success == false) {
                setloading(false)
                return Alert.alert("Error", response.message,)
            }
            if (response && response.data) {
                setloading(false)
                navigation.navigate("Enter-otp", {
                    signedOTP: response.data.signedOTP,
                    id: response.data.uid,
                    email: response.data.email,
                    phone: response.data.phone,
                    name: response.data.name,
                })
            } else {
                setloading(false)
                return Alert.alert("Error", "An error occured",)
            }
        })
        .catch(error => {
            setloading(false)
            console.log(error)
            return Alert.alert("Error", "An error occured",)
        })
}

export function VerifyAccountController({ setloading, Alert, navigation, data, login, setModalVisible }) {
    VerifyAccountService(data.data.userData.id)
        .then(response => {
            setloading(false)
            if (response.success == false) {
                return Alert.alert("Error", response.message,)
            }
            login(data.data.userData)
            // navigation.replace("Home", { data: data.data })

            // Alert.alert("Success", "OTP verified successfully. Proceed to login to your account", [
            //     {
            //         onPress: () => {
            //             navigation.replace("Login")
            //             setloading(false)
            //         },
            //         text: "Login"
            //     }
            // ])
            setModalVisible(true)

        })
        .catch(error => {
            setloading(false)
            // console.log(error)
            return Alert.alert("Error", "An error occured",)
        })
}

export function RequestOtpController({ setloading, Alert, navigation, email }) {
    RequestOtpService(email)
        .then(response => {
            if (response.success == false) {
                setloading(false)
                return Alert.alert("Error", response.message,)
            }
            navigation.replace("Enter-otp", { data: response.data, type: "RESET-PWD", email })
            setloading(false)
        })
        .catch(error => {
            setloading(false)
            // console.log(error)
            return Alert.alert("Error", "An error occured",)
        })
}

export function ResetPwdController({ setloading, Alert, navigation, password, user }) {
    ResetPwdService(password, user)
        .then(response => {
            if (response.success == false) {
                setloading(false)
                return Alert.alert("Error", response.message,)
            }
            navigation.replace("Login")
            setloading(false)
        })
        .catch(error => {
            setloading(false)
            // console.log(error)
            return Alert.alert("Error", "An error occured",)
        })
}

export async function UpdateKycController(setLoading, login, data, Initialize, navigation) {
    let { address, gender, state, city, country, id, dob, email, phone, name } = data
    setLoading(true)

    try {
        const response = await VerifyKYCService(id, address, dob, gender, country, state, city, email, phone, name)

        if (response.success == false) {
            setLoading(false)
            return Alert.alert("Error", response.message)
        }
        console.log(response)
        const user = await signInWithCustomToken(auth, response.data.customToken)
        // console.log(response.data.user)

        const userDocRef = doc(db, "users", user.user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const Data = userDocSnap.data()

            const updatedUser = {
                accessToken: user.user.uid,
                refreshToken: user.user.refreshToken,
                ...user.user,
                ...Data
            }
            login(updatedUser)
            Initialize(Data.id)
            navigation.replace("Home")
        } else {
            console.log("No such user document!");
        }

        setLoading(false)
    } catch (error) {
        console.error("Error in UpdateKycController:", error)
        setLoading(false)
        return Alert.alert("Error", "An error occurred")
    }
}


// verify NIN
export function UpdateNINController(setLoading, login, user, data, email, name, phone, User, setclaimCard, navigation) {

    let { nin, yy, mm, dd, PickedImage } = data;
    supabase.storage
        .from("NIN")
        .upload(PickedImage.fileName, PickedImage.formData)
        .then(response => {

            // console.log(response) base64
            let Img = response.data.path;

            UpdateNINModel(user, nin, yy, mm, dd, email, phone, Img, PickedImage.base64)
                .then(response => {
                    if (response.success == false) {
                        setLoading(false)
                        return Alert.alert("Error", response.message,)
                    }
                    login({
                        ...User,
                        ...response.data,
                    })
                    console.log(response.data)
                    setLoading(false)
                    navigation.replace("Claim-card")
                })
                .catch(error => {
                    setLoading(false)
                    console.log(error)
                    return Alert.alert("Error", "An error occured",)
                })

        })
        .catch(error => {
            console.log(error)
            setLoading(false)
        })


}




// fetch all transaction history
export function FetchTransactionHistorycController(setLoading, login, user, account_number) {

    FetchTransactionModel(user, account_number)
        .then(response => {
            if (response.success == false) {
                setLoading(false)
                return Alert.alert("Error", response.message,)
            }
            // console.log("response.data,", response.data)
            setLoading(false)
        })
        .catch(error => {
            setLoading(false)
            // console.log(error)
            return Alert.alert("Error", "An error occured",)
        })
}

// Fetch all banks
export function FetcAllBanksController(setLoading, SaveBanks) {
    FetchBanksModel()
        .then(response => {
            if (response.success == false) {
                setLoading(false)
                return Alert.alert("Error", response.message,)
            }
            // console.log("response.data,", response.data)
            SaveBanks(response.data)
            setLoading(false)
        })
        .catch(error => {
            setLoading(false)
            // console.log(error)
            return Alert.alert("Error", "An error occured",)
        })
}

// resolve bank
export function ResolveBankController(setLoading, bank, account, setAccountHolder, setEnterAmountPop, SelectedBank, navigation) {
    ResolveBankModel(bank, account)
        .then(response => {
            if (response.success == false) {
                setLoading(false)
                return Alert.alert("Error", response.message,)
            }
            // setEnterAmountPop(true)
            let data = {
                ...response.data,
                logo: SelectedBank.logo
            }
            // console.log("response.data,", data)
            // setAccountHolder(data)
            navigation.navigate("Amount-page", { data: data })
            setLoading(false)
        })
        .catch(error => {
            setLoading(false)
            console.log(error)
            return Alert.alert("Error", "An error occured",)
        })
}

// initiate payout
export function InitiatePayoutController({ setLoading, payoutType, amount, naration, bankCode, account, name, email, id, accountName, receiver, bank_name, navigation, GetAllTransactions, bankLogo }) {
    InitiatePayout({ payoutType, amount, naration, bankCode, account, name, email, id, accountName, receiver, bank_name, bankLogo })
        .then(response => {
            if (response.success == false) {
                setLoading(false)
                return Alert.alert("Error", response.message,)
            }
            // Alert.alert("Success", response.message)
            // console.log(response.data)
            GetAllTransactions()
            navigation.replace("view-transaction", { data: response.data })
            setLoading(false)
        })
        .catch(error => {
            setLoading(false)
            return Alert.alert("Error", "An error occured",)
        })
}

export function FetchAllTransactions(Userid, SaveTrxn, setLoading) {
    FetchTransactionsModel(Userid)
        .then(response => {
            if (response.success == false) {
                SaveTrxn([])
            } else {
                SaveTrxn(response.data)
            }
            setLoading(false)
        })
        .catch(error => {
            setLoading(false)
            disp_transactions([])
        })
}

// conversion rate
export function ConversionRateController(setLoading, amount, setResponse, setloadingText, setclaimCard, setbottomSheetType, type) {
    setloadingText("Getting the best exchange rate for you.")
    ConversionRateService(amount, type)
        .then(response => {
            console.log(response)
            if (response.success == false) {
                setLoading(false)
                setloadingText("")
                return Alert.alert("Error", response.message,)
            }

            setclaimCard && setclaimCard(true)
            setbottomSheetType && setbottomSheetType(type)

            setLoading(false)
            setResponse(response.data)
            setloadingText("")
        })
        .catch(error => {
            console.log(error)
            setLoading(false)
            setloadingText('')
            return Alert.alert("Error", "An error occured",)
        })
}

// create card
export function CreateCardController(setLoading, id, card_holder_reference, login, User, amount, navigation) {
    CreateCardService(card_holder_reference, id, amount)
        .then(response => {
            if (response.success == false) {
                setLoading(false)
                console.log(response)
                return Alert.alert("Error", response.message,)
            }
            login({
                ...User,
                ...response.data,
            })
            setLoading(false)
            navigation.replace("Home", {
                screen: "Cards"
            })
            // navigation.pop()
        })
        .catch(error => {
            console.log(error)
            setLoading(false)
            return Alert.alert("Error", "An error occured",)
        })
}

// get card details
export function GetCardDetailsController(setLoading, reference, setCardInfo, setclaimCard, setbottomSheetType) {
    setLoading(true)
    GetCardDetailsHistoryModel(reference)
        .then(response => {
            if (response.success == false) {
                setLoading(false)
                return Alert.alert("Error", response.message,)
            }
            setCardInfo(response.data)
            setclaimCard && setclaimCard(true)
            setbottomSheetType && setbottomSheetType("SHOW-DETAILS")
            setLoading(false)
        })
        .catch(error => {
            setLoading(false)
            return Alert.alert("Error", "An error occured",)
        })
}

// fund card controller
export function FundCardController(setLoading, setloadingText, amount, card_number, User, login, navigation, setModalVisible) {
    setloadingText("Funding your card")
    FundCardService(amount, card_number, User.uid)
        .then(response => {
            if (response.success == false) {
                setLoading(false)
                setloadingText("")
                return Alert.alert("Error", response.message,)
            }
            setLoading(false)
            setloadingText("")
            setModalVisible(true)
        })
        .catch(error => {
            setLoading(false)
            setloadingText('')
            return Alert.alert("Error", "An error occured",)
        })
}

// withdraw card controller
export function WithdrawCardController(setLoading, setloadingText, User, amount, card_ref, setModalVisible, fetchUserInfo, GetAllTransactions, destination) {
    setloadingText("Withdrawing from card")
    CardWithdrawalService(amount, User.id, card_ref, destination)
        .then(response => {
            if (response.success == false) {
                setLoading(false)
                setloadingText("")
                return Alert.alert("Error", response.message,)
            }
            setLoading(false)
            setloadingText("")
            fetchUserInfo()
            GetAllTransactions()
            // setModalVisible(true)
        })
        .catch(error => {
            console.log(error)
            setLoading(false)
            setloadingText('')
            return Alert.alert("Error", "An error occured",)
        })
}