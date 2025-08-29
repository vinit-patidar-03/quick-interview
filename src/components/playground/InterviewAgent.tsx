"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PhoneCall, PhoneOff, Save, Clock, Volume2, VolumeX, RotateCcw, Bot, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Interview, User } from '@/types/types';
import { toast } from 'sonner';
import { vapi } from '@/lib/vapi';
import { createInterviewer } from '@/constants/constants';
import { apiRequest } from '@/api/client-request';
import PlaygroundCard from './PlaygroundCard';
import { useRouter } from 'next/navigation';

enum CallStatus {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
    CONNECTING = 'CONNECTING',
    ERROR = 'ERROR',
    LOADING_PROGRESS = 'LOADING_PROGRESS'
}

interface InterviewPlaygroundProps {
    interview: Interview;
    user: User
}

interface SavedMessages {
    role: 'user' | 'agent';
    content: string;
    timestamp: Date;
}

interface Message {
    type: string;
    transcriptType?: string;
    role: 'user' | 'agent';
    transcript: string;
}

interface InterviewProgress {
    timeRemaining: number;
    transcript: SavedMessages[];
    sessionId: string;
    lastSaved: string;
    duration: number;
}

const generateSessionId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const InterviewPlayground = ({ interview, user }: InterviewPlaygroundProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const validDuration = interview?.duration || 30;

    // State management
    const [timeRemaining, setTimeRemaining] = useState(() => validDuration * 60);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessages[]>([]);
    const [sessionId, setSessionId] = useState<string>(() => generateSessionId());
    const [hasExistingProgress, setHasExistingProgress] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState<SavedMessages | null>(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, streamingMessage, scrollToBottom]);


    // Prevent back navigation during active interview
    useEffect(() => {
        if (callStatus === CallStatus.ACTIVE) {
            const handleBeforeUnload = (e: BeforeUnloadEvent) => {
                e.preventDefault();
                e.returnValue = 'Interview is in progress. Are you sure you want to leave?';
                return 'Interview is in progress. Are you sure you want to leave?';
            };

            const handlePopState = (e: PopStateEvent) => {
                if (callStatus === CallStatus.ACTIVE) {
                    e.preventDefault();
                    setShowExitConfirm(true);
                    window.history.pushState(null, '', window.location.href);
                }
            };

            window.addEventListener('beforeunload', handleBeforeUnload);
            window.addEventListener('popstate', handlePopState);
            window.history.pushState(null, '', window.location.href);

            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
                window.removeEventListener('popstate', handlePopState);
            };
        }
    }, [callStatus]);

    // Toggle fullscreen
    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch((err) => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            if (callStatus === CallStatus.ACTIVE) {
                setShowExitConfirm(true);
            }
        }
    }, [callStatus]);

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isNowFullscreen = !!document.fullscreenElement;

            if (!isNowFullscreen) {
                // User exited fullscreen
                if (callStatus === CallStatus.ACTIVE || callStatus === CallStatus.CONNECTING) {
                    setShowExitConfirm(true);
                }
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, [callStatus]);


    const saveProgress = useCallback(async () => {
        if (!interview?._id) {
            console.error('Missing user or interview ID');
            return false;
        }

        const data = {
            interviewId: interview._id,
            timeRemaining,
            transcript: messages,
            sessionId,
            totalDuration: validDuration
        }

        try {
            const response = await apiRequest(`/api/interviews/${interview?._id}/progress`, 'POST', data);

            if (!response.success) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;

        } catch (error) {
            console.error('Failed to save progress:', error);
            return false;
        }
    }, [interview?._id, timeRemaining, messages, sessionId, validDuration]);

    const handleSaveAndQuit = useCallback(async () => {
        try {
            const saved = await saveProgress();

            if (saved) {
                toast.success('Interview progress saved! You can resume later.');

                if (callStatus === CallStatus.ACTIVE || callStatus === CallStatus.CONNECTING) {
                    if (vapi && typeof vapi.stop === 'function') {
                        await vapi.stop();
                    }
                }
                router.back();
                setCallStatus(CallStatus.FINISHED);
            } else {
                toast.error('Failed to save interview progress');
            }
        } catch (error) {
            console.error('Error saving and quitting:', error);
            toast.error('Failed to save interview progress');
        }
    }, [saveProgress, callStatus, router]);

    // Handle exit confirmation
    const handleExitConfirm = useCallback(async () => {
        if (callStatus === CallStatus.ACTIVE) {
            await handleSaveAndQuit();
        }
        setShowExitConfirm(false);
    }, [callStatus, handleSaveAndQuit]);

    // Check for existing progress on component mount
    useEffect(() => {
        const checkExistingProgress = async () => {
            if (!interview?._id) return;

            try {
                const response = await apiRequest(`/api/interviews/${interview._id}/progress`, 'GET');

                if (response?.success) {
                    setHasExistingProgress(true);
                    toast.info('Found saved progress! You can resume your interview.', {
                        duration: 5000
                    });
                }
            } catch (error) {
                console.error('Error checking progress:', error);
            }
        };

        checkExistingProgress();
    }, [interview?._id]);

    // Load existing progress
    const loadProgress = useCallback(async () => {
        if (!interview?._id) return;

        setCallStatus(CallStatus.LOADING_PROGRESS);

        try {
            const response = await apiRequest(`/api/interviews/${interview._id}/progress`, 'GET');
            if (!response?.success) {
                throw new Error('Failed to load progress');
            }

            if (response.data) {
                const progress: InterviewProgress = response.data;
                setTimeRemaining(progress.timeRemaining);
                setMessages(progress.transcript || []);
                setSessionId(progress.sessionId);
                setCallStatus(CallStatus.INACTIVE);
                toast.success('Progress loaded successfully!');
            } else {
                toast.info('No previous progress found. Starting fresh!');
                setCallStatus(CallStatus.INACTIVE);
            }
        } catch (error) {
            console.error('Error loading progress:', error);
            toast.error('Failed to load progress. Starting fresh.');
            setCallStatus(CallStatus.INACTIVE);
        }
    }, [interview?._id]);

    // Complete interview
    const completeInterview = useCallback(async () => {
        if (!interview?._id) return;

        const data = {
            interviewId: interview._id,
            timeRemaining,
            transcript: messages,
            sessionId,
            totalDuration: validDuration,
            isCompleted: true
        };
        try {
            const response = await apiRequest(`/api/interviews/${interview._id}/progress`, 'POST', data);

            if (response.success) {
                toast.success('Interview completed and saved!');
            }
        } catch (error) {
            console.error('Error completing interview:', error);
            toast.error('Failed to save completed interview');
        }
    }, [interview?._id, messages, timeRemaining, validDuration, sessionId]);

    // End call handler
    const handleEndCall = useCallback(async () => {
        try {
            if (callStatus === CallStatus.ACTIVE || callStatus === CallStatus.CONNECTING) {
                if (vapi && typeof vapi.stop === 'function') {
                    await vapi.stop();
                }
            }

            setCallStatus(CallStatus.FINISHED);
            setIsSpeaking(false);
            setIsListening(false);
            setStreamingMessage(null);

            await completeInterview();
        } catch (error) {
            console.error('Error ending call:', error);
            setCallStatus(CallStatus.ERROR);
            toast.error('Error ending call');
        }
    }, [callStatus, completeInterview]);

    // Auto-save every 30 seconds during active interview
    useEffect(() => {
        if (callStatus === CallStatus.ACTIVE && messages.length > 0) {
            const autoSaveInterval = setInterval(async () => {
                await saveProgress();
            }, 30000);

            return () => clearInterval(autoSaveInterval);
        }
    }, [callStatus, messages.length, saveProgress]);

    // Timer effect
    useEffect(() => {
        if (callStatus === CallStatus.ACTIVE && timeRemaining > 0) {
            const interview_timer = setInterval(() => {
                setTimeRemaining(prev => {
                    const newTime = Math.max(0, prev - 1);
                    if (newTime <= 0) {
                        handleEndCall();
                        return 0;
                    }
                    return newTime;
                });
            }, 1000);
            return () => clearInterval(interview_timer);
        }
    }, [callStatus, handleEndCall, timeRemaining]);

    // Format time display
    const formatTime = useCallback((seconds: number) => {
        const safeSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
        const minutes = Math.floor(safeSeconds / 60);
        const remainingSeconds = safeSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, []);

    // Toggle mute functionality
    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const newMuted = !prev;
            toast.info(newMuted ? 'Microphone muted' : 'Microphone unmuted');
            return newMuted;
        });
    }, []);

    // Safe message creation from Vapi messages
    const createSafeMessage = useCallback((message: Message): SavedMessages | null => {
        try {
            if (!message || !message.transcript || !message.role) {
                console.warn('Invalid message format:', message);
                return null;
            }

            return {
                role: message.role === 'user' || message.role === 'agent' ? message.role : 'agent',
                content: String(message.transcript).trim(),
                timestamp: new Date()
            };
        } catch (error) {
            console.error('Error creating safe message:', error);
            return null;
        }
    }, []);

    // Vapi integration effect
    useEffect(() => {
        if (!vapi) {
            console.error('Vapi is not available');
            return;
        }

        const callStart = () => {
            setCallStatus(CallStatus.ACTIVE);
            setIsListening(true);
            toast.success('Interview started successfully');
        };

        const callEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            setIsSpeaking(false);
            setIsListening(false);
            setStreamingMessage(null);
        };

        const onMessage = (message: Message) => {
            try {
                if (!message || message.type !== "transcript") return;

                const safeMessage = createSafeMessage(message);
                if (!safeMessage) return;

                if (message.transcriptType === "partial") {
                    setStreamingMessage(safeMessage);
                } else if (message.transcriptType === "final") {
                    setStreamingMessage(null);
                    setMessages(prevMessages => [...prevMessages, safeMessage]);
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        };

        const onSpeechStart = () => {
            setIsSpeaking(true);
            setIsListening(false);
        };

        const onSpeechEnd = () => {
            setIsSpeaking(false);
            setIsListening(true);
        };

        const onError = (error: Error) => {
            console.error("Vapi error:", error);
            setCallStatus(CallStatus.ERROR);
            toast.error(`Call error: ${error?.message || 'Unknown error'}`);
        };

        try {
            vapi.on("call-start", callStart);
            vapi.on("call-end", callEnd);
            vapi.on("message", onMessage);
            vapi.on("speech-start", onSpeechStart);
            vapi.on("speech-end", onSpeechEnd);
            vapi.on("error", onError);
        } catch (error) {
            console.error('Error setting up Vapi listeners:', error);
        }

        return () => {
            try {
                vapi.off("call-start", callStart);
                vapi.off("call-end", callEnd);
                vapi.off("message", onMessage);
                vapi.off("speech-start", onSpeechStart);
                vapi.off("speech-end", onSpeechEnd);
                vapi.off("error", onError);
            } catch (error) {
                console.error('Error removing Vapi listeners:', error);
            }
        };
    }, [createSafeMessage]);

    const handleStartCall = useCallback(async () => {
        if (!interview?._id) {
            toast.error('Invalid interview data');
            return;
        }

        if (callStatus !== CallStatus.INACTIVE) return;

        setCallStatus(CallStatus.CONNECTING);

        try {
            let formattedQuestions = '';
            let formattedTranscript = '';

            if (interview?.questions && Array.isArray(interview.questions)) {
                formattedQuestions = interview.questions
                    .filter(packet => packet && packet.question)
                    .map((packet) => {
                        let questionText = String(packet.question).trim();

                        if (packet.followups && Array.isArray(packet.followups)) {
                            const followupText = packet.followups
                                .filter(fup => fup && typeof fup === 'string')
                                .map((fup, index) => `Follow-up ${index + 1}: ${fup}`)
                                .join('\n');
                            if (followupText) questionText += `\n${followupText}`;
                        }

                        return questionText;
                    })
                    .join('\n\n');
            }

            if (messages.length > 0) {
                formattedTranscript = messages.map(msg => `${msg.role === 'user' ? 'user' : 'agent'}: ${msg.content}`).join('\n');
            }

            toggleFullscreen();
            const interviewer = createInterviewer(formattedTranscript, timeRemaining / 60);
            await vapi.start(interviewer, { variableValues: { questions: formattedQuestions, transcript: formattedTranscript } });

        } catch (error) {
            console.error('Failed to start Vapi call:', error);
            setCallStatus(CallStatus.INACTIVE);
            toast.error(`Failed to start interview: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }, [interview?._id, interview.questions, callStatus, messages, toggleFullscreen, timeRemaining]);

    const getTimerColor = useCallback(() => {
        const totalDuration = validDuration * 60;
        const percentage = totalDuration > 0 ? (timeRemaining / totalDuration) * 100 : 0;

        if (percentage > 50) return 'text-green-600';
        if (percentage > 25) return 'text-amber-600';
        return 'text-red-600';
    }, [timeRemaining, validDuration]);

    const getCallStatusDisplay = useCallback(() => {
        switch (callStatus) {
            case CallStatus.CONNECTING:
                return { text: 'Connecting...', variant: 'secondary' as const };
            case CallStatus.ACTIVE:
                return { text: 'Live', variant: 'destructive' as const };
            case CallStatus.FINISHED:
                return { text: 'Completed', variant: 'default' as const };
            case CallStatus.ERROR:
                return { text: 'Error', variant: 'destructive' as const };
            case CallStatus.LOADING_PROGRESS:
                return { text: 'Loading...', variant: 'secondary' as const };
            default:
                return { text: 'Ready', variant: 'outline' as const };
        }
    }, [callStatus]);

    const handleExitCancel = useCallback(() => {
        setShowExitConfirm(false);
        if (isFullscreen && !document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch((err) => {
                console.error('Error attempting to re-enable fullscreen:', err);
            });
        }
    }, [isFullscreen]);

    const handleBackNavigation = () => {
        if (isFullscreen && callStatus === CallStatus.ACTIVE) {
            setShowExitConfirm(true);
        } else {
            if (isFullscreen) {
                document.exitFullscreen();
            }
            router.back();
        }
    }


    if (!user) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <Alert className="max-w-md">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        User information not available. Please log in and try again.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const statusDisplay = getCallStatusDisplay();

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                onClick={handleBackNavigation}
                                variant="outline"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back</span>
                            </Button>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">
                                    {interview.company} - {interview.role}
                                </h1>
                                <div className="flex items-center space-x-2 mt-1">
                                    {interview.difficulty && (
                                        <Badge variant="outline" className="text-xs">
                                            {interview.difficulty}
                                        </Badge>
                                    )}
                                    {hasExistingProgress && (
                                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                                            Progress Available
                                        </Badge>
                                    )}
                                    <Badge variant={statusDisplay.variant} className="text-xs">
                                        {statusDisplay.text}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {hasExistingProgress && callStatus === CallStatus.INACTIVE && (
                                <Button
                                    onClick={loadProgress}
                                    variant="outline"
                                    size="sm"
                                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                                >
                                    <RotateCcw size={14} className="mr-1" />
                                    Resume
                                </Button>
                            )}

                            {callStatus === CallStatus.INACTIVE && (
                                <Button
                                    onClick={handleStartCall}
                                    size="sm"
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                    <PhoneCall size={14} className="mr-1" />
                                    Start Interview
                                </Button>
                            )}

                            {callStatus === CallStatus.CONNECTING && (
                                <Button disabled size="sm">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                                    Connecting...
                                </Button>
                            )}

                            {callStatus === CallStatus.ACTIVE && (
                                <>
                                    <Button
                                        variant={isMuted ? "destructive" : "outline"}
                                        onClick={toggleMute}
                                        size="sm"
                                    >
                                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={handleSaveAndQuit}
                                        size="sm"
                                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                    >
                                        <Save size={14} className="mr-1" />
                                        Save & Quit
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        onClick={handleEndCall}
                                        size="sm"
                                    >
                                        <PhoneOff size={14} className="mr-1" />
                                        End
                                    </Button>
                                </>
                            )}
                            <div className={`text-lg font-mono font-bold ${getTimerColor()} flex items-center`}>
                                <Clock size={14} className="mr-2" />
                                {formatTime(timeRemaining)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {/* Status Alerts */}
                {callStatus === CallStatus.ERROR && (
                    <div className="mb-6">
                        <Alert className="border-red-200 bg-red-50">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-red-800 flex items-center justify-between">
                                <span>An error occurred during the interview.</span>
                                <Button
                                    onClick={() => {
                                        setCallStatus(CallStatus.INACTIVE);
                                        setMessages([]);
                                        setStreamingMessage(null);
                                    }}
                                    size="sm"
                                    variant="destructive"
                                    className="ml-4"
                                >
                                    Try Again
                                </Button>
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-6">
                    {/* Participant Cards */}
                    <div className="lg:col-span-2 lg:row-span-2 grid grid-rows-2 gap-4">
                        <PlaygroundCard
                            role='agent'
                            details={{ username: "AI Interviewer", email: "prepsmash.ai@gmail.com" }}
                            isSpeaking={isSpeaking}
                        />
                        <PlaygroundCard
                            role="user"
                            details={user}
                            isSpeaking={isListening && !isMuted}
                            isMuted={isMuted}
                        />
                    </div>

                    <Card className="lg:row-span-2 max-h-[80vh] overflow-auto">
                        <CardHeader className="py-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 flex items-center">
                                    <Bot size={16} className="mr-2 text-purple-600" />
                                    Conversation
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                    {messages.length} messages
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col min-h-0">
                            {messages.length === 0 && !streamingMessage ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                        <Bot className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <p className="text-sm text-center max-w-xs">
                                        {hasExistingProgress
                                            ? 'Click "Resume" to continue your interview or "Start Interview" to begin fresh.'
                                            : 'Click "Start Interview" to begin your session.'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto space-y-3">
                                    {messages.map((message, index) => (
                                        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-3 rounded-2xl ${message.role === 'user'
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                                }`}>
                                                <p className="text-sm leading-relaxed">{message.content}</p>
                                                <span className={`text-xs opacity-70 block mt-2 ${message.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                                                    }`}>
                                                    {new Date(message.timestamp).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    {streamingMessage && (
                                        <div className="flex justify-start">
                                            <div className="max-w-[85%] p-3 rounded-2xl bg-gray-100 text-gray-900">
                                                <p className="text-sm leading-relaxed">
                                                    {streamingMessage.content}
                                                    <span className="inline-block w-2 h-4 bg-purple-600 ml-1 animate-pulse rounded-sm"></span>
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Exit Confirmation Modal */}
            {showExitConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="max-w-md mx-4">
                        <CardContent className="p-6">
                            <div className="text-center space-y-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Interview in Progress</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {callStatus === CallStatus.ACTIVE
                                        ? "Your interview session is currently active. Your progress will be saved automatically if you exit."
                                        : "Are you sure you want to exit? Any unsaved progress may be lost."
                                    }
                                </p>
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={handleExitCancel}
                                        className="flex-1"
                                    >
                                        Stay
                                    </Button>
                                    <Button
                                        onClick={handleExitConfirm}
                                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                                    >
                                        {callStatus === CallStatus.ACTIVE ? 'Save & Exit' : 'Exit'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default InterviewPlayground;