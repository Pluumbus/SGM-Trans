"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type AnimationType = "fireworks";

export type FireworkEffectType = {
  prize?: {
    amount?: number;
    text?: ReactNode;
  };
  coinProps?: {
    quantity?: 1 | 2 | 3;
  };
};

type AnimationPropsMap = {
  fireworks?: FireworkEffectType;
};

interface AnimationsContextType {
  activeAnimation: AnimationType | null;
  animationProps: AnimationPropsMap;
  triggerAnimation: (
    animation?: AnimationType,
    props?: FireworkEffectType
  ) => void;
}

const AnimationsContext = createContext<AnimationsContextType | undefined>(
  undefined
);

export const AnimationsProvider = ({ children }: { children: ReactNode }) => {
  const [activeAnimation, setActiveAnimation] = useState<AnimationType | null>(
    null
  );
  const [animationProps, setAnimationProps] = useState<AnimationPropsMap>({});

  const triggerAnimation = (
    animation?: AnimationType,
    props?: FireworkEffectType
  ) => {
    const anim = animation || "fireworks";
    setActiveAnimation(anim);
    if (anim === "fireworks") {
      setAnimationProps({ fireworks: props });
    }

    setTimeout(() => {
      setActiveAnimation(null);
      setAnimationProps({});
    }, 5000);
  };

  return (
    <AnimationsContext.Provider
      value={{ activeAnimation, animationProps, triggerAnimation }}
    >
      {children}
    </AnimationsContext.Provider>
  );
};

export const useAnimations = () => {
  const context = useContext(AnimationsContext);
  if (!context) {
    throw new Error("useAnimations must be used within an AnimationsProvider");
  }
  return context;
};
