import AuthForm from '@/components/AuthForm'
import React from 'react'

const page = () => {
    return (
        <>
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <div className='w-full max-w-md p-8 bg-white rounded-lg sm:shadow-[0_0px_5px_rgba(0,0,0,0.2)]'>
                    <AuthForm type="sign-up" />
                </div>
            </div>
        </>
    )
}

export default page