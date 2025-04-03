import { Box } from "native-base";
import { supabase } from "../../../configurations/supabase-config";
import { UpdateProfilePhotoModel } from "./model";
import { Alert } from "react-native";

export function UpdateProfilePhoto(PickedImage, User, setLoading, login, setPickedImage) {
    setLoading(true)
    supabase.storage
        .from("dp")
        .upload(PickedImage.fileName, PickedImage.formData)
        .then(response => {
            let Img = response.data.path; 

            UpdateProfilePhotoModel(User.id, Img)
                .then(response => {
                    // console.log(response)
                    if (response.success == true) {
                        login({
                            ...User,
                            dp: response.data.dp
                        })
                        setPickedImage({ status: false })
                    } else {
                        Alert.alert("Error", response.message)
                        setPickedImage({ status: false })
                    }
                })
            setLoading(false)
        })
        .catch(error => {
            setLoading(false)
            setPickedImage({ status: false })
        })


}