import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { registerDeviceToken } from "./api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.warn("Push notifications require a physical device");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.warn("Push notification permission denied");
    return null;
  }

  const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync();
  await registerDeviceToken(expoPushToken);
  return expoPushToken;
}
