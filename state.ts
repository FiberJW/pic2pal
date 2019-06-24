import * as ImagePicker from "expo-image-picker";
import { Machine, assign, send } from "xstate";
import * as Vibrant from "node-vibrant";

export const STATES = {
  initial: "initial",
  processing: "processing",
  complete: "complete",
};

export const TRIGGERS = {
  SELECTED_IMAGE: "SELECTED_IMAGE",
  CANCEL_IMAGE_SELECTION: "CANCEL_IMAGE_SELECTION",
  COMPLETE_PROCESSING: "COMPLETE_PROCESSING",
  SELECT_ANOTHER_IMAGE: "SELECT_ANOTHER_IMAGE",
};

export const ACTIONS = {
  selectImage: "selectImage",
};

export const appMachine = Machine({
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
