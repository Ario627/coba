'use client'

import Link from "next/link"
import { useState } from "react"

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-linear-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">E</span>
                    </div>
                    <span className="font-bold text-xl hidden sm:inline bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        Erine
                    </span>
                    </Link>

                    <div className="hidden md:flex gap-8">
                        <Link href="#profile" className="text-gray-700 hover:text-pink-600  transition">
                            Profile
                        </Link>
                        <Link href="#events" className="text-gray-700 hover:text-pink-600  transition">
                            Events
                        </Link>
                        <Link href="#contact" className="text-gray-700 hover:text-pink-600 transition">
                            Contact
                        </Link>
                    </div>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    
                        aria-label="Toggle Menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {isOpen && (
                    <div className="">
                         
                    </div>
                )}

            </nav>
        </header>
    )
}