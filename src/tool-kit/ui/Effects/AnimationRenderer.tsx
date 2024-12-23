"use client";

import { useAnimations } from "./EffectsContext";
import { FireworkEffect } from "./EffectsUI/Fireworks";

export const AnimationRenderer = () => {
  const { activeAnimation, animationProps } = useAnimations();

  if (!activeAnimation) return null;
  switch (activeAnimation) {
    case "fireworks":
      return <FireworkEffect {...(animationProps.fireworks || {})} />;
    default:
      return null;
  }
};
