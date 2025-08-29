// UserProfilePage.tsx (Server Component)
import { apiRequestSSR } from '@/api/sever-request';
import UserProfile from '@/components/profile/UserProfile';
import { getCookies } from '@/lib/session';
import { getUser } from '@/utils/auth';
import React from 'react';

const getOwneredInterviews = async () => {
  try {
    const cookies = await getCookies();
    const response = await apiRequestSSR('http://localhost:3000/api/interviews/me/owned', "GET", cookies);
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching owned interviews:', error);
    return [];
  }
}

const getCompletedInterviews = async () => {
  try {
    const cookies = await getCookies();
    const response = await apiRequestSSR('http://localhost:3000/api/interviews/me/given', "GET", cookies);
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching completed interviews:', error);
    return [];
  }
}

const UserProfilePage = async () => {
  const [ownedInterviews, completedInterviews, user] = await Promise.allSettled([
    getOwneredInterviews(),
    getCompletedInterviews(),
    getUser()
  ]);

  const ownedData = ownedInterviews.status === 'fulfilled' ? ownedInterviews.value : [];
  const completedData = completedInterviews.status === 'fulfilled' ? completedInterviews.value : [];
  const userData = user.status === 'fulfilled' ? user.value : null;

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h1>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <UserProfile
      user={userData}
      ownedInterviews={ownedData}
      completedInterviews={completedData}
    />
  );
}

export default UserProfilePage;