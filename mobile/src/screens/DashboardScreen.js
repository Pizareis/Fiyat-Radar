import { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { fetchAssets, fetchAnomalies } from "../api";

export default function DashboardScreen() {
  const [assets, setAssets] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [a, an] = await Promise.all([fetchAssets(), fetchAnomalies()]);
    setAssets(a);
    setAnomalies(an);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fiyat Radar</Text>
      <Text style={styles.section}>Takip edilen varliklar</Text>
      <FlatList
        data={assets}
        keyExtractor={(item) => item.symbol}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowText}>{item.display_name}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Yukleniyor...</Text>}
      />
      <Text style={styles.section}>Son anomaliler</Text>
      <FlatList
        data={anomalies}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowText}>{item.message}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Henuz anomali yok</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, backgroundColor: "#0f1115" },
  title: { fontSize: 24, fontWeight: "700", color: "#e6e8eb", marginBottom: 12 },
  section: { fontSize: 14, color: "#9aa0a6", marginTop: 16, marginBottom: 8 },
  row: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#262a31" },
  rowText: { color: "#e6e8eb" },
  empty: { color: "#9aa0a6", fontStyle: "italic" },
});
