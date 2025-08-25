import { apiRequestSSR } from '@/api/request';
import InterviewAgent from '@/components/playground/InterviewAgent';
import { getCookies } from '@/lib/session';

const getInterviewData = async (id: string) => {
    try {
        const cookies = await getCookies();
        const response = await apiRequestSSR(`http://localhost:3000/api/interviews/${id}`, "GET", cookies);
        console.log("Interview data:", response);
        return response?.data;
    } catch (error) {
        console.error("Error fetching interview data:", error);
        return null;
    }
}

const InterviewPlayground = async ({ params }: { params: { id: string } }) => {
    const { id } = await params;

    const InterviewData = await getInterviewData(id);

    if (!InterviewData) {
        return <p className="text-red-500">Failed to load interview data.</p>;
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <InterviewAgent interview={InterviewData} />
            </div>
        </>
    )
}

export default InterviewPlayground