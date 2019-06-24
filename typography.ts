import { Dimensions } from "react-native";
import { useState, useEffect } from "react";

export function useScalableSize(multiple) {
  const [baseUnit, setBaseUnit] = useState(16);

  function setBase(width) {
    if (width >= 1408) setBaseUnit(24);
    else if (width >= 1216) setBaseUnit(22);
    else if (width >= 1024) setBaseUnit(20);
    else if (width >= 768) setBaseUnit(18);
    else setBaseUnit(16);
  }

  useEffect(() => {
    setBase(Dimensions.get("window").width);
  }, []);

  useEffect(() => {
    function handleSizeChange({ window: { width } }) {
      setBase(width);
    }

    Dimensions.addEventListener("change", handleSizeChange);

    return () => {
      Dimensions.removeEventListener("change", handleSizeChange);
    };
  });

  return baseUnit * multiple;
}
