import Navbar from '@/components/Navbar'
import { ChildProp } from '@/types/types'
import React from 'react'

const RootLayout = ({ children }: ChildProp) => {
    return (
        <>
            <div>
                <Navbar />
                {children}
            </div>
        </>
    )
}

export default RootLayout