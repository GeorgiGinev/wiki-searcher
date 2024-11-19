export function mapWikiLinkToString(link: any): string {
  return (link['*'] as string).replaceAll(' ', '_');
}
