"use client";
import { Menu, Target, Users, X, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { User } from "@/types/types";
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
            <Link
              href={`/profile`}
              className="flex items-center justify-center space-x-2 bg-gray-50 hover:bg-gray-100 w-10 h-10 rounded-full transition-colors duration-200 border border-gray-200 font-bold"
            >
              {user?.username[0]?.toUpperCase()}
            </Link>

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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-br from-gray-50 to-purple-50 border-t border-gray-200">
              <Link
                href="/practice"
                className="text-gray-700 hover:text-purple-600 hover:bg-white px-3 py-2 rounded-md text-base font-medium transition-all duration-200 flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Target className="w-4 h-4" />
                <span>Practice Interviews</span>
              </Link>
              <Link
                href="/browse"
                className="text-gray-700 hover:text-purple-600 hover:bg-white px-3 py-2 rounded-md text-base font-medium transition-all duration-200 flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="w-4 h-4" />
                <span>Browse Interviews</span>
              </Link>
              <Link
                href="/create"
                className="text-gray-700 hover:text-purple-600 hover:bg-white px-3 py-2 rounded-md text-base font-medium transition-all duration-200 flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Zap className="w-4 h-4" />
                <span>Create Interview</span>
              </Link>
              <div className="pt-2 border-t border-gray-200 mt-2">
                <Link
                  href="/signup"
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
