import { Children, cloneElement } from "react";

export const FirstChildGetsNoSpecialTreatment = ({ children, injectedStyle }) =>
  Children.map(children, (child, i) => {
    if (i !== 0) {
      const style = { ...(child.props.style || {}), ...injectedStyle };

      return cloneElement(child, { style });
    }

    return child;
  });
