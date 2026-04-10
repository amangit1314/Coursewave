import { cn } from "@/lib/utils/utils";

interface UserAvatarProps {
  name: string | null;
  email?: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function UserAvatar({
  name,
  email,
  imageUrl,
  size = "md",
  className,
}: UserAvatarProps) {
  const initial = (name || email || "?")[0].toUpperCase();

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name || "User"}
        className={cn(
          "rounded-full object-cover ring-2 ring-background",
          sizeMap[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-primary/10 font-medium text-primary ring-2 ring-background",
        sizeMap[size],
        className
      )}
    >
      {initial}
    </div>
  );
}
