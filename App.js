import React, { Component } from 'react';

//import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//import screens
import Start from './components/Start';
import Chat from './components/Chat';

//Create the Navigator
const Stack = createStackNavigator();

export default class App extends Component {
	render() {
		return (
			//Navigation between screens
				<NavigationContainer>
					<Stack.Navigator initialRouteName="Start">
					<Stack.Screen name="Start" component={Start} />
					<Stack.Screen name="Chat" component={Chat} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}
