import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

type ProgressSegment = {
  value: number;
  color?: string;
};

type Props = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  segments: ProgressSegment[];
};

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  Props
>(({ className, segments, ...props }, ref) => {
  // const sortedSegments = segments.sort((a, b) => a.value - b.value);
  const sortedSegments = segments;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-gray-400/20",
        className
      )}
      {...props}
    >
      {sortedSegments.map((segment, index) => (
        <ProgressPrimitive.Indicator
          key={index}
          className={cn(
            "h-full transition-all absolute",
            segment.color ? segment.color : "bg-primary"
          )}
          style={{
            width: `${segment.value}%`,
            left: `${sortedSegments
              .slice(0, index)
              .reduce((acc, segment) => acc + segment.value, 0)}%`,
            zIndex: sortedSegments.length - index,
          }}
        />
      ))}
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = "Progress";

export { Progress };
