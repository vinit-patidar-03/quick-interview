"use client";
import { Menu, Target, Users, X, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { User } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
type NavbarProps = {
  user: User
}
const Navbar = ({ user }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 h-16 grid-cols-2">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
            >
              <Image
                src="/images/prep_smash.webp"
                alt="PrepSmash Logo"
                width={200}
                height={100}
                priority
              />
            </Link>
          </div>

          <div className="hidden w-full md:flex items-center justify-evenly">
            <Link
              href="/practice"
              className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
            >
              <Target className="w-4 h-4" />
              <span>Practice</span>
            </Link>
            <Link
              href="/browse"
              className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
            >
              <Users className="w-4 h-4" />
              <span>Browse</span>
            </Link>
            <Link
              href="/create"
              className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
            >
              <Zap className="w-4 h-4" />
              <span>Create</span>
            </Link>
          </div>

          <div className="flex justify-end items-center w-full gap-3">
            {user ? (
              // Authenticated user - show profile
              <Link href="/profile">
                <Avatar className="w-10 h-10 hover:ring-2 hover:ring-gray-300 transition-all duration-200 cursor-pointer">
                  <AvatarImage
                    src={user?.profileImage}
                    alt={`${user?.username}'s profile`}
                  />
                  <AvatarFallback className="bg-gray-50 hover:bg-gray-100 border border-gray-200 font-bold">
                    {user?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              // Not authenticated - show sign in/up buttons (desktop only)
              <div className="hidden md:flex items-center gap-2">
                <Link href="/sign-in">
                  <Button variant="ghost" className="text-gray-700 hover:text-purple-600">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              onClick={toggleMenu}
              variant="prepsmash_button_outline"
              aria-expanded="false"
              className="md:hidden"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <Menu className="w-6 h-6" />
              ) : (
                <X className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="py-4 px-4 bg-white border-t border-gray-200 shadow-lg">
              {/* Navigation Links */}
              <div className="space-y-1">
                <Link
                  href="/practice"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Target className="w-5 h-5 mr-3 text-purple-500" />
                  <span className="font-medium">Practice Interviews</span>
                </Link>
                <Separator />
                <Link
                  href="/browse"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Users className="w-5 h-5 mr-3 text-indigo-500" />
                  <span className="font-medium">Browse Interviews</span>
                </Link>
                <Separator />
                <Link
                  href="/create"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Zap className="w-5 h-5 mr-3 text-yellow-500" />
                  <span className="font-medium">Create Interview</span>
                </Link>
              </div>
              {
                !user &&
                <>
                  <Separator />
                  <div className="space-y-3 border-t border-gray-100 pt-4">
                    <Link
                      href="/sign-in"
                      className="flex items-center justify-center w-full px-4 py-2.5 text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg font-medium transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/sign-up"
                      className="flex items-center justify-center w-full px-4 py-2.5 text-white bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </>
              }

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
