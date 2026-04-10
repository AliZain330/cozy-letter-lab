import { useNavigate } from "react-router-dom";
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { Button } from "@/components/ui/button";
import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import { ArrowLeft, FileIcon, FolderIcon, FolderOpenIcon, BookOpen } from "lucide-react";
import Logo from "@/components/Logo";
import StarRating from "@/components/StarRating";

interface Item {
  name: string;
  children?: string[];
  rating?: number;
}

const existingItems: Record<string, Item> = {
  root: {
    name: "My Courses",
    children: ["cs101", "math201", "phys150"],
  },
  cs101: {
    name: "CS 101 – Intro to Computer Science",
    children: ["cs101-lectures", "cs101-labs"],
  },
  "cs101-lectures": {
    name: "Lectures",
    children: ["cs101-lec1", "cs101-lec2", "cs101-lec3"],
  },
  "cs101-lec1": { name: "Lecture 1 - Variables.pdf", rating: 4 },
  "cs101-lec2": { name: "Lecture 2 - Control Flow.pdf", rating: 2 },
  "cs101-lec3": { name: "Lecture 3 - Functions.pdf", rating: 5 },
  "cs101-labs": {
    name: "Labs",
    children: ["cs101-lab1", "cs101-lab2"],
  },
  "cs101-lab1": { name: "Lab 1 - Hello World.py", rating: 5 },
  "cs101-lab2": { name: "Lab 2 - Loops.py", rating: 3 },
  math201: {
    name: "MATH 201 – Linear Algebra",
    children: ["math-notes", "math-hw"],
  },
  "math-notes": {
    name: "Notes",
    children: ["math-n1", "math-n2"],
  },
  "math-n1": { name: "Chapter 1 - Vectors.pdf", rating: 3 },
  "math-n2": { name: "Chapter 2 - Matrices.pdf", rating: 1 },
  "math-hw": {
    name: "Homework",
    children: ["math-hw1"],
  },
  "math-hw1": { name: "Problem Set 1.pdf", rating: 4 },
  phys150: {
    name: "PHYS 150 – Mechanics",
    children: ["phys-slides", "phys-exam"],
  },
  "phys-slides": {
    name: "Slides",
    children: ["phys-s1", "phys-s2"],
  },
  "phys-s1": { name: "Kinematics.pptx", rating: 2 },
  "phys-s2": { name: "Newton's Laws.pptx", rating: 5 },
  "phys-exam": { name: "Midterm Review.pdf", rating: 3 },
};

const indent = 24;

const ExistingFolder = () => {
  const navigate = useNavigate();

  const tree = useTree<Item>({
    initialState: {
      expandedItems: ["cs101", "cs101-lectures", "math201", "math-notes", "phys150", "phys-slides"],
    },
    indent,
    rootItemId: "root",
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => existingItems[itemId],
      getChildren: (itemId) => existingItems[itemId].children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-3">
            <Logo className="w-7 h-7 text-foreground" />
            <span className="text-base font-semibold text-foreground tracking-tight">BridgeAI</span>
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

      {/* Main */}
      <main className="flex-1 container mx-auto px-6 py-10 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-accent/50">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">My Courses</h1>
            <p className="text-sm text-muted-foreground">Browse your existing course materials and ratings</p>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
          <Tree tree={tree} className="w-full py-1">
            {tree.getItems().map((item) => {
              const level = item.getItemMeta().level;
              const isFolder = item.isFolder();
              const isTopLevel = level === 0;

              return (
                <TreeItem
                  key={item.getId()}
                  item={item}
                  className={`
                    group rounded-none border-b border-border/20 last:border-b-0
                    hover:bg-accent/30 transition-colors
                    ${isTopLevel && isFolder ? "bg-accent/10" : ""}
                    ${isFolder ? "py-2" : "py-1.5"}
                  `}
                >
                  <div className="flex items-center justify-between w-full pr-2">
                    <TreeItemLabel item={item} className="flex items-center gap-2.5">
                      {isFolder ? (
                        item.isExpanded() ? (
                          <FolderOpenIcon className={`shrink-0 ${isTopLevel ? "w-[18px] h-[18px] text-foreground/70" : "w-4 h-4 text-muted-foreground/70"}`} />
                        ) : (
                          <FolderIcon className={`shrink-0 ${isTopLevel ? "w-[18px] h-[18px] text-foreground/70" : "w-4 h-4 text-muted-foreground/70"}`} />
                        )
                      ) : (
                        <FileIcon className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className={`
                        ${isTopLevel && isFolder ? "text-sm font-medium text-foreground" : ""}
                        ${!isTopLevel && isFolder ? "text-sm font-medium text-foreground/80" : ""}
                        ${!isFolder ? "text-[13px] text-foreground/70" : ""}
                      `}>
                        {item.getItemName()}
                      </span>
                    </TreeItemLabel>

                    {!isFolder && (
                      <StarRating
                        rating={item.getItemData().rating ?? 0}
                        onChange={() => {}}
                        size={13}
                      />
                    )}
                  </div>
                </TreeItem>
              );
            })}
          </Tree>
        </div>
      </main>
    </div>
  );
};

export default ExistingFolder;
