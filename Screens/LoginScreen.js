import React, { Component } from "react";
import { Button, StyleSheet, View, TextInput, Text, Image } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import AppConf from "../app.json";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "" };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  Login = () => {
    if (this.state.username.length > 0) {
      fetch(AppConf.hostname + "/users/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.state.username
        })
      })
        .then(response => response.json())
        .then(async responseJson => {
          const { navigate } = this.props.navigation;
          await AsyncStorage.setItem("usuario", responseJson.username);
          await AsyncStorage.setItem("id", responseJson._id);

          navigate("Messages");
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  handleInputChange(event = {}) {
    this.setState({ username: event });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Awesome Chat!</Text>
          <Image style={styles.logo} source={require("./logo.png")} />
        </View>

        <View style={styles.formContainer}>
          <TextInput
            name="username"
            onChangeText={this.handleInputChange}
            value={this.state.username}
            style={styles.inputBox}
            placeholder="Nome de usuario"
          />
          <Button textStyle={{}} title="Login" onPress={e => this.Login(e)} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#435572"
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50
  },
  title: {
    textAlign: "center",
    color: "white",
    margin: 25,
    fontSize: 25
  },
  inputBox: {
    backgroundColor: "#F5FCFF",
    margin: 15,
    textAlign: "center",
    color: "black"
  },
  logo: {
    width: 80,
    height: 80,
    margin: 5
  },
  formContainer: {}
});
