"use client";

import { HTMLMotionProps, Variants, motion } from "framer-motion";

export const smoothEase = [0.4, 0, 0.2, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: smoothEase }
  }
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.22, ease: smoothEase }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: smoothEase }
  }
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.025
    }
  }
};

export const drawerOverlay: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, ease: smoothEase } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: smoothEase } }
};

export const drawerPanel: Variants = {
  hidden: { x: "100%" },
  show: { x: 0, transition: { duration: 0.28, ease: smoothEase } },
  exit: { x: "100%", transition: { duration: 0.22, ease: smoothEase } }
};

export function MotionSection(props: HTMLMotionProps<"section">) {
  return <motion.section variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} {...props} />;
}

export function MotionDiv(props: HTMLMotionProps<"div">) {
  return <motion.div variants={fade} initial="hidden" animate="show" {...props} />;
}

export function MotionStaggerDiv(props: HTMLMotionProps<"div">) {
  return <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} {...props} />;
}

export function MotionArticle(props: HTMLMotionProps<"article">) {
  return <motion.article variants={fadeUp} {...props} />;
}
