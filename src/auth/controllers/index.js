import { LoginService, RegisterService, RequestOtpService, ResetPwdService, VerifyAccountService } from "../service";


export function LoginController({ setloading, Alert, navigation, email, password, fcmToken, login, setmodalData, modalData, Initialize }) {
    // console.log("response")
    LoginService(email, password, fcmToken)
        .then(response => {
            if (response.success == false) {
                setloading(false)
                return Alert.alert("Error", response.message,)
            }
            if (response.action == "ENTER OTP") {
                navigation.navigate("Enter-otp", { data: response.data })
            } else {
                console.log(response)
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
                navigation.replace("Home")

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

export function RegisterController({ setloading, Alert, email, phone, name, pwd1, fcmToken, navigation }) {
    RegisterService({ email, phone, name, pwd1, fcmToken })
        .then(response => {
            if (response.success == false) {
                setloading(false)
                return Alert.alert("Error", response.message,)
            }
            navigation.navigate("Enter-otp", { data: response.data })
            setloading(false)
        })
        .catch(error => {
            setloading(false)
            console.log(error)
            return Alert.alert("Error", "An error occured",)
        })
}

export function VerifyAccountController({ setloading, Alert, navigation, data, login }) {
    VerifyAccountService(data.data.userData.id)
        .then(response => {
            if (response.success == false) {
                setloading(false)
                return Alert.alert("Error", response.message,)
            }
            // disp_Login(data.data.userData)
            // navigation.replace("Home", { data: data.data })

            Alert.alert("Success", "OTP verified successfully. Proceed to login to your account", [
                {
                    onPress: () => {
                        navigation.replace("Login")
                        setloading(false)
                    },
                    text: "Login"
                }
            ])

        })
        .catch(error => {
            setloading(false)
            console.log(error)
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
            console.log(error)
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
            console.log(error)
            return Alert.alert("Error", "An error occured",)
        })
}