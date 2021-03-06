import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';
import style from '../public/style';
import { store, auth } from '../fire';
import getDirections from 'react-native-google-maps-directions';
import call from 'react-native-phone-call';


export default class Winner extends React.Component {

	/**
	 * NOTE:
	 * 		When you reach Winner.js, the lot that you are working with should be a lot that is in lot_history.
	 * It should not be in the lots collection. If it is, then this is a mistake.
	 *
	 * ANOTHER NOTE:
	 * 		There should be no need to bother with Props. You should simply be able to only direct the correct drivers to winner,
	 * and then simply query the information.
	 */

	state = {
		lot : {},
		passenger : {},
		showFinishTrip: false,
		showDirectionsForTrip: false,
	};

	componentDidMount = async () => {
		let lotId;
		await store.collection("users").doc(auth.currentUser.email).get().then(user => {
			// Since the ride is not complete, then we can find the lotId (which links to a lot_history doc), as currentLot on the user
			lotId = user.data().currentLot.lotId;
		});
		await store.collection("lot_history").doc(lotId).get().then(lot => {
			this.setState({ lot: lot.data() });
		});
		await store.collection("users").doc(this.state.lot.passengerId).get().then(passenger => {
			this.setState({ passenger: passenger.data() })
		});

		// We need a way to do this below line, right? But if it's here, then ComponentDidMount never finishes..
		// this.handleTransmitLocation(); // We did this in parkupied, right?
	}

	/**
	 * I think that what we'll do is transmit their location every 5-10 seconds,
	 * while this.state.showDirectionsForTrip is false
	 * (once it's true, the driver is there, and the passenger doesn't need to see him on the map)
	 */
	handleTransmitLocation = () => {
		while (!this.state.showDirectionsForTrip) {
			setTimeout(async () => { // This setTimeout is very important, I think..
				let location = await Location.getCurrentPositionAsync({});
				let myLocation = {
					region: {
						lat: location.coords.latitude,
						lng: location.coords.longitude
					},
					fullAddress: 'N/A', // We don't really need this, but I tried to keep the same format as we used for other locations (ie, pickupLocation and dropoffLocation)
				};
				store.collection("users").doc(auth.currentUser.email).update({ location: myLocation });
			}, 10000)
		}
	}

	// It seems like these functions could be written more concisely / better, but I don't think it's really a big deal, since it doesn't really affect proformance, and they're pretty readable
	handleDirectionsToStart = () => {
		const data = {
			destination: {
				latitude: this.state.lot.pickupLocation.region.lat,
				longitude: this.state.lot.pickupLocation.region.lng
			},
			params: [
				{
					key: 'travelmode',
					value: 'driving'
				},
				{
					key: 'dir_action"',
					value: 'navigate'       // this instantly initializes navigation using the given travel mode
				}
			]
		};
		getDirections(data);
		this.setState({ showDirectionsForTrip: true })
	}

	handleDirectionsForTrip = () => {
		const data = {
			destination: {
				latitude: this.state.lot.dropoffLocation.region.lat,
				longitude: this.state.lot.dropoffLocation.region.lng
			},
			params: [
				{
					key: 'travelmode',
					value: 'driving'
				},
				{
					key: 'dir_action"',
					value: 'navigate'       // this instantly initializes navigation using the given travel mode
				}
			]
		};
		getDirections(data);
		this.setState({ showFinishTrip: true })
	}

	handleFinishTrip = () => {
		store.collection("users").doc(auth.currentUser.email).update({ currentLot: { lotId: '', inProgress: false } });
		store.collection("users").doc(this.state.lot.passengerId).update({ currentLot: { lotId: '', inProgress: false } });
		store.collection("lot_history").doc(this.state.lot.lotId).update({ showReceipt: true })
		this.props.navigation.navigate('DriverHome');
	}


	render () {
		return (
			<View style={style.background} >
				<View style={style.winner} >
					<Text> You are the Winner!</Text>
					<Text>Passenger Name: {this.state.passenger.name}</Text>
					<Button
						outline
						onPress={() => { call({ number: this.state.passenger.phone, prompt: true }).catch(console.error) }} >
						<Text>{this.state.passenger.phone}</Text>
					</Button>
					<Text>Passenger location</Text>

					<Button
							style={style.button}
							onPress={this.handleDirectionsToStart} >
						<Text style={style.buttonText} >Get Directions to {this.state.lot.pickupLocation && this.state.lot.pickupLocation.fullAddress}!</Text>
					</Button>

					{this.state.showDirectionsForTrip
					?	<Button
							style={style.button}
							onPress={this.handleDirectionsForTrip} >
							<Text style={style.buttonText} >Get Directions to {this.state.lot.dropoffLocation && this.state.lot.dropoffLocation.fullAddress}!</Text>
						</Button>
					:	null}

					{this.state.showFinishTrip
					?	<Button
							style={style.button}
							onPress={this.handleFinishTrip} >
							<Text style={style.buttonText} >Trip is Finished</Text>
						</Button>
					:	null}
				</View>
			</View>
		);
	}
}
