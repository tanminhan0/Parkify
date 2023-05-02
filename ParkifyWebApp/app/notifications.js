import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => {
      return {
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowAlert: true,
      };
    },
  });


export function sendPushNotificationHandler() {
    fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        to: 'ExponentPushToken[hPNIOTHqB1tgToiAztDWkc]', //ExponentPushToken[sZKvLIDYw_1SIyYgm9xYxD]
        title: 'Payment completed!',
        body: 'Please leave within 15 minutes!',
        })
});
}

export async function configurePushNotifications() {
    const { status } = await Notifications.getPermissionsAsync();
    let finalStatus = status;

    if (finalStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permission required',
        'Push notifications need the appropriate permissions.'
      );
      return;
    }

    const pushTokenData = await Notifications.getExpoPushTokenAsync();
    console.log(pushTokenData);

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  }