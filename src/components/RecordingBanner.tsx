import AudioWaveform from './AudioWaveform';

interface RecordingBannerProps {
  duration: number;
}

export default function RecordingBanner({ duration }: RecordingBannerProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute bottom-full left-0 right-0 bg-[rgba(239,68,68,0.1)] border-t border-[#ef4444] py-3 px-4">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-[#ef4444] pulse"></div>
        <span className="text-sm text-[#ef4444] font-medium">Aufnahme...</span>
        <AudioWaveform barCount={7} className="flex-1" />
        <span className="text-sm text-[#ef4444] font-mono">{formatDuration(duration)}</span>
      </div>
    </div>
  );
}
