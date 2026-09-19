import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";

export default function RootLayout() {
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem("token");
            setLoggedIn(!!token);
            setLoading(false);
        };
        checkToken();
    }, []);

    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 200 }} />;

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ title: "BattleFit" }}   // 🔥 여기서 제목 변경
            />
            <Stack.Screen name="login" options={{ title: "로그인" }} />
            <Stack.Screen name="register" options={{ title: "회원가입" }} />
            <Stack.Screen name="create-post" options={{ title: "게시물 작성" }} />
        </Stack>
    );
}
