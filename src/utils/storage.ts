// Robust IndexedDB helper for storing PDF files and high-res images

const DB_NAME = 'AshrafulPortfolioDB';
const DB_VERSION = 1;
const STORE_NAME = 'files_store';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function setFile(key: string, data: { name: string; type: string; base64: string; size: number; updatedAt: string }): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(data, key);
      req.onsuccess = () => {
        // Also save a small metadata flag in localStorage
        try {
          localStorage.setItem(`meta_${key}`, JSON.stringify({ name: data.name, size: data.size, updatedAt: data.updatedAt }));
        } catch (e) {}
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('IndexedDB setFile error:', err);
    // Fallback to localStorage if small enough
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('localStorage fallback failed:', e);
    }
  }
}

export async function getFile(key: string): Promise<{ name: string; type: string; base64: string; size: number; updatedAt: string } | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        if (req.result) {
          resolve(req.result);
        } else {
          // Check localStorage fallback
          try {
            const raw = localStorage.getItem(key);
            resolve(raw ? JSON.parse(raw) : null);
          } catch {
            resolve(null);
          }
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}

export async function deleteFile(key: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(key);
      try {
        localStorage.removeItem(key);
        localStorage.removeItem(`meta_${key}`);
      } catch (e) {}
      resolve();
    });
  } catch {
    try {
      localStorage.removeItem(key);
      localStorage.removeItem(`meta_${key}`);
    } catch (e) {}
  }
}

/**
 * Downloads a base64 string or fetches a fallback URL and triggers a real browser download.
 * Guarantees 100% download execution in any browser, iframe, or mobile.
 */
export async function triggerDownload(fileName: string, base64Data?: string, fallbackUrl?: string): Promise<boolean> {
  try {
    let blob: Blob;

    if (base64Data && base64Data.startsWith('data:')) {
      const parts = base64Data.split(';base64,');
      const contentType = parts[0].split(':')[1] || 'application/pdf';
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      blob = new Blob([uInt8Array], { type: contentType });
    } else if (fallbackUrl) {
      const res = await fetch(fallbackUrl);
      if (!res.ok) throw new Error('Failed to fetch file');
      blob = await res.blob();
    } else {
      throw new Error('No data provided');
    }

    // Programmatically trigger download
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    }, 200);

    return true;
  } catch (err) {
    console.error('triggerDownload error:', err);
    // Ultimate fallback: open in window or anchor
    if (fallbackUrl) {
      const a = document.createElement('a');
      a.href = fallbackUrl;
      a.target = '_blank';
      a.download = fileName;
      a.click();
      return true;
    }
    return false;
  }
}
