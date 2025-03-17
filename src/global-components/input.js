import { StyleSheet, TextInput } from "react-native";
import { BoldText } from "./texts";

export const Input = ({
    Style, value, onChange,
    Placeholder, LabelText, Label,
    secureTextEntry, LabelMargin,
    type
}) => {
    return (
        <>
            {Label && <BoldText text={LabelText} color="#000" style={{ marginTop: LabelMargin }} />}

            <TextInput
                style={[styles.input, Style]}
                placeholder={Placeholder}
                placeholderTextColor="grey"
                onChangeText={onChange}
                secureTextEntry={secureTextEntry}
                keyboardType={type ? type : "default"}
            />
        </>
    )
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        padding: 15,
        marginVertical: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        color: "#000"
    },
});
