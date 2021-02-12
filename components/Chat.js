import React from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, Day, GiftedChat, SystemMessage } from 'react-native-gifted-chat';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			messages: [],
			user: {
				_id: '',
				name: '',
				avatar: '',
			},
		};

		// Firebase configuration for app
		const firebaseConfig = {
			apiKey: 'AIzaSyAoXioUktiim_Rm2prqXDZ65tEFPsU6ukA',
			authDomain: 'chat-app-548d3.firebaseapp.com',
			projectId: 'chat-app-548d3',
			storageBucket: 'chat-app-548d3.appspot.com',
			messagingSenderId: '946287131661',
			appId: '1:946287131661:web:c5172cd3394a85d8e8a944',
		};

		// Initialize Firestore
		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
		}

		// Connect to Firestore to store messages in the database
		this.referenceChatMessages = firebase.firestore().collection('messages');
	}

	componentDidMount() {
		// Define props passed from Start screen
		const { name } = this.props.route.params;

		// Populate user's name, if entered
		this.props.navigation.setOptions({ title: name });

		// Authenticate user with Firebase
		this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
			if (!user) {
				firebase.auth().signInAnonymously();
			}
			this.setState({
				user: {
					_id: user.uid,
					name: name,
					avatar: 'https://placeimg.com/140/140/any',
				},
				messages: [],
			});
			this.unsubscribe = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
		});
	}

	componentWillUnmount() {
		// Stop listening for authentication
		this.unsubscribe();

		// Stop listening for collection changes
		this.authUnsubscribe();
	}

	// Add new message to Firestore db
	addMessage() {
		const message = this.state.messages[0];
		this.referenceChatMessages.add({
			_id: message._id,
			createdAt: message.createdAt,
			text: message.text || '',
			user: message.user,
		});
	}

	// Append new message to messages array
	onSend(messages = []) {
		this.setState(
			(previousState) => ({
				messages: GiftedChat.append(previousState.messages, messages),
			}),
			() => {
				this.addMessage();
				// this.saveMessages();
			}
		);
	}

	// Update messages state when new message is added to Firestore db
	onCollectionUpdate = (querySnapshot) => {
		const messages = [];

		// Go through each document
		querySnapshot.forEach((doc) => {
			// Get the QueryDocumentSnapshot's data
			let data = doc.data();
			messages.push({
				_id: data._id,
				createdAt: data.createdAt.toDate(),
				text: data.text,
				user: {
					_id: data.user._id,
					name: data.user.name,
					avatar: data.user.avatar,
				},
			});
		});
		this.setState({
			messages,
		});
	};

	// Change styles for System Messages
	renderSystemMessage(props) {
		return (
			<SystemMessage
				{...props}
				textStyle={{
					color: '#fff',
					fontSize: 12,
					fontWeight: '600',
				}}
			/>
		);
	}

	// Change styles for date
	renderDay(props) {
		return (
			<Day
				{...props}
				textStyle={{
					color: '#fff',
					fontSize: 12,
					fontWeight: '600',
				}}
			/>
		);
	}

	// Change styles for chat bubbles
	renderBubble(props) {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					right: {
						backgroundColor: '#757083',
					},
				}}
			/>
		);
	}

	render() {
		// Define props passed from Start screen
		const { color } = this.props.route.params;

		return (
			// Sets colorChoice from Start screen as Chat screen background color
			<View style={{ flex: 1, backgroundColor: color }}>
				<GiftedChat renderSystemMessage={this.renderSystemMessage.bind(this)} renderDay={this.renderDay.bind(this)} renderBubble={this.renderBubble.bind(this)} messages={this.state.messages} onSend={(messages) => this.onSend(messages)} user={this.state.user} />
				{Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
			</View>
		);
	}
}
// const styles = StyleSheet.create({
// });
