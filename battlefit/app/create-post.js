import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

const EXERCISE_TYPES = ["헬스", "크로스핏", "런닝", "축구", "필라테스", "기타"];
const DURATIONS = ["15분", "30분", "1시간", "2시간", "2시간 초과"];

export default function CreatePostScreen() {
    const router = useRouter();

    const [image, setImage] = useState(null);
    const [text, setText] = useState("");
    const [exerciseType, setExerciseType] = useState("헬스");
    const [duration, setDuration] = useState("30분");

    // 📌 이미지 고르기 (최신 expo-image-picker 대응 완료)
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // 📌 게시물 업로드
    const handlePost = async () => {
        const user_id = await AsyncStorage.getItem("user_id");
        if (!user_id) {
            alert("로그인이 필요합니다!");
            return;
        }

        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("text", text);
        formData.append("exercise_type", exerciseType);
        formData.append("duration", duration);

        if (image) {
            formData.append("image", {
                uri: image,
                name: "upload.jpg",
                type: "image/jpeg",
            });
        }

        const token = await AsyncStorage.getItem("token");

        try {
            const res = await fetch(`${API_URL}/posts`, {
                method: "POST",
                body: formData,  // ← RN이 알아서 multipart 바운더리 생성함
                headers: {
                    "Authorization": `Bearer ${token}`, // 🔥 이것만 있어야 함
                },
            });

            if (!res.ok) {
                const errMsg = await res.text();
                console.log("Upload Error:", errMsg);
                alert("업로드 실패: " + errMsg);
                return;
            }

            router.push("/");
        } catch (error) {
            console.log("Post Error", error);
            alert("업로드 중 오류 발생");
        }
    }


        return (
        <SafeAreaView style={styles.container}>
            {/* 상단 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>

                </TouchableOpacity>

            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* 이미지 업로드 */}
                <TouchableOpacity onPress={pickImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.previewImg} />
                    ) : (
                        <View style={styles.previewPlaceholder}>
                            <Ionicons name="camera" size={40} color="#777" />
                            <Text style={{ color: "#777" }}>Upload Image</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* 운동 종류 선택 */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>운동 종류</Text>
                    <View style={styles.tagsContainer}>
                        {EXERCISE_TYPES.map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.tagButton,
                                    exerciseType === type && styles.selectedTagButton,
                                ]}
                                onPress={() => setExerciseType(type)}
                            >
                                <Text
                                    style={[
                                        styles.tagText,
                                        exerciseType === type && styles.selectedTagText,
                                    ]}
                                >
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 운동 시간 선택 */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>운동 시간</Text>
                    <View style={styles.tagsContainer}>
                        {DURATIONS.map((d) => (
                            <TouchableOpacity
                                key={d}
                                style={[
                                    styles.tagButton,
                                    duration === d && styles.selectedTagButton,
                                ]}
                                onPress={() => setDuration(d)}
                            >
                                <Text
                                    style={[
                                        styles.tagText,
                                        duration === d && styles.selectedTagText,
                                    ]}
                                >
                                    {d}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 텍스트 입력 */}
                <TextInput
                    placeholder="Description"
                    placeholderTextColor="#999"
                    style={styles.textInput}
                    multiline
                    value={text}
                    onChangeText={setText}
                />

                {/* POST 버튼 */}
                <TouchableOpacity style={styles.postBtn} onPress={handlePost}>
                    <Text style={styles.postText}>POST</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#F7F6F2" },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
    title: { fontSize: 22, fontWeight: "bold", marginLeft: 15 },
    previewImg: { width: "100%", height: 250, borderRadius: 15, marginBottom: 20 },
    previewPlaceholder: {
        width: "100%",
        height: 250,
        backgroundColor: "#EEE",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    sectionContainer: { marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#333" },
    tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    tagButton: {
        backgroundColor: "#E0E0E0",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#D0D0D0",
    },
    selectedTagButton: { backgroundColor: "#2C72C9", borderColor: "#2C72C9" },
    tagText: { color: "#555", fontWeight: "500" },
    selectedTagText: { color: "white" },
    textInput: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 15,
        height: 120,
        textAlignVertical: "top",
        marginBottom: 20,
    },
    postBtn: {
        backgroundColor: "#2C72C9",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },
    postText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
