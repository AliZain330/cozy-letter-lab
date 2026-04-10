import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, BookOpen, Search, LogOut, ChevronRight } from "lucide-react";
import Logo from "@/components/Logo";

interface Course {
  id: string;
  name: string;
  code: string;
  topics: { known: number; learning: number; missed: number };
}

const mockCourses: Course[] = [
  {
    id: "1",
    name: "Structural Mechanics",
    code: "CIVL2001",
    topics: { known: 8, learning: 2, missed: 1 },
  },
  {
    id: "2",
    name: "Linear Algebra",
    code: "MATH2101",
    topics: { known: 5, learning: 3, missed: 2 },
  },
  {
    id: "3",
    name: "Thermodynamics",
    code: "MECH3004",
    topics: { known: 6, learning: 1, missed: 3 },
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = mockCourses.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 text-foreground" />
            <span className="text-lg font-semibold text-foreground">BridgeAI</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/")}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Your Courses</h1>
            <p className="text-muted-foreground mt-1">
              Organize materials and track knowledge gaps
            </p>
          </div>
          <Button
            onClick={() => navigate("/course/new")}
            className="gap-2 bg-foreground text-background hover:bg-primary/80"
          >
            <Plus className="w-4 h-4" />
            New Course
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-secondary border-border"
          />
        </div>

        {/* Course Cards */}
        <div className="space-y-3">
          {filtered.map((course) => (
            <button
              key={course.id}
              onClick={() => navigate(`/course/${course.id}`)}
              className="w-full glass-card rounded-xl p-5 flex items-center justify-between hover:bg-secondary/50 transition-colors text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{course.name}</h3>
                  <p className="text-sm text-muted-foreground">{course.code}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-muted-foreground">{course.topics.known} known</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-warning" />
                    <span className="text-muted-foreground">{course.topics.learning} learning</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-destructive" />
                    <span className="text-muted-foreground">{course.topics.missed} missed</span>
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No courses found. Create your first course to get started.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
