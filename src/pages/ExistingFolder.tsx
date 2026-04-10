import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import { ArrowLeft, FileIcon, FolderIcon, FolderOpenIcon, BookOpen, Search, ChevronRight, Star } from "lucide-react";
import { CursorMark } from "@/components/CursorMark";
import StarRating from "@/components/StarRating";

interface Item {
  name: string;
  children?: string[];
  rating?: number;
}

const existingItems: Record<string, Item> = {
  root: { name: "My Courses", children: ["cs101", "math201", "phys150"] },
  cs101: { name: "CS 101 – Intro to Computer Science", children: ["cs101-lectures", "cs101-labs"] },
  "cs101-lectures": { name: "Lectures", children: ["cs101-lec1", "cs101-lec2", "cs101-lec3"] },
  "cs101-lec1": { name: "Lecture 1 - Variables.pdf", rating: 4 },
  "cs101-lec2": { name: "Lecture 2 - Control Flow.pdf", rating: 2 },
  "cs101-lec3": { name: "Lecture 3 - Functions.pdf", rating: 5 },
  "cs101-labs": { name: "Labs", children: ["cs101-lab1", "cs101-lab2"] },
  "cs101-lab1": { name: "Lab 1 - Hello World.py", rating: 5 },
  "cs101-lab2": { name: "Lab 2 - Loops.py", rating: 3 },
  math201: { name: "MATH 201 – Linear Algebra", children: ["math-notes", "math-hw"] },
  "math-notes": { name: "Notes", children: ["math-n1", "math-n2"] },
  "math-n1": { name: "Chapter 1 - Vectors.pdf", rating: 3 },
  "math-n2": { name: "Chapter 2 - Matrices.pdf", rating: 1 },
  "math-hw": { name: "Homework", children: ["math-hw1"] },
  "math-hw1": { name: "Problem Set 1.pdf", rating: 4 },
  phys150: { name: "PHYS 150 – Mechanics", children: ["phys-slides", "phys-exam"] },
  "phys-slides": { name: "Slides", children: ["phys-s1", "phys-s2"] },
  "phys-s1": { name: "Kinematics.pptx", rating: 2 },
  "phys-s2": { name: "Newton's Laws.pptx", rating: 5 },
  "phys-exam": { name: "Midterm Review.pdf", rating: 3 },
};

function itemMatchesSearch(itemId: string, query: string): boolean {
  const item = existingItems[itemId];
  if (!item) return false;
  if (item.name.toLowerCase().includes(query)) return true;
  if (item.children) {
    return item.children.some((childId) => itemMatchesSearch(childId, query));
  }
  return false;
}

function countFiles(itemId: string): number {
  const item = existingItems[itemId];
  if (!item) return 0;
  if (!item.children) return 1;
  return item.children.reduce((sum, id) => sum + countFiles(id), 0);
}

const indent = 24;

