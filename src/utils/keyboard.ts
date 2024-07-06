import { useCallback, useEffect } from "react";
import { NoOp } from "./noOp";

export const useKeyCycle = ({
  downHandler,
  upHandler,
}: {
  downHandler: NoOp;
  upHandler: NoOp;
}) => {
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => downHandler(event.key),
    [downHandler]
  );
  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", upHandler);
    };
  }, [downHandler, onKeyDown, upHandler]);
};
