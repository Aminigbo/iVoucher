import { Alert } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";
import { captureRef } from 'react-native-view-shot';
import ShareLib from 'react-native-share';
import RNFS from 'react-native-fs';



// export const BaseURL = "http://192.168.1.121:9090/APP/"   //home
// export const BaseURL = "http://192.168.1.60:9090/APP/"  //office
// export const BaseURL = "http://192.168.216.218:9090/APP/"   //phone  
// export const BaseURL = "http://192.168.144.218:9090/APP/"   //Steawrt 


export const BaseURL = "https://i-voucher-server.vercel.app//APP/" 


export const DpUrl = "https://awkkradstjkklsyqbkhl.supabase.co/storage/v1/object/public/dp/"   //DP


export const formatDate = (inputDate) => {
  const date = new Date(inputDate);

  const day = date.getDate();
  const year = date.getFullYear();

  // Define an array to get the month name in the desired format
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Get the month in the desired format from the array
  const month = months[date.getMonth()];

  // Get the ordinal suffix for the day (e.g., 1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const ordinalDay = `${day}${getOrdinalSuffix(day)}`;

  // Construct the formatted date string
  const formattedDate = `${ordinalDay} ${month} ${year}`;
  // const formattedDate = `${ordinalDay} ${month}`;

  return formattedDate;
};




export const NumberWithCommas = (x) => {
  // return 4000;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function generateRandomString() {
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKQRSTUVWXYZ012345678945678934567';
  let result = 'Blake-';

  for (let i = 0; i < 4; i++) {
    result += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
  }

  return result;
}


export const onShareToken = async (token) => {
  try {
    await ShareLib.open({
      message: token,
    });
  } catch (error) {
    console.log("Image deleted from cache");
  }
};



// export async function ImagePicker({ setPickedImage, prop }) {
//   const options = {
//     storageOptions: {
//       path: "images",
//       mediaType: "photo",
//     },
//     includeBase64: true, // Ensures base64 data is included
//     quality: 0.7,
//   };

//   launchImageLibrary(options, (response) => {
//     if (response.didCancel) {
//       console.log("User cancelled image picker");
//     } else if (response.error) {
//       console.log("ImagePicker Error: ", response.error);
//     } else if (response.customButton) {
//       console.log("User tapped custom button: ", response.customButton);
//     } else {
//       const asset = response.assets[0];

//       if (!asset) return;

//       const { uri, base64, height, width } = asset;
//       const fileExt = uri.substring(uri.lastIndexOf(".") + 1);
//       const fileName = `${Math.random()}.${fileExt}`;
//       const base64Image = `data:image/${fileExt};base64,${base64}`;

//       var formData = new FormData();
//       formData.append("files", {
//         uri,
//         name: fileName,
//         type: `image/${fileExt}`,
//       });

//       setPickedImage({
//         source: { uri },
//         fileName,
//         formData,
//         base64: base64Image, // This is the Base64 string you need
//         height,
//         width,
//         status: true,
//         type: prop,
//       });
//     }
//   });
// }

export async function ImagePicker({ setPickedImage, prop }) {
  const options = {
    storageOptions: {
      path: "images",
      mediaType: "photo",
    },
    includeBase64: true, // Ensures base64 data is included
    quality: 0.7,
  };

  launchImageLibrary(options, async (response) => {
    if (response.didCancel) {
      console.log("User cancelled image picker");
    } else if (response.error) {
      console.log("ImagePicker Error: ", response.error);
    } else {
      let asset = response.assets?.[0];
      if (!asset) return;

      let { uri, base64, height, width } = asset;
      let fileExt = uri.substring(uri.lastIndexOf(".") + 1);
      let fileName = `${Math.random()}.${fileExt}`;
      let base64Image = `data:image/${fileExt};base64,${base64}`;

      // Calculate file size in bytes
      let fileSizeInBytes = (base64.length * 3) / 4 - (base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0);
      const maxSize = 1048576; // 1MB

      // If file is too large, compress it
      if (fileSizeInBytes >= maxSize) {
        console.log("File too large, compressing...");
        try {
          let compressQuality = 30; // Start with 80% quality
          let compressedImage = await ImageResizer.createResizedImage(uri, width * 0.3, height * 0.3, "PNG", compressQuality);
          uri = compressedImage.uri;

          console.log(compressedImage.size)

        } catch (error) {
          console.log("Image compression failed:", error);
          return;
        }
      }

      var formData = new FormData();
      formData.append("files", {
        uri,
        name: fileName,
        type: `image/${fileExt}`,
      });

      setPickedImage({
        source: { uri },
        fileName,
        formData,
        base64: base64Image,
        height,
        width,
        status: true,
        type: prop,
      });
    }
  });
}




export const nigerianBanks = [
  {
    "name": "Access Bank Nigeria",
    "code": "044",
    "type": "Commercial Bank"
  },
  {
    "name": "Citibank Nigeria",
    "code": "023",
    "type": "Commercial Bank"
  },
  {
    "name": "Coronation Merchant Bank",
    "code": "559",
    "type": "Commercial Bank"
  },
  {
    "name": "Ecobank Nigeria",
    "code": "050",
    "type": "Commercial Bank"
  },
  {
    "name": "Fidelity Bank Nigeria",
    "code": "070",
    "type": "Commercial Bank"
  },
  {
    "name": "First Bank of Nigeria",
    "code": "011",
    "type": "Commercial Bank"
  },
  {
    "name": "First City Monument Bank (FCMB)",
    "code": "214",
    "type": "Commercial Bank"
  },
  {
    "name": "Globus Bank",
    "code": "001",
    "type": "Commercial Bank"
  },
  {
    "name": "Guaranty Trust Bank (GTBank)",
    "code": "058",
    "type": "Commercial Bank"
  },
  {
    "name": "Heritage Bank Plc",
    "code": "030",
    "type": "Commercial Bank"
  },
  {
    "name": "Keystone Bank Limited",
    "code": "082",
    "type": "Commercial Bank"
  },
  {
    "name": "Polaris Bank",
    "code": "076",
    "type": "Commercial Bank"
  },
  {
    "name": "Providus Bank",
    "code": "101",
    "type": "Commercial Bank"
  },
  {
    "name": "Stanbic IBTC Bank Nigeria",
    "code": "221",
    "type": "Commercial Bank"
  },
  {
    "name": "Standard Chartered Bank Nigeria",
    "code": "068",
    "type": "Commercial Bank"
  },
  {
    "name": "Sterling Bank Nigeria",
    "code": "232",
    "type": "Commercial Bank"
  },
  {
    "name": "SunTrust Bank Nigeria Limited",
    "code": "100",
    "type": "Commercial Bank"
  },
  {
    "name": "Titan Trust Bank Limited",
    "code": "022",
    "type": "Commercial Bank"
  },
  {
    "name": "Union Bank of Nigeria",
    "code": "032",
    "type": "Commercial Bank"
  },
  {
    "name": "United Bank for Africa (UBA)",
    "code": "033",
    "type": "Commercial Bank"
  },
  {
    "name": "Unity Bank Plc",
    "code": "215",
    "type": "Commercial Bank"
  },
  {
    "name": "Wema Bank Nigeria",
    "code": "035",
    "type": "Commercial Bank"
  },
  {
    "name": "Zenith Bank Nigeria",
    "code": "057",
    "type": "Commercial Bank"
  },
  {
    "name": "Jaiz Bank Plc",
    "code": "301",
    "type": "Non-Interest Bank"
  },
  {
    "name": "Bank of Industry (BOI)",
    "code": "030",
    "type": "Development Finance Institution"
  },
  {
    "name": "Bank of Agriculture (BOA)",
    "code": "030",
    "type": "Development Finance Institution"
  },
  {
    "name": "Nigeria Export-Import Bank (NEXIM)",
    "code": "030",
    "type": "Development Finance Institution"
  },
  {
    "name": "Development Bank of Nigeria (DBN)",
    "code": "030",
    "type": "Development Finance Institution"
  },
  {
    "name": "Microfinance Banks",
    "code": "N/A",
    "type": "Microfinance Bank"
  }
];

export function timeAgo(dateString) {
  const now = new Date();
  const pastDate = new Date(dateString);
  const diffInMs = now - pastDate;

  // Convert milliseconds to different units
  const diffInMinutes = Math.floor(diffInMs / 1000 / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30); // Approximate month length
  const diffInYears = Math.floor(diffInMonths / 12);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks}wk ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths}m ago`;
  } else {
    return `${diffInYears}yr ago`;
  }
}


export const onShare = async ({
  qrCodeRef,
}) => {
  console.log("Clicked on share");
  try {
    // Capture the QR code view
    const uri = await captureRef(qrCodeRef, {
      format: 'png',
      quality: 1,
    });
    console.log("onShare", uri)

    // Share the captured image
    await ShareLib.open({
      url: uri,
      message: "Enjoy seamless transactions with Pocket Voucher.",
    });
    // Delete the image from cache after sharing
    await RNFS.unlink(uri);
    console.log("Image deleted from cache");

  } catch (error) {
    // Delete the image from cache after sharing
    await RNFS.unlink(uri);
    console.log("Image deleted from cache");
    Alert.alert("Error", error.message);
  }
};