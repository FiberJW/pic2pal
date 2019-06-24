import * as React from "react";
import { Text, View } from "react-native";
import { black, white } from "../colors";
import { useScalableSize } from "../typography";

export default function Color({ style, value }) {
  const rem0_75 = useScalableSize(0.75);

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
            fontSize: rem0_75,
            lineHeight: rem0_75,
          }}
        >
          {value.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}
