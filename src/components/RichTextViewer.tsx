import { cn } from "@/common/utils"

import React from "react"

export const RichTextViewer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
RichTextViewer.displayName = "RichTextViewer"

