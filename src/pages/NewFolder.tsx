import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { Button } from "@/components/ui/button";
import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import { ArrowLeft, FolderOpen, FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import { CursorMark } from "@/components/CursorMark";
import StarRating from "@/components/StarRating";

interface Item {
  name: string;
  children?: string[];
}

const mockItems: Record<string, Item> = {
  root: { name: "Course Materials", children: ["lectures", "assignments", "resources"] },
  lectures: { name: "Lectures", children: ["lecture-1", "lecture-2", "lecture-3"] },
  "lecture-1": { name: "Week 1 - Introduction.pdf" },
  "lecture-2": { name: "Week 2 - Data Structures.pdf" },
  "lecture-3": { name: "Week 3 - Algorithms.pdf" },
  assignments: { name: "Assignments", children: ["hw1", "hw2"] },
  hw1: { name: "Homework 1.docx" },
  hw2: { name: "Homework 2.docx" },
  resources: { name: "Resources", children: ["textbook", "notes", "cheatsheet"] },
  textbook: { name: "Textbook Chapter 1-5.pdf" },
  notes: { name: "Study Notes.md" },
  cheatsheet: { name: "Formula Cheatsheet.pdf" },
};

const indent = 20;

const NewFolder = () => {
  const navigate = useNavigate();
  const [hasSelected, setHasSelected] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const folderInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tree = useTree<Item>({
    initialState: { expandedItems: ["lectures", "assignments", "resources"] },
    indent,
    rootItemId: "root",
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => mockItems[itemId],
      getChildren: (itemId) => mockItems[itemId].children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  });

  const handleSelect = () => setHasSelected(true);
  const handleRatingChange = (id: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [id]: rating }));
  };

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
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-10 max-w-2xl">
        <h1 className="text-xl font-semibold tracking-[-0.03em] text-foreground mb-6">New Folder</h1>

        {!hasSelected ? (
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => { folderInputRef.current?.click(); handleSelect(); }}
              className="glass-card rounded-2xl p-10 flex flex-col items-center gap-4 hover:bg-secondary/60 transition-all group w-64 h-56 justify-center"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                <FolderOpen className="w-7 h-7 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <span className="text-lg font-semibold tracking-[-0.03em] text-foreground">Select Folder</span>
              <span className="text-sm text-muted-foreground font-mono tracking-[-0.01em]">Upload an entire folder</span>
            </button>

            <button
              onClick={() => { fileInputRef.current?.click(); handleSelect(); }}
              className="glass-card rounded-2xl p-10 flex flex-col items-center gap-4 hover:bg-secondary/60 transition-all group w-64 h-56 justify-center"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileIcon className="w-7 h-7 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <span className="text-lg font-semibold tracking-[-0.03em] text-foreground">Select Files</span>
              <span className="text-sm text-muted-foreground font-mono tracking-[-0.01em]">Pick individual files</span>
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden p-4">
            <Tree tree={tree} className="w-full">
              {tree.getItems().map((item) => (
                <TreeItem key={item.getId()} item={item}>
                  <div className="flex items-center justify-between w-full">
                    <TreeItemLabel item={item} className="flex items-center gap-2">
                      {item.isFolder() ? (
                        item.isExpanded() ? (
                          <FolderOpenIcon className="w-4 h-4 text-muted-foreground/70 shrink-0" />
                        ) : (
                          <FolderIcon className="w-4 h-4 text-muted-foreground/70 shrink-0" />
                        )
                      ) : (
                        <FileIcon className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className="tracking-[-0.01em]">{item.getItemName()}</span>
                    </TreeItemLabel>

                    {!item.isFolder() && (
                      <StarRating
                        rating={ratings[item.getId()] ?? 0}
                        onChange={(r) => handleRatingChange(item.getId(), r)}
                        size={14}
                      />
                    )}
                  </div>
                </TreeItem>
              ))}
            </Tree>

            <div className="mt-4 pt-4 border-t border-border/40 flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSelect}>Add Folder</Button>
                <Button variant="outline" size="sm" onClick={handleSelect}>Add Files</Button>
              </div>
              <Button size="sm" onClick={() => navigate("/dashboard")}>Create Course</Button>
            </div>
          </div>
        )}

        <input ref={folderInputRef} type="file" className="hidden" {...({ webkitdirectory: "", directory: "", multiple: true } as any)} onChange={() => {}} />
        <input ref={fileInputRef} type="file" className="hidden" multiple onChange={() => {}} />
      </main>
    </div>
  );
};

export default NewFolder;
