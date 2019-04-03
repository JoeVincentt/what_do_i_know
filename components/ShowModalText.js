// import React, { Component } from "react";

// import HeaderText from "../constants/HeaderText";

// export const _showModalText = (correctAnswer, timeExpired) => {
//   if (correctAnswer === true) {
//     return (
//       <HeaderText
//         style={{
//           color: "#00e676",
//           shadowColor: "green",
//           shadowOpacity: 0.8,
//           shadowRadius: 20,
//           elevation: 1
//         }}
//       >
//         🎉 C O R R E C T{" "}
//       </HeaderText>
//     );
//   }
//   if (correctAnswer === false) {
//     return (
//       <HeaderText
//         style={{
//           color: "#ef5350",
//           shadowColor: "red",
//           shadowOpacity: 0.8,
//           shadowRadius: 20,
//           elevation: 1
//         }}
//       >
//         ❌ I N C O R R E C T{" "}
//       </HeaderText>
//     );
//   }
//   if (timeExpired) {
//     return (
//       <HeaderText
//         style={{
//           color: "#fdd835",
//           shadowColor: "yellow",
//           shadowOpacity: 0.8,
//           shadowRadius: 20,
//           elevation: 1
//         }}
//       >
//         🛎 T I M E {"  "}E X P I R E D
//       </HeaderText>
//     );
//   }
// };

// {
//   /* Modal starts here */
// }

// <Modal isVisible={this.state.showModal}>
//   <LinearGradient
//     colors={[
//       context.backgroundColor.color1,
//       context.backgroundColor.color2,
//       context.backgroundColor.color3
//     ]}
//     style={{
//       padding: 15,
//       alignItems: "center",
//       justifyContent: "center",
//       borderRadius: 20
//     }}
//   >
//     {_showModalText(correctAnswer, timeExpired)}

//     <Button
//       dark
//       full
//       style={{ borderRadius: 20, marginTop: 20 }}
//       onPress={() => this._closeModal()}
//     >
//       <HeaderText> c o n t i n u e </HeaderText>
//     </Button>
//     <View style={{ marginVertical: 10 }} />
//   </LinearGradient>
// </Modal>;

{
  /* modal ends here */
}
