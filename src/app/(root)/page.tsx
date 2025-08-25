"use client";
import { Button } from "@/components/ui/button";
import { ChevronsRight, Target, Users, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Target,
      text: "AI-Powered Mock Interviews",
      color: "text-purple-500",
    },
    { icon: Users, text: "Domain-Specific Questions", color: "text-blue-500" },
    { icon: Zap, text: "Instant Feedback", color: "text-green-500" },
  ];

  const handleGetStarted = async () => {
    router.push("/practice");
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-300 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-300 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>

          <div
            className="absolute top-20 left-20 w-4 h-4 bg-purple-400 rounded-full animate-ping opacity-75"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-40 right-32 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75"
            style={{ animationDelay: "3s" }}
          ></div>
          <div
            className="absolute bottom-32 left-1/4 w-2 h-2 bg-purple-500 rounded-full animate-ping opacity-75"
            style={{ animationDelay: "5s" }}
          ></div>
          <div
            className="absolute bottom-20 right-20 w-5 h-5 bg-blue-500 rounded-full animate-ping opacity-50"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div
          className={`relative z-10 w-[90%] md:w-[70%] lg:w-[60%] transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                Level Up Your
              </span>
              <br />
              <span className="text-gray-800">Interview Game</span>
            </h1>

            <div className="h-8 mb-6 flex items-center justify-center">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 absolute transition-all duration-500 ${
                      currentFeature === index
                        ? "opacity-100 transform scale-100"
                        : "opacity-0 transform scale-95"
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                    <span className={`text-lg font-semibold ${feature.color}`}>
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-xl text-gray-600 leading-relaxed text-center mb-6">
              Tired of boring prep?{" "}
              <span className="font-semibold text-purple-600 relative">
                PrepSmash
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse"></span>
              </span>{" "}
              lets you create and practice mock interviews based on your dream
              job or domain. No real interviewer needed. Just smart, adaptive
              AI—ready anytime.
            </p>
            <div className="flex items-center justify-center gap-2 text-lg text-purple-500 font-medium">
              <span className="animate-bounce" style={{ animationDelay: "0s" }}>
                Build.
              </span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "0.2s" }}
              >
                Share.
              </span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "0.4s" }}
              >
                Smash.
              </span>
              <span className="text-2xl animate-pulse ml-2">🚀</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              variant="prepsmash_button"
              className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 text-white px-10 py-6 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group overflow-hidden"
              onClick={handleGetStarted}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center">
                Get Started Free
                <ChevronsRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
            <Button
              variant="outline"
              className="relative border-2 border-purple-300 text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 px-10 py-6 text-lg font-semibold rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 group hover:border-purple-400"
            >
              <span className="flex items-center">
                Watch Demo
                <div className="ml-2 w-3 h-3 bg-purple-500 rounded-full group-hover:animate-ping"></div>
              </span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
