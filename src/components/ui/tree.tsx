"use client"

import * as React from "react"
import { ItemInstance } from "@headless-tree/core"
import { ChevronDownIcon } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

interface TreeContextValue {
  indent: number
  currentItem?: ItemInstance<any>
  tree?: any
}

const TreeContext = React.createContext<TreeContextValue>({
  indent: 20,
  currentItem: undefined,
  tree: undefined,
})

function useTreeContext() {
  return React.useContext(TreeContext) as TreeContextValue
}

interface TreeProps extends React.HTMLAttributes<HTMLDivElement> {
  indent?: number
  tree?: any
}

function Tree({ indent = 20, tree, className, ...props }: TreeProps) {
  const containerProps =
    tree && typeof tree.getContainerProps === "function"
      ? tree.getContainerProps()
      : {}
  const mergedProps = { ...props, ...containerProps }

  const { style: propStyle, ...otherProps } = mergedProps

  const mergedStyle = {
    ...propStyle,
    "--tree-indent": `${indent}px`,
  } as React.CSSProperties

  return (
    <TreeContext.Provider value={{ indent, tree }}>
      <div
        role="tree"
        className={cn("flex flex-col", className)}
        style={mergedStyle}
        {...otherProps}
      />
    </TreeContext.Provider>
  )
}

interface TreeItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  item: ItemInstance<any>
  indent?: number
  asChild?: boolean
}

function TreeItem({
  item,
  className,
  asChild,
  children,
  ...props
}: Omit<TreeItemProps, "indent">) {
  const { indent } = useTreeContext()

  const itemProps = typeof item.getProps === "function" ? item.getProps() : {}
  const mergedProps = { ...props, ...itemProps }

  const { style: propStyle, ...otherProps } = mergedProps

  const mergedStyle = {
    ...propStyle,
    "--tree-padding": `${item.getItemMeta().level * indent}px`,
  } as React.CSSProperties

  const Comp = asChild ? Slot.Root : "button"

  return (
    <TreeContext.Provider value={{ indent, currentItem: item }}>
      <Comp
        className={cn(
          "flex items-center w-full text-left py-1 px-2 rounded-md hover:bg-accent/50 transition-colors",
          "focus:outline-none focus:ring-1 focus:ring-ring",
          className
        )}
        style={mergedStyle}
        role="treeitem"
        aria-expanded={item.isFolder() ? item.isExpanded() : undefined}
        {...(otherProps as any)}
      >
        <span style={{ paddingLeft: `var(--tree-padding)` }}>{children}</span>
      </Comp>
    </TreeContext.Provider>
  )
}

interface TreeItemLabelProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  item?: ItemInstance<any>
}

function TreeItemLabel({
  item: propItem,
  children,
  className,
  ...props
}: TreeItemLabelProps) {
  const { currentItem } = useTreeContext()
  const item = propItem || currentItem

  if (!item) {
    console.warn("TreeItemLabel: No item provided via props or context")
    return null
  }

  return (
    <span className={cn("flex items-center gap-2 text-sm", className)} {...props}>
      {item.isFolder() && (
        <ChevronDownIcon
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            !item.isExpanded() && "-rotate-90"
          )}
        />
      )}
      {children ||
        (typeof item.getItemName === "function" ? item.getItemName() : null)}
    </span>
  )
}

export { Tree, TreeItem, TreeItemLabel }
