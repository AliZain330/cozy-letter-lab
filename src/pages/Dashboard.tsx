import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, FolderOpen, FolderPlus } from "lucide-react";
import { CursorMark } from "@/components/CursorMark";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-2.5">
            <CursorMark className="w-6 h-6 text-foreground" />
            <span className="text-base font-semibold tracking-[-0.03em] text-foreground">Debil</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground gap-2"
            onClick={() => navigate("/")}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => navigate("/dashboard/existing")}
            className="glass-card rounded-2xl p-10 flex flex-col items-center gap-4 hover:bg-secondary/60 transition-all group w-64 h-64 justify-center"
          >
            <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderOpen className="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <span className="text-lg font-semibold tracking-[-0.03em] text-foreground">Open Existing Folder</span>
            <span className="text-sm text-muted-foreground font-mono tracking-[-0.01em]">Browse your courses</span>
          </button>

          <button
            onClick={() => navigate("/dashboard/new")}
            className="glass-card rounded-2xl p-10 flex flex-col items-center gap-4 hover:bg-secondary/60 transition-all group w-64 h-64 justify-center"
          >
            <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderPlus className="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <span className="text-lg font-semibold tracking-[-0.03em] text-foreground">Open New Folder</span>
            <span className="text-sm text-muted-foreground font-mono tracking-[-0.01em]">Create a new course</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
