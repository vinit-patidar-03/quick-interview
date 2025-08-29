export const dynamic = "force-dynamic";
import React from "react";
import { Interview } from "@/types/types";
import InterviewBrowseClient from "@/components/browse/InterviewBrowseClient";
import { apiRequestSSR } from "@/api/sever-request";
import { getCookies } from "@/lib/session";

async function getInterviews(): Promise<Interview[]> {
  try {
    const cookies = await getCookies();
    const interviews = await apiRequestSSR(`${process.env.INTERVIEW_URL}/api/interviews`, "GET", cookies);
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