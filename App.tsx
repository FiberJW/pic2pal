import * as React from "react";
import { useEffect, Children, cloneElement, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as Font from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { black, white } from "./assets/colors";
import { useMachine } from "@xstate/react";
import { Machine, assign, send } from "xstate";
import * as Vibrant from "node-vibrant";

const STATES = {
  initial: "initial",
  processing: "processing",
  complete: "complete",
};

const TRIGGERS = {
  SELECTED_IMAGE: "SELECTED_IMAGE",
  CANCEL_IMAGE_SELECTION: "CANCEL_IMAGE_SELECTION",
  COMPLETE_PROCESSING: "COMPLETE_PROCESSING",
  SELECT_ANOTHER_IMAGE: "SELECT_ANOTHER_IMAGE",
};

const ACTIONS = {
  selectImage: "selectImage",
};

const appMachine = Machine({
  id: "app",
  context: {
    palette: null,
  },
  initial: STATES.initial,
  states: {
    [STATES.initial]: {
      on: {
        [TRIGGERS.SELECTED_IMAGE]: {
          target: STATES.processing,
        },
      },
    },
    [STATES.processing]: {
      on: {
        [TRIGGERS.COMPLETE_PROCESSING]: STATES.complete,
        [TRIGGERS.CANCEL_IMAGE_SELECTION]: STATES.initial,
      },
      invoke: {
        id: "selectAndProcessImage",
        src: async (context, event) => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          });

          if (result.cancelled) throw new Error("Cancelled image selection");

          const palette = await Vibrant.from(result.uri).getPalette();

          return palette;
        },
        onDone: {
          target: STATES.complete,
          actions: assign({
            palette: (context, event) => event.data,
          }),
        },
        onError: {
          target: STATES.initial,
          actions: (context, event) => console.log(event),
        },
      },
    },
    complete: {
      on: {
        [TRIGGERS.SELECT_ANOTHER_IMAGE]: STATES.processing,
      },
    },
  },
});

export default function App() {
  const [current, send] = useMachine(appMachine);
  const [fontsLoaded, setFontsLoaded] = useState(false);

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
    <View style={styles.container}>
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
            fontSize: 24,
            lineHeight: 32,
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
            fontSize: 24,
            lineHeight: 32,
          }}
        >
          {"A picture\nfor a palette.".toUpperCase()}
        </Text>
        <Text
          style={{
            fontFamily: "manrope-regular",
            color: white,
            fontSize: 16,
            lineHeight: 24,
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
                  fontSize: 16,
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
                    fontSize: 12,
                    lineHeight: 16,
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
                fontSize: 12,
                lineHeight: 12,
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
          <TouchableOpacity
            onPress={() => send(TRIGGERS.CANCEL_IMAGE_SELECTION)}
            style={{
              padding: 16,
              marginTop: 24,
              width: "100%",
              backgroundColor: "rgba(255, 255,255, 0.2)",
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
              CANCEL UPLOAD
            </Text>
          </TouchableOpacity>
        ) : null}
        {current.matches(STATES.complete) ? (
          <TouchableOpacity
            onPress={() => send(TRIGGERS.SELECT_ANOTHER_IMAGE)}
            style={{
              padding: 16,
              marginTop: 24,
              width: "100%",
              backgroundColor: "rgba(255, 255,255, 0.2)",
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
              CHOOSE ANOTHER PICTURE
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  ) : null;
}

function Color({ style, value }) {
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

const FirstChildGetsNoSpecialTreatment = ({ children, injectedStyle }) =>
  Children.map(children, (child, i) => {
    if (i !== 0) {
      const style = { ...(child.props.style || {}), ...injectedStyle };

      return cloneElement(child, { style });
    }

    return child;
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: black,
  },
});
