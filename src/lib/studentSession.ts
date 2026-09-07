const KEY = "abhyas.student.session";
export const STUDENT_SESSION_EVENT = "abhyas-student-session";

export type StudentSession = { query: string; name?: string };

export const getStudentSession = (): StudentSession | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StudentSession) : null;
  } catch {
    return null;
  }
};

export const setStudentSession = (session: StudentSession) => {
  localStorage.setItem(KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent(STUDENT_SESSION_EVENT, { detail: session }));
};

export const clearStudentSession = () => {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent(STUDENT_SESSION_EVENT, { detail: null }));
};
