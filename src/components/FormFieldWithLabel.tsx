import React from 'react'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FormFieldWithLabelProps } from '@/types/types'
import { FieldValues } from 'react-hook-form'

const FormFieldWithLabel = <T extends FieldValues>({ control, name, placeholder, label, type }: FormFieldWithLabelProps<T>) => {
    return (
        <>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <Input placeholder={placeholder} type={type} {...field} autoComplete="off" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}

export default FormFieldWithLabel