import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import { Vibration, Platform } from "react-native";

export function HandleFPN(navigation, FetchAllActiveRides) {
    // Handle background messages
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('Background Message:', remoteMessage);
    });

    // Handle notification when the app is opened from the background
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification caused app to open from background:', remoteMessage.notification);
    });

    // Create a notification channel
    PushNotification.createChannel(
        {
            channelId: "channel-id",
            channelName: "My Channel",
            channelDescription: "A channel for categorizing notifications",
            playSound: true,
            soundName: "default",
            vibrate: true,
        },
        (created) => console.log("Created channel:", created)
    );

    // Handle app launch from a notification
    messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
            if (remoteMessage) {
                console.log("Initial Notification:", remoteMessage);
            }
        });

    // Configure push notifications
    PushNotification.configure({
        onNotification: function (notification) {
            console.log("Notification Received:", notification);
            const { userInteraction, foreground, data, title, message } = notification;

            if (userInteraction) {
                handleNotificationClick(navigation, data);
            } else {
                handleForegroundNotification(FetchAllActiveRides, data, title, message, foreground);
            }
        },
        requestPermissions: Platform.OS === 'ios'
    });
}

function handleNotificationClick(navigation, data) {
    if (!data || !data.id) return;

    const [userType, orderId] = data.id.split(":");
    
    switch (userType) {
        case "RIDER":
            navigation.navigate("Home");
            break;
        case "USER":
            navigation.navigate("DeliveryDetails", { id: orderId });
            break;
        case "MEALORDER":
            navigation.navigate("Home");
            break;
        default:
            console.log("Unknown notification type", userType);
    }
}

function handleForegroundNotification(FetchAllActiveRides, data, title, message, foreground) {
    Vibration.vibrate(3000);
    console.log("Received notification in", foreground ? "foreground" : "background");

    PushNotification.localNotification({
        largeIconUrl: data?.largeImg,
        smallIcon: "ic_notifications",
        bigText: message,
        message,
        details: { repeated: false },
        channelId: "channel-id",
        subText: title,
        bigPictureUrl: data?.largeImg,
    });

    if (foreground) {
        FetchAllActiveRides();
    }
}
