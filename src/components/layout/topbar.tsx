import { ChevronDown, Sparkles, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="flex items-center gap-3 px-4 md:px-6 h-14">
      <div className="md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="bg-black border-white/10 hover:bg-zinc-900"
        >
          <img src="/open-ai-logo.png" alt="OpenAI" className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold">ChatGPT</span>
        <ChevronDown className="h-4 w-4 text-zinc-400" />
      </div>

      <div className="flex-1 flex justify-center">
        <Button
          size="sm"
          className="rounded-full border-0 shadow-sm text-white"
          style={{ backgroundColor: "rgb(55,54,105)" }}
        >
          <Sparkles className="h-4 w-4 mr-1.5" />
          <span className="text-white">Try Plus</span>
        </Button>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-300 hover:text-white"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-300 hover:text-white"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
