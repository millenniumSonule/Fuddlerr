import { createContext } from 'react';
import defaultContent from '../data/content.json';

export type SiteContent = typeof defaultContent;

export type ContentContextValue = {
  content: SiteContent;
  reloadContent: () => Promise<void>;
  patchContent: (path: Array<string | number>, value: unknown) => void;
};

export const ContentContext = createContext<ContentContextValue>({
  content: defaultContent,
  reloadContent: async () => {},
  patchContent: () => {},
});
export { defaultContent };
