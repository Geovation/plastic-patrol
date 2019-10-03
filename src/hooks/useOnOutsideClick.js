import { useEffect, useRef } from "react";

const useOnOutsideClick = onOutsideClick => {
  const componentRef = useRef();

  const handleClick = e => {
    if (componentRef.current && componentRef.current.contains(e.target)) {
      return;
    }
    onOutsideClick();
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return componentRef;
};

export default useOnOutsideClick;
