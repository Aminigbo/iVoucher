import { Alert } from "react-native"
import { FetchTransactionHistoryModel } from "../auth/service"

export function FetchTransactionHistoryController(setData, type, ref, setLoading) {
    setLoading(true)
    FetchTransactionHistoryModel(type, ref)
        .then(response => {
            // console.log(response.data)
            if (response.success == false) {
                Alert.alert("Error", response.message)
            } else {
                if (response.success == true) {
                    setData(response.data)
                } else {
                    setData(null)
                }
            }
            setLoading(false)
        })
        .catch(error => {
            setLoading(false)
            setData(null)
            console.log(error)
        })
}