import type { ReactNode } from "react";

export type Tab = "dashboard" | "patients" | "consultations";

const tabDetails: Record<Tab, { title: string; description: string }> = {
  dashboard: {
    title: "Dashboard",
    description: "A quick view of patients and appointments."
  },
  patients: {
    title: "Patients",
    description: "Keep patient identity details clean and searchable."
  },
  consultations: {
    title: "Consultations",
    description: "Track scheduled, completed and cancelled visits."
  }
};

const tabs = Object.keys(tabDetails) as Tab[];

type AppShellProps = {
  activeTab: Tab;
  search: string;
  loading: boolean;
  canRefresh: boolean;
  children: ReactNode;
  onTabChange: (tab: Tab) => void;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
};

export function AppShell({
  activeTab,
  search,
  loading,
  canRefresh,
  children,
  onTabChange,
  onSearchChange,
  onRefresh
}: AppShellProps) {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">CP</span>
          <div>
            <h1>Clinic Pro</h1>
            <p>Care desk</p>
          </div>
        </div>

        <nav className="nav-tabs" aria-label="Main navigation">
          {tabs.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onTabChange(item)}
              className={activeTab === item ? "active" : ""}
              aria-current={activeTab === item ? "page" : undefined}
            >
              {tabDetails[item].title}
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Clinic overview</p>
            <h2>{tabDetails[activeTab].title}</h2>
            <p>{tabDetails[activeTab].description}</p>
            <p className="topbar-meta">Search is shared across patients and consultations.</p>
          </div>

          <div className="topbar-actions">
            <label className="search-field">
              <span className="sr-only">Search</span>
              <input
                placeholder="Search name, CID, town..."
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </label>
            <button className="secondary-button" type="button" onClick={onRefresh} disabled={!canRefresh || loading}>
              Refresh
            </button>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
