import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useMotionTemplate } from "framer-motion";
import { cn } from "@/utils/cn";
 // Assuming cn is a utility for conditionally joining class names

export const InteractiveCard = ({
  children,
  className,
  InteractiveColor = "#07eae6ff",
  borderRadius,
  transitionDuration = 0.3,
  transitionEasing = "easeInOut",
  width,  
  height,
  lightSize,
  tailwindBgClass = "bg-transparent backdrop-blur-md",
}: {
  children: React.ReactNode;
  className?: string;
  InteractiveColor?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  rotationFactor?: number;
  transitionDuration?: number;
  transitionEasing?: string;
  tailwindBgClass?: string; 
  lightSize:number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);



  const handlePointerMove = (e: React.PointerEvent) => {
    const bounds = cardRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const px = (e.clientX - bounds.left) / bounds.width;
    const py = (e.clientY - bounds.top) / bounds.height;

    x.set(px);
    y.set(py);
  };

  const xPercentage = useTransform(x, (val) => `${val * 100}%`);
  const yPercentage = useTransform(y, (val) => `${val * 100}%`);

  const interactiveBackground = useMotionTemplate`radial-gradient(circle at ${xPercentage} ${yPercentage}, ${InteractiveColor} 0%, transparent ${lightSize}% )`;

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      style={{
        perspective: 1000,
        borderRadius,
        width,   
        height, 
      }}
      className={cn("relative isolate", className)}
    >
     <motion.div
        style={{
          transformStyle: "preserve-3d",
          transition: `transform ${transitionDuration}s ${transitionEasing}`,
          width: "100%",
          height: "100%",
        }}
        className="rounded-xl overflow-hidden border shadow-lg"
      >
        {/* Background Interactive Layer */}
        <motion.div
          className="absolute inset-0 rounded-xl z-0"
          style={{
            background: interactiveBackground,
            transition: `opacity ${transitionDuration}s ${transitionEasing}`,
            opacity: isHovered ? 0.6 : 0,
            pointerEvents: "none",
          }}
        />
        {/* Content */}
        <div
          className={cn(
            "relative z-10 w-full h-full",
            tailwindBgClass,
            className,
            "text-foreground"
          )}
          style={{ borderRadius }}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};