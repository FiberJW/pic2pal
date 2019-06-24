import * as React from "react";
import { TouchableOpacity, Text } from "react-native";
import { white20, white } from "../colors";

export default function PrimaryButton({ onPress, label }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 16,
        marginTop: 24,
        width: "100%",
        backgroundColor: white20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontFamily: "manrope-semibold",
          color: white,
          fontSize: 16,
          textAlign: "center",
          lineHeight: 16,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
