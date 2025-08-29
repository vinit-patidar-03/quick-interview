import { apiRequestSSR } from '@/api/sever-request';
import InterviewAgent from '@/components/playground/InterviewAgent';
import { getCookies } from '@/lib/session';
import { getUser } from '@/utils/auth';

const getInterviewData = async (id: string) => {
    try {
        const cookies = await getCookies();
        const response = await apiRequestSSR(`http://localhost:3000/api/interviews/${id}`, "GET", cookies);
        return response?.data;
    } catch (error) {
        console.error("Error fetching interview data:", error);
        return null;
    }
}

const InterviewPlayground = async ({ params }: { params: { id: string } }) => {
    const { id } = await params;
    const user = await getUser();

    const InterviewData = await getInterviewData(id);

    if (!InterviewData) {
        return <p className="text-red-500">Failed to load interview data.</p>;
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <InterviewAgent interview={InterviewData} user={user!} />
            </div>
        </>
    )
}

export default InterviewPlayground