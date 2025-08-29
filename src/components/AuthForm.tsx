"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { AuthFormProps } from "@/types/types";
import Image from "next/image";
import FormFieldWithLabel from "./FormFieldWithLabel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiRequest } from "../api/client-request";
import ButtonWithLoading from "./ButtonWithLoading";

const getAuthSchema = (type: string) => {
  const baseSchema = z.object({
    username:
      type === "sign-in"
        ? z.string().optional()
        : z
          .string()
          .min(5, { message: "Username must be at least 5 characters long" })
          .max(50, {
            message: "Username must be at most 50 characters long",
          }),

    email: z.string().email({ message: "Invalid email address" }),

    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),

    confirm_password:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(6, {
          message: "Confirm Password must be at least 6 characters long",
        }),
  });

  return type === "sign-in"
    ? baseSchema
    : baseSchema.refine((data) => data.password === data.confirm_password, {
      path: ["confirm_password"],
      message: "Passwords do not match",
    });
};

const AuthForm = ({ type }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isSignIn = type === "sign-in";
  const router = useRouter();
  const authFormSchema = getAuthSchema(type);

  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof authFormSchema>) => {
    setIsLoading(true);
    try {
      if (isSignIn) {
        const response = await apiRequest("/api/auth/sign-in", "POST", data);
        if (response.success) {
          setIsLoading(false);
          toast.success("Sign In successful");
          router.push("/practice");
        }
      } else {
        const response = await apiRequest("/api/auth/sign-up", "POST", data);
        if (response.success) {
          setIsLoading(false);
          toast.success("Account created successfully! Please sign in.");
          router.push("/sign-in");
        }
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-center mb-5">
          <Image
            src="/images/prep_smash.webp"
            height={100}
            width={200}
            alt="prepsmash_logo"
            title="prepsmash"
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {!isSignIn && (
              <FormFieldWithLabel
                control={form.control}
                name="username"
                placeholder="Enter your username"
                label="Username"
              />
            )}
            <FormFieldWithLabel
              control={form.control}
              name="email"
              placeholder="Enter your email"
              label="Email"
            />
            <FormFieldWithLabel
              type="password"
              control={form.control}
              name="password"
              placeholder="Enter your password"
              label="Password"
            />
            {!isSignIn && (
              <FormFieldWithLabel
                type="password"
                control={form.control}
                name="confirm_password"
                placeholder="Enter your password again"
                label="Confirm Password"
              />
            )}
            <ButtonWithLoading isLoading={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </ButtonWithLoading>
          </form>
        </Form>
        <div className="flex items-center justify-center mt-5 text-sm text-gray-600">
          <span>
            {isSignIn ? "don't you have account?" : "already a user?"}
          </span>
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="text-purple-500 font-semibold ml-1"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
