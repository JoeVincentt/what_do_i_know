import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import HeaderText from "../constants/HeaderText";
import Modal from "react-native-modal";
import { SettingsConsumer } from "../context/SettingsContext";

export default class AnnouncementModal extends Component {
  render() {
    return (
      <View>
        <SettingsConsumer>
          {context => (
            <Modal
              isVisible={this.props.isAnnouncementModalVisible}
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
                {context.announcement.message !== "" ? (
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <View>
                      {context.announcement.header !== "" ? (
                        <HeaderText>
                          {"  "}
                          {context.announcement.header}
                          {"  "}
                        </HeaderText>
                      ) : null}
                    </View>
                    <View>
                      <HeaderText style={{ fontSize: 25 }}>
                        {"  "}
                        {context.announcement.message}
                        {"  "}
                      </HeaderText>
                    </View>
                    <View>
                      {context.announcement.footer !== "" ? (
                        <HeaderText style={{ fontSize: 20 }}>
                          {"  "}
                          {context.announcement.footer}
                          {"  "}
                        </HeaderText>
                      ) : null}
                    </View>
                  </View>
                ) : (
                  <View>
                    <HeaderText>
                      {"  "}No announcements today!{"  "}
                    </HeaderText>
                  </View>
                )}

                <View style={{ padding: 10 }}>
                  <TouchableOpacity
                    onPress={() => this.props.closeAnnouncementModal()}
                  >
                    <View style={{ elevation: 200 }}>
                      <Image
                        source={require("../assets/images/cross.png")}
                        style={{
                          height: 40,
                          width: 60,
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
