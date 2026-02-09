import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
    const supabase = await createClient()

    // 1. Arrays of data to randomize
    const titles = [
        "Software Engineer", "Senior Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
        "Data Scientist", "Data Analyst", "Product Manager", "UI/UX Designer", "Product Designer",
        "DevOps Engineer", "Machine Learning Engineer", "Cloud Architect", "QA Engineer", "Site Reliability Engineer",
        "System Administrator", "Mobile Developer", "iOS Developer", "Android Developer", "Security Engineer",
        "Blockchain Developer", "Game Developer", "Embedded Systems Engineer", "Network Engineer", "Database Administrator"
    ]
    const companies = [
        "Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix", "Tesla",
        "Spotify", "Uber", "Airbnb", "Twitter", "LinkedIn", "Salesforce", "Adobe",
        "Oracle", "IBM", "Intel", "Cisco", "HP", "Dell", "Sony", "Samsung",
        "Stripe", "Coinbase", "Shopify", "Slack", "Zoom", "Atlassian", "Twilio", "Dropbox",
        "Square", "Pinterest", "Snap", "Reddit", "TikTok", "Bytedance", "Alibaba", "Tencent"
    ]
    const locations = [
        "Remote", "San Francisco, CA", "New York, NY", "Bangalore, India",
        "London, UK", "Berlin, Germany", "Toronto, Canada", "Singapore",
        "Austin, TX", "Seattle, WA", "Boston, MA", "Chicago, IL", "Los Angeles, CA",
        "Hyderabad, India", "Pune, India", "Mumbai, India", "Delhi, India", "Chennai, India",
        "Sydney, Australia", "Tokyo, Japan", "Amsterdam, Netherlands", "Dublin, Ireland",
        "Vancouver, Canada", "Paris, France", "Barcelona, Spain", "Stockholm, Sweden"
    ]
    const types = ["Full-time", "Contract", "Part-time", "Internship"]
    const levels = ["Entry Level", "Mid Level", "Senior Level", "Lead", "Director"]
    const sources = ["LinkedIn", "Indeed", "Glassdoor", "Company Website", "AngelList", "SimplyHired", "Wellfound"]

    // 2. Generate 200 jobs
    const jobs = []
    for (let i = 0; i < 200; i++) {
        const title = titles[Math.floor(Math.random() * titles.length)]
        const company = companies[Math.floor(Math.random() * companies.length)]
        const location = locations[Math.floor(Math.random() * locations.length)]
        const type = types[Math.floor(Math.random() * types.length)]
        const level = levels[Math.floor(Math.random() * levels.length)]

        // Randomize time within last 24-72 hours to simulate "freshness"
        // User asked for "update every day", so most should be < 24h
        const hoursAgo = Math.floor(Math.random() * 48)
        const postedAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()

        // Random skills
        const allSkills = ["JavaScript", "React", "Node.js", "Python", "SQL", "Java", "C++", "AWS", "Docker", "Kubernetes", "TypeScript", "Go", "Rust", "C#", ".NET", "Azure", "GCP", "Terraform", "Ansible", "Linux", "Git", "CI/CD", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "Data Analysis", "Statistics", "Excel", "Tableau", "PowerBI", "Figma", "Sketch", "InVision", "Adobe XD", "User Research", "Prototyping", "Wireframing", "Agile", "Scrum", "Kanban", "Jira", "Confluence", "Product Management", "Project Management", "Leadership", "Communication", "Problem Solving", "Critical Thinking", "Teamwork", "Collaboration", "Adaptability", "Creativity", "Innovation", "Emotional Intelligence", "Empathy", "Negotiation", "Conflict Resolution", "Decision Making", "Time Management", "Organization", "Attention to Detail", "Public Speaking", "Presentation Skills", "Writing", "Editing", "Research", "Analysis", "Reporting", "Documentation", "Testing", "Debugging", "Troubleshooting", "Optimization", "Performance Tuning", "Security", "Privacy", "Compliance", "Regulation", "Law", "Ethics", "Sustainability", "Accessibility", "Inclusivity", "Diversity", "Equity", "Belonging"]
        const jobSkills: string[] = []
        const skillCount = Math.floor(Math.random() * 5) + 3 // 3 to 7 skills
        for (let j = 0; j < skillCount; j++) {
            const skill = allSkills[Math.floor(Math.random() * allSkills.length)]
            if (!jobSkills.includes(skill)) jobSkills.push(skill)
        }

        jobs.push({
            title,
            company,
            location,
            job_type: type,
            experience_level: level,
            description: `We are looking for a talented ${title} to join our team at ${company}. You will be working on cutting-edge technologies and solving complex problems. This is a ${type} position based in ${location}. \n\nResponsibilities:\n- Design and develop scalable software solutions.\n- Collaborate with cross-functional teams.\n- Write clean, maintainable, and efficient code.\n\nRequirements:\n- Proven experience as a ${title} or similar role.\n- Strong knowledge of ${jobSkills.slice(0, 2).join(" and ")}.\n- Excellent problem-solving skills.`,
            skills: jobSkills,
            salary_range: `$${80 + Math.floor(Math.random() * 120)},000 - $${120 + Math.floor(Math.random() * 150)},000`,
            apply_url: "https://example.com/apply",
            source: sources[Math.floor(Math.random() * sources.length)],
            posted_at: postedAt,
            is_deleted: false
        })
    }

    // 3. Delete all existing jobs generally to keep the count at exactly 200 and fresh
    // Note: In production, you might want to soft-delete or archive, but for this specific "update every day" demo request:
    const { error: deleteError } = await supabase.from("jobs").delete().neq("id", "00000000-0000-0000-0000-000000000000") // Simple delete all

    if (deleteError) {
        console.error("Error clearing jobs:", deleteError)
    }

    // 4. Insert in batches if necessary (Supabase handles large inserts well usually, but 200 is small)
    const { error } = await supabase.from("jobs").insert(jobs)

    if (error) {
        const fs = require('fs');
        fs.writeFileSync('seed-error.txt', JSON.stringify(error, null, 2));
        console.error("Error seeding jobs (written to file)");
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
        success: true,
        count: jobs.length,
        message: "Successfully seeded 200 fresh jobs",
        timestamp: new Date().toISOString()
    })
}
