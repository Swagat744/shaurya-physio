"use client";

import { useEffect, useState } from "react";
import { getClinicSettings, ClinicTimings } from "./firestore";

const DEFAULT_TIMINGS: ClinicTimings = {
  monday:    "9:00 AM – 1:00 PM, 5:00 PM – 8:00 PM",
  tuesday:   "9:00 AM – 1:00 PM, 5:00 PM – 8:00 PM",
  wednesday: "9:00 AM – 1:00 PM, 5:00 PM – 8:00 PM",
  thursday:  "9:00 AM – 1:00 PM, 5:00 PM – 8:00 PM",
  friday:    "9:00 AM – 1:00 PM, 5:00 PM – 8:00 PM",
  saturday:  "9:00 AM – 2:00 PM",
  sunday:    "Closed",
};

export function useClinicTimings() {
  const [timings, setTimings] = useState<ClinicTimings>(DEFAULT_TIMINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClinicSettings()
      .then((s) => { if (s?.timings) setTimings(s.timings); })
      .finally(() => setLoading(false));
  }, []);

  return { timings, loading };
}
