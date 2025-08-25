"use client"
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { PhoneCall, PhoneOff, Pause, Play, Save, Clock, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Interview } from '@/types/types';
import PlaygroundCard from './PlaygroundCard';
import context from '@/context/Context';
import { toast } from 'sonner';
import { vapi } from '@/lib/vapi';
import { interviewer } from '@/constants/constants';

enum CallStatus {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
    PAUSED = 'PAUSED',
    FINISHED = 'FINISHED',
    CONNECTING = 'CONNECTING',
    ERROR = 'ERROR'
}

interface InterviewPlaygroundProps {
    interview: Interview;
}

interface SavedMessages {
    role: 'user' | 'agent';
    content: string;
    timestamp: Date;
}

interface InterviewState {
    timeRemaining: number;
    messages: SavedMessages[];
    isPaused: boolean;
    callStatus: CallStatus;
}

interface Message {
    type: string;
    transcriptType?: string;
    role: 'user' | 'agent';
    transcript: string;
}

const DEFAULT_INTERVIEW_DURATION = 30; // Default 30 minutes
const MIN_TIME_REMAINING = 0;
const MAX_RETRY_ATTEMPTS = 3;
const AUDIO_LEVEL_UPDATE_INTERVAL = 100;
const TIMER_UPDATE_INTERVAL = 1000;

const aiInterviewer = {
    username: "AI Interviewer",
    email: "prepsmash.ai@gmail.com"
};

