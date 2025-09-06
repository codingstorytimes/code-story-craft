import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { History, RotateCcw, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface Version {
  id: string;
  content: string;
  timestamp: Date;
  description: string;
}

interface EditorVersionControlProps {
  versions: Version[];
  currentVersion: string;
  onRestore: (version: Version) => void;
  onSaveVersion: (description: string) => void;
}

export function EditorVersionControl({
  versions,
  currentVersion,
  onRestore,
  onSaveVersion,
}: EditorVersionControlProps) {
  const [open, setOpen] = useState(false);

  const handleSaveVersion = () => {
    const description = `Auto-save ${formatDistanceToNow(new Date(), {
      addSuffix: true,
    })}`;
    onSaveVersion(description);
  };

  const handleRestore = (version: Version) => {
    onRestore(version);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleSaveVersion}
        className="text-xs"
      >
        <History className="w-3 h-3 mr-1" />
        Save Version
      </Button>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            History ({versions.length})
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Version History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-64 overflow-y-auto">
              {versions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No saved versions
                </p>
              ) : (
                versions.map((version, index) => (
                  <div
                    key={version.id}
                    className="flex items-center justify-between p-2 rounded-md border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {version.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(version.timestamp, {
                          addSuffix: true,
                        })}
                      </div>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Latest
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRestore(version)}
                      className="ml-2 h-8 px-2"
                      disabled={version.content === currentVersion}
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}
