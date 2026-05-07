export type MetricTone = "teal" | "blue" | "amber" | "violet";

type MetricCardProps = {
  label: string;
  value: number;
  tone: MetricTone;
};

export function MetricCard({ label, value, tone }: MetricCardProps) {
  return (
    <div className={`card ${tone}`}>
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  );
}
