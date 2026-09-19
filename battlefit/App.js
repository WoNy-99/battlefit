import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import CreatePostScreen from "./screens/CreatePostScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => {
                        let iconName;

                        if (route.name === "Home") {
                            iconName = "home-outline";
                        } else if (route.name === "Create") {
                            iconName = "add-circle-outline";
                        }

                        return <Ionicons name={iconName} size={26} color={color} />;
                    },
                    tabBarActiveTintColor: "#2563EB",
                    tabBarInactiveTintColor: "gray",
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Create" component={CreatePostScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
