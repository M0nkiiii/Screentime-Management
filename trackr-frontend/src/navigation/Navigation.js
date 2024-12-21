import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../../App'; // Import AuthContext from App.js
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
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminRegisterScreen from '../screens/AdminRegisterScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';

// Settings Section Screens
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
            })}>
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

function SettingsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Account"
                component={AccountScreen}
                options={{ title: 'Account' }}
            />
            <Stack.Screen
                name="PrivacyAndSecurity"
                component={PrivacyAndSecurityScreen}
                options={{ title: 'Privacy and Security' }}
            />
            <Stack.Screen
                name="HelpAndSupport"
                component={HelpAndSupportScreen}
                options={{ title: 'Help and Support' }}
            />
            <Stack.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicyScreen}
                options={{ title: 'Privacy Policy' }}
            />
            <Stack.Screen
                name="About"
                component={AboutScreen}
                options={{ title: 'About' }}
            />
        </Stack.Navigator>
    );
}

export default function Navigation() {
    const { isAuthenticated, isAdminAuthenticated } = useContext(AuthContext);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated && !isAdminAuthenticated ? (
                    <>
                        {/* Unauthenticated Routes */}
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
                        <Stack.Screen name="AdminRegister" component={AdminRegisterScreen} />
                    </>
                ) : isAdminAuthenticated ? (
                    <>
                        {/* Admin-Specific Routes */}
                        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
                    </>
                ) : (
                    <>
                        {/* Regular User Routes */}
                        <Stack.Screen name="Main" component={TabNavigator} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
