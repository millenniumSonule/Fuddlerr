import { ReactNode, useEffect, useState } from 'react';
import { ContentContext, defaultContent, SiteContent } from './contentContext';

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        const response = await fetch('/api/cms/content');
        if (!response.ok) return;

        const data = (await response.json()) as SiteContent;
        if (isMounted) setContent(data);
      } catch {
        // Static preview/build fallback uses bundled JSON.
      }
    };

    void loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
