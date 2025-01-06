import { Alert } from "react-native"
import { FetchUserInfoService } from "../auth/service"

export function FetchUserInfo({
    setloading,
    id,
    login,
    navigation
}) {
    setloading(true)
    FetchUserInfoService(id)
        .then(response => {
            if (response.success == false) {
                setloading(false)
                Alert.alert("Error", response.message)
            } else {
                if (response.success == true) {
                    setloading(false)
                    login({
                        ...response.data,
                        id: response.data.sub
                    })
                    navigation && navigation.navigate("Home")
                } else {
                    setloading(false)
                }
            }

        })
        .catch(error => {
            setloading(false)
            console.log(error)
        })
}