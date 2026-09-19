// app/comment.js
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Button
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";
import { useEffect, useState } from "react";

export default function CommentScreen() {
    const { post_id } = useLocalSearchParams();
    const router = useRouter();

    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");

    /* ----------------------------------------
       📌 댓글 불러오기
    ---------------------------------------- */
    const loadComments = async () => {
        if (!post_id) return;

        try {
            const res = await fetch(`${API_URL}/comments/${post_id}`);
            const data = await res.json();
            setComments(data);
        } catch (error) {
            console.log("❌ Failed to load comments:", error);
        }
    };

    useEffect(() => {
        loadComments();
    }, [post_id]);

    /* ----------------------------------------
       📌 댓글 작성
    ---------------------------------------- */
    const submitComment = async () => {
        if (!content.trim()) return alert("댓글을 입력하세요!");

        const token = await AsyncStorage.getItem("token");
        const user_id = await AsyncStorage.getItem("user_id");

        try {
            const res = await fetch(`${API_URL}/comments/${post_id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id, content })
            });

            const data = await res.json();
            if (!res.ok) {
                alert("댓글 작성 실패");
                console.log("❌", data);
                return;
            }

            setContent("");
            loadComments();
        } catch (error) {
            console.log("❌ 댓글 작성 오류:", error);
        }
    };

    return (
        <View style={styles.container}>
            {/* 상단 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backText}>◀ Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>댓글</Text>
            </View>

            {/* 댓글 목록 */}
            <ScrollView style={styles.commentsBox}>
                {comments.length === 0 ? (
                    <Text style={{ color: "#777" }}>첫 댓글을 작성해주세요!</Text>
                ) : (
                    comments.map((c) => (
                        <View key={c.id} style={styles.commentRow}>
                            <Image
                                source={{ uri: `${API_URL}${c.profile_img}` }}
                                style={styles.profileImg}
                            />
                            <View>
                                <Text style={styles.commentName}>{c.username}</Text>
                                <Text style={styles.commentText}>{c.content}</Text>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* 댓글 입력 */}
            <View style={styles.inputRow}>
                <TextInput
                    value={content}
                    onChangeText={setContent}
                    placeholder="댓글 입력..."
                    style={styles.input}
                />
                <TouchableOpacity style={styles.submitBtn} onPress={submitComment}>
                    <Text style={styles.submitText}>작성</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

/* ----------------------------------------
   🎨 스타일
---------------------------------------- */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    backText: {
        fontSize: 18,
        color: "#2C72C9",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginLeft: 20,
    },

    commentsBox: {
        flex: 1,
        marginBottom: 20,
    },

    commentRow: {
        flexDirection: "row",
        marginBottom: 15,
        alignItems: "flex-start",
    },
    profileImg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    commentName: {
        fontWeight: "bold",
        fontSize: 15,
    },
    commentText: {
        fontSize: 14,
        color: "#333",
    },

    inputRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    submitBtn: {
        backgroundColor: "#2C72C9",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginLeft: 10,
    },
    submitText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
