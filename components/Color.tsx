import * as React from "react";
import { Text, View } from "react-native";
import { black, white } from "../colors";

export default function Color({ style, value }) {
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: value,
          alignItems: "center",
        },
        style,
      ]}
    >
      <View
        style={{
          backgroundColor: black,
          alignItems: "center",
          justifyContent: "center",
          padding: 8,
          width: "30%",
        }}
      >
        <Text
          selectable
          style={{
            color: white,
            textAlign: "center",
            fontFamily: "manrope-semibold",
            fontSize: 12,
            lineHeight: 12,
          }}
        >
          {value.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}
