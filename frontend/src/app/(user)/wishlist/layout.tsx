interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function WishlistLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="h-full min-h-screen dark:bg-zinc-900">
      <div className="mx-auto h-full max-w-7xl items-center px-[1.5xl]">
        {children}
      </div>
    </div>
  );
}
