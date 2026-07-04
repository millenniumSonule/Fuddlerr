import { FormEvent, useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Loader2, Palette, Settings2 } from 'lucide-react';
import { useContent, useContentActions } from '../content/useContent';
import { cmsSections, type CmsSectionKey } from '../content/cmsSections';

const EDITABLE_SELECTOR = '[data-cms-editable="true"]';
const EDITABLE_IMAGE_SELECTOR = '[data-cms-image-path]';
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
type CmsImage = { name: string; path: string; url: string };
type AuthState = 'checking' | 'authenticated' | 'login';
type CmsThemeKey = 'text' | 'muted' | 'accent';

const defaultCmsTheme: Record<CmsThemeKey, string> = {
  text: '#2A2420',
  muted: '#6D5B50',
  accent: '#C6972F',
};

const themeSwatches: Record<CmsThemeKey, string[]> = {
  text: ['#2A2420', '#3A2F2A', '#4D3F35', '#1C1714'],
  muted: ['#6D5B50', '#8A776A', '#4F4138', '#A08C7C'],
  accent: ['#C6972F', '#B56A4A', '#567A63', '#B89A45'],
};

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

function getValueAtPath(value: JsonValue, path: ContentPath): JsonValue | undefined {
  return path.reduce<JsonValue | undefined>((current, segment) => {
    if (current === undefined || current === null || typeof current !== 'object') return undefined;
    return (current as JsonValue[] | { [key: string]: JsonValue })[segment as never];
  }, value);
}

function getEditableOriginal(content: JsonValue, path: ContentPath, fallback: string) {
  const value = getValueAtPath(content, path);
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return fallback;
}

