/** Deterministic per-category accent shared by the filter pills and community cards */
const CATEGORY_PALETTE = [
  { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", ring: "bg-blue-500" },
  { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", ring: "bg-emerald-500" },
  { text: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-500/10", ring: "bg-violet-500" },
  { text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", ring: "bg-amber-500" },
  { text: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-500/10", ring: "bg-pink-500" },
  { text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10", ring: "bg-red-500" },
];

const ALL_STYLE = {
  text: "text-indigo-600 dark:text-indigo-400",
  bg: "bg-indigo-50 dark:bg-indigo-500/10",
  ring: "bg-indigo-500",
};

export const getCategoryColor = (name: string) => {
  if (name.toLowerCase() === "all") return ALL_STYLE;
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return CATEGORY_PALETTE[Math.abs(hash) % CATEGORY_PALETTE.length];
};
