import LogosTypescriptIcon from '~icons/logos/typescript-icon';
import LogosJavascript from '~icons/logos/javascript';
import LogosVue from '~icons/logos/vue';
import LogosSvelteIcon from '~icons/logos/svelte-icon';
import LogosMarkdown from '~icons/logos/markdown';
import { FileQuestion } from 'lucide-react';

const IconMap = new Map<string, (props: React.SVGProps<SVGSVGElement>) => React.ReactElement>();

['ts', 'tsx', 'mts', 'cts'].forEach((ext) => IconMap.set(ext, LogosTypescriptIcon));
['js', 'jsx', 'mjs', 'cjs'].forEach((ext) => IconMap.set(ext, LogosJavascript));
['vue'].forEach((ext) => IconMap.set(ext, LogosVue));
['svelte'].forEach((ext) => IconMap.set(ext, LogosSvelteIcon));
['md', 'markdown', 'mdx'].forEach((ext) => IconMap.set(ext, LogosMarkdown));

export function FileIcon({ filename }: { filename: string }) {
  const ext = filename.toLowerCase().split('.').pop() ?? '';
  const Icon = IconMap.get(ext) ?? FileQuestion;

  return <Icon width={20} height={20} />;
}
