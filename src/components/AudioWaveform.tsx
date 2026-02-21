interface AudioWaveformProps {
  barCount?: number;
  className?: string;
}

export default function AudioWaveform({ barCount = 7, className = '' }: AudioWaveformProps) {
  return (
    <div className={`flex items-center gap-1 h-6 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className="w-1 bg-white rounded-full wave-bar"
          style={{ minHeight: '8px' }}
        />
      ))}
    </div>
  );
}
