import * as React from "react";
import { useEffect, Children, cloneElement, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useMachine } from "@xstate/react";
import * as Font from "expo-font";
import { black, white } from "./colors";
import { appMachine, STATES, TRIGGERS, ACTIONS } from "./state";
import Color from "./components/Color";
import PrimaryButton from "./components/PrimaryButton";
import { FirstChildGetsNoSpecialTreatment } from "./components/helpers";
import { useScalableSize } from "./typography";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const [current, send] = useMachine(appMachine);

  const rem0_75 = useScalableSize(0.75);
  const rem1 = useScalableSize(1);
  const rem1_5 = useScalableSize(1.5);
  const rem2 = useScalableSize(2);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "manrope-thin": require("./assets/fonts/manrope/fonts/ttf/manrope-thin.ttf"),
        "manrope-light": require("./assets/fonts/manrope/fonts/ttf/manrope-light.ttf"),
        "manrope-regular": require("./assets/fonts/manrope/fonts/ttf/manrope-regular.ttf"),
        "manrope-medium": require("./assets/fonts/manrope/fonts/ttf/manrope-medium.ttf"),
        "manrope-semibold": require("./assets/fonts/manrope/fonts/ttf/manrope-semibold.ttf"),
        "manrope-bold": require("./assets/fonts/manrope/fonts/ttf/manrope-bold.ttf"),
        "manrope-extrabold": require("./assets/fonts/manrope/fonts/ttf/manrope-extrabold.ttf"),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  return fontsLoaded ? (
    <View style={{ flex: 1, backgroundColor: black }}>
      <View
        style={{
          backgroundColor: white,
          paddingVertical: 8,
          paddingHorizontal: 24,
          flexDirection: "row",
          width: "100%",
        }}
      >
        <Text
          style={{
            fontFamily: "manrope-extrabold",
            color: "black",
            fontSize: rem1_5,
            lineHeight: rem2,
          }}
        >
          PIC2PAL
        </Text>
      </View>
      <View style={{ flex: 1, padding: 24 }}>
        <Text
          style={{
            fontFamily: "manrope-bold",
            color: white,
            fontSize: rem1_5,
            lineHeight: rem2,
          }}
        >
          {"A picture\nfor a palette.".toUpperCase()}
        </Text>
        <Text
          style={{
            fontFamily: "manrope-regular",
            color: white,
            fontSize: rem1,
            lineHeight: rem1_5,
            marginTop: 8,
          }}
        >
          Upload an image to reveal the pigments that piqued your interest.
        </Text>
        {!current.matches(STATES.complete) ? (
          <TouchableOpacity
            disabled={current.matches(STATES.processing)}
            onPress={() => {
              send(TRIGGERS.SELECTED_IMAGE);
            }}
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginTop: 24,
              paddingVertical: 48,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderStyle: "dashed",
              borderWidth: 2,
              borderColor: white,
            }}
          >
            {current.matches(STATES.initial) ? (
              <Text
                style={{
                  fontFamily: "manrope-medium",
                  color: white,
                  fontSize: rem1,
                }}
              >
                CHOOSE A PICTURE
              </Text>
            ) : null}
            {current.matches(STATES.processing) ? (
              <>
                <ActivityIndicator
                  color={white}
                  size="large"
                  style={{ height: 16 }}
                />
                <Text
                  style={{
                    fontFamily: "manrope-thin",
                    color: white,
                    textAlign: "center",
                    fontSize: rem0_75,
                    lineHeight: rem1,
                    marginHorizontal: 24,
                    marginTop: 24,
                  }}
                >
                  This will continue spinning if you cancel your picture
                  selection. Hit the button below to upload a new image.{" "}
                  <Text style={{ fontStyle: "italic" }}>
                    Gotta love the platform.
                  </Text>
                </Text>
              </>
            ) : null}
          </TouchableOpacity>
        ) : null}
        {current.matches(STATES.complete) ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
              marginTop: 24,
            }}
          >
            <Text
              style={{
                fontFamily: "manrope-extrabold",
                color: white,
                fontSize: rem0_75,
                lineHeight: rem0_75,
                letterSpacing: "5%",
              }}
            >
              YOUR PALETTE
            </Text>
          </View>
        ) : null}
        {current.matches(STATES.complete) ? (
          <View
            style={{
              width: "100%",
              backgroundColor: white,
              padding: 8,
            }}
          >
            <View style={{ width: "100%" }}>
              <FirstChildGetsNoSpecialTreatment
                injectedStyle={{
                  marginTop: 8,
                }}
              >
                {current.context.palette
                  ? Object.keys(current.context.palette).map((k, i) => {
                      let color = current.context.palette[k].getHex();
                      return <Color value={color} key={i} />;
                    })
                  : null}
              </FirstChildGetsNoSpecialTreatment>
            </View>
          </View>
        ) : null}
        {current.matches(STATES.processing) ? (
          <PrimaryButton
            onPress={() => send(TRIGGERS.CANCEL_IMAGE_SELECTION)}
            label="CANCEL UPLOAD"
          />
        ) : null}
        {current.matches(STATES.complete) ? (
          <PrimaryButton
            onPress={() => send(TRIGGERS.SELECT_ANOTHER_IMAGE)}
            label="CHOOSE ANOTHER PICTURE"
          />
        ) : null}
      </View>
      <View
        style={{
          width: "100%",
          backgroundColor: white,
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 24,
        }}
      >
        <Text
          style={{
            fontFamily: "manrope-thin",
            fontSize: rem0_75,
            color: black,
          }}
        >
          Made with 🍵 and{" "}
          <Text
            accessibilityRole="link"
            target="_blank"
            href="https://github.com/expo/web-examples/"
            style={{ textDecorationLine: "underline" }}
          >
            Expo for Web
          </Text>
        </Text>
        <Text
          accessibilityRole="link"
          target="_blank"
          href="https://fiberjw.com"
          style={{
            fontFamily: "manrope-semibold",
            fontSize: rem0_75,
            color: black,
          }}
        >
          FiberJW.com
        </Text>
      </View>
    </View>
  ) : null;
}
