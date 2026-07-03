import { ReactNode, useEffect, useState } from 'react';
import { ContentContext, defaultContent, SiteContent } from './contentContext';

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  const loadContent = async () => {
    try {
      const response = await fetch('/api/cms/content');
      if (!response.ok) return;

      const data = (await response.json()) as SiteContent;
      setContent(data);
    } catch {
      // Static preview/build fallback uses bundled JSON.
    }
  };

  useEffect(() => {
    void loadContent();
  }, []);

  return <ContentContext.Provider value={{ content, reloadContent: loadContent }}>{children}</ContentContext.Provider>;
}
