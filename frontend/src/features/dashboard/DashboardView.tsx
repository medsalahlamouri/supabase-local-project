import { MetricCard } from "../../components/MetricCard";
import type { ClinicMetrics } from "../../utils/clinic";

type DashboardViewProps = {
  metrics: ClinicMetrics;
};

export function DashboardView({ metrics }: DashboardViewProps) {
  return (
    <section>
      <div className="metrics">
        <MetricCard label="Total patients" value={metrics.totalPatients} tone="teal" />
        <MetricCard label="Consultations" value={metrics.totalConsultations} tone="blue" />
        <MetricCard label="Today" value={metrics.todayConsultations} tone="amber" />
        <MetricCard label="Upcoming" value={metrics.upcoming} tone="violet" />
      </div>
    </section>
  );
}
