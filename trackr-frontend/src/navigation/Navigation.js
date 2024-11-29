import React, { useContext } from 'react'; // Fix: Added `useContext`
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../../App'; // Ensure AuthContext is imported
import { Text } from 'react-native';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CalendarScreen from '../screens/CalendarScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NewGoalScreen from '../screens/NewGoalScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

//Setting Screen
import AccountScreen from '../screens/AccountScreen';
import PrivacyAndSecurityScreen from '../screens/PrivacyAndSecurityScreen';
import HelpAndSupportScreen from '../screens/HelpAndSupportScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import AboutScreen from '../screens/AboutScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ size }) => {
                    let icon;
                    if (route.name === 'Dashboard') icon = '🏠';
                    else if (route.name === 'Calendar') icon = '📅';
                    else if (route.name === 'New Goal') icon = '➕';
                    else if (route.name === 'Notification') icon = '🔔';
                    else if (route.name === 'Settings') icon = '⚙️';

                    return <Text style={{ fontSize: size }}>{icon}</Text>;
                },
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
            })}
        >
             <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="New Goal"
                component={NewGoalScreen}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Notification"
                component={NotificationScreen}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsStack}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    );
}

// Stack Navigator for Settings Section
function SettingsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Account" component={AccountScreen} options={{ title: 'Account' }} />
            <Stack.Screen name="PrivacyAndSecurity" component={PrivacyAndSecurityScreen} options={{ title: 'Privacy and Security' }} />
            <Stack.Screen name="HelpAndSupport" component={HelpAndSupportScreen} options={{ title: 'Help and Support' }} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ title: 'Privacy Policy' }} />
            <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
        </Stack.Navigator>
    );
}

export default function Navigation() {
    const { isAuthenticated } = useContext(AuthContext); // Fix: Ensure `useContext` works

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Main" component={TabNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
