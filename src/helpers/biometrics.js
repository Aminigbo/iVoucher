import ReactNativeBiometrics from "react-native-biometrics";

function ConfigBiometric({
    key,
    BiometricAuth,
    setbiometricLoader,
    isBiometric,
    callBack
}) {
    BiometricAuth(!isBiometric)
    setbiometricLoader(false)

    callBack && callBack()

}


export const handleBiometricAuth = async ({
    setbiometricLoader,
    setkey,
    Key,
    isBiometric,
    BiometricAuth,
    message,
    callBack
}) => {

    const rnBiometrics = new ReactNativeBiometrics();

    try {
        const { biometryType } = await rnBiometrics.isSensorAvailable();
        if (biometryType === "Biometrics") {
            // console.log('Biometric sensor available');

            // Check if keys already exist
            const keysExist = await rnBiometrics.biometricKeysExist();

            if (!keysExist.keysExist) {
                console.log('No keys found, creating keys...');
                const { publicKey } = await rnBiometrics.createKeys();
                // console.log('Public key created:', publicKey); 

                setkey(publicKey)
            } else {
                setkey("User.publicKey")
            }

            setbiometricLoader(true)
            const epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
            const payload = epochTimeSeconds + 'some message';

            const { success, signature } = await rnBiometrics.createSignature({
                // promptMessage: isBiometric == false ? "Set Biometric auth" : "Disable Biometric auth",
                promptMessage: message,
                payload: payload, // Use a meaningful payload
            });

            if (success) {
                console.log("Success")
                ConfigBiometric({
                    Key,
                    BiometricAuth,
                    setbiometricLoader,
                    isBiometric,
                    callBack
                }) // save
            } else {
                setbiometricLoader(false)
                console.log('Signature creation failed');
            }

        } else {
            // setbiometricLoader(false)
            // console.log(biometryType)
            // console.log('Biometric authentication not available');

            // console.log('Biometric sensor available');

            // Check if keys already exist
            const keysExist = await rnBiometrics.biometricKeysExist();

            if (!keysExist.keysExist) {
                console.log('No keys found, creating keys...');
                const { publicKey } = await rnBiometrics.createKeys();
                // console.log('Public key created:', publicKey); 

                setkey(publicKey)
            } else {
                setkey("User.publicKey")
            }

            setbiometricLoader(true)
            const epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
            const payload = epochTimeSeconds + 'some message';

            const { success, signature } = await rnBiometrics.createSignature({
                // promptMessage: isBiometric == false ? "Set Biometric auth" : "Disable Biometric auth",
                promptMessage: message,
                payload: payload, // Use a meaningful payload
            });

            if (success) {
                console.log("Success")
                ConfigBiometric({
                    Key,
                    BiometricAuth,
                    setbiometricLoader,
                    isBiometric,
                    callBack
                }) // save
            } else {
                setbiometricLoader(false)
                console.log('Signature creation failed');
            }


        }
    } catch (error) {
        setbiometricLoader(false)
        console.error('Biometric authentication error:', error);
    }
}