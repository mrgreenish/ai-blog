import { Star } from "lucide-react";

export function PersonalFavorite() {
  return (
    <span className="personal-favorite not-prose inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase select-none">
      <Star className="h-3.5 w-3.5 fill-current" />
      Personal Favorite
    </span>
  );
}
