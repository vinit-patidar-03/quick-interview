import { NextRequest, NextResponse } from 'next/server';
import { USER_PROGRESS } from '@/models';
import { connectDB } from '@/lib/db';
import { getUserId } from '@/lib/session';

export const POST = async (request: NextRequest,   {
    params,
  }: {
    params: Promise<{ [key: string]: string | string[] | undefined }>;
  })=> {
    try {

        const userId = await getUserId("access");
        const {id} = await params;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        
        const {
            timeRemaining,
            transcript,
            sessionId,
            totalDuration,
            isCompleted
        } = await request.json();
        

        if (!userId || !id || !sessionId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const progress = await USER_PROGRESS.findOneAndUpdate(
            { user: userId, interview: id },
            {
                transcript: transcript || [],
                sessionId,
                totalDuration,
                timeRemaining: timeRemaining/60,
                lastSaved: new Date(),
                isCompleted: isCompleted || timeRemaining <= 0
            },
            { 
                upsert: true, 
                new: true,
                setDefaultsOnInsert: true
            }
        );

        return NextResponse.json({
            success: true,
            progressId: progress._id,
            message: 'Progress saved successfully'
        });

    } catch (error) {
        console.error('Error saving progress:', error);
        return NextResponse.json(
            { error: 'Failed to save progress' },
            { status: 500 }
        );
    }
}

export const GET = async (request: NextRequest,   {
    params,
  }: {
    params: Promise<{ [key: string]: string | string[] | undefined }>;
  }) => {
    try {
        const userId = await getUserId("access");
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }   

        await connectDB();
 
        const {id} = await params;

        if (!userId || !id) {
            return NextResponse.json(
                { error: 'Missing userId or interviewId' },
                { status: 400 }
            );
        }

        const progress = await USER_PROGRESS.findOne({
            user: userId,
            interview: id,
            isCompleted: false
        }).populate('interview');

        if (!progress) {
            return NextResponse.json({
                success: false,
                message: 'No saved progress found'
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                timeRemaining: progress.timeRemaining * 60,
                transcript: progress.transcript,
                sessionId: progress.sessionId,
                lastSaved: progress.lastSaved,
                totalDuration: progress.totalDuration
            }
        });

    } catch (error) {
        console.error('Error fetching progress:', error);
        return NextResponse.json(
            { error: 'Failed to fetch progress' },
            { status: 500 }
        );
    }
}