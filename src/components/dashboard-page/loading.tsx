import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const Loading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="relative mx-auto w-full max-w-sm pt-0 rounded">
          <div className="relative aspect-video w-full overflow-hidden rounded-t">
            <Skeleton className="absolute inset-0" />
          </div>

          <CardHeader>
            <Skeleton className="h-5 w-3/4" />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default Loading;
