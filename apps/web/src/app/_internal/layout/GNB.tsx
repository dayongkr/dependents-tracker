import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Binoculars } from 'lucide-react';
import Link from 'next/link';

export function GNB() {
  return (
    <nav className="bg-background sticky top-0 z-50 flex items-center justify-between gap-2 p-6">
      <Link href="/" className="flex items-center gap-2">
        <span className="bg-primary hover:text-foreground inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all hover:scale-110">
          <Binoculars className="bg-primary text-primary-foreground h-3 w-3" />
        </span>
        <h1>Dependents Tracker</h1>
      </Link>
      <Link href="https://github.com/dayongkr/dependents-tracker" target="_blank" title="GitHub Repository">
        <GitHubLogoIcon className="text-muted-foreground hover:text-foreground h-6 w-6" />
      </Link>
    </nav>
  );
}
