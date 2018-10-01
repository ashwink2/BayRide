import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';
import Icon from 'react-native-vector-icons/Octicons';
import style from '../public/style';
import { WebBrowser } from 'expo';
import { TextField } from 'react-native-material-textfield';


export default class Help extends Component {

    state = {
        showFeatureList: false,
        listButtonText: "Click here to see features that will soon be implemented",
        feedback: '',
    }

    /**
     * This is the component that lets everyone know that we're still in beta mode...
     */

    handleList = () => {
        let bool = this.state.showFeatureList;
        if (bool) {
            this.setState({ showFeatureList: false, listButtonText: "Click here to see features that will soon be implemented" });
        } else {
            this.setState({ showFeatureList: true, listButtonText: "Close List" });
        }
    }

    submitFeedback = () => {
        console.log(this.state.feedback); // here we should actuall just send an email to me or someone...
        this.setState({ feedback: '' });
    }

	render () {
		return(
			<View style={style.background} >
                <Icon
                    style={style.drawerIcon}
                    name='three-bars'
                    size={30}
                    color='#000'
                    onPress={() => this.props.navigation.toggleDrawer()}
                />

                <View style={style.center} >

                    <Text>BAYRIDE BETA VERSION</Text>

                    <View style={style.horizontalRule} />

                    <Text>BayRide is currently in its Beta Phase.</Text>
                    <Text>As such, some features may not be available yet, and certain bugs may exist. We are committed to providing you with the best experience possible, and are working day and night to complete our fully functioning, bug-free version. We appreciate that you are supporting us in this early stage, and it is our hope that we can serve all of your ride-sharing needs</Text>
                    <Text>In order to help us improve BayRide, we would appreciate any feedback that you have to offer. Found a bug or encountered a problem? We'd love to hear about it, and we'll fix it as soon as we can. Have input about design or functionality? We're all ears!</Text>
                    <Text>To show our appreciation for your help, if you submit some feedback, we'll give you 20 RideNodes, BayRide's very own digital currency. Use these tokens to pay for your next ride.</Text>

					<TextField label="Feedback" placeholder="Enter any feedback you have :)"
						onChangeText={feedback => this.setState({ feedback })}
					/>
                    <Button>
                        rounded
                        style={style.button}
                        onPress={this.submitFeedback}
                        <Text>Submit Feedback</Text>
                    </Button>

                    <Button>
                        rounded
                        style={style.button}
                        onPress={this.handleList}
                        <Text>{this.state.listButtonText}</Text>
                    </Button>

                    {this.state.showFeatureList
                    ?   <View>
                            <Text>(1) RideNode payment integration</Text>
                            <Text>(2) Real-time, visual updates of driver's progress</Text>
                            <Text>(3) Credit/Debit card payment integration</Text>
                            <Text>(4) The ability for drivers to sort the list of Trips by various critiria</Text>
                            <Text>(5) The ability to rate trips</Text>
                            <Text>(6) Further safety features, such as instant location transmission</Text>
                            <Text>(7) Predictive assitance for both Drivers and Passengers</Text>
                        </View>
                    :   null}

                </View>

			</View>
		);
	}
}
