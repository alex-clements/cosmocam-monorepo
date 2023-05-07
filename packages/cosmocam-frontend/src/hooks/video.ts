export const useGetVideo = ({ deviceId }) => {
  const getLocalStream = () => {
    return navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        ...(deviceId && {
          deviceId: {
            exact: deviceId,
          },
        }),
        width: {
          min: 640,
          max: 1920,
        },
        height: {
          min: 400,
          max: 1080,
        },
      },
    });
  };

  return { getLocalStream };
};