const InterviewPlayground = ({ interview }: InterviewPlaygroundProps) => {
    const { user } = useContext(context);

    // Validate and sanitize interview duration
    const getValidDuration = useCallback((duration?: number) => {
        if (!duration || duration <= 0 || isNaN(duration)) {
            console.warn('Invalid interview duration, using default:', DEFAULT_INTERVIEW_DURATION);
            return DEFAULT_INTERVIEW_DURATION;
        }
        return Math.max(1, Math.min(duration, 180)); // Limit between 1-180 minutes
    }, []);

    const validDuration = getValidDuration(interview?.duration);

    // Timer states with validation
    const [timeRemaining, setTimeRemaining] = useState(() => validDuration * 60);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Call states
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [retryAttempts, setRetryAttempts] = useState(0);

    // Message states
    const [messages, setMessages] = useState<SavedMessages[]>([]);
    const [streamingMessage, setStreamingMessage] = useState<SavedMessages | null>(null);

    // Audio visualization
    const [audioLevel, setAudioLevel] = useState(0);
    const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup function
    const cleanup = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        if (audioIntervalRef.current) {
            clearInterval(audioIntervalRef.current);
            audioIntervalRef.current = null;
        }
    }, []);

    // Validate interview data
    const validateInterview = useCallback((interview: Interview) => {
        if (!interview) {
            console.error('Interview object is missing');
            return false;
        }
        if (!interview.company || !interview.role) {
            console.error('Interview missing required fields: company or role');
            return false;
        }
        return true;
    }, []);

    // Safe message creation
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

    // Enhanced save conversation with error handling and retry logic
    const saveConversationToBackend = useCallback(async (conversation: SavedMessages[], retryCount = 0) => {
        if (!interview?._id) {
            console.error('Cannot save conversation: missing interview ID');
            return false;
        }

        if (!conversation || conversation.length === 0) {
            console.warn('No conversation to save');
            return true; // Not an error, just nothing to save
        }

        try {
            const payload = {
                interviewId: interview._id,
                transcript: conversation.filter(msg => msg && msg.content && msg.role), // Filter out invalid messages
                duration: Math.max(0, validDuration * 60 - timeRemaining),
                timestamp: new Date().toISOString()
            };

            const response = await fetch('/api/interviews/save-transcript', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(30000) // 30 second timeout
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Conversation saved successfully:', result);
            toast.success('Interview saved successfully');
            return true;

        } catch (error) {
            console.error('Failed to save conversation:', error);

            // Retry logic
            if (retryCount < MAX_RETRY_ATTEMPTS) {
                console.log(`Retrying save (attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS})...`);
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
                return saveConversationToBackend(conversation, retryCount + 1);
            }

            toast.error(`Failed to save interview after ${MAX_RETRY_ATTEMPTS} attempts`);
            return false;
        }
    }, [interview?._id, validDuration, timeRemaining]);

    // Safe format time function
    const formatTime = useCallback((seconds: number) => {
        try {
            const safeSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
            const minutes = Math.floor(safeSeconds / 60);
            const remainingSeconds = safeSeconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        } catch (error) {
            console.error('Error formatting time:', error);
            return '00:00';
        }
    }, []);

    // Enhanced end call handler
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
            cleanup();

            // Save conversation if there are messages
            if (messages.length > 0) {
                await saveConversationToBackend(messages);
            }
        } catch (error) {
            console.error('Error ending call:', error);
            setCallStatus(CallStatus.ERROR);
            toast.error('Error ending call');
        }
    }, [callStatus, cleanup, messages, saveConversationToBackend]);

    // Enhanced timer effect with better error handling
    useEffect(() => {
        if (callStatus === CallStatus.ACTIVE && !isPaused && timeRemaining > MIN_TIME_REMAINING) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    const newTime = Math.max(0, prev - 1);
                    if (newTime <= 0) {
                        handleEndCall();
                        return 0;
                    }
                    return newTime;
                });
            }, TIMER_UPDATE_INTERVAL);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }

        return cleanup;
    }, [callStatus, handleEndCall, isPaused, timeRemaining, cleanup]);

    // Enhanced Vapi integration with better error handling
    useEffect(() => {
        if (!vapi) {
            console.error('Vapi is not available');
            return;
        }

        const callStart = () => {
            console.log('Call started');
            setCallStatus(CallStatus.ACTIVE);
            setIsListening(true);
            setRetryAttempts(0);
            toast.success('Interview started successfully');
        };

        const callEnd = () => {
            console.log('Call ended');
            setCallStatus(CallStatus.FINISHED);
            setIsSpeaking(false);
            setIsListening(false);
            setStreamingMessage(null);

            // Save conversation
            if (messages.length > 0) {
                saveConversationToBackend(messages);
            }
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
            console.log("Speech start");
            setIsSpeaking(true);
            setIsListening(false);
        };

        const onSpeechEnd = () => {
            console.log("Speech end");
            setIsSpeaking(false);
            setIsListening(true);
        };

        const onError = (error: Error) => {
            console.error("Vapi error:", error);
            setCallStatus(CallStatus.ERROR);
            toast.error(`Call error: ${error?.message || 'Unknown error'}`);
        };

        // Register event listeners
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
    }, [messages, createSafeMessage, saveConversationToBackend]);

    // Audio visualization effect
    useEffect(() => {
        if (isSpeaking || isListening) {
            audioIntervalRef.current = setInterval(() => {
                setAudioLevel(Math.random() * 100);
            }, AUDIO_LEVEL_UPDATE_INTERVAL);
        } else {
            setAudioLevel(0);
            if (audioIntervalRef.current) {
                clearInterval(audioIntervalRef.current);
                audioIntervalRef.current = null;
            }
        }

        return () => {
            if (audioIntervalRef.current) {
                clearInterval(audioIntervalRef.current);
                audioIntervalRef.current = null;
            }
        };
    }, [isSpeaking, isListening]);

    // Enhanced start call handler
    const handleStartCall = useCallback(async () => {
        if (!validateInterview(interview)) {
            toast.error('Invalid interview data');
            return;
        }

        if (callStatus !== CallStatus.INACTIVE) return;

        setCallStatus(CallStatus.CONNECTING);

        try {
            let formattedQuestions = '';

            if (interview?.questions && Array.isArray(interview.questions)) {
                formattedQuestions = interview.questions
                    .filter(packet => packet && packet.question) // Filter out invalid questions
                    .map((packet) => {
                        let questionText = String(packet.question).trim();

                        if (packet.followups && Array.isArray(packet.followups)) {
                            const followupText = packet.followups
                                .filter(fup => fup && typeof fup === 'string')
                                .map((fup, index) => `Follow-up ${index + 1}: ${fup}`)
                                .join('\n');
                            if (followupText) questionText += `\n${followupText}`;
                        }

                        if (packet.hints && Array.isArray(packet.hints)) {
                            const hintsText = packet.hints
                                .filter(hint => hint && typeof hint === 'string')
                                .map((hint, index) => `Hint ${index + 1}: ${hint}`)
                                .join('\n');
                            if (hintsText) questionText += `\n${hintsText}`;
                        }

                        return questionText;
                    })
                    .join('\n\n');
            }

            if (!interviewer) {
                throw new Error('Interviewer configuration is missing');
            }

            await vapi.start(interviewer, {
                variableValues: {
                    questions: formattedQuestions || 'General interview questions'
                }
            });

        } catch (error) {
            console.error('Failed to start Vapi call:', error);
            setCallStatus(CallStatus.INACTIVE);
            setRetryAttempts(prev => prev + 1);

            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Failed to start interview: ${errorMessage}`);

            // Offer retry if under limit
            if (retryAttempts < MAX_RETRY_ATTEMPTS) {
                setTimeout(() => {
                    if (callStatus === CallStatus.INACTIVE) {
                        console.log('Auto-retrying call start...');
                        handleStartCall();
                    }
                }, 2000);
            }
        }
    }, [interview, callStatus, retryAttempts, validateInterview]);

    const handlePauseResume = useCallback(() => {
        if (callStatus === CallStatus.ACTIVE) {
            setIsPaused(!isPaused);
            setCallStatus(isPaused ? CallStatus.ACTIVE : CallStatus.PAUSED);
            toast.info(isPaused ? 'Interview resumed' : 'Interview paused');
        }
    }, [callStatus, isPaused]);

    const handleSaveAndQuit = useCallback(async () => {
        try {
            await saveConversationToBackend(messages);

            const interviewState: InterviewState = {
                timeRemaining,
                messages,
                isPaused,
                callStatus
            };

            console.log('Saving interview state:', interviewState);
            toast.success('Interview progress saved! You can resume later.');
            await handleEndCall();
        } catch (error) {
            console.error('Error saving and quitting:', error);
            toast.error('Failed to save interview progress');
        }
    }, [messages, timeRemaining, isPaused, callStatus, saveConversationToBackend, handleEndCall]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const newMuted = !prev;
            toast.info(newMuted ? 'Microphone muted' : 'Microphone unmuted');
            return newMuted;
        });
    }, []);

    const getTimerColor = useCallback(() => {
        try {
            const totalDuration = validDuration * 60;
            const percentage = totalDuration > 0 ? (timeRemaining / totalDuration) * 100 : 0;

            if (percentage > 50) return 'text-green-600';
            if (percentage > 25) return 'text-yellow-600';
            return 'text-red-600';
        } catch (error) {
            console.error('Error calculating timer color:', error);
            return 'text-gray-600';
        }
    }, [timeRemaining, validDuration]);

    const getCallStatusDisplay = useCallback(() => {
        switch (callStatus) {
            case CallStatus.CONNECTING:
                return { text: 'Connecting...', variant: 'default' as const };
            case CallStatus.ACTIVE:
                return { text: 'Interview Active', variant: 'default' as const };
            case CallStatus.PAUSED:
                return { text: 'Interview Paused', variant: 'secondary' as const };
            case CallStatus.FINISHED:
                return { text: 'Interview Finished', variant: 'destructive' as const };
            case CallStatus.ERROR:
                return { text: 'Error Occurred', variant: 'destructive' as const };
            default:
                return { text: 'Ready to Start', variant: 'outline' as const };
        }
    }, [callStatus]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);

    // Early return for invalid interview
    if (!validateInterview(interview)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
                <Alert className="max-w-md border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                        Invalid interview data. Please check the interview configuration and try again.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // Early return for missing user context
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
                <Alert className="max-w-md border-yellow-200 bg-yellow-50">
                    <AlertDescription className="text-yellow-800">
                        User information not available. Please log in and try again.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const statusDisplay = getCallStatusDisplay();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
            {/* Clean Header */}
            <div className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                {interview.company || 'Unknown Company'} - {interview.role || 'Unknown Role'}
                            </h1>
                            <div className="flex flex-wrap gap-2">
                                {interview.difficulty && (
                                    <Badge variant="outline" className="border-purple-200 text-xs">
                                        Difficulty: {interview.difficulty}
                                    </Badge>
                                )}
                                {interview.technologies && Array.isArray(interview.technologies) &&
                                    interview.technologies
                                        .filter(tech => tech && typeof tech === 'string')
                                        .slice(0, 5) // Limit to 5 technologies to prevent UI overflow
                                        .map((tech, index) => (
                                            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                                {tech}
                                            </Badge>
                                        ))
                                }
                            </div>
                        </div>

                        {/* Timer and Status */}
                        <div className="flex items-center space-x-3">
                            <Badge variant={statusDisplay.variant} className="px-2 py-1 text-xs">
                                {statusDisplay.text}
                            </Badge>
                            <div className={`text-lg font-mono font-bold ${getTimerColor()} flex items-center`}>
                                <Clock size={14} className="mr-1" />
                                {formatTime(timeRemaining)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4 h-[calc(100vh-100px)]">
                <div className="h-full space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <PlaygroundCard
                            role='agent'
                            details={aiInterviewer}
                            isSpeaking={isSpeaking}
                            audioLevel={audioLevel}
                        />
                        <PlaygroundCard
                            role="user"
                            details={user}
                            isSpeaking={isListening && !isMuted}
                            audioLevel={audioLevel}
                            isMuted={isMuted}
                        />
                    </div>

                    {/* Controls Card */}
                    <Card className="bg-white/90 backdrop-blur-sm shadow-lg h-[20%]">
                        <CardContent className="py-4 h-full flex items-center justify-center">
                            <div className="flex justify-center items-center gap-3 flex-wrap">

                                {callStatus === CallStatus.INACTIVE && (
                                    <Button
                                        onClick={handleStartCall}
                                        size="lg"
                                        disabled={retryAttempts >= MAX_RETRY_ATTEMPTS}
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg disabled:opacity-50"
                                    >
                                        <PhoneCall className="mr-2 h-4 w-4" />
                                        {retryAttempts >= MAX_RETRY_ATTEMPTS ? 'Max Retries Reached' : 'Start Interview'}
                                    </Button>
                                )}

                                {callStatus === CallStatus.CONNECTING && (
                                    <Button disabled size="lg" className="shadow-lg">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        Connecting...
                                    </Button>
                                )}

                                {(callStatus === CallStatus.ACTIVE || callStatus === CallStatus.PAUSED) && (
                                    <>
                                        <Button
                                            variant={isPaused ? "default" : "secondary"}
                                            onClick={handlePauseResume}
                                        >
                                            {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                                            {isPaused ? 'Resume' : 'Pause'}
                                        </Button>

                                        <Button
                                            variant={isMuted ? "destructive" : "outline"}
                                            onClick={toggleMute}
                                        >
                                            {isMuted ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
                                            {isMuted ? 'Unmute' : 'Mute'}
                                        </Button>

                                        <Button variant="outline" onClick={handleSaveAndQuit}>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save & Quit
                                        </Button>

                                        <Button variant="destructive" onClick={handleEndCall}>
                                            <PhoneOff className="mr-2 h-4 w-4" />
                                            End Interview
                                        </Button>
                                    </>
                                )}

                                {callStatus === CallStatus.ERROR && (
                                    <div className="text-center space-y-3 w-full">
                                        <Alert className="border-red-200 bg-red-50">
                                            <AlertDescription className="text-center text-red-800">
                                                ⚠️ An error occurred during the interview. Please try again.
                                            </AlertDescription>
                                        </Alert>
                                        <Button
                                            onClick={() => {
                                                setCallStatus(CallStatus.INACTIVE);
                                                setRetryAttempts(0);
                                                setMessages([]);
                                                setStreamingMessage(null);
                                            }}
                                            className="bg-gradient-to-r from-purple-600 to-blue-600"
                                        >
                                            Try Again
                                        </Button>
                                    </div>
                                )}

                                {callStatus === CallStatus.FINISHED && (
                                    <div className="text-center space-y-3 w-full">
                                        <Alert className="border-green-200 bg-green-50">
                                            <AlertDescription className="text-center text-green-800">
                                                🎉 Interview Completed Successfully!
                                            </AlertDescription>
                                        </Alert>
                                        <Button
                                            onClick={() => window.location.reload()}
                                            className="bg-gradient-to-r from-purple-600 to-blue-600"
                                        >
                                            View Results
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
                        <CardContent className="p-2 h-full overflow-hidden">
                            {!streamingMessage ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <p className="text-sm">
                                        {callStatus === CallStatus.INACTIVE && 'Click "Start Interview" to begin'}
                                        {callStatus === CallStatus.CONNECTING && 'Connecting to interview...'}
                                        {callStatus === CallStatus.ACTIVE && 'Conversation will appear here...'}
                                        {callStatus === CallStatus.PAUSED && 'Interview is paused'}
                                        {callStatus === CallStatus.FINISHED && 'Interview completed'}
                                        {callStatus === CallStatus.ERROR && 'Error occurred'}
                                    </p>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col">
                                    <div className="flex-1 overflow-auto">
                                        <div className={`p-2 rounded-2xl shadow-sm border-2 border-dashed ${streamingMessage.role === 'agent'
                                            ? 'bg-gradient-to-br from-blue-50/70 to-blue-100/30 border-blue-300/50'
                                            : 'bg-gradient-to-br from-green-50/70 to-green-100/30 border-green-300/50'
                                            } animate-pulse`}>
                                            <p className="text-base leading-relaxed text-gray-700 font-medium">
                                                {streamingMessage.content}
                                                <span className="inline-block w-2 h-5 bg-gray-400 ml-1 animate-pulse"></span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default InterviewPlayground;