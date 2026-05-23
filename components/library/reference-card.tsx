"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STYLE_CATEGORIES } from "@/types/library";
import type { ReferenceImage } from "@/types/library";
import { Trash2, GripVertical } from "lucide-react";

interface Props {
  image: ReferenceImage;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

export function ReferenceCard({ image, onDelete, isDragging }: Props) {
  const category = STYLE_CATEGORIES[image.category];

  return (
    <div
      className={cn(
        "group relative rounded-xl overflow-hidden border border-border bg-card transition-all",
        isDragging && "shadow-2xl scale-105 rotate-1"
      )}
    >
      {/* Drag handle */}
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-6 h-6 rounded-md bg-background/80 backdrop-blur flex items-center justify-center cursor-grab">
          <GripVertical className="w-3 h-3 text-muted-foreground" />
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(image.id)}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-md bg-background/80 backdrop-blur flex items-center justify-center hover:bg-destructive hover:text-white"
      >
        <Trash2 className="w-3 h-3" />
      </button>

      {/* Image */}
      <div className="aspect-[4/5] relative bg-muted">
        <Image
          src={image.url}
          alt={image.title}
          fill
          className="object-cover"
          sizes="200px"
        />
      </div>

      {/* Info */}
      <div className="p-2.5 space-y-1.5">
        <p className="text-xs font-semibold leading-tight line-clamp-1">{image.title}</p>
        <div className="flex flex-wrap gap-1">
          <Badge
            className="text-[10px] py-0 px-1.5 h-4"
            style={{ background: `${category?.color}20`, color: category?.color, border: `1px solid ${category?.color}40` }}
          >
            {category?.label || image.category}
          </Badge>
          {image.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] py-0 px-1.5 h-4">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
