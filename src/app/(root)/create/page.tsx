"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Building2,
  Code,
  Target,
  Edit2,
  Clock,
  Users,
  FileText,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Settings,
  Trash2,
  ImageIcon,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import AiGenerateButton from "@/components/AiGenerateButton";
import SkillsBadge from "@/components/SkillsBadge";
import ButtonWithLoading from "@/components/ButtonWithLoading";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import { apiRequest, apiRequestWithFile } from "@/api/request";
import { toast } from "sonner";

interface Question {
  question: string;
  type: string;
}

interface FormData {
  company: string;
  role: string;
  technologies: string[];
  difficulty: string;
  duration: string;
  description: string;
  companyLogo: File | null;
  questions: Question[];
}

const INITIAL_FORM_DATA: FormData = {
  company: "",
  role: "",
  technologies: [],
  difficulty: "",
  duration: "",
  description: "",
  companyLogo: null,
  questions: [],
};

const DIFFICULTY_OPTIONS = [
  {
    value: "Beginner",
    label: "Beginner",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "Intermediate",
    label: "Intermediate",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "Advanced",
    label: "Advanced",
    color: "bg-orange-100 text-orange-800",
  },
  { value: "Expert", label: "Expert", color: "bg-red-100 text-red-800" },
];

const QUESTION_TYPES = [
  { value: "Technical", icon: Code, color: "bg-purple-100 text-purple-800" },
  { value: "Behavioral", icon: Users, color: "bg-blue-100 text-blue-800" },
  {
    value: "System Design",
    icon: Settings,
    color: "bg-orange-100 text-orange-800",
  },
  { value: "Coding", icon: FileText, color: "bg-green-100 text-green-800" },
  { value: "General", icon: MessageSquare, color: "bg-gray-100 text-gray-800" },
];

