'use client';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { User, Calendar, Clock, Users, Award, Star, ChevronRight, TrashIcon, Edit, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Interview } from '@/types/types';
import Link from 'next/link';
import { apiRequest, apiRequestWithFile } from '@/api/client-request';
import { toast } from 'sonner';
import ButtonWithLoading from '../ButtonWithLoading';
import { getDifficultyColor } from '@/constants/constants';

export interface UserData {
  _id: string;
  email: string;
  username: string;
  profileImage?: string;
  profileLogo?: File | null,
  vapiAPIKey?: string
}

interface UserProfileProps {
  user: UserData;
  ownedInterviews: Interview[];
  completedInterviews: Interview[];
}

const calculateActivityRate = (ownedCount: number, completedCount: number): number => {
  const totalInterviews = ownedCount + completedCount;
  return totalInterviews > 0 ? Math.round((completedCount / totalInterviews) * 100) : 0;
};

const useInterviewActions = () => {
  const generateFeedback = async (interviewId: string) => {
    try {
      const response = await apiRequest(`/api/interviews/${interviewId}/feedback`, "POST");
      if (response?.success) {
        toast.success("Feedback generated successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error generating feedback:', error);
      toast.error("Failed to generate feedback");
      return false;
    }
  };

  const deleteInterview = async (interviewId: string) => {
    try {
      const response = await apiRequest(`/api/interviews/${interviewId}`, "DELETE");
      if (response?.success) {
        toast.success("Interview deleted successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting interview:', error);
      toast.error("Failed to delete interview");
      return false;
    }
  };

  const updateUser = async (userData: Partial<UserData>) => {
    try {
      const formData = new FormData();
      if (userData.username) formData.append('username', userData.username);
      if (userData.email) formData.append('email', userData.email);
      if (userData.profileLogo) formData.append('profileLogo', userData.profileLogo);
      if (userData.vapiAPIKey) formData.append('vapiAPIKey', userData.vapiAPIKey);

      const response = await apiRequestWithFile(`/api/auth/me`, "PUT", formData);
      if (response?.success) {
        toast.success("Profile updated successfully");
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
      return null;
    }
  };

  return { generateFeedback, deleteInterview, updateUser };
};

const UserAvatar = ({ user, size = 'large' }: { user: UserData; size?: 'small' | 'medium' | 'large' }) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-20 w-20 border-4 border-primary/20'
  };

  const iconSizes = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  };

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={user.profileImage} alt={user.username} />
        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
          <User className={iconSizes[size]} />
        </AvatarFallback>
      </Avatar>
      {size === 'large' && (
        <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-background" />
      )}
    </div>
  );
};

const EditUserDialog = ({
  user,
  onUserUpdate
}: {
  user: UserData;
  onUserUpdate: (updatedUser: UserData) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    profileImage: string;
    profileLogo: File | null;
    vapiAPIKey: string
  }>({
    username: user.username,
    email: user.email,
    profileImage: user.profileImage || '',
    profileLogo: null,
    vapiAPIKey: user?.vapiAPIKey as string
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { updateUser } = useInterviewActions();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 2) {
      newErrors.username = 'Username must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.profileLogo) {
      const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
      if (formData.profileLogo.size > maxSizeInBytes) {
        newErrors.profileLogo = "File size should not exceed 2MB";
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(formData.profileLogo.type)) {
        newErrors.profileLogo = "Only JPG, PNG, or WEBP images are allowed";
      }
    }

    if (formData.vapiAPIKey) {
      if (formData.vapiAPIKey.length < 20) {
        newErrors.vapiAPIKey = "API Key must be at least 20 characters long";
      } else if (!/^[A-Za-z0-9_\-\.]+$/.test(formData.vapiAPIKey)) {
        newErrors.vapiAPIKey = "API Key can only contain letters, numbers, dashes, underscores, and dots";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    const updatedUser = await updateUser(formData);

    if (updatedUser) {
      onUserUpdate({ ...user, ...updatedUser });
      setOpen(false);
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string | File | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      username: user.username,
      email: user.email,
      profileImage: user.profileImage || '',
      profileLogo: null,
      vapiAPIKey: ''
    });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          <span className='md:block hidden'>Edit Profile</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Enter your username"
                className={errors.username ? 'border-red-500' : ''}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Image (Optional)</Label>
              <Input
                id="profileImage"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  handleInputChange("profileLogo", file || null);
                }}
              />
              {formData.profileLogo && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={URL.createObjectURL(formData.profileLogo)} alt="Preview" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">Preview</span>
                </div>
              )}
              {errors.profileLogo && <p className="text-red-500 text-sm">{errors.profileLogo}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Vapi API Key</Label>
              <Input
                id="username"
                value={formData.vapiAPIKey}
                onChange={(e) => handleInputChange('vapiAPIKey', e.target.value)}
                placeholder="Enter your key"
                className={errors.vapiAPIKey ? 'border-red-500' : ''}
              />
              {errors.vapiAPIKey && (
                <p className="text-sm text-red-500">{errors.vapiAPIKey}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <div className='grid grid-cols-2 gap-2'>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <div className='justify-items-center'>
                <ButtonWithLoading isLoading={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </ButtonWithLoading>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const UserInfoCard = ({
  user,
  onUserUpdate
}: {
  user: UserData;
  onUserUpdate: (updatedUser: UserData) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('/api/auth/logout', 'POST');
      if (response?.success) {
        toast.success("logged out successfully");
        window.location.href = '/'
      }
    } catch (error) {
      toast.error('Logout failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return <Card className="mb-6">
    <CardContent>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <UserAvatar user={user} size="large" />
          <div className="flex-1 space-y-2">
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
        <div className='flex gap-2 items-center'>
          <EditUserDialog user={user} onUserUpdate={onUserUpdate} />
          <ButtonWithLoading isLoading={isLoading} size='sm' onClick={handleLogout}>
            {isLoading ? <span className='md:block hidden'>Logging Out...</span> : <><span className='md:block hidden'>Log Out</span> <LogOut className='w-4 h-4' /></>}
          </ButtonWithLoading>
        </div>
      </div>
    </CardContent>
  </Card>
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  bgColor,
  textColor,
  iconBg
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  textColor: string;
  iconBg: string;
}) => (
  <Card className={`bg-gradient-to-br ${bgColor} ${textColor}`}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <CardDescription className={textColor}>{title}</CardDescription>
          <CardTitle className="text-2xl">{value}</CardTitle>
        </div>
        <div className={`h-12 w-12 ${iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const StatsCard = ({ ownedCount, completedCount }: { ownedCount: number; completedCount: number }) => {
  const activityRate = calculateActivityRate(ownedCount, completedCount);

  const stats = [
    {
      title: "Interviews Created",
      value: ownedCount,
      icon: Users,
      bgColor: "from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800",
      textColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-500"
    },
    {
      title: "Interviews Completed",
      value: completedCount,
      icon: Award,
      bgColor: "from-green-50 to-green-100 border-green-200 dark:from-green-950 dark:to-green-900 dark:border-green-800",
      textColor: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-500"
    },
    {
      title: "Activity Rate",
      value: `${activityRate}%`,
      icon: Star,
      bgColor: "from-purple-50 to-purple-100 border-purple-200 dark:from-purple-950 dark:to-purple-900 dark:border-purple-800",
      textColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

const TechnologyTags = ({ technologies }: { technologies: string[] }) => {
  if (!technologies?.length) return null;

  return (
    <div className="space-y-2">
      <Separator />
      <div className="flex flex-wrap gap-1">
        {technologies.slice(0, 3).map((tech, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {tech}
          </Badge>
        ))}
        {technologies.length > 3 && (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            +{technologies.length - 3} more
          </Badge>
        )}
      </div>
    </div>
  );
};

const InterviewStatus = ({ interview }: { interview: Interview }) => {
  const getStatusConfig = () => {
    if (interview?.isCompleted) {
      return { text: "Completed", color: "text-green-500" };
    }
    if (interview?.isStarted) {
      return { text: "Attempted", color: "text-yellow-500" };
    }
    return { text: "Not started", color: "text-gray-500" };
  };

  const { text, color } = getStatusConfig();

  return (
    <Badge variant="outline" className={color}>
      {text}
    </Badge>
  );
};

const InterviewActions = ({
  interview,
  onFeedbackGenerated
}: {
  interview: Interview;
  onFeedbackGenerated?: () => void;
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateFeedback } = useInterviewActions();

  const handleGenerateFeedback = async () => {
    setIsGenerating(true);
    const success = await generateFeedback(interview._id);
    if (success) {
      onFeedbackGenerated?.();
    }
    setIsGenerating(false);
  };

  if (!interview?.isCompleted) {
    return (
      <Link
        href={`/playground/${interview?._id}`}
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium"
      >
        Start Interview
        <ChevronRight className='w-4 h-4' />
      </Link>
    );
  }

  if (interview?.isCompleted && !interview?.isFeedback) {
    return (
      <Button variant="outline" onClick={handleGenerateFeedback} disabled={isGenerating}>
        {isGenerating ? "Generating..." : "Generate Feedback"}
      </Button>
    );
  }

  if (interview?.isFeedback) {
    return (
      <Link href={`/interview/feedback/${interview?._id}`} className='flex items-center gap-1 px-4 py-2 text-sm font-medium'>
        See Feedback
        <ChevronRight className='w-4 h-4' />
      </Link>
    );
  }

  return null;
};

const InterviewCardHeader = ({
  interview,
  type,
  onDelete
}: {
  interview: Interview;
  type: "owned" | "completed";
  onDelete?: () => void;
}) => (
  <CardHeader className="pb-4">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center font-bold text-2xl">
          {interview?.company[0].toUpperCase()}
        </div>
        <div>
          <CardTitle className="text-lg">{interview.company}</CardTitle>
          <CardDescription>{interview.role}</CardDescription>
        </div>
      </div>
      {type === "owned" && (
        <Button variant="outline" className='hover:bg-red-100 transition-all p-1' onClick={onDelete}>
          <TrashIcon className='w-4 h-4 fill-red-500 text-red-500' />
        </Button>
      )}
    </div>
  </CardHeader>
);

const InterviewMetrics = ({ interview }: { interview: Interview }) => (
  <div className="flex items-center justify-between">
    <Badge className={`${getDifficultyColor(interview.difficulty)}`} variant="outline">
      {interview.difficulty}
    </Badge>
    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
      <div className="flex items-center space-x-1">
        <Clock className="h-4 w-4" />
        <span>{interview.duration} min</span>
      </div>
      <div className="flex items-center space-x-1">
        <Users className="h-4 w-4" />
        <span>{interview.questions?.length || 0} questions</span>
      </div>
    </div>
  </div>
);

const InterviewCard = ({
  interview,
  setInterviews,
  type
}: {
  interview: Interview;
  setInterviews: Dispatch<SetStateAction<Interview[]>>;
  type: "owned" | "completed";
}) => {
  const { deleteInterview } = useInterviewActions();

  const handleDelete = async () => {
    const success = await deleteInterview(interview._id);
    if (success) {
      setInterviews(prev => prev.filter(item => item._id !== interview._id));
    }
  };

  const handleFeedbackGenerated = () => {
    setInterviews(prev => prev.map(item =>
      item._id === interview._id
        ? { ...item, isFeedback: true }
        : item
    ));
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50">
      <InterviewCardHeader
        interview={interview}
        type={type}
        onDelete={handleDelete}
      />

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {interview.description}
        </p>

        <InterviewMetrics interview={interview} />

        <TechnologyTags technologies={interview.technologies} />

        <Separator />

        <div className="flex items-center justify-between">
          <InterviewStatus interview={interview} />
          <InterviewActions
            interview={interview}
            onFeedbackGenerated={handleFeedbackGenerated}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyState = ({
  type,
  message
}: {
  type: 'owned' | 'completed';
  message: string;
}) => (
  <Card>
    <CardContent className="p-12 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardDescription className="text-lg">{message}</CardDescription>
        <Link
          href={type === "owned" ? '/create' : '/browse'}
          className='border px-2 border-gray-500 rounded-sm text-sm text-gray-500 hover:border-gray-400 transition-colors'
        >
          {type === 'owned' ? 'Create Interview' : 'Browse Interviews'}
        </Link>
      </div>
    </CardContent>
  </Card>
);

const InterviewSection = ({
  title,
  interviews,
  setInterviews,
  type,
  emptyMessage
}: {
  title: string;
  interviews: Interview[];
  setInterviews?: Dispatch<SetStateAction<Interview[]>>;
  type: 'owned' | 'completed';
  emptyMessage: string;
}) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold">{title}</h2>
      <Badge variant="secondary">
        {interviews.length} {interviews.length === 1 ? 'interview' : 'interviews'}
      </Badge>
    </div>

    {interviews.length === 0 ? (
      <EmptyState type={type} message={emptyMessage} />
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.map((interview) => (
          <InterviewCard
            key={interview._id}
            interview={interview}
            setInterviews={setInterviews!}
            type={type}
          />
        ))}
      </div>
    )}
  </div>
);

const UserProfile = ({ user, ownedInterviews, completedInterviews }: UserProfileProps) => {
  const [interviews, setInterviews] = useState(ownedInterviews);
  const [currentUser, setCurrentUser] = useState(user);

  const handleUserUpdate = (updatedUser: UserData) => {
    setCurrentUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <UserInfoCard user={currentUser} onUserUpdate={handleUserUpdate} />

        <StatsCard
          ownedCount={interviews.length}
          completedCount={completedInterviews.length}
        />

        <InterviewSection
          title="Interviews You Created"
          interviews={interviews}
          setInterviews={setInterviews}
          type="owned"
          emptyMessage="You haven't created any interviews yet. Start by creating your first interview!"
        />

        <InterviewSection
          title="Interviews You Completed"
          interviews={completedInterviews}
          type="completed"
          emptyMessage="You haven't completed any interviews yet. Browse available interviews to get started!"
        />
      </div>
    </div>
  );
};

export default UserProfile;