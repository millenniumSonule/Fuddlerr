import { createContext } from 'react';
import defaultContent from '../data/content.json';

export type SiteContent = typeof defaultContent;

export const ContentContext = createContext<SiteContent>(defaultContent);
export { defaultContent };
