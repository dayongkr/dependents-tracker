import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Binoculars } from 'lucide-react';
import Link from 'next/link';

export function GNB() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between gap-2 bg-background p-6">
      <Link href="/" className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary transition-all hover:scale-110 hover:text-foreground">
          <Binoculars className="h-3 w-3 bg-primary text-primary-foreground" />
        </span>
        <h1>Dependents Tracker</h1>
      </Link>
      <Link href="https://github.com/dayongkr/dependents-tracker" target="_blank" title="GitHub Repository">
        <GitHubLogoIcon className="h-6 w-6 text-muted-foreground hover:text-foreground" />
      </Link>
    </nav>
  );
}
