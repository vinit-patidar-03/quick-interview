import { ChildProp } from '@/types/types'
import React from 'react'

const AuthLayout = ({ children }: ChildProp) => {
    return (
        <div>{children}</div>
    )
}

export default AuthLayout