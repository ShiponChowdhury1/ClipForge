import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateActionButtons() {
  const router = useRouter();

  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        className="flex-1 border-zinc-700 py-6 text-zinc-300 hover:bg-zinc-800"
        onClick={() => router.back()}
      >
        Cancel
      </Button>
      <Button 
        className="flex-1 bg-[#3B82F6] text-white! py-6 hover:bg-[#3B82F6]/90"
        onClick={() => router.push("/generate")}
      >
        <Download className="mr-2 h-4 w-4" />
        Create Video
      </Button>
    </div>
  );
}
