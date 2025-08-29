export const dynamic = "force-dynamic";
import { apiRequestSSR } from '@/api/sever-request';
import { getCookies } from '@/lib/session';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    TrendingUp,
    MessageSquare,
    Code,
    Brain,
    Target,
    BookOpen,
    Building,
    ArrowLeft,
    Star
} from 'lucide-react';
import { Interview } from '@/types/types';

interface CategoryData {
    score: number;
    outOf: number;
    strengths: string[];
    improvements: string[];
}

interface CategoryScores {
    communication: CategoryData;
    handlingAmbiguity: CategoryData;
    problemSolving: CategoryData;
    incorporatingFeedback: CategoryData;
}

interface OverallScore {
    level: string;
    outOf: number;
    percentage: number;
    total: number;
}

interface Feedback {
    categoryScores: CategoryScores;
    overallScore: OverallScore;
    summaryFeedback: string[];
}

interface FeedbackData {
    feedback: Feedback;
    interview: Interview
}

const getInterviewFeedback = async (id: string): Promise<FeedbackData | null> => {
    try {
        const cookies = await getCookies();
        const response = await apiRequestSSR(`/api/interviews/${id}/feedback`, "GET", cookies);
        return response?.data;
    } catch (error) {
        console.error('Error fetching interview feedback:', error);
        return null;
    }
};

const getScoreIcon = (score: number) => {
    if (score <= 1) return <XCircle className="w-5 h-5 text-red-500" />;
    if (score <= 2) return <AlertCircle className="w-5 h-5 text-orange-500" />;
    if (score <= 3) return <CheckCircle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
};

const getBadgeVariant = (level: string) => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('excellent') || lowerLevel.includes('outstanding')) {
        return { variant: "default" as const, className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" };
    }
    if (lowerLevel.includes('good') || lowerLevel.includes('satisfactory')) {
        return { variant: "secondary" as const, className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100" };
    }
    if (lowerLevel.includes('needs improvement') || lowerLevel.includes('poor')) {
        return { variant: "destructive" as const, className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100" };
    }
    return { variant: "outline" as const, className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100" };
};

const categoryConfig = {
    communication: {
        name: "Communication",
        icon: <MessageSquare className="w-5 h-5" />,
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50",
        iconBg: "bg-blue-100"
    },
    handlingAmbiguity: {
        name: "Handling Ambiguity",
        icon: <Brain className="w-5 h-5" />,
        color: "from-purple-500 to-purple-600",
        bgColor: "bg-purple-50",
        iconBg: "bg-purple-100"
    },
    problemSolving: {
        name: "Problem Solving",
        icon: <Target className="w-5 h-5" />,
        color: "from-green-500 to-green-600",
        bgColor: "bg-green-50",
        iconBg: "bg-green-100"
    },
    incorporatingFeedback: {
        name: "Incorporating Feedback",
        icon: <BookOpen className='w-5 h-5' />,
        color: "from-orange-500 to-orange-600",
        bgColor: "bg-orange-50",
        iconBg: "bg-orange-100"
    }
} as const;

const CategoryCard = ({ category, data }: { category: string; data: CategoryData }) => {
    const config = categoryConfig[category as keyof typeof categoryConfig];

    return (
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${config?.color}`} />
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2.5 ${config?.iconBg} rounded-xl`}>
                            {config?.icon}
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">{config?.name}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                                {getScoreIcon(data.score)}
                                <span className="text-sm font-medium text-gray-600">
                                    {data.score}/{data.outOf}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{data.score}</div>
                        <div className="text-xs text-gray-500">out of {data?.outOf}</div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{Math.round((data.score / data.outOf) * 100)}%</span>
                    </div>
                    <Progress
                        value={(data.score / 5) * 100}
                        className="h-2.5"
                    />
                </div>

                {data.strengths?.length > 0 && (
                    <>
                        <Separator />
                        <div className="space-y-3">
                            <h4 className="font-semibold text-green-700 text-sm flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Strengths
                            </h4>
                            <div className="space-y-2">
                                {data.strengths.map((strength, idx) => (
                                    <div key={idx} className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                                        <p className="text-sm text-gray-700 leading-relaxed">{strength}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {data.improvements?.length > 0 && (
                    <>
                        <Separator />
                        <div className="space-y-3">
                            <h4 className="font-semibold text-orange-700 text-sm flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Areas for Improvement
                            </h4>
                            <div className="space-y-2">
                                {data.improvements.map((improvement, idx) => (
                                    <div key={idx} className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                                        <p className="text-sm text-gray-700 leading-relaxed">{improvement}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

const FeedbackPage = async ({
    params,
}: {
    params: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const { id } = await params;
    const feedbackData = await getInterviewFeedback(id as string);

    if (!feedbackData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
                <Card className="max-w-md w-full shadow-xl">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Feedback Not Available</h2>
                        <p className="text-gray-600 mb-6">Unable to load interview feedback. Please try again later.</p>
                        <Button variant="outline" className="w-full">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { categoryScores, overallScore, summaryFeedback } = feedbackData?.feedback;
    const { interview } = feedbackData;

    const badgeConfig = getBadgeVariant(overallScore.level);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Interview Info Banner */}
                <Card className="mb-8 border-0 shadow-xl overflow-hidden py-0">
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Building className="w-6 h-6 text-slate-300" />
                                    <span className="text-slate-300 text-sm font-medium uppercase tracking-wide">Interview Report</span>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">{interview?.company} - {interview?.role}</h1>
                                    <p className="text-slate-300 text-lg">Performance Analysis & Feedback</p>
                                </div>
                                <div className="flex items-center space-x-6 pt-4">
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-300">Performance: {overallScore.percentage}%</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Badge {...badgeConfig} className="px-3 py-1 text-xs">
                                            {overallScore.level}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 min-w-[160px]">
                                    <div className="text-4xl font-bold mb-1">{overallScore.total}</div>
                                    <div className="text-slate-300 text-sm mb-2">out of {overallScore.outOf}</div>
                                    <div className="flex items-center justify-end space-x-4">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4 text-yellow-400" />
                                            <span className="text-lg font-semibold">{overallScore.percentage}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Category Analysis */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <Code className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Category Analysis</h2>
                            <p className="text-gray-600">Detailed breakdown by skill areas</p>
                        </div>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-6">
                        {Object.entries(categoryScores).map(([category, data]) => (
                            <CategoryCard key={category} category={category} data={data} />
                        ))}
                    </div>
                </div>

                {/* Enhanced Summary Feedback */}
                {summaryFeedback?.length > 0 && (
                    <Card className="border-0 shadow-xl">
                        <CardHeader className="pb-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                                    <MessageSquare className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold">Detailed Feedback</CardTitle>
                                    <p className="text-gray-600 text-sm">Comprehensive analysis and recommendations</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4">
                                {summaryFeedback.map((feedback, idx) => (
                                    <Card key={idx} className="border border-slate-200 bg-slate-50/50">
                                        <CardContent className="p-5">
                                            <div className="flex items-start space-x-4">
                                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-sm font-bold text-white">{idx + 1}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-gray-700 leading-relaxed">{feedback}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default FeedbackPage;