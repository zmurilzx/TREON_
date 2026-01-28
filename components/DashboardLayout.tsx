"use client";

import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <DashboardHeader title={title} subtitle={subtitle} />
            <main className="dashboard-content">
                {children}
            </main>
        </div>
    );
}
