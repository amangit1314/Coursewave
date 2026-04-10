import type { Variants, Transition } from "framer-motion";

// -------------------------------------------------------------------------
// Shared timing curves
// -------------------------------------------------------------------------

export const ease = {
  default: [0.25, 0.1, 0.25, 1] as const,
  out: [0, 0, 0.2, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  spring: { type: "spring", stiffness: 350, damping: 30 } as const,
  springGentle: { type: "spring", stiffness: 200, damping: 24 } as const,
};

// -------------------------------------------------------------------------
// Page-level transitions
// -------------------------------------------------------------------------

export const pageTransition: Transition = {
  duration: 0.4,
  ease: ease.out,
};

export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: pageTransition,
  },
};

// -------------------------------------------------------------------------
// Container with staggered children
// -------------------------------------------------------------------------

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: ease.out },
  },
};

// -------------------------------------------------------------------------
// Fade variants
// -------------------------------------------------------------------------

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: ease.out } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: ease.out },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: ease.out },
  },
};

// -------------------------------------------------------------------------
// Scale variants (for cards, modals)
// -------------------------------------------------------------------------

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: ease.out },
  },
};

// -------------------------------------------------------------------------
// Micro-interaction props (apply directly to motion elements)
// -------------------------------------------------------------------------

export const hoverLift = {
  whileHover: { y: -2, transition: { duration: 0.2 } },
} as const;

export const hoverScale = {
  whileHover: { scale: 1.02, transition: { duration: 0.2 } },
} as const;

export const tapScale = {
  whileTap: { scale: 0.97 },
} as const;

export const hoverLiftTap = {
  ...hoverLift,
  ...tapScale,
} as const;

// -------------------------------------------------------------------------
// List / table row animations
// -------------------------------------------------------------------------

export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: ease.out },
  },
};

// -------------------------------------------------------------------------
// Number counter (for stat cards)
// -------------------------------------------------------------------------

export const counterTransition: Transition = {
  duration: 0.8,
  ease: ease.out,
};
