import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FolderOpen, FileIcon, FolderIcon, ChevronDown, ChevronRight } from "lucide-react";
import Logo from "@/components/Logo";
import StarRating from "@/components/StarRating";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  rating: number;
}

function buildTreeFromFiles(fileList: FileList): FileNode[] {
  const root: Record<string, any> = {};

  Array.from(fileList).forEach((file) => {
    const parts = (file.webkitRelativePath || file.name).split("/");
    let current = root;
    parts.forEach((part, i) => {
      if (!current[part]) {
        current[part] = i === parts.length - 1 ? { __file: true } : {};
      }
      current = current[part];
    });
  });

  let idCounter = 0;
  const convert = (obj: Record<string, any>): FileNode[] => {
    return Object.entries(obj).map(([name, value]) => {
      const id = `node-${idCounter++}`;
      if (value.__file) {
        return { id, name, type: "file" as const, rating: 0 };
      }
      const { __file, ...rest } = value;
      return {
        id,
        name,
        type: "folder" as const,
        children: convert(rest),
        rating: 0,
      };
    });
  };

  return convert(root);
}

function TreeNode({
  node,
  onRatingChange,
  depth = 0,
}: {
  node: FileNode;
  onRatingChange: (id: string, rating: number) => void;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const isFolder = node.type === "folder";

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-secondary/50 transition-colors group"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {isFolder ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-0 bg-transparent border-none cursor-pointer flex items-center"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        {isFolder ? (
          <FolderIcon className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <FileIcon className="w-4 h-4 text-muted-foreground shrink-0" />
        )}

        <span className="text-sm text-foreground flex-1 truncate">{node.name}</span>

        {!isFolder && (
          <StarRating
            rating={node.rating}
            onChange={(r) => onRatingChange(node.id, r)}
            size={14}
          />
        )}
      </div>

      {isFolder && expanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onRatingChange={onRatingChange}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function updateRating(nodes: FileNode[], id: string, rating: number): FileNode[] {
  return nodes.map((node) => {
    if (node.id === id) return { ...node, rating };
    if (node.children) return { ...node, children: updateRating(node.children, id, rating) };
    return node;
  });
}

const NewFolder = () => {
  const navigate = useNavigate();
  const [tree, setTree] = useState<FileNode[]>([]);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newNodes = buildTreeFromFiles(e.target.files);
      setTree((prev) => [...prev, ...newNodes]);
    }
  };

  const handleRatingChange = (id: string, rating: number) => {
    setTree((prev) => updateRating(prev, id, rating));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-foreground">New Folder</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => folderInputRef.current?.click()}
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Select Folder
          </Button>
          <input
            ref={folderInputRef}
            type="file"
            className="hidden"
            {...({ webkitdirectory: "", directory: "", multiple: true } as any)}
            onChange={handleFolderSelect}
          />
        </div>

        {tree.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 flex flex-col items-center gap-4 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              Select one or more folders to get started
            </p>
            <Button
              variant="secondary"
              onClick={() => folderInputRef.current?.click()}
            >
              Browse Folders
            </Button>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-4">
            {tree.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                onRatingChange={handleRatingChange}
              />
            ))}

            <div className="mt-4 pt-4 border-t border-border flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => folderInputRef.current?.click()}
              >
                Add More Folders
              </Button>
              <Button size="sm" onClick={() => navigate("/dashboard")}>
                Create Course
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NewFolder;
