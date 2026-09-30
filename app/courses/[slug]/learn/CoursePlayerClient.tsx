"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Circle, Play, Award, Download, CheckCircle2 } from "lucide-react";

interface CoursePlayerClientProps {
  course: any;
  initialProgress: number;
}

export default function CoursePlayerClient({ course, initialProgress }: CoursePlayerClientProps) {
  const curriculum = Array.isArray(course.curriculum) && course.curriculum.length > 0
    ? course.curriculum
    : [
        { module: "Module 1", title: "Introduction & Foundations", duration: "45 mins", topics: ["Overview", "Core Concepts", "Setup Guide"] },
        { module: "Module 2", title: "Hands-on Implementation", duration: "60 mins", topics: ["Architecture", "Live Coding", "Automation Scripts"] },
        { module: "Module 3", title: "Enterprise Workflows", duration: "45 mins", topics: ["Connecting APIs", "Production Deployments", "Best Practices"] },
        { module: "Module 4", title: "Monetization & Certification Quiz", duration: "30 mins", topics: ["Client Pitching", "Final Assessment", "Certificate Issuance"] },
      ];

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>(() => {
    const count = Math.round((initialProgress / 100) * curriculum.length);
    return Array.from({ length: count }, (_, i) => i);
  });
  const [progress, setProgress] = useState(initialProgress);
  const [isUpdating, setIsUpdating] = useState(false);
  const [certificateData, setCertificateData] = useState<any>(null);

  const toggleModuleCompletion = async (index: number) => {
    setIsUpdating(true);
    let newCompleted: number[];
    if (completedModules.includes(index)) {
      newCompleted = completedModules.filter((i) => i !== index);
    } else {
      newCompleted = [...completedModules, index];
    }
    setCompletedModules(newCompleted);

    const calculatedProgress = Math.round((newCompleted.length / curriculum.length) * 100);
    setProgress(calculatedProgress);

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          progressPercent: calculatedProgress,
        }),
      });
      const data = await res.json();
      if (data.certificate) {
        setCertificateData(data.certificate);
      }
    } catch (err) {
      console.error("Error saving progress:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const activeModule = curriculum[activeModuleIndex] || curriculum[0];
  const isAllComplete = progress >= 100;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "1.5rem", alignItems: "start" }} className="player-grid">
      {/* Left: Player & Resource Area */}
      <div>
        <div
          style={{
            background: "#000",
            borderRadius: 20,
            overflow: "hidden",
            aspectRatio: "16 / 9",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          }}
        >
          {course.drive_url ? (
            <iframe
              src={course.drive_url.replace("/view", "/preview")}
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="autoplay"
              title={course.title}
            />
          ) : (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  background: "rgba(30, 111, 255, 0.2)",
                  border: "2px solid #1e6fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.25rem",
                  color: "#1e6fff",
                }}
              >
                <Play size={32} fill="#1e6fff" style={{ marginLeft: 4 }} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.5rem" }}>
                {activeModule.title}
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem", maxWidth: 450, margin: "0 auto" }}>
                Interactive session content & video stream. Watch and check off module below to track completion.
              </p>
            </div>
          )}
        </div>

        {/* Module Details & Action */}
        <div
          style={{
            background: "rgba(17, 24, 39, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 16,
            padding: "1.75rem",
            marginTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <span style={{ fontSize: "0.75rem", color: "#f5a623", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {activeModule.module || `Module ${activeModuleIndex + 1}`} • {activeModule.duration}
            </span>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0.25rem 0 0" }}>
              {activeModule.title}
            </h2>
          </div>

          <button
            onClick={() => toggleModuleCompletion(activeModuleIndex)}
            disabled={isUpdating}
            style={{
              background: completedModules.includes(activeModuleIndex)
                ? "rgba(16, 185, 129, 0.2)"
                : "#1e6fff",
              border: completedModules.includes(activeModuleIndex)
                ? "1px solid rgba(16, 185, 129, 0.4)"
                : "none",
              color: completedModules.includes(activeModuleIndex) ? "#10b981" : "#fff",
              fontWeight: 700,
              padding: "0.75rem 1.25rem",
              borderRadius: 10,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.875rem",
              transition: "all 0.2s",
            }}
          >
            {completedModules.includes(activeModuleIndex) ? (
              <>
                <CheckCircle2 size={16} /> Completed
              </>
            ) : (
              <>
                <Circle size={16} /> Mark as Complete
              </>
            )}
          </button>
        </div>

        {/* Certificate Unlocked Card */}
        {isAllComplete && (
          <div
            style={{
              background: "linear-gradient(135deg, rgba(245, 166, 35, 0.15), rgba(16, 185, 129, 0.1))",
              border: "1px solid rgba(245, 166, 35, 0.4)",
              borderRadius: 16,
              padding: "2rem",
              marginTop: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#f5a623", fontWeight: 800, fontSize: "0.8125rem", textTransform: "uppercase" }}>
                <Award size={18} /> Congratulations! Course 100% Completed
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0.5rem 0 0" }}>
                Your Verifiable Certificate is Ready!
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>
                Download your official ProCareerLabs certificate of completion in PDF format.
              </p>
            </div>

            <Link
              href="/certificates"
              style={{
                background: "#f5a623",
                color: "#0a0f1e",
                fontWeight: 800,
                padding: "0.875rem 1.5rem",
                borderRadius: 10,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 16px rgba(245, 166, 35, 0.3)",
              }}
            >
              <Download size={16} /> View & Download Certificate
            </Link>
          </div>
        )}
      </div>

      {/* Right: Modules Playlist Sidebar */}
      <div
        style={{
          background: "rgba(17, 24, 39, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 20,
          padding: "1.5rem",
        }}
      >
        {/* Progress Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
            <span style={{ fontWeight: 700, color: "#f9fafb" }}>Course Progress</span>
            <span style={{ color: "#f5a623", fontWeight: 800 }}>{progress}%</span>
          </div>
          <div style={{ width: "100%", height: 8, background: "rgba(255, 255, 255, 0.08)", borderRadius: 9999, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #1e6fff, #10b981)", borderRadius: 9999, transition: "width 0.3s ease" }} />
          </div>
        </div>

        <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 1rem" }}>
          Modules ({completedModules.length}/{curriculum.length})
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {curriculum.map((mod: any, idx: number) => {
            const isCompleted = completedModules.includes(idx);
            const isActive = activeModuleIndex === idx;

            return (
              <div
                key={idx}
                onClick={() => setActiveModuleIndex(idx)}
                style={{
                  background: isActive ? "rgba(30, 111, 255, 0.15)" : "rgba(255, 255, 255, 0.03)",
                  border: isActive ? "1px solid rgba(30, 111, 255, 0.4)" : "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: 12,
                  padding: "1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  transition: "all 0.2s",
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleModuleCompletion(idx);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: isCompleted ? "#10b981" : "#64748b",
                    cursor: "pointer",
                    padding: 0,
                    marginTop: 2,
                  }}
                >
                  {isCompleted ? <CheckCircle size={18} /> : <Circle size={18} />}
                </button>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.6875rem", color: isCompleted ? "#10b981" : "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                    {mod.module || `Module ${idx + 1}`} • {mod.duration}
                  </div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: isActive ? "#60a5fa" : "#f9fafb", marginTop: 2 }}>
                    {mod.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .player-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
