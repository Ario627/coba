'use client'

import Link from "next/link"
import {Menu, X, Sparkles} from "lucide-react"
import { useState, useEffect } from "react"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => { window.removeEventListener('scroll', handleScroll); }
    }, []);

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            isScrolled
                ? 'bg-white/80 backdrop-blur-xl shadow-lg'
                : 'bg-linear-to-b from-black/20 top-transparent'
            }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-12 h-12 rounded-xl bg-linear-to-br from-pink-500 via-purple-500 to-cyan-500 p-0.5 shadow-lg shadow-pink-500/50">
                            <div className="w-full h-full rounded-[10px] bg-black items-center justify-center  group-hover:bg-linear-to-br group-hover:from-pink-600 group-hover:to-purple-600 transition-all">
                                <Sparkles className="w-6 h-6 text-white"/>
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <p className="font-black text-lg bg-linear-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                                ERINE
                            </p>
                            <p className="text-xs text-gray-600 font-medium">JKT48 Official</p>
                        </div>
                    </Link>

                    <div className="hidden md:flex gap-1">
                        {['Profile', 'Events', 'Gallery', 'Contact'].map((item) => (
                            <Link 
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="px-4 py-2 text-gray-700 hover:text-pink-600 font-medium transition-colors relative group"
                            >
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-pink-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <button className="px-6 py-2 rounded-4xl font-medium text-white bg-linear-to-r from-pink-600 to-purple-600 hover:shadow-lg hover:shadow-pink-500/50 transition-all transform hover:scale-105">
                            Support
                        </button>
                    </div>

                    <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="rounded-lg hover:hidden hover:bg-white/10 transition"
                    >
                        {isOpen ? (
                            <X className="w-6 h-6 text-gray-900" />
                         ): (
                            <Menu className="w-6 h-6 text-gray-900" />
                         )}
                    </button>
                </div>

                {isOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 mt-2 rounded-b-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="p-4 space-y-2">
                            {['Profile', 'Events', 'Gallery', 'Contact'].map((item) => (
                                <link
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 text-gray-800 hover:bg-pink-50 rounded-lg font-medium transition"
                                >
                                    {item}
                                </link>
                            ))}
                            <button className="w-full mt-4 px-6 py-2 rounded-lg font-medium text-white bg-linear-to-r from-pink-600 to-purple-600 hover:shadow-lg transition">
                               Support 
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}