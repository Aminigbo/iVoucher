import { BaseURL } from "../../utilities";

export async function UpdateProfilePhotoModel(uuid, dp) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "uuid": uuid,
        "data": {
            "dp": dp
        }
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}auth/verify-otp`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}