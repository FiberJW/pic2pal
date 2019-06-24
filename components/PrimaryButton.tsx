import * as React from "react";
import { TouchableOpacity, Text } from "react-native";
import { white20, white } from "../colors";
import { useScalableSize } from "../typography";

export default function PrimaryButton({ onPress, label }) {
  const rem1 = useScalableSize(1);

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
          fontSize: rem1,
          textAlign: "center",
          lineHeight: rem1,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
