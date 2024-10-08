import { OutBoundLink } from '@/components/OutBoundLink';

export default function Footer() {
  return (
    <footer className="p-6 text-center text-sm text-gray-500">
      If you have any questions or suggestions, please contact me at{' '}
      <OutBoundLink className="underline" href="mailto:dayongkr@gmail.com">
        dayongkr@gmail.com
      </OutBoundLink>
      .
    </footer>
  );
}
