import { animate } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getSeparatedNumber } from "@/tool-kit/hooks";

interface CounterProps {
  from: number;
  to: number;
}

export const Counter: React.FC<CounterProps> = ({ from, to }) => {
  const nodeRef = useRef<HTMLParagraphElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { threshold: 1 },
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(from, to, {
      duration: 1.5,
      onUpdate(value) {
        node.textContent = getSeparatedNumber(Math.round(value)).toString();
      },
    });

    return () => controls.stop();
  }, [from, to, isInView]);

  return (
    <motion.p
      ref={nodeRef}
      initial={{ opacity: 0, scale: 0.1 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4 }}
    />
  );
};
