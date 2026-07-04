import { ReactNode, useEffect, useState } from 'react';
import { ContentContext, defaultContent, SiteContent } from './contentContext';

function patchValueAtPath(content: SiteContent, path: Array<string | number>, value: unknown): SiteContent {
  if (!path.length) return content;

  const cloneNode = (node: unknown, pathIndex: number): unknown => {
    const segment = path[pathIndex];

    if (pathIndex === path.length - 1) {
      if (Array.isArray(node)) {
        const next = [...node];
        next[segment as number] = value;
        return next;
      }

      if (node && typeof node === 'object') {
        return { ...(node as Record<string, unknown>), [segment]: value };
      }

      return node;
    }

    if (Array.isArray(node)) {
      const next = [...node];
      next[segment as number] = cloneNode(next[segment as number], pathIndex + 1);
      return next;
    }

    if (node && typeof node === 'object') {
      const next = { ...(node as Record<string, unknown>) };
      next[segment] = cloneNode(next[segment as keyof typeof next], pathIndex + 1);
      return next;
    }

    return node;
  };

  return cloneNode(content, 0) as SiteContent;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  const loadContent = async () => {
    try {
      const response = await fetch('/api/cms/content', { cache: 'no-store' });
      if (!response.ok) return;

      const data = (await response.json()) as SiteContent;
      setContent(data);
    } catch {
      // Static preview/build fallback uses bundled JSON.
    }
  };

  const patchContent = (path: Array<string | number>, value: unknown) => {
    setContent((currentContent) => patchValueAtPath(currentContent, path, value));
  };

  useEffect(() => {
    void loadContent();
  }, []);

  return <ContentContext.Provider value={{ content, reloadContent: loadContent, patchContent }}>{children}</ContentContext.Provider>;
}
