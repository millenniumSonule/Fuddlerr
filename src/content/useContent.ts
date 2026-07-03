import { useContext } from 'react';
import { ContentContext } from './contentContext';

export function useContent() {
  return useContext(ContentContext).content;
}

export function useContentActions() {
  const { reloadContent } = useContext(ContentContext);
  return { reloadContent };
}
