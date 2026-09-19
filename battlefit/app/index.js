import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useCallback } from "react";

import { API_URL } from "../constants/api";

export default function HomeScreen() {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    /* -----------------------------
       ❤️ 좋아요 토글
    ------------------------------ */
    const handleLike = async (post_id) => {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            alert("로그인이 필요합니다!");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/likes/${post_id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.error || "좋아요 실패");
                return;
            }

            loadPosts(); // 좋아요 갱신
        } catch (err) {
            console.log("Like Error:", err);
        }
    };

    /* -----------------------------
       💬 댓글 페이지 이동
    ------------------------------ */
    const handleComment = (post_id) => {
        router.push(`/comment?post_id=${post_id}`);
    };

    /* -----------------------------
       📌 게시물 불러오기
    ------------------------------ */
    const loadPosts = useCallback(async () => {
        !refreshing && setLoading(true);

        try {
            const res = await fetch(`${API_URL}/posts`);
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error("Error loading posts:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [refreshing]);

    useEffect(() => {
        loadPosts();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadPosts();
    };

    /* -----------------------------------------
       🔥 게시물 카드 렌더링
    ------------------------------------------ */
    const renderPost = ({ item: post }) => (
        <View style={styles.card}>
            {/* 프로필 */}
            <View style={styles.profileRow}>
                <Image
                    source={{ uri: `${API_URL}${post.profile_img}` }}
                    style={styles.profileImg}
                />
                <View>
                    <Text style={styles.profileName}>{post.username}</Text>
                    <Text style={styles.timeText}>
                        {new Date(post.created_at).toLocaleString()}
                    </Text>
                </View>
            </View>

            {/* 텍스트 */}
            <Text style={styles.postText}>{post.text}</Text>

            {/* 태그 */}
            <View style={styles.tagsContainer}>
                <View style={styles.tag}>
                    <Text style={styles.tagText}>{post.exercise_type}</Text>
                </View>
                <View style={styles.tag}>
                    <Text style={styles.tagText}>{post.duration}</Text>
                </View>
            </View>

            {/* 이미지 */}
            {post.image_url && (
                <Image
                    source={{ uri: `${API_URL}${post.image_url}` }}
                    style={styles.postImg}
                />
            )}

            {/* 좋아요 / 댓글 수 */}
            <View style={styles.bottomRow}>
                <TouchableOpacity onPress={() => handleLike(post.id)}>
                    <Text style={styles.iconText}>❤️ {post.like_count}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleComment(post.id)}>
                    <Text style={styles.iconText}>💬 {post.comment_count}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <ActivityIndicator style={{ marginTop: 20 }} size="large" />
            ) : (
                <FlatList
                    data={posts}
                    renderItem={renderPost}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            )}
        </SafeAreaView>
    );
}

/* -----------------------------------------
   ⭐ 스타일
------------------------------------------ */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F6F2" },
    listContent: { paddingBottom: 120 },

    card: {
        backgroundColor: "white",
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 15,
        padding: 15,
    },

    profileRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    profileImg: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    profileName: { fontWeight: "bold", fontSize: 16 },
    timeText: { color: "#777", fontSize: 12 },

    postText: { marginVertical: 5, fontSize: 15, marginBottom: 10 },

    tagsContainer: { flexDirection: "row", gap: 8, marginBottom: 10 },
    tag: {
        backgroundColor: "#E8E8E8",
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    tagText: { color: "#555", fontWeight: "600", fontSize: 12 },

    postImg: { width: "100%", height: 250, borderRadius: 10, marginTop: 10 },

    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
        paddingHorizontal: 5,
    },
    iconText: { fontSize: 14, color: "#444", fontWeight: "600" },
});
