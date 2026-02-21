export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] bg-[#1a1a1a] border-b border-[#333333] flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🔗</span>
        <span className="text-[20px] font-bold">Makima</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#4ade80]"></div>
        <span className="text-sm text-[#888888]">Online</span>
      </div>
    </header>
  );
}