async function saveContentEdit(path: ContentPath, value: unknown) {
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

function applyImageSource(target: HTMLElement, src: string) {
  if (target instanceof HTMLImageElement) {
    target.src = src;
    return;
  }

  target.style.backgroundImage = `url("${src}")`;
}

function clearImageSource(target: HTMLElement) {
  if (target instanceof HTMLImageElement) {
    target.src = '';
    return;
  }

  target.style.backgroundImage = 'none';
}

function resolveImageTarget(element: HTMLElement) {
  if (element instanceof HTMLImageElement) return element;

  const imageTarget = element.closest<HTMLElement>('.cms-image-target');
  if (imageTarget) {
    const cardImage = imageTarget.querySelector<HTMLImageElement>('img[data-cms-image-path]');
    if (cardImage) return cardImage;
    return imageTarget;
  }

  const galleryCard = element.closest<HTMLElement>('.gallery-card');
  if (galleryCard) {
    const cardImage = galleryCard.querySelector<HTMLImageElement>('img[data-cms-image-path]');
    if (cardImage) return cardImage;
  }

  const nestedImage = element.querySelector<HTMLImageElement>('img[data-cms-image-path]');
  if (nestedImage) return nestedImage;

  const firstImage = element.querySelector<HTMLImageElement>('img');
  if (firstImage) return firstImage;

  return element;
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

function markEditableText(pathIndex: ContentPathIndex, contentData: JsonValue) {
  const usedPaths = new Map<string, number>();
  const elements = Array.from(document.body.querySelectorAll<HTMLElement>('*'));

  elements.forEach((element) => {
    const explicitPath = getExplicitPath(element);
    if (explicitPath) {
      applyEditableDataset(
        element,
        explicitPath,
        element.dataset.cmsOriginalValue || getEditableOriginal(contentData, explicitPath, element.innerText)
      );
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
      applyEditableDataset(wrapper, path, getEditableOriginal(contentData, path, node.textContent));
      element.replaceChild(wrapper, node);
      element.dataset.cmsEditReady = 'true';
    });
  });
}

export default function EditModeCMS() {
  const contentData = useContent();
  const { reloadContent } = useContentActions();
  const [activeText, setActiveText] = useState('');
  const [authState, setAuthState] = useState<AuthState>('checking');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('Click any text to edit');
  const [authMessage, setAuthMessage] = useState('');
  const [imageLibrary, setImageLibrary] = useState<CmsImage[]>([]);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [imagePickerLoading, setImagePickerLoading] = useState(false);
  const [imagePickerMessage, setImagePickerMessage] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const isTextEditingRef = useRef(false);
  const selectedImagePathRef = useRef<ContentPath | null>(null);
  const selectedImageTargetRef = useRef<HTMLElement | null>(null);
  const cmsVisibility = (contentData.cms?.sections || {}) as Partial<Record<CmsSectionKey, boolean>>;
  const cmsTheme = (contentData.cms?.theme || {}) as Partial<Record<CmsThemeKey, string>>;
  const overlayOpen = settingsOpen || imagePickerOpen;

  const loadImageLibrary = async () => {
    try {
      setIsBusy(true);
      setImagePickerLoading(true);
      const response = await fetch('/api/cms/images');
      const result = (await response.json()) as { ok?: boolean; images?: CmsImage[]; message?: string };

      if (!response.ok || !result.ok) {
        setImagePickerMessage(result.message || 'Could not load CMS images');
        setImageLibrary([]);
        return;
      }

      setImageLibrary(result.images || []);
      setImagePickerMessage((result.images || []).length ? '' : 'No CMS images found yet');
    } catch {
      setImagePickerMessage('Could not load CMS images');
      setImageLibrary([]);
    } finally {
      setImagePickerLoading(false);
      setIsBusy(false);
    }
  };

  const openStoredImagePicker = (image: HTMLElement) => {
    const pathValue = image.dataset.cmsImagePath;
    if (!pathValue) return;

    try {
      selectedImagePathRef.current = JSON.parse(pathValue) as ContentPath;
      selectedImageTargetRef.current = resolveImageTarget(image);
      setImagePickerMessage('');
      setImagePickerOpen(true);
      void loadImageLibrary();
    } catch {
      setStatus('Could not open image picker');
    }
  };

  const saveSelectedCmsImage = async (imageUrl: string) => {
    if (!selectedImagePathRef.current || !selectedImageTargetRef.current) return;

    try {
      setIsBusy(true);
      setStatus('Saving selected CMS image');
      await saveContentEdit(selectedImagePathRef.current, imageUrl);
      applyImageSource(selectedImageTargetRef.current, imageUrl);
      setStatus(`Saved image ${formatPath(selectedImagePathRef.current)}`);
      setImagePickerOpen(false);
      await reloadContent();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not save image');
    } finally {
      setIsBusy(false);
    }
  };

  const removeSelectedCmsImage = async () => {
    if (!selectedImagePathRef.current || !selectedImageTargetRef.current) return;

    try {
      setIsBusy(true);
      setStatus('Removing image');
      await saveContentEdit(selectedImagePathRef.current, '');
      clearImageSource(selectedImageTargetRef.current);
      setStatus(`Removed image ${formatPath(selectedImagePathRef.current)}`);
      setImagePickerOpen(false);
      await reloadContent();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not remove image');
    } finally {
      setIsBusy(false);
    }
  };

  const triggerLocalUpload = () => {
    imageInputRef.current?.click();
  };

  const updateCmsSetting = async (path: ContentPath, value: unknown, successMessage: string) => {
    try {
      setIsBusy(true);
      setStatus(successMessage);
      await saveContentEdit(path, value);
      await reloadContent();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not save CMS setting');
    } finally {
      setIsBusy(false);
    }
  };

  const toggleSection = async (key: CmsSectionKey) => {
    const nextValue = !(cmsVisibility[key] ?? true);
    await updateCmsSetting(['cms', 'sections', key], nextValue, `${nextValue ? 'Showing' : 'Hiding'} ${key}`);
  };

  const applyTheme = async (key: CmsThemeKey, value: string) => {
    await updateCmsSetting(['cms', 'theme', key], value, `Updated ${key} theme`);
  };

  const resetTheme = async () => {
    try {
      setIsBusy(true);
      setStatus('Resetting theme');
      await Promise.all(
        (Object.keys(defaultCmsTheme) as CmsThemeKey[]).map((key) =>
          saveContentEdit(['cms', 'theme', key], defaultCmsTheme[key])
        )
      );
      await reloadContent();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not reset theme');
    } finally {
      setIsBusy(false);
    }
  };

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
    if (!overlayOpen) {
      document.body.style.overflow = '';
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [overlayOpen]);

  useEffect(() => {
    if (authState !== 'authenticated') return;

    const pathIndex = buildContentPathIndex(contentData as JsonValue);

    document.documentElement.classList.add('cms-edit-mode');
    markEditableText(pathIndex, contentData as JsonValue);

    const refreshTimer = window.setTimeout(() => markEditableText(pathIndex, contentData as JsonValue), 1200);
    const observer = new MutationObserver(() => {
      if (isTextEditingRef.current) return;
      window.requestAnimationFrame(() => markEditableText(pathIndex, contentData as JsonValue));
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const finishEditing = async (element: HTMLElement) => {
      isTextEditingRef.current = false;
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
        await reloadContent();
      } catch (error) {
        element.innerText = element.dataset.cmsOriginal || '';
        setStatus(error instanceof Error ? error.message : 'Could not save edit');
      }

      setActiveText('');
    };

    const chooseImage = (image: HTMLElement) => {
      openStoredImagePicker(image);
    };

    const imageInput = imageInputRef.current;
    if (imageInput) {
      imageInput.onchange = async () => {
        const file = imageInput.files?.[0];
        imageInput.value = '';
        if (!file || !selectedImagePathRef.current || !selectedImageTargetRef.current) return;

        try {
          setStatus(`Uploading ${file.name}`);
          const result = await saveImageEdit(selectedImagePathRef.current, file);
          applyImageSource(selectedImageTargetRef.current, result.src);
          setStatus(`Saved image ${formatPath(selectedImagePathRef.current)}`);
          setImagePickerOpen(false);
          await reloadContent();
          await loadImageLibrary();
        } catch (error) {
          setStatus(error instanceof Error ? error.message : 'Could not save image');
        }
      };
    }

    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(EDITABLE_SELECTOR);
      if (target) {
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
        isTextEditingRef.current = true;
        setActiveText(target.innerText);
        setStatus(`Editing ${formatPath(JSON.parse(target.dataset.cmsPath || '[]') as ContentPath)}`);

        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(target);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
        return;
      }

      const imageTarget = (event.target as Element | null)?.closest<HTMLElement>(EDITABLE_IMAGE_SELECTOR);
      if (imageTarget) {
        event.preventDefault();
        event.stopPropagation();
        chooseImage(imageTarget);
        return;
      }
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

      if (event.key === ' ') {
        event.stopPropagation();
      }

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
      setIsBusy(true);
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
    } finally {
      setIsBusy(false);
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
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        hidden
      />
      <div>
        <strong>Edit mode</strong>
        <span>{activeText ? 'Typing changes here' : status}</span>
      </div>
      {isBusy && <Loader2 className="cms-toolbar__spinner" size={16} />}
      <button type="button" onClick={() => setSettingsOpen((value) => !value)} aria-label="Open section settings">
        <Settings2 size={16} />
      </button>
      <button type="button" onClick={logout}>
        Logout
      </button>
      {settingsOpen && (
        <div className="cms-settings" role="dialog" aria-modal="true" aria-label="CMS section settings">
          <div className="cms-settings__backdrop" onClick={() => setSettingsOpen(false)} />
          <div className="cms-settings__panel">
            <div className="cms-settings__header">
              <div>
                <strong>Section controls</strong>
                <span>Hide or show sections, and adjust theme colors.</span>
              </div>
              <button type="button" onClick={() => setSettingsOpen(false)}>
                Close
              </button>
            </div>
            <div className="cms-settings__body">
              <div className="cms-settings__group">
                <div className="cms-settings__group-label">
                  <Eye size={16} />
                  <span>Visibility</span>
                </div>
                <div className="cms-settings__section-list">
                  {cmsSections.map((section) => {
                    const visible = cmsVisibility[section.key] !== false;
                    return (
                      <button
                        key={section.key}
                        type="button"
                        className={`cms-settings__section-item ${visible ? 'is-visible' : 'is-hidden'}`}
                        onClick={() => void toggleSection(section.key)}
                      >
                        <span>{section.label}</span>
                        {visible ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="cms-settings__group">
                <div className="cms-settings__group-label">
                  <Palette size={16} />
                  <span>Theme</span>
                </div>
                <div className="cms-settings__theme-grid">
                  {(Object.keys(themeSwatches) as CmsThemeKey[]).map((key) => {
                    const currentValue = cmsTheme[key] || defaultCmsTheme[key];
                    return (
                      <div className="cms-settings__theme-card" key={key}>
                        <div className="cms-settings__theme-card-head">
                          <div>
                            <span className="cms-settings__theme-title">{key}</span>
                            <span className="cms-settings__theme-value">{currentValue}</span>
                          </div>
                          <div className="cms-settings__theme-preview" style={{ backgroundColor: currentValue }} />
                        </div>
                        <div className="cms-settings__swatches">
                          {themeSwatches[key].map((swatch) => (
                            <button
                              key={swatch}
                              type="button"
                              className={`cms-settings__swatch ${cmsTheme[key] === swatch ? 'is-active' : ''}`}
                              style={{ backgroundColor: swatch }}
                              aria-label={`Set ${key} color to ${swatch}`}
                              onClick={() => void applyTheme(key, swatch)}
                            >
                              {cmsTheme[key] === swatch ? <span className="cms-settings__swatch-check">✓</span> : null}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button type="button" className="cms-settings__ghost-button" onClick={() => void resetTheme()}>
                  Reset theme
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {imagePickerOpen && (
        <div className="cms-image-picker" role="dialog" aria-modal="true" aria-label="CMS image library">
          <div className="cms-image-picker__backdrop" onClick={() => setImagePickerOpen(false)} />
          <div className="cms-image-picker__panel">
            <div className="cms-image-picker__header">
              <div>
                <strong>Choose an image</strong>
                <span>{imagePickerMessage || 'Pick from CMS uploads or add a new one'}</span>
              </div>
              <button type="button" onClick={() => setImagePickerOpen(false)}>
                Close
              </button>
            </div>

            <div className="cms-image-picker__actions">
              <button type="button" onClick={triggerLocalUpload}>
                Upload new image
              </button>
              <button type="button" onClick={() => void removeSelectedCmsImage()}>
                Remove image
              </button>
            </div>

            <div className="cms-image-picker__body">
              {imagePickerLoading ? (
                <div className="cms-image-picker__grid" aria-busy="true">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="cms-image-picker__skeleton">
                      <span />
                      <small />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="cms-image-picker__grid">
                  {imageLibrary.map((image) => (
                    <button
                      key={image.path}
                      type="button"
                      className="cms-image-picker__item"
                      onClick={() => void saveSelectedCmsImage(image.url)}
                      title={image.name}
                    >
                      <img src={image.url} alt={image.name} />
                      <span>{image.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
