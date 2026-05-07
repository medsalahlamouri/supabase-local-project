import type { Notice } from "../hooks/useClinicData";
import { UI_MESSAGES } from "../constants/ui";

type FeedbackProps = {
  notice: Notice;
  loading: boolean;
  supabaseConfigured: boolean;
};

export function Feedback({ notice, loading, supabaseConfigured }: FeedbackProps) {
  return (
    <>
      {!supabaseConfigured && (
        <div className="notice warning">
          {UI_MESSAGES.SUPABASE_NOT_CONFIGURED}
        </div>
      )}

      {notice && <div className={`notice ${notice.type}`}>{notice.message}</div>}
      {loading && <div className="loading">{UI_MESSAGES.LOADING}</div>}
    </>
  );
}
