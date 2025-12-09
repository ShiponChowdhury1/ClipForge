import VideoCard from "@/components/video/video-card";
import { Video } from "@/types";

interface VideoGridProps {
  videos: Video[];
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}

export function VideoGrid({ videos, onDelete, onDownload }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="py-8 sm:py-10 md:py-12 text-center">
        <p className="text-sm sm:text-base md:text-lg text-zinc-400">No videos found matching your criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 md:gap-4 lg:grid-cols-3 lg:gap-4 xl:grid-cols-3 xl:gap-4 2xl:grid-cols-3 2xl:gap-5 ">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onDelete={onDelete}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}
