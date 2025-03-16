import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-black">
            How Much More
          </Link>
        </div>

        <nav className="flex items-center space-x-6">
          <Link
            href="/items"
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            My Goals
          </Link>

          <Link
            href="/item/upload"
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            Add Goal
          </Link>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
