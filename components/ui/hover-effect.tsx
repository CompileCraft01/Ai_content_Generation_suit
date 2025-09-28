"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon?: string;
    link: string;
  }[];
  className?: string;
}) => {
  const router = useRouter();

  const handleCardClick = (link: string) => {
    router.push(link);
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item?.link}
          className="relative group block p-2 h-full w-full cursor-pointer"
          onClick={() => handleCardClick(item.link)}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <div className="relative px-7 py-6 bg-slate-900 rounded-lg leading-none flex items-top justify-start space-x-6 h-full border border-slate-600 group-hover:border-pink-500 transition-all duration-300">
            <div className="space-y-2 w-full">
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-3xl">{item.icon || "✨"}</div>
                <h4 className="text-xl font-bold text-gray-200 group-hover:text-white transition-colors duration-200">
                  {item.title}
                </h4>
              </div>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-200 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
