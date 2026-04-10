import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, BookOpen, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import Logo from "@/components/Logo";

const mockMaterials = [
  { id: "1", name: "Lecture 1 - Introduction to Forces", type: "slides", status: "known" as const },
  { id: "2", name: "Lecture 2 - Equilibrium", type: "slides", status: "known" as const },
  { id: "3", name: "Lecture 3 - Free Body Diagrams", type: "slides", status: "known" as const },
  { id: "4", name: "Lecture 4 - Shear & Bending", type: "slides", status: "missed" as const },
  { id: "5", name: "Lecture 5 - Beam Analysis", type: "slides", status: "learning" as const },
  { id: "6", name: "Tutorial Sheet 1", type: "tutorial", status: "known" as const },
  { id: "7", name: "Past Paper 2023", type: "exam", status: "known" as const },
];

const statusConfig = {
  known: { label: "Known", icon: CheckCircle, color: "text-success" },
  learning: { label: "Learning", icon: Clock, color: "text-warning" },
  missed: { label: "Missed", icon: AlertTriangle, color: "text-destructive" },
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const courseName = id === "1" ? "Structural Mechanics" : id === "2" ? "Linear Algebra" : "Thermodynamics";
  const courseCode = id === "1" ? "CIVL2001" : id === "2" ? "MATH2101" : "MECH3004";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 text-foreground" />
            <span className="text-lg font-semibold text-foreground">Debil</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 text-muted-foreground hover:text-foreground -ml-2"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to courses
        </Button>

        {/* Course Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{courseName}</h1>
            <p className="text-muted-foreground mt-1">{courseCode}</p>
          </div>
          <Button className="gap-2 bg-foreground text-background hover:bg-primary/80">
            <Upload className="w-4 h-4" />
            Upload Materials
          </Button>
        </div>

        {/* Knowledge Summary */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {(["known", "learning", "missed"] as const).map((status) => {
            const config = statusConfig[status];
            const Icon = config.icon;
            const count = mockMaterials.filter((m) => m.status === status).length;
            return (
              <div key={status} className="glass-card rounded-xl p-4 text-center">
                <Icon className={`w-5 h-5 mx-auto mb-2 ${config.color}`} />
                <div className="text-2xl font-semibold text-foreground">{count}</div>
                <div className="text-xs text-muted-foreground mt-1">{config.label}</div>
              </div>
            );
          })}
        </div>

        {/* Materials List */}
        <h2 className="text-lg font-medium text-foreground mb-4">Course Materials</h2>
        <div className="space-y-2">
          {mockMaterials.map((material) => {
            const config = statusConfig[material.status];
            const Icon = config.icon;
            return (
              <div
                key={material.id}
                className="glass-card rounded-lg p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{material.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  <span className={`text-xs ${config.color}`}>{config.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;
