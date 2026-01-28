type SparklineProps = {
  points: number[];
  stroke: string;
  fill: string;
};

const buildSparklinePath = (
  points: number[],
  width: number,
  height: number,
  padding = 4
) => {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = (width - padding * 2) / (points.length - 1);

  return points
    .map((point, index) => {
      const x = padding + index * step;
      const y =
        padding +
        (1 - (point - min) / range) * (height - padding * 2);
      return `${index === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ");
};

const buildSparklineFill = (path: string, width: number, height: number) =>
  `${path} L${width} ${height} L0 ${height} Z`;

export default function Sparkline({ points, stroke, fill }: SparklineProps) {
  const width = 140;
  const height = 44;
  const path = buildSparklinePath(points, width, height);
  const fillPath = buildSparklineFill(path, width, height);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      className="h-full w-full"
    >
      <path d={fillPath} fill={fill} opacity="0.25" />
      <path d={path} fill="none" stroke={stroke} strokeWidth="2" />
    </svg>
  );
}
