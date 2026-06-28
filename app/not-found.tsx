import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-32 text-center">
      <p className="text-6xl font-bold text-primary mb-4">404</p>
      <h1 className="text-2xl font-bold text-foreground mb-3">Page not found</h1>
      <p className="text-muted-foreground mb-8">
        This page doesn't exist — maybe a comparison or product was renamed.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/laptops">Browse laptops</Link>
        </Button>
      </div>
    </div>
  );
}
