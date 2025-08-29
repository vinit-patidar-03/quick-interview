import { apiRequestSSR } from '@/api/sever-request';
import InterviewAgent from '@/components/playground/InterviewAgent';
import { getCookies } from '@/lib/session';
import { getUser } from '@/utils/auth';

const getInterviewData = async (id: string) => {
    try {
        const cookies = await getCookies();
        const response = await apiRequestSSR(`/api/interviews/${id}`, "GET", cookies);
        return response?.data;
    } catch (error) {
        console.error("Error fetching interview data:", error);
        return null;
    }
}

export default async function InterviewPlayground({
    params,
}: {
    params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { id } = await params;
    const user = await getUser();

    const interviewData = await getInterviewData(id as string);

    if (!interviewData) {
        return <p className="text-red-500">Failed to load interview data.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <InterviewAgent interview={interviewData} user={user!} />
        </div>
    );
}


