const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <div className="relative z-10 p-6">{children}</div>
    </main>
  );
};

export default Layout;
