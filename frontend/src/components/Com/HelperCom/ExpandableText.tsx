import { cn } from "@/utils/cn";
import React, { useState } from "react";

const ExpandableText = ({
  text = "",
  maxChars = 150,
  expandLabel = "Read more",
  collapseLabel = "Show less",
  className = "",
}) => {
  const [expanded, setExpanded] = useState(false);

  // If text shorter than maxChars, just render as-is
  if (!text || text.length <= maxChars) {
    return <p className={className}>{text}</p>;
  }

  const displayText = expanded ? text : text.slice(0, maxChars) + "...";

  return (
    <p className={cn(className)}>
      {displayText}{" "}
      <span
        onClick={() => setExpanded(!expanded)}
        className="text-blue-500 cursor-pointer font-medium hover:underline break-words"
      >
        {expanded ? collapseLabel : expandLabel}
      </span>
    </p>
  );
};

export default ExpandableText;
