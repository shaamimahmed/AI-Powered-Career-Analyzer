
import React from 'react';

interface SkeletonLoaderProps {
    sections: number;
    linesPerSection?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ sections, linesPerSection = 3 }) => {
    return (
        <div className="space-y-8 animate-pulse">
            {Array.from({ length: sections }).map((_, i) => (
                <div key={i} className="space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="space-y-2">
                         {Array.from({ length: linesPerSection }).map((_, j) => (
                            <div key={j} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                         ))}
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};
