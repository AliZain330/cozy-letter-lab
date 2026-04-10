import { useNavigate } from "react-router-dom";
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { Button } from "@/components/ui/button";
import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import { ArrowLeft, FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
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

const indent = 20;

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
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Existing Folders</h1>

        <div className="glass-card rounded-2xl p-4">
          <Tree tree={tree} className="w-full">
            {tree.getItems().map((item) => (
              <TreeItem key={item.getId()} item={item}>
                <div className="flex items-center justify-between w-full">
                  <TreeItemLabel item={item} className="flex items-center gap-2">
                    {item.isFolder() ? (
                      item.isExpanded() ? (
                        <FolderOpenIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                      ) : (
                        <FolderIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                      )
                    ) : (
                      <FileIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    {item.getItemName()}
                  </TreeItemLabel>

                  {!item.isFolder() && (
                    <StarRating
                      rating={item.getItemData().rating ?? 0}
                      onChange={() => {}}
                      size={14}
                    />
                  )}
                </div>
              </TreeItem>
            ))}
          </Tree>
        </div>
      </main>
    </div>
  );
};

export default ExistingFolder;
