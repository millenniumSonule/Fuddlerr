import { createContext } from 'react';
import defaultContent from '../data/content.json';

export type SiteContent = typeof defaultContent;

export type ContentContextValue = {
  content: SiteContent;
  reloadContent: () => Promise<void>;
};

export const ContentContext = createContext<ContentContextValue>({
  content: defaultContent,
  reloadContent: async () => {},
});
export { defaultContent };
