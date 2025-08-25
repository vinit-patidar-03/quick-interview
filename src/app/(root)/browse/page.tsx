import React from "react";
import { Interview } from "@/types/types";
import InterviewBrowseClient from "@/components/browse/InterviewBrowseClient";
import { apiRequestSSR } from "@/api/request";
import { getCookies } from "@/lib/session";

async function getInterviews(): Promise<Interview[]> {
  try {
    const cookies = await getCookies();
    const interviews = await apiRequestSSR("http://localhost:3000/api/interviews", "GET", cookies);
    console.log("Fetched interviews:", interviews);
    return interviews?.data as Interview[];
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return [];
  }
}

const InterviewBrowsePlatform = async () => {
  const interviews = await getInterviews();

  return <InterviewBrowseClient initialInterviews={interviews} />;
};

export default InterviewBrowsePlatform;