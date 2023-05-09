import { useState, useEffect } from "react";

export const useGetWindowSize = () => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);

  const debounceFunction = (callback: () => void) => {
    let timer: NodeJS.Timeout | undefined;

    return function () {
      if (!timer) {
        timer = setTimeout(() => {
          callback();
          timer = undefined;
        }, 100);
      }
    };
  };

  const windowResizeHandler = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  const debouncedWindowResizeHandler = debounceFunction(windowResizeHandler);

  useEffect(() => {
    window.addEventListener("resize", debouncedWindowResizeHandler);

    return () => {
      window.removeEventListener("resize", debouncedWindowResizeHandler);
    };
  }, []);

  return { windowWidth, windowHeight };
};

export const useGetRefSize = ({
  nodeRef,
}: {
  nodeRef: React.RefObject<HTMLDivElement>;
}) => {
  const [nodeWidth, setNodeWidth] = useState<number>(
    nodeRef.current?.getBoundingClientRect().width || 1000
  );
  const [nodeHeight, setNodeHeight] = useState<number>(
    nodeRef.current?.getBoundingClientRect().height || 1000
  );

  useEffect(() => {
    windowResizeHandler();
  }, [nodeRef]);

  const debounceFunction = (callback: () => void) => {
    let timer: NodeJS.Timeout | undefined;

    return function () {
      console.log("here");
      if (!timer) {
        timer = setTimeout(() => {
          callback();
          timer = undefined;
        }, 100);
      }
    };
  };

  const windowResizeHandler = () => {
    console.log("triggering resize handler");
    setNodeWidth(nodeRef.current?.getBoundingClientRect().width || 1000);
    setNodeHeight(nodeRef.current?.getBoundingClientRect().height || 1000);
  };

  const debouncedWindowResizeHandler = debounceFunction(windowResizeHandler);

  useEffect(() => {
    window.addEventListener("resize", debouncedWindowResizeHandler);

    return () => {
      window.removeEventListener("resize", debouncedWindowResizeHandler);
    };
  }, []);

  return { nodeWidth, nodeHeight };
};