const InterviewForm = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [currentTech, setCurrentTech] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question: "",
    type: "",
  });
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTechnology = () => {
    if (
      currentTech.trim() &&
      !formData.technologies.includes(currentTech.trim())
    ) {
      handleInputChange("technologies", [
        ...formData.technologies,
        currentTech.trim(),
      ]);
      setCurrentTech("");
    }
  };

  const removeTechnology = (tech: string) => {
    handleInputChange(
      "technologies",
      formData.technologies.filter((t) => t !== tech)
    );
  };

  const generateDescription = async () => {
    setIsGenerating(true);

    if (
      !formData.company ||
      !formData.role ||
      !formData.difficulty ||
      !formData.technologies
    ) {
      toast.error("Please fill all the fields");
      setIsGenerating(false);
      return;
    }

    try {
      const response = await apiRequest(
        "/api/interviews/generate-description",
        "POST",
        {
          company: formData.company,
          role: formData.role,
          difficulty: formData.difficulty,
          technologies: formData.technologies,
        }
      );

      if (response.success) {
        handleInputChange("description", response.description);
      }
    } catch (error) {
      console.error("Error generating description", error);
      toast.error("Failed to generate description");
    } finally {
      setIsGenerating(false);
    }
  };

  const addQuestion = () => {
    if (currentQuestion.question.trim()) {
      if (editingQuestionIndex !== null) {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[editingQuestionIndex] = { ...currentQuestion };
        handleInputChange("questions", updatedQuestions);
        setEditingQuestionIndex(null);
      } else {
        handleInputChange("questions", [
          ...formData.questions,
          { ...currentQuestion },
        ]);
      }
      setCurrentQuestion({ question: "", type: "" });
    }
  };

  const editQuestion = (index: number) => {
    setCurrentQuestion({ ...formData.questions[index] });
    setEditingQuestionIndex(index);
  };

  const removeQuestion = (index: number) => {
    handleInputChange(
      "questions",
      formData.questions.filter((_, i) => i !== index)
    );
  };

  const generateQuestions = async () => {
    setIsGenerating(true);

    if (
      !formData.company ||
      !formData.role ||
      !formData.difficulty ||
      !formData.technologies ||
      !formData.duration ||
      !formData.description
    ) {
      toast.error("Please fill all the fields");
      setIsGenerating(false);
      return;
    }

    try {
      const response = await apiRequest(
        "/api/interviews/generate-questions",
        "POST",
        {
          company: formData.company,
          role: formData.role,
          difficulty: formData.difficulty,
          technologies: formData.technologies,
          duration: formData.duration,
          description: formData.description,
        },
      );

      if (response.success) {
        handleInputChange("questions", response.questions);
      }
    } catch (error) {
      console.error("Error generating questions", error);
      toast.error("Failed to generate questions");
    } finally {
      setIsGenerating(false);
    }
  };

  const validateStep1 = () => {
    if (
      !formData.company ||
      !formData.role ||
      !formData.technologies.length ||
      !formData.difficulty ||
      !formData.duration ||
      !formData.description
    ) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleCreateInterview = async () => {
    setIsGenerating(true);

    const form = new FormData();
    form.append("company", formData.company);
    form.append("role", formData.role);
    form.append("technologies", JSON.stringify(formData.technologies));
    form.append("difficulty", formData.difficulty);
    form.append("duration", formData.duration);
    form.append("description", formData.description);
    form.append("questions", JSON.stringify(formData.questions));
    if (formData.companyLogo) {
      form.append("companyLogo", formData.companyLogo!);
    }
    try {
      const response = await apiRequestWithFile(
        "/api/interviews/create-interview",
        "POST",
        form
      );

      if (response.success) {
        toast.success("Interview created successfully!");
        setFormData(INITIAL_FORM_DATA);
        setCurrentStep(1);
      } else {
        toast.error("Failed to create interview");
      }
    } catch (error) {
      console.error("Error creating interview", error);
      toast.error("Failed to create interview");

    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div>
      <div className="mx-auto p-4">
        {currentStep === 1 ? (
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                <Building2 className="w-5 h-5 text-blue-600" />
                Company & Role Details
              </CardTitle>
              <CardDescription className="text-gray-600">
                Define the interview parameters and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="company"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    Company Name *
                  </Label>
                  <Input
                    id="company"
                    placeholder="Enter company name"
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="role"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Briefcase className="w-4 h-4" />
                    Role *
                  </Label>
                  <Input
                    id="role"
                    placeholder="Enter role title"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Technologies & Skills *
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add technology or skill"
                    value={currentTech}
                    onChange={(e) => setCurrentTech(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTechnology())
                    }
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    type="button"
                    variant="prepsmash_button"
                    onClick={addTechnology}
                    className="px-4"
                  >
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </Button>
                </div>
                {formData.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                    {formData.technologies.map((tech, index) => (
                      <SkillsBadge
                        key={index}
                        tech={tech}
                        onClick={removeTechnology}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="companyLogo"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Company Logo
                  </Label>
                  <Input
                    id="companyLogo"
                    type="file"
                    placeholder="Upload company logo"
                    onChange={(e) =>
                      handleInputChange(
                        "companyLogo",
                        e.target.files?.[0] || null
                      )
                    }
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="duration"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Duration (minutes) *
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="60"
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange("duration", e.target.value)
                    }
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Difficulty Level *
                </Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) =>
                    handleInputChange("difficulty", value)
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_OPTIONS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${level.color.split(" ")[0]
                              }`}
                          ></div>
                          {level.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Description *
                  </Label>
                  <AiGenerateButton
                    onClick={generateDescription}
                    isGenerating={isGenerating}
                  />
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe the interview objectives and scope..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={nextStep} variant="prepsmash_button">
                  Next Step
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                <Target className="w-5 h-5 text-indigo-600" />
                Interview Questions
                {formData.questions.length > 0 && (
                  <Badge className="bg-green-100 text-green-800">
                    {formData.questions.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-gray-600">
                Create targeted questions for your interview
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 space-y-3">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                    <Label className="text-sm font-medium text-gray-700">
                      Add New Question
                    </Label>
                  </div>
                  <AiGenerateButton
                    onClick={generateQuestions}
                    isGenerating={isGenerating}
                  />
                </div>
                <Textarea
                  placeholder="Enter your interview question..."
                  value={currentQuestion.question}
                  onChange={(e) =>
                    setCurrentQuestion((prev) => ({
                      ...prev,
                      question: e.target.value,
                    }))
                  }
                  rows={3}
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <div className="flex gap-3">
                  <Select
                    value={currentQuestion.type}
                    onValueChange={(value) =>
                      setCurrentQuestion((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="flex-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      {QUESTION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            {type.value}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={addQuestion}
                    disabled={
                      !currentQuestion.question.trim() || !currentQuestion.type
                    }
                    variant="prepsmash_button"
                  >
                    {editingQuestionIndex !== null ? "Update" : "Add"}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {formData.questions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                    <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No questions yet</p>
                    <p className="text-sm">
                      Add your first question to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.questions.map((q, index) => {
                      return (
                        <div
                          key={index}
                          className="group flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Q{index + 1}.
                          </p>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 mb-1 text-justify">
                              {q.question}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {q.type}
                            </Badge>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ButtonWithIcon
                              onClick={() => editQuestion(index)}
                              icon={
                                <Edit2 className="w-4 h-4 text-indigo-600" />
                              }
                            />
                            <ButtonWithIcon
                              onClick={() => removeQuestion(index)}
                              icon={<Trash2 className="w-4 h-4 text-red-600" />}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <Button onClick={prevStep} variant="outline">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Previous Step
                </Button>
                <ButtonWithLoading isLoading={isGenerating} onClick={handleCreateInterview}>
                  {isGenerating ? "Generating..." : "Create Interview"}
                </ButtonWithLoading>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InterviewForm;
