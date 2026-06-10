export function drawCanvasCard(ctx, x, y, width, height, fill = "rgba(255, 253, 245, 0.74)") {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.strokeStyle = "rgba(23, 35, 29, 0.16)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 16);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
