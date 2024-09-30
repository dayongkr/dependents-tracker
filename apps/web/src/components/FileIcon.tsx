import VscodeIconsDefaultFile from '~icons/vscode-icons/default-file';
import VscodeIconsFileTypeJsOfficial from '~icons/vscode-icons/file-type-js-official';
import VscodeIconsFileTypeMarkdown from '~icons/vscode-icons/file-type-markdown';
import VscodeIconsFileTypeReactjs from '~icons/vscode-icons/file-type-reactjs';
import VscodeIconsFileTypeReactts from '~icons/vscode-icons/file-type-reactts';
import VscodeIconsFileTypeSvelte from '~icons/vscode-icons/file-type-svelte';
import VscodeIconsFileTypeTypescriptOfficial from '~icons/vscode-icons/file-type-typescript-official';
import VscodeIconsFileTypeVue from '~icons/vscode-icons/file-type-vue';

const IconMap = new Map<string, (props: React.SVGProps<SVGSVGElement>) => React.ReactElement>([
  ['ts', VscodeIconsFileTypeTypescriptOfficial],
  ['mts', VscodeIconsFileTypeTypescriptOfficial],
  ['cts', VscodeIconsFileTypeTypescriptOfficial],
  ['js', VscodeIconsFileTypeJsOfficial],
  ['mjs', VscodeIconsFileTypeJsOfficial],
  ['cjs', VscodeIconsFileTypeJsOfficial],
  ['vue', VscodeIconsFileTypeVue],
  ['jsx', VscodeIconsFileTypeReactjs],
  ['tsx', VscodeIconsFileTypeReactts],
  ['svelte', VscodeIconsFileTypeSvelte],
  ['md', VscodeIconsFileTypeMarkdown],
  ['markdown', VscodeIconsFileTypeMarkdown],
  ['mdx', VscodeIconsFileTypeMarkdown],
]);

export function FileIcon({ filename }: { filename: string }) {
  const ext = filename.toLowerCase().split('.').pop() ?? '';
  const Icon = IconMap.get(ext) ?? VscodeIconsDefaultFile;

  return <Icon width={20} height={20} />;
}
