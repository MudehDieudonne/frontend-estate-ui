import React from "react";
import { Navbar } from "./Navbar";

interface FeedLayoutProps {
    leftSidebar?: React.ReactNode;
    children: React.ReactNode;
    rightSidebar?: React.ReactNode;
}

export const FeedLayout: React.FC<FeedLayoutProps> = ({ leftSidebar, children, rightSidebar }) => {
    return (
        <div className="min-h-screen bg-muted/30">
            <Navbar />
            <main className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar - Profile & Quick Links */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-20">
                            {leftSidebar}
                        </div>
                    </aside>

                    {/* Center Column - Main Feed */}
                    <section className="col-span-1 lg:col-span-6 space-y-6">
                        {children}
                    </section>

                    {/* Right Sidebar - Suggestions & Stats */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-20">
                            {rightSidebar}
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};
