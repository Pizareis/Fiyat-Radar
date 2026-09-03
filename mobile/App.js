import { useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import DashboardScreen from "./src/screens/DashboardScreen";
import { registerForPushNotifications } from "./src/notifications";

export default function App() {
  useEffect(() => {
    registerForPushNotifications();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f1115" }}>
      <StatusBar barStyle="light-content" />
      <DashboardScreen />
    </SafeAreaView>
  );
}
