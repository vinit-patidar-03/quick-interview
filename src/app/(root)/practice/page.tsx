"use client";
import React, { useEffect, useState } from "react";
import { Search, Filter, Loader2, Blend } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NoInterview from "@/components/NoInterview";
import InterviewCard from "@/components/practice/InterviewCard";
import { PracticeInterviews } from "@/types/types";
import { apiRequest } from "@/api/client-request";

const difficultyConfig = [
  { id: "all", name: "All Difficulties", emoji: <Blend className="w-4 h-4" /> },
  { id: "expert", name: "Expert", emoji: <div className="w-3 h-3 rounded-full bg-red-500"></div> },
  { id: "advanced", name: "Advanced", emoji: <div className="w-3 h-3 rounded-full bg-red-300"></div> },
  { id: "intermidate", name: "Intermidate", emoji: <div className="w-3 h-3 rounded-full bg-orange-500" ></div> },
  { id: "beginner", name: "Beginner", emoji: <div className="w-3 h-3 rounded-full bg-green-500" ></div> },
];


const PracticePage = () => {
  const [selectedJobType, setSelectedJobType] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [practiceInterviews, setPracticeInterviews] = useState<PracticeInterviews[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [roles, setRoles] = useState<string[]>([])

  useEffect(() => {
    fetchPracticeInterviews();
  }, []);

  const getRolesAdded = (interviews: PracticeInterviews[]) => {
    const roles = new Set<string>();
    interviews.forEach((practiceInterview: PracticeInterviews) => {
      roles.add(practiceInterview?.interview.role);
    });
    return roles;
  }

  const fetchPracticeInterviews = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiRequest('/api/interviews/practice', 'GET');

      if (response?.success === true) {
        const interviews = response.data || [];
        setPracticeInterviews(interviews);
        setRoles(['all', ...getRolesAdded(interviews)]);
      }
    } catch (error) {
      console.error("Failed to fetch practice interviews:", error);
      setError("Failed to load interviews. Please try again later.");
      setPracticeInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredInterviews = practiceInterviews.filter((practiceInterview) => {
    const matchesJobType =
      selectedJobType === "all" ||
      practiceInterview?.interview.role.toLowerCase().includes(selectedJobType.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === "all" ||
      practiceInterview?.interview.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    const matchesSearch =
      !searchTerm ||
      practiceInterview.interview.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      practiceInterview.interview.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (practiceInterview.interview.technologies && practiceInterview.interview.technologies.some((topic) =>
        topic.toLowerCase().includes(searchTerm.toLowerCase())
      ));

    return matchesJobType && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="container mx-auto px-3 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Master Your Interview Skills
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Practice with real interview questions from top companies and
              boost your confidence
            </p>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search interviews, companies, or technologies..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex gap-4">
              <Select
                value={selectedJobType}
                onValueChange={setSelectedJobType}
                disabled={loading}
              >
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Job Types" />
                </SelectTrigger>
                <SelectContent>
                  {roles &&
                    roles?.map((role, index) => {
                      if (role === 'all') {
                        return <SelectItem key={index} value={role}>All Job Types</SelectItem>
                      }
                      return <SelectItem key={index} value={role}>{role[0]?.toUpperCase() + role?.slice(1,)}</SelectItem>
                    })
                  }
                </SelectContent>
              </Select>

              <Select
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyConfig &&
                    difficultyConfig?.map((type) => {
                      return <SelectItem key={type.id} value={type.id}>
                        {type.emoji}
                        {type.name}
                      </SelectItem>
                    })
                  }
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-600">Loading interviews...</span>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 font-medium mb-2">Error</p>
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <button
                onClick={fetchPracticeInterviews}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {filteredInterviews.length} Interview
                {filteredInterviews.length !== 1 ? "s" : ""} Available
              </h2>
              <div className="text-sm text-gray-500">
                Showing {filteredInterviews.length} of {practiceInterviews.length}{" "}
                interviews
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredInterviews?.map((practiceInterview) => (
                <InterviewCard key={practiceInterview?.interview?._id} interview={practiceInterview?.interview} isCompleted={practiceInterview?.isCompleted} isStarted={practiceInterview?.isStarted} />
              ))}
            </div>

            {filteredInterviews.length === 0 && practiceInterviews.length > 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No interviews match your current filters</p>
                <button
                  onClick={() => {
                    setSelectedJobType("all");
                    setSelectedDifficulty("all");
                    setSearchTerm("");
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {practiceInterviews.length === 0 && <NoInterview />}
          </>
        )}
      </div>
    </div>
  );
};

export default PracticePage;