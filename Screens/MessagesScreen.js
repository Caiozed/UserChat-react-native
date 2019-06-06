import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { GiftedChat } from "react-native-gifted-chat";
import SocketIOClient from "socket.io-client";
import AppConf from "../app.json";

export default class MessagesScreen extends React.Component {
  state = {
    messages: [],
    message: "",
    usuarioAtual: "",
    user_id: 0
  };

  constructor(props) {
    super(props);

    this.socket = SocketIOClient(AppConf.hostname);
    this.socket.emit("connection");

    this.socket.on("new-message", data => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, data)
      }));
    });

    this.socket.on("remove-message", data => {
      let id = data._id;
      fetch(AppConf.hostname + "/messages")
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            messages: responseJson
          });
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  async componentDidMount() {
    var usuarioAtual = await AsyncStorage.getItem("usuario");
    var id = await AsyncStorage.getItem("id");

    this.setState({
      usuarioAtual: usuarioAtual,
      user_id: id
    });

    fetch(AppConf.hostname + "/messages")
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({
          messages: responseJson
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  onSend(messages = []) {
    var message = {
      text: this.state.message,
      createdAt: new Date(),
      user: {
        _id: this.state.user_id,
        name: this.state.usuarioAtual
      }
    };

    fetch(AppConf.hostname + "/new/message", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(message)
    })
      .then(response => {
        response.json();
      })
      .then(response => {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages)
        }));
      })
      .catch(error => {
        console.error(error);
      });
  }

  setCustomText = e => {
    this.setState(() => ({
      message: e
    }));
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <GiftedChat
          renderLoading={() => (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
          placeholder="Insira uma mensagem!"
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          renderUsernameOnMessage={true}
          onInputTextChanged={text => this.setCustomText(text)}
          user={{
            _id: this.state.user_id,
            name: this.state.usuarioAtual
          }}
          text={this.state.message}
        />
      </View>
    );
  }
}
