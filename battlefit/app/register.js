import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

const TAGS = ["헬스", "런닝", "요가", "필라테스", "자전거", "수영"];

export default function RegisterScreen() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [profileImg, setProfileImg] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        });
        if (!result.canceled) {
            setProfileImg(result.assets[0].uri);
        }
    };

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleRegister = async () => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("name", name);
        formData.append("favorite_tags", selectedTags.join(","));

        if (profileImg) {
            formData.append("profile_img", {
                uri: profileImg,
                name: "profile.jpg",
                type: "image/jpeg"
            });
        }

        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        if (data.success) {
            router.push("/login");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage} style={styles.profileCircle}>
                {profileImg ? (
                    <Image source={{ uri: profileImg }} style={styles.profileImg} />
                ) : (
                    <Text>프로필 선택</Text>
                )}
            </TouchableOpacity>

            <TextInput
                placeholder="아이디"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="비밀번호"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                placeholder="닉네임"
                style={styles.input}
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.tagLabel}>좋아하는 운동</Text>
            <View style={styles.tagContainer}>
                {TAGS.map(tag => (
                    <TouchableOpacity
                        key={tag}
                        style={[
                            styles.tag,
                            selectedTags.includes(tag) && styles.selectedTag
                        ]}
                        onPress={() => toggleTag(tag)}
                    >
                        <Text style={[
                            styles.tagText,
                            selectedTags.includes(tag) && styles.selectedTagText
                        ]}>
                            {tag}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleRegister}>
                <Text style={styles.btnText}>회원가입</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    input: {
        backgroundColor: "#eee",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10
    },
    profileCircle: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: "#ddd",
        justifyContent: "center", alignItems: "center",
        alignSelf: "center", marginBottom: 20
    },
    profileImg: { width: "100%", height: "100%", borderRadius: 50 },
    tagLabel: { fontSize: 16, marginVertical: 10, fontWeight: "bold" },
    tagContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#ccc",
        borderRadius: 20,
    },
    selectedTag: {
        backgroundColor: "#2C72C9"
    },
    tagText: { color: "#444" },
    selectedTagText: { color: "white" },
    btn: {
        backgroundColor: "#2C72C9",
        padding: 15, borderRadius: 10,
        alignItems: "center", marginTop: 20
    },
    btnText: { color: "white", fontWeight: "bold", fontSize: 16 }
});
