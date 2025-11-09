import { ReactNode } from "react";

// Reusable Badge component:
export default function Badge({
  color = "blue",
  children,
}: {
  color: "green" | "yellow" | "blue" | "gray";
  children: ReactNode;
}) {
  const colors = {
    green: "bg-green-100 text-green-700 border-green-400",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-400",
    blue: "bg-blue-100 text-blue-700 border-blue-400",
    gray: "bg-gray-100 text-gray-600 border-gray-300",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full border shadow-sm text-xs font-semibold ${colors[color]}`}
    >
      {children}
    </span>
  );
}
