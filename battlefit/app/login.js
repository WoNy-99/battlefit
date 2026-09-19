import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator
} from "react-native";

import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";

export default function LoginScreen() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Login Failed", "Please enter both username and password.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || "Login failed");
            }

            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("user_id", data.user.id.toString());

            router.replace("/");
        } catch (error) {
            Alert.alert("Login Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>로그인</Text>

            <TextInput
                placeholder="아이디"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <TextInput
                placeholder="비밀번호"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity
                style={[styles.btn, loading && styles.disabledBtn]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.btnText}>로그인</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.link}>회원가입</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, marginTop: 100, justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, textAlign: 'center' },
    input: {
        backgroundColor: "#eee",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15
    },
    btn: {
        backgroundColor: "#2C72C9",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10
    },
    disabledBtn: {
        backgroundColor: "#A5C9F2",
    },
    btnText: { color: "white", fontWeight: "bold", fontSize: 16 },
    link: { color: "#2C72C9", marginTop: 20, textAlign: "center", fontSize: 16 }
});
