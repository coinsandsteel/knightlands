export default function lightningAnimation(x, y, size = 100) {
  let stopped = false;
  const container = document.body;
  const c = document.createElement("canvas");
  c.style.position = "absolute";
  c.style.left = `${x}px`;
  c.style.top = `${y}px`;
  c.style.width = `${size}px`;
  c.style.height = `${size}px`;
  c.width = size;
  c.height = size;

  container.appendChild(c);

  const ctx = "getContext" in c ? c.getContext("2d") : null;

  const center = { x: size / 2, y: 20 };
  const minSegmentHeight = 5;
  const groundHeight = size - 20;
  const color = "rgb(255, 255, 255)";
  const roughness = 2;
  const maxDifference = size / 5;

  ctx.globalCompositeOperation = "lighter";

  ctx.strokeStyle = color;
  ctx.shadowColor = color;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "hsla(0, 0%, 10%, 0.2)";

  function createLightning() {
    let segmentHeight = groundHeight - center.y;
    let lightning = [];
    lightning.push({ x: center.x, y: center.y });
    lightning.push({
      x: Math.random() * (size - 100) + 50,
      y: groundHeight + (Math.random() - 0.9) * 50
    });
    let currDiff = maxDifference;

    while (segmentHeight > minSegmentHeight) {
      const newSegments = [];

      for (let i = 0; i < lightning.length - 1; i++) {
        const start = lightning[i];
        const end = lightning[i + 1];
        const midX = (start.x + end.x) / 2;
        const newX = midX + (Math.random() * 2 - 1) * currDiff;
        newSegments.push(start, { x: newX, y: (start.y + end.y) / 2 });
      }

      newSegments.push(lightning.pop());
      lightning = newSegments;

      currDiff /= roughness;
      segmentHeight /= 2;
    }

    return lightning;
  }

  function render() {
    if (stopped) {
      return;
    }

    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = "source-over";
    // ctx.fillRect(0, 0, size, size);
    ctx.clearRect(0, 0, size, size);
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowBlur = 15;

    for (let j = 0; j < 3; j++) {
      const lightning = createLightning();
      ctx.beginPath();

      for (let i = 0; i < lightning.length; i++) {
        ctx.lineTo(lightning[i].x, lightning[i].y);
      }
      ctx.stroke();
    }
    requestAnimationFrame(render);
  }

  function stop() {
    c.remove();
    stopped = true;
  }

  render();

  return stop;
}
