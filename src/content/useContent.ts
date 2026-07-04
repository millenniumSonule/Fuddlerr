import { useContext } from 'react';
import { ContentContext } from './contentContext';

export function useContent() {
  return useContext(ContentContext).content;
}

export function useContentActions() {
  const { reloadContent, patchContent } = useContext(ContentContext);
  return { reloadContent, patchContent };
}
