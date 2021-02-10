import React from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			messages: [],
		};
	}

	componentDidMount() {
		// Define props passed from Start screen
		const { name } = this.props.route.params;

		// Populate user's name, if entered
		this.props.navigation.setOptions({ title: name });

		// Set static messages
		this.setState({
			messages: [
				{
					_id: 1,
					text: 'Hello!',
					createdAt: new Date(),
					user: {
						_id: 2,
						name: 'React Native',
						avatar: 'https://placeimg.com/140/140/any',
					},
				},
				{
					_id: 2,
					text: `Welcome to the chat, ${this.props.route.params.name}!`,
					createdAt: new Date(),
					system: true,
				},
			],
		});
	}
	// Append new message to messages array so that new message is displayed in chat with all messages
	onSend(messages = []) {
		this.setState((previousState) => ({
			messages: GiftedChat.append(previousState.messages, messages),
		}));
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
				<GiftedChat
					renderBubble={this.renderBubble.bind(this)}
					messages={this.state.messages}
					onSend={(messages) => this.onSend(messages)}
					user={{
						_id: 1,
					}}
				/>
				{Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
			</View>
		);
	}
}
// const styles = StyleSheet.create({
// });
