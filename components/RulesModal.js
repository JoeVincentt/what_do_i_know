import React, { Component } from "react";
import { Item } from "native-base";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import HeaderText from "../constants/HeaderText";
import Modal from "react-native-modal";
import { SettingsConsumer } from "../context/SettingsContext";

export default class RulesModal extends Component {
  render() {
    return (
      <View>
        {/* rules modal */}
        <SettingsConsumer>
          {context => (
            <Modal
              isVisible={this.props.isRulesModalVisible}
              ref={ref => {
                this.context = context;
              }}
              backdropColor={context.backgroundColor.color2}
              backdropOpacity={0.95}
              animationIn="zoomInDown"
              animationOut="zoomOutUp"
              animationInTiming={600}
              animationOutTiming={600}
              backdropTransitionInTiming={600}
              backdropTransitionOutTiming={600}
            >
              <View style={styles.modalBox}>
                <View>
                  <View style={{ paddingBottom: 10 }}>
                    <HeaderText> g a m e{"  "}r u l e s : </HeaderText>
                  </View>
                  <Item style={styles.itemStyle}>
                    <Image
                      source={require("../assets/images/question.png")}
                      style={{
                        height: 40,
                        width: 40
                      }}
                    />
                    <HeaderText style={styles.modalText}>
                      {" "}
                      answer questions{" "}
                    </HeaderText>
                  </Item>
                  <Item style={styles.itemStyle}>
                    <Image
                      source={require("../assets/images/trophy.png")}
                      style={{
                        height: 40,
                        width: 40
                      }}
                    />
                    <HeaderText style={styles.modalText}>
                      get the best score{" "}
                    </HeaderText>
                  </Item>
                  <Item style={styles.itemStyle}>
                    <Image
                      source={require("../assets/images/target.png")}
                      style={{
                        height: 40,
                        width: 40
                      }}
                    />
                    <HeaderText style={styles.modalText}>
                      {" "}
                      get in top chart{"  "}
                    </HeaderText>
                  </Item>
                  <Item style={styles.itemStyle}>
                    <Image
                      source={require("../assets/images/key.png")}
                      style={{
                        height: 35,
                        width: 30
                      }}
                    />
                    <HeaderText style={styles.modalText}>
                      {"   "}
                      get hint for 20{"  "}
                    </HeaderText>
                    <Image
                      source={require("../assets/images/crystal.png")}
                      style={{
                        overflow: "visible",
                        height: 30,
                        width: 30
                      }}
                    />
                  </Item>
                  <Item style={styles.itemStyle}>
                    <Image
                      source={require("../assets/images/timer.png")}
                      style={{
                        height: 30,
                        width: 30
                      }}
                    />
                    <HeaderText style={styles.modalText}>
                      {"   "}
                      reset countdown for 10{"  "}
                    </HeaderText>
                    <Image
                      source={require("../assets/images/crystal.png")}
                      style={{
                        overflow: "visible",
                        height: 30,
                        width: 30
                      }}
                    />
                  </Item>
                  <Item style={styles.itemStyle}>
                    <Image
                      source={require("../assets/images/heart.png")}
                      style={{
                        height: 40,
                        width: 40
                      }}
                    />
                    <HeaderText style={styles.modalText}>
                      {" "}
                      for 35{"   "}
                    </HeaderText>
                    <Image
                      source={require("../assets/images/crystal.png")}
                      style={{
                        overflow: "visible",
                        height: 30,
                        width: 30
                      }}
                    />
                  </Item>
                  <Item style={styles.itemStyle}>
                    <Image
                      source={require("../assets/images/skip.png")}
                      style={{
                        height: 30,
                        width: 30
                      }}
                    />
                    <HeaderText style={styles.modalText}>
                      {"  "}
                      skip question for 15{"   "}
                    </HeaderText>
                    <Image
                      source={require("../assets/images/crystal.png")}
                      style={{
                        overflow: "visible",
                        height: 30,
                        width: 30
                      }}
                    />
                  </Item>

                  <View
                    style={{
                      paddingTop: 20,
                      paddingBottom: 10
                    }}
                  >
                    <HeaderText> Question difficulty : </HeaderText>
                  </View>
                  <Item style={styles.itemStyle}>
                    <Image
                      source={require("../assets/images/star.png")}
                      style={{
                        height: 30,
                        width: 30
                      }}
                    />
                    <HeaderText style={styles.modalText}> +1 score </HeaderText>
                  </Item>
                  <Item style={styles.itemStyle}>
                    <Image
                      source={require("../assets/images/star.png")}
                      style={{
                        height: 30,
                        width: 30
                      }}
                    />
                    <Image
                      source={require("../assets/images/star.png")}
                      style={{
                        height: 30,
                        width: 30
                      }}
                    />
                    <HeaderText style={styles.modalText}> +2 score </HeaderText>
                  </Item>
                  <Item style={styles.itemStyle}>
                    <Image
                      source={require("../assets/images/star.png")}
                      style={{
                        height: 30,
                        width: 30
                      }}
                    />
                    <Image
                      source={require("../assets/images/star.png")}
                      style={{
                        height: 30,
                        width: 30
                      }}
                    />
                    <Image
                      source={require("../assets/images/star.png")}
                      style={{
                        height: 30,
                        width: 30
                      }}
                    />
                    <HeaderText style={styles.modalText}> +3 score </HeaderText>
                  </Item>
                </View>
                <View style={{ padding: 10 }}>
                  <TouchableOpacity
                    onPress={() => this.props.closeRulesModal()}
                  >
                    <View style={{ elevation: 200 }}>
                      <Image
                        source={require("../assets/images/cross.png")}
                        style={{
                          height: 40,
                          width: 40,

                          overflow: "visible"
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </SettingsConsumer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalBox: {
    flex: 1,
    backgroundColor: "transparent",
    height: 300,
    justifyContent: "center",
    alignItems: "center"
  },
  modalText: { fontSize: 20 },
  itemStyle: {
    borderBottomColor: "transparent",
    padding: 3
  }
});
