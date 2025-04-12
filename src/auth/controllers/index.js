import { Alert } from "react-native";
import { CardWithdrawalService, ConversionRateService, CreateCardService, FetchBanksModel, FetchTransactionModel, FundCardService, GetCardDetailsHistoryModel, InitiatePayout, LoginService, RegisterService, RequestOtpService, ResetPwdService, ResolveBankModel, UpdateKycModel, UpdateNINModel, VerifyAccountService } from "../service";
import { FetchTransactionsModel } from "../../home/service";
import { supabase } from "../../../configurations/supabase-config";


export function LoginController({ setloading, Alert, navigation, email, password, fcmToken, login, setmodalData, modalData, Initialize }) {
    // console.log("response")
    LoginService(email, password, fcmToken)
        .then(response => {
            if (response.success == false) {
                setloading(false)
                console.log(response)
                return Alert.alert("Error", response.message,)
            }
            if (response.action == "ENTER OTP") {
                navigation.navigate("Enter-otp", { data: response.data })
            } else {
                // console.log(response)
                if (!response.data) {
                    setloading(false)
                    return setmodalData({
                        isTrue: true,
                        header: "Error",
                        msg: "A network error occured, please try again",
                        callBack: () => { },
                        buttonText: "OK",
                        type: "ERROR"
                    })
                }
                login(response.data)
                Initialize(response.data.id)
                if (response.data.kyc == false) {
                    navigation.replace("kyc-onboarding")
                } else {
                    navigation.replace("Home")
                }
                // setloading(false)


                // setmodalData({
                //     isTrue: true,
                //     header: "Success",
                //     msg: "You have successfully logged in",
                //     callBack: () => navigation.replace("Home"),
                //     buttonText: "Continue",
                //     type: "SUCCESS"
                // })
                // 
            }
            setloading(false)
        })
        .catch(error => {
            setloading(false)
            console.log(error)
            return Alert.alert("Error", "An error occured",)
        })
}

export function RegisterController({ setloading, Alert, email, phone, name, pwd1, fcmToken, navigation, lastName }) {
    RegisterService({ email, phone, name, pwd1, lastName, fcmToken })
        .then(response => {
            if (response.success == false) {
                setloading(false)
                return Alert.alert("Error", response.message,)
            }
            if (response && response.data) {
                navigation.navigate("Enter-otp", { data: response.data })
            }
            setloading(false)
            // console.log
        })
        .catch(error => {
            setloading(false)
            // console.log(error)
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

export function UpdateKycController(setLoading, login, user, data, email, name, phone, User, setModalVisible) {

    let { bvn, address, gender, state, city, country, zipCode } = data

    UpdateKycModel(user, gender, address, bvn, email, name, phone, state, city, country, zipCode)
        .then(response => {
            if (response.success == false) {
                setLoading(false)
                return Alert.alert("Error", response.message,)
            }
            login({
                ...User,
                ...response.data,
            })
            setLoading(false)
            setModalVisible(true)
        })
        .catch(error => {
            setLoading(false)
            // console.log(error)
            return Alert.alert("Error", "An error occured",)
        })
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
export function FundCardController(setLoading, setloadingText, amount, chargeAmount, card_ref, GetCardDetailsHandler, user, fundingSource) {
    setloadingText("Funding your card")
    FundCardService(amount, chargeAmount, card_ref, user, fundingSource)
        .then(response => {
            if (response.success == false) {
                setLoading(false)
                setloadingText("")
                return Alert.alert("Error", response.message,)
            }
            setLoading(false)
            setloadingText("")
            GetCardDetailsHandler()
            // login({
            //     ...User,
            //     ...response.data
            // })
            // GetAllTransactions()
        })
        .catch(error => {
            setLoading(false)
            setloadingText('')
            return Alert.alert("Error", "An error occured",)
        })
}

// withdraw card controller
export function WithdrawCardController(setLoading, setloadingText, User, amount, card_ref, GetCardDetailsHandler, login) {
    setloadingText("Withdrawing from card")
    CardWithdrawalService(amount, User.id, card_ref)
        .then(response => {
            if (response.success == false) {
                setLoading(false)
                setloadingText("")
                return Alert.alert("Error", response.message,)
            }
            setLoading(false)
            setloadingText("")
            // login({
            //     ...User,
            //     // ...response.data
            // })
            GetCardDetailsHandler()
            console.log(response.data)
        })
        .catch(error => {
            console.log(error)
            setLoading(false)
            setloadingText('')
            return Alert.alert("Error", "An error occured",)
        })
}