import { useContext } from 'react';
import { ContentContext } from './contentContext';

export function useContent() {
  return useContext(ContentContext);
}
