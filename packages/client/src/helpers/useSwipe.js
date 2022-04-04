export default function useSwipe() {
  let track = null;
  let callback = null;
  let isMouseDown = false;
  let dragStartX = false;
  let dragStartY = false;

  function handleMouseDown(event) {
    isMouseDown = true;

    if ("touches" in event) {
      dragStartX = event.touches[0].clientX;
      dragStartY = event.touches[0].clientY;
    } else {
      dragStartX = event.clientX;
      dragStartY = event.clientY;
    }
  }

  function handleMouseUp() {
    isMouseDown = false;
  }

  function handleMouseMove(event) {
    if (!isMouseDown) {
      return;
    }

    let positionX = 0;
    let positionY = 0;

    if ("touches" in event) {
      positionX = event.touches[0].clientX;
      positionY = event.touches[0].clientY;
    } else {
      positionX = event.clientX;
      positionY = event.clientY;
    }

    const dragDistanceX = positionX - dragStartX;
    const dragDistanceY = positionY - dragStartY;

    if (
      typeof callback !== "function" ||
      !(Math.abs(dragDistanceX) > 30 || Math.abs(dragDistanceY) > 30)
    ) {
      return;
    }

    callback(
      Math.abs(dragDistanceX) > Math.abs(dragDistanceY)
        ? dragDistanceX < 0
          ? "left"
          : "right"
        : dragDistanceY < 0
        ? "up"
        : "down"
    );

    isMouseDown = false;
  }

  function registerEvents(element, swipeCallback) {
    track = element;
    callback = swipeCallback;
    track.addEventListener("touchstart", handleMouseDown);
    track.addEventListener("touchend", handleMouseUp);
    track.addEventListener("touchmove", handleMouseMove);
    track.addEventListener("mousedown", handleMouseDown);
    track.addEventListener("mouseup", handleMouseUp);
    track.addEventListener("mouseout", handleMouseUp);
    track.addEventListener("mousemove", handleMouseMove);
  }

  function unregisterEvents() {
    if (!track) return;
    track.addEventListener("touchstart", handleMouseDown);
    track.addEventListener("touchend", handleMouseUp);
    track.addEventListener("touchmove", handleMouseMove);
    track.addEventListener("mousedown", handleMouseDown);
    track.addEventListener("mouseup", handleMouseUp);
    track.addEventListener("mouseout", handleMouseUp);
    track.addEventListener("mousemove", handleMouseMove);
    track = null;
    callback = null;
  }

  return { registerEvents, unregisterEvents };
}
