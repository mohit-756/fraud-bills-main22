import React, { createContext, useContext, useState, ReactNode } from "react";
import { mockAttendance, AttendanceRecord } from "@/data/mockData";

interface AttendanceContextType {
  records: AttendanceRecord[];
  markAttendance: (date: string, status: "on-duty" | "leave" | "half-day") => void;
  getStatus: (date: string) => "on-duty" | "leave" | "half-day" | null;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<AttendanceRecord[]>([...mockAttendance]);

  const markAttendance = (date: string, status: "on-duty" | "leave" | "half-day") => {
    setRecords((prev) => {
      const existing = prev.findIndex((r) => r.date === date);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { date, status };
        return updated;
      }
      return [...prev, { date, status }].sort((a, b) => a.date.localeCompare(b.date));
    });
  };

  const getStatus = (date: string) => {
    const record = records.find((r) => r.date === date);
    return record?.status ?? null;
  };

  return (
    <AttendanceContext.Provider value={{ records, markAttendance, getStatus }}>
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const ctx = useContext(AttendanceContext);
  if (!ctx) throw new Error("useAttendance must be used within AttendanceProvider");
  return ctx;
}
