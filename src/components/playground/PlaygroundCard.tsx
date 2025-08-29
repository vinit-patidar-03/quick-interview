"use client"
import React from 'react'
import { Card, CardContent } from '@/components/ui/card';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bot, MicOff, User, Mic, Volume2 } from 'lucide-react';

type PlaygroundCardProps = {
    role: "user" | "agent";
    details: { username: string; email: string };
    isSpeaking?: boolean;
    isMuted?: boolean;
}
const PlaygroundCard = ({
    role,
    details,
    isSpeaking = false,
    isMuted = false
}: PlaygroundCardProps) => {
    const getStatusText = () => {
        if (role === 'agent') {
            return isSpeaking ? 'Speaking...' : 'Listening...';
        } else {
            if (isMuted) return 'Muted';
            return isSpeaking ? 'Speaking...' : 'Ready';
        }
    };

    const isAgent = role === 'agent';
    const isActive = isSpeaking && !isMuted;

    return (
        <Card className={`
            relative overflow-hidden transition-all duration-300 hover:shadow-lg border-0 backdrop-blur-sm
            ${isAgent
                ? 'bg-gradient-to-br from-blue-50 to-blue-100/70 shadow-blue-100/50'
                : 'bg-gradient-to-br from-green-50 to-green-100/70 shadow-green-100/50'
            }
            ${isActive ? 'shadow-xl scale-[1.02] ring-2 ring-opacity-20' : 'shadow-md'}
            ${isActive && isAgent ? 'ring-blue-300' : ''}
            ${isActive && !isAgent ? 'ring-green-300' : ''}
        `}>
            {/* Animated border glow for active state */}
            {isActive && (
                <div className={`absolute inset-0 rounded-lg animate-pulse ${isAgent ? 'bg-gradient-to-r from-blue-400/10 to-blue-600/10' : 'bg-gradient-to-r from-green-400/10 to-green-600/10'
                    }`} />
            )}

            <CardContent className="p-6 relative z-10">
                <div className="space-y-4">
                    {/* Header with Avatar and Info */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className={`
                                h-16 w-16 rounded-full border-3 transition-all duration-200 flex items-center justify-center
                                ${isActive
                                    ? 'shadow-lg border-white scale-105'
                                    : 'shadow-md border-white/80'
                                }
                                ${isAgent
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                                    : isMuted
                                        ? 'bg-gradient-to-br from-red-500 to-red-600'
                                        : 'bg-gradient-to-br from-green-500 to-green-600'
                                }
                            `}>
                                {/* Subtle pattern overlay */}
                                <div className="absolute inset-0 bg-white/10 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent_50%)] rounded-full" />

                                {role === 'user' && isMuted ? (
                                    <MicOff size={20} className="relative z-10 text-white" />
                                ) : isAgent ? (
                                    <Bot size={20} className="relative z-10 text-white" />
                                ) : (
                                    <User size={20} className="relative z-10 text-white" />
                                )}
                            </div>

                            {/* Status indicator */}
                            {isActive && (
                                <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white animate-pulse ${isAgent ? 'bg-blue-500' : 'bg-green-500'
                                    }`}>
                                    <div className={`w-full h-full rounded-full animate-ping ${isAgent ? 'bg-blue-400' : 'bg-green-400'
                                        }`} />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <h3 className={`text-xl font-bold ${isAgent ? 'text-blue-800' : 'text-green-800'
                                    }`}>
                                    {isAgent ? 'AI Interviewer' : 'You'}
                                </h3>
                                {isSpeaking && (
                                    <div className="flex items-center gap-1">
                                        {isAgent ? (
                                            <Volume2 size={16} className="text-blue-600 animate-pulse" />
                                        ) : (
                                            <Mic size={16} className="text-green-600 animate-pulse" />
                                        )}
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 font-medium">
                                {details?.username || 'User'}
                            </p>

                            {/* Status badge */}
                            <Badge className={`text-xs font-medium border-0 ${isAgent
                                ? 'bg-blue-200/80 text-blue-800 hover:bg-blue-200'
                                : isMuted
                                    ? 'bg-red-200/80 text-red-800 hover:bg-red-200'
                                    : 'bg-green-200/80 text-green-800 hover:bg-green-200'
                                }`}>
                                {getStatusText()}
                            </Badge>
                        </div>
                    </div>

                    {/* Enhanced Audio Visualization */}
                    <div className={`relative p-4 rounded-xl border transition-all duration-200 ${isAgent
                        ? 'bg-blue-100/60 border-blue-200/50'
                        : 'bg-green-100/60 border-green-200/50'
                        }`}>
                        {/* Audio bars */}
                        <div className="flex items-center justify-center gap-1 h-12">
                            {[...Array(16)].map((_, i) => {
                                const baseHeight = 4 + (i % 3) * 2;
                                const activeHeight = isActive
                                    ? Math.max(baseHeight, Math.min(32, Math.sin(i * 0.5 + Date.now() * 0.01) * 8 + baseHeight))
                                    : baseHeight;

                                return (
                                    <div
                                        key={i}
                                        className={`w-1.5 rounded-full transition-all duration-150 ${isAgent ? 'bg-blue-500' : 'bg-green-500'
                                            }`}
                                        style={{
                                            height: `${activeHeight}px`,
                                            opacity: isActive ? 0.9 : 0.3,
                                            animationDelay: `${i * 50}ms`
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PlaygroundCard