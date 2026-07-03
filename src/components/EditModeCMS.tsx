import { FormEvent, useEffect, useState } from 'react';
import { useContent } from '../content/useContent';

const EDITABLE_SELECTOR = '[data-cms-editable="true"]';
const EDITABLE_IMAGE_SELECTOR = 'img[data-cms-image-path]';
const CMS_TEXT_WRAPPER = 'cmsTextWrapper';
const SKIP_TAGS = new Set([
  'AREA',
  'CANVAS',
  'IMG',
  'INPUT',
  'PICTURE',
  'SCRIPT',
  'SELECT',
  'STYLE',
  'SVG',
  'TEXTAREA',
  'VIDEO',
]);

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type ContentPath = Array<string | number>;
type ContentPathIndex = Map<string, ContentPath[]>;
type AuthState = 'checking' | 'authenticated' | 'login';

function normalizeText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function buildContentPathIndex(value: JsonValue, path: ContentPath = [], index: ContentPathIndex = new Map()) {
  if (typeof value === 'string') {
    const normalizedValue = normalizeText(value);

    if (normalizedValue) {
      const paths = index.get(normalizedValue) || [];
      paths.push(path);
      index.set(normalizedValue, paths);
    }

    return index;
  }

  if (Array.isArray(value)) {
    value.forEach((item, indexValue) => {
      buildContentPathIndex(item, [...path, indexValue], index);
    });

    return index;
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => {
      buildContentPathIndex(item, [...path, key], index);
    });
  }

  return index;
}

function hasEditableText(element: Element) {
  if (SKIP_TAGS.has(element.tagName)) return false;
  if (element.closest('.cms-toolbar, .premium-cursor, [aria-hidden="true"]')) return false;
  if ((element as HTMLElement).dataset.cmsEditReady === 'true') return false;

  return Array.from(element.childNodes).some(
    (node) => node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim())
  );
}

function formatPath(path: ContentPath) {
  return path.map(String).join('.');
}

async function saveContentEdit(path: ContentPath, value: string) {
  const response = await fetch('/api/cms/content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path, value }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function saveImageEdit(path: ContentPath, file: File) {
  const response = await fetch('/api/cms/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      path,
      fileName: file.name,
      dataUrl: await readFileAsDataUrl(file),
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return (await response.json()) as { src: string };
}

function applyEditableDataset(element: HTMLElement, path: ContentPath, originalText: string) {
  element.dataset.cmsEditable = 'true';
  element.dataset.cmsPath = JSON.stringify(path);
  element.dataset.cmsOriginal = originalText;
  element.title = `Edit ${formatPath(path)}`;
}

function getExplicitPath(element: HTMLElement) {
  if (!element.dataset.cmsPath) return null;

  try {
    const path = JSON.parse(element.dataset.cmsPath) as ContentPath;
    return Array.isArray(path) ? path : null;
  } catch {
    return null;
  }
}

function markEditableText(pathIndex: ContentPathIndex) {
  const usedPaths = new Map<string, number>();
  const elements = Array.from(document.body.querySelectorAll<HTMLElement>('*'));

  elements.forEach((element) => {
    const explicitPath = getExplicitPath(element);
    if (explicitPath) {
      applyEditableDataset(element, explicitPath, element.innerText);
      return;
    }

    if (!hasEditableText(element)) return;

    element.childNodes.forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) return;

      const normalizedText = normalizeText(node.textContent);
      const matchingPaths = pathIndex.get(normalizedText);

      if (!matchingPaths?.length) return;

      const usedCount = usedPaths.get(normalizedText) || 0;
      const path = matchingPaths[Math.min(usedCount, matchingPaths.length - 1)];
      usedPaths.set(normalizedText, usedCount + 1);

      const wrapper = document.createElement('span');
      wrapper.dataset[CMS_TEXT_WRAPPER] = 'true';
      wrapper.textContent = node.textContent;
      applyEditableDataset(wrapper, path, node.textContent);
      element.replaceChild(wrapper, node);
      element.dataset.cmsEditReady = 'true';
    });
  });
}

export default function EditModeCMS() {
  const contentData = useContent();
  const [activeText, setActiveText] = useState('');
  const [authState, setAuthState] = useState<AuthState>('checking');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('Click any text to edit');
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/cms/session');
        const session = (await response.json()) as {
          authenticated?: boolean;
          configured?: boolean;
        };

        if (!session.configured) {
          setAuthMessage('Set FUDDLERR_CMS_PASSWORD in your terminal before opening /edit.');
          setAuthState('login');
          return;
        }

        setAuthState(session.authenticated ? 'authenticated' : 'login');
      } catch {
        setAuthMessage('CMS auth server is not available.');
        setAuthState('login');
      }
    };

    void checkSession();
  }, []);

  useEffect(() => {
    if (authState !== 'authenticated') return;

    const pathIndex = buildContentPathIndex(contentData as JsonValue);
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml';
    imageInput.hidden = true;
    document.body.appendChild(imageInput);

    document.documentElement.classList.add('cms-edit-mode');
    markEditableText(pathIndex);

    const refreshTimer = window.setTimeout(() => markEditableText(pathIndex), 1200);
    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(() => markEditableText(pathIndex));
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const finishEditing = async (element: HTMLElement) => {
      element.contentEditable = 'false';
      element.classList.remove('cms-editing');

      const pathValue = element.dataset.cmsPath;
      if (!pathValue) return;

      const nextValue = element.innerText.trim();
      if (!nextValue) {
        element.innerText = element.dataset.cmsOriginal || '';
        setActiveText('');
        setStatus('Empty text was not saved');
        return;
      }

      if (element.innerText === element.dataset.cmsOriginal) {
        setActiveText('');
        setStatus('No changes');
        return;
      }

      try {
        setStatus('Saving to content.json');
        await saveContentEdit(JSON.parse(pathValue) as ContentPath, element.innerText);
        element.dataset.cmsOriginal = element.innerText;
        setStatus(`Saved ${formatPath(JSON.parse(pathValue) as ContentPath)}`);
      } catch (error) {
        element.innerText = element.dataset.cmsOriginal || '';
        setStatus(error instanceof Error ? error.message : 'Could not save edit');
      }

      setActiveText('');
    };

    const chooseImage = (image: HTMLImageElement) => {
      const pathValue = image.dataset.cmsImagePath;
      if (!pathValue) return;

      imageInput.onchange = async () => {
        const file = imageInput.files?.[0];
        imageInput.value = '';
        if (!file) return;

        try {
          const path = JSON.parse(pathValue) as ContentPath;
          setStatus(`Uploading ${file.name}`);
          const result = await saveImageEdit(path, file);
          image.src = result.src;
          setStatus(`Saved image ${formatPath(path)}`);
        } catch (error) {
          setStatus(error instanceof Error ? error.message : 'Could not save image');
        }
      };

      imageInput.click();
    };

    const onClick = (event: MouseEvent) => {
      const imageTarget = (event.target as Element | null)?.closest<HTMLImageElement>(EDITABLE_IMAGE_SELECTOR);
      if (imageTarget) {
        event.preventDefault();
        event.stopPropagation();
        chooseImage(imageTarget);
        return;
      }

      const target = (event.target as Element | null)?.closest<HTMLElement>(EDITABLE_SELECTOR);
      if (!target) return;

      event.preventDefault();
      event.stopPropagation();

      document.querySelectorAll<HTMLElement>('.cms-editing').forEach((element) => {
        if (element !== target) {
          void finishEditing(element);
        }
      });

      target.contentEditable = 'plaintext-only';
      target.classList.add('cms-editing');
      target.focus();
      setActiveText(target.innerText);
      setStatus(`Editing ${formatPath(JSON.parse(target.dataset.cmsPath || '[]') as ContentPath)}`);

      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(target);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    };

    const onFocusOut = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches(EDITABLE_SELECTOR)) {
        void finishEditing(target);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.matches(EDITABLE_SELECTOR)) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        target.innerText = target.dataset.cmsOriginal || '';
        void finishEditing(target);
      }

      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        target.blur();
      }
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('focusout', onFocusOut, true);
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      window.clearTimeout(refreshTimer);
      observer.disconnect();
      imageInput.remove();
      document.documentElement.classList.remove('cms-edit-mode');
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('focusout', onFocusOut, true);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [authState, contentData]);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthMessage('Checking password');

    try {
      const response = await fetch('/api/cms/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !result.ok) {
        setAuthMessage(result.message || 'Login failed');
        return;
      }

      setPassword('');
      setAuthMessage('');
      setAuthState('authenticated');
    } catch {
      setAuthMessage('Could not reach CMS auth server');
    }
  };

  const logout = async () => {
    await fetch('/api/cms/logout', { method: 'POST' });
    window.location.reload();
  };

  if (authState !== 'authenticated') {
    return (
      <div className="cms-auth-screen">
        <form className="cms-auth-card" onSubmit={login}>
          <div>
            <strong>CMS Login</strong>
            <span>{authState === 'checking' ? 'Checking session' : 'Enter the edit password'}</span>
          </div>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            disabled={authState === 'checking'}
            autoFocus
          />
          <button type="submit" disabled={authState === 'checking' || !password}>
            Unlock Editor
          </button>
          {authMessage && <p>{authMessage}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="cms-toolbar" role="status" aria-live="polite">
      <div>
        <strong>Edit mode</strong>
        <span>{activeText ? 'Typing changes here' : status}</span>
      </div>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