const ExistingFolder = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());

  const toggleCourse = (courseId: string) => {
    setExpandedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) next.delete(courseId);
      else next.add(courseId);
      return next;
    });
  };

  const query = search.toLowerCase().trim();
  const topLevelCourses = existingItems.root.children ?? [];

  const filteredCourses = query
    ? topLevelCourses.filter((id) => itemMatchesSearch(id, query))
    : topLevelCourses;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-2.5">
            <CursorMark className="w-6 h-6 text-foreground" />
            <span className="text-base font-semibold tracking-[-0.03em] text-foreground">Debil</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground gap-2"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-10 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/50">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-[-0.03em] text-foreground">My Courses</h1>
              <p className="text-sm text-muted-foreground font-mono tracking-[-0.01em]">Browse your existing course materials and ratings</p>
            </div>
          </div>
        </div>

        {/* Star rating key */}
        <div className="flex items-center gap-4 mb-6 text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1.5">
            <Star size={12} className="text-foreground fill-foreground" />
            <span>1 = Very less confident</span>
          </span>
          <span className="text-border">—</span>
          <span className="flex items-center gap-1.5">
            <span className="flex">{[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-foreground fill-foreground" />)}</span>
            <span>5 = Very confident</span>
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search folders and files..."
            className="pl-9 bg-card/50 border-border/60"
          />
        </div>

        {/* Course cards with inline expanded trees */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((courseId) => {
              const course = existingItems[courseId];
              const isExpanded = expandedCourse === courseId;
              const fileCount = countFiles(courseId);

              return (
                <div key={courseId} className="flex flex-col">
                  <button
                    onClick={() => setExpandedCourse(isExpanded ? null : courseId)}
                    className={`
                      group text-left rounded-xl border transition-all duration-200
                      p-5 flex flex-col gap-3
                      hover:scale-[1.03] hover:shadow-lg hover:shadow-foreground/5
                      ${isExpanded
                        ? "border-foreground/20 bg-accent/20 scale-[1.01]"
                        : "border-border/50 bg-card/40 hover:border-foreground/15 hover:bg-accent/10"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-accent/50 group-hover:bg-accent/80 transition-colors">
                        {isExpanded ? (
                          <FolderOpenIcon className="w-5 h-5 text-foreground/70" />
                        ) : (
                          <FolderIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground/70 transition-colors" />
                        )}
                      </div>
                      <ChevronRight className={`w-4 h-4 text-muted-foreground/40 transition-transform duration-200 ${isExpanded ? "rotate-90" : "group-hover:translate-x-0.5"}`} />
                    </div>
                    <div>
                      <span className="text-sm font-medium tracking-[-0.01em] text-foreground">{course.name}</span>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{fileCount} files</p>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Expanded course tree - appears below the grid */}
          {expandedCourse && (
            <ExpandedCourseTree
              courseId={expandedCourse}
              query={query}
            />
          )}
        </div>

        {query && filteredCourses.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground font-mono">
            No results for "{search}"
          </div>
        )}
      </main>
    </div>
  );
};

function ExpandedCourseTree({ courseId, query }: { courseId: string; query: string }) {
  const tree = useTree<Item>({
    initialState: {
      expandedItems: existingItems[courseId]?.children ?? [],
    },
    indent,
    rootItemId: courseId,
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => existingItems[itemId],
      getChildren: (itemId) => existingItems[itemId]?.children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  });

  const visibleItems = query
    ? tree.getItems().filter((item) => itemMatchesSearch(item.getId(), query))
    : tree.getItems();

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden animate-fade-in">
      <Tree tree={tree} className="w-full py-1">
        {visibleItems.map((item) => {
          const isFolder = item.isFolder();

          return (
            <TreeItem
              key={item.getId()}
              item={item}
              className={`
                group rounded-none border-b border-border/15 last:border-b-0
                transition-all duration-150
                hover:bg-accent/30 hover:translate-x-1
                ${isFolder ? "py-2" : "py-1.5"}
              `}
            >
              <div className="flex items-center justify-between w-full gap-8 pr-3">
                <TreeItemLabel item={item} className="flex items-center gap-2.5 min-w-0">
                  {isFolder ? (
                    item.isExpanded() ? (
                      <FolderOpenIcon className="w-4 h-4 text-muted-foreground/70 shrink-0" />
                    ) : (
                      <FolderIcon className="w-4 h-4 text-muted-foreground/70 shrink-0" />
                    )
                  ) : (
                    <FileIcon className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                  )}
                  <span className={`
                    tracking-[-0.01em] truncate
                    ${isFolder ? "text-sm font-medium text-foreground/80" : "text-[13px] text-foreground/70"}
                  `}>
                    {item.getItemName()}
                  </span>
                </TreeItemLabel>

                {!isFolder && (
                  <div className="shrink-0">
                    <StarRating
                      rating={item.getItemData().rating ?? 0}
                      onChange={() => {}}
                      size={13}
                    />
                  </div>
                )}
              </div>
            </TreeItem>
          );
        })}
      </Tree>
    </div>
  );
}

export default ExistingFolder;
