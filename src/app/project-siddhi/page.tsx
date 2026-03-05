import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { ProjectSiddhiPageContent } from "./_components/ProjectSiddhiPageContent";

export const metadata: Metadata = genMeta({
    title: "Project Siddhi — Mental Health Initiative",
    description:
        "Project Siddhi is Kuinbee's workplace mental health initiative. Access helplines, webinars, support circles, and professional resources for employee wellbeing.",
    keywords: [
        "mental health",
        "workplace wellbeing",
        "employee support",
        "Project Siddhi",
        "mental health helpline",
    ],
    path: "/project-siddhi",
});

export default function ProjectSiddhiPage() {
    return <ProjectSiddhiPageContent />;
}
