"use client";
import { Whiteboard } from "@/lib/types";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";

const WhiteboardsDisplay = ({ whiteboards }: { whiteboards: Whiteboard[] }) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-4 gap-2">
      {whiteboards.map((w, i) => (
        <Card
          key={w.slug}
          className="relative mx-auto w-full max-w-sm pt-0 rounded hover:cursor-pointer overflow-hidden"
          onClick={() => {
            router.push(`/whiteboard/${w.slug}`);
          }}
        >
          <div className="relative aspect-video w-full">
            <div className="absolute inset-0 z-30 bg-black/35" />
            <Image
              src={
                w.image ||
                "https://swcxwcivbezgmunayqlf.supabase.co/storage/v1/object/public/images/5f8360"
              }
              alt="Event cover"
              className="z-20 object-cover brightness-60 grayscale dark:brightness-40"
              fill
            />
          </div>
          <CardHeader>
            <CardTitle className="relative z-40">{w.name}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default WhiteboardsDisplay;
