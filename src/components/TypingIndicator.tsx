export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-4 px-4">
      <span className="text-lg mt-1">🔗</span>
      <div className="bg-[#1a1a1a] rounded-[20px] px-4 py-3 flex gap-1">
        <div className="w-2 h-2 bg-[#888888] rounded-full typing-dot"></div>
        <div className="w-2 h-2 bg-[#888888] rounded-full typing-dot"></div>
        <div className="w-2 h-2 bg-[#888888] rounded-full typing-dot"></div>
      </div>
    </div>
  );
}
