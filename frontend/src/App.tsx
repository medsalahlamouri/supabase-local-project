import { useDeferredValue, useMemo, useState } from "react";
import { AppShell, type Tab } from "./components/AppShell";
import { Feedback } from "./components/Feedback";
import { ConsultationsView } from "./features/consultations/ConsultationsView";
import { DashboardView } from "./features/dashboard/DashboardView";
import { PatientsView } from "./features/patients/PatientsView";
import { useClinicData } from "./hooks/useClinicData";
import { supabaseConfigured } from "./lib/supabase";
import { filterConsultations, filterPatients, getClinicMetrics } from "./utils/clinic";

export function App() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const {
    patients,
    consultations,
    loading,
    saving,
    notice,
    refresh,
    addPatient,
    editPatient,
    addConsultation,
    editConsultation,
    deletePatient,
    deleteConsultation
  } = useClinicData();

  const filteredPatients = useMemo(() => filterPatients(patients, deferredSearch), [patients, deferredSearch]);
  const filteredConsultations = useMemo(
    () => filterConsultations(consultations, deferredSearch),
    [consultations, deferredSearch]
  );
  const metrics = useMemo(() => getClinicMetrics(patients, consultations), [patients, consultations]);
  const dataDisabled = !supabaseConfigured;

  return (
    <AppShell
      activeTab={tab}
      search={search}
      loading={loading}
      canRefresh={supabaseConfigured}
      onTabChange={setTab}
      onSearchChange={setSearch}
      onRefresh={() => void refresh()}
    >
      <Feedback notice={notice} loading={loading} supabaseConfigured={supabaseConfigured} />

      {!loading && tab === "dashboard" && <DashboardView metrics={metrics} />}

      {!loading && tab === "patients" && (
        <PatientsView
          patients={filteredPatients}
          disabled={dataDisabled}
          saving={saving}
          onCreate={addPatient}
          onUpdate={editPatient}
          onDelete={deletePatient}
        />
      )}

      {!loading && tab === "consultations" && (
        <ConsultationsView
          consultations={filteredConsultations}
          patients={patients}
          disabled={dataDisabled}
          saving={saving}
          onCreate={addConsultation}
          onUpdate={editConsultation}
          onDelete={deleteConsultation}
        />
      )}
    </AppShell>
  );
}
