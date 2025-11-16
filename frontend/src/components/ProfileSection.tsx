'use client'

import {Profile} from "@/types"
import { Calendar, MapPin, Heart, MessageCircle, Share2, LucideProps } from "lucide-react"

interface ProfileSectionProps {
    profile: Profile;
}

export default function ProfileSection({ profile }: ProfileSectionProps) {
    return (
        <section id="profile" className="relative py-20 bg-linear-to-b from-white to-gray-100">
            <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-black mb-4">
                        <span className="bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            About Erine
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Get to know the incredible member of JKT48, Erine! Discover her journey, talents, and passions that make her shine both on and off the stage.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative h-96">
                        <div className="absolute inset-0 bg-linear-to-br from-pink-500 to-purple-600 rounded-3xl opacity-20 blur-2xl"></div>
                        <div className="relative h-full rounded-3xl border-2 border-gray-200 bg-linear-to-br from-pink-100 to-purple-100 items-center justify-center overflow-hidden group">
                            <div className="text-9xl group-hover:scale-110 transition-transform duration-500 ease-in-out">👩‍🎤</div>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <h3 className="text-5xl font-black text-gray-900">{profile.name}</h3>
                            {profile.position && (
                                <p className="text-xl font-bold text-pink-600">{profile.position}</p>
                            )}
                            <p className="text-gray-600 text-lg leading-relaxed">{profile.bio}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {profile.joinDate && (
                                <div className="p-4 rounded-xl bg-linear-to-br from-pink-50  to-pink-100 border border-pink-200">
                                    <p className="text-sm text-gray-600 mb-1">Member Since</p>
                                    <p className="font-bold text-pink-600">{profile.joinDate}</p>
                                </div>
                            )}
                            <div className="p-4 rounded-xl bg-linear-to-br from-purple-50 to-purple-100 border border-purple-200">
                                <p className="text-sm text-gray-600 mb-1">Status</p>
                                <p className="font-bold text-purple-600">Active</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                            {[
                                { icon: Heart, label: "Followers", value: "1.2M" },
                                { icon: MessageCircle, label: "Posts", value: "3.4K" },
                                { icon: Share2, label: "Engagements", value: "96%" },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <stat.icon className="w-6 h-6 text-pink-600 mx-automb-2" />
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button className="flex-1 px-6 py-3 rounded-lg bg-linear-to-r from-pink-600 to-purple-600 text-white font-bold hover:shadow-2xldow-lg hover:shadow-pink-500/60 transition-all transform hover:scale-105">
                                Follow
                            </button>
                            <button className="flex-1 px-6 py-3 rounded-lg border-2 border-pink-600 text-pink-600 font-bold hover:bg-pink-50 transition">
                                Message
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}