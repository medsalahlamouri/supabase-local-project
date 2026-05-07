export type ConsultationStatus = "scheduled" | "completed" | "cancelled";

export type Patient = {
  id: string;
  full_name: string;
  cid: string;
  birth_date: string;
  town: string;
  created_at: string | null;
};

export type PatientInput = Pick<Patient, "full_name" | "cid" | "birth_date" | "town">;

export type PatientSummary = Pick<Patient, "full_name" | "cid" | "town">;

export type ConsultationRow = {
  id: string;
  patient_id: string;
  appointment_date: string;
  status: ConsultationStatus;
  reason: string | null;
  notes: string | null;
  created_at: string | null;
};

export type Consultation = ConsultationRow & {
  patient?: PatientSummary | null;
};

export type ConsultationInput = Pick<
  ConsultationRow,
  "patient_id" | "appointment_date" | "status" | "reason" | "notes"
>;

export type Database = {
  public: {
    Tables: {
      patients: {
        Row: Patient;
        Insert: PatientInput & {
          id?: string;
          created_at?: string | null;
        };
        Update: Partial<PatientInput>;
        Relationships: [];
      };
      consultations: {
        Row: ConsultationRow;
        Insert: ConsultationInput & {
          id?: string;
          created_at?: string | null;
        };
        Update: Partial<ConsultationInput>;
        Relationships: [
          {
            foreignKeyName: "consultations_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
