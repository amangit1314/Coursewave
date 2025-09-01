interface LearningsLayoutProps {
  children: React.ReactNode;
}

export default function LearningsLayout({ children }: LearningsLayoutProps) {
  return (
    <div className="h-full min-h-screen dark:bg-zinc-900">
      <div className="mx-auto h-full max-w-3xl items-center px-[1.5xl]">
        {children}
      </div>
    </div>
  );
}
