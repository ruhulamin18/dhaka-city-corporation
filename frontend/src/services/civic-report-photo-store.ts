const DATABASE_NAME = 'dscc_civic_report_photos';
const DATABASE_VERSION = 1;
const PHOTO_STORE = 'photos';

let databasePromise: Promise<IDBDatabase> | undefined;

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('Photo storage is not available in this browser.'));
  }
  if (databasePromise) return databasePromise;

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(PHOTO_STORE)) {
        request.result.createObjectStore(PHOTO_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open photo storage.'));
    request.onblocked = () => reject(new Error('Photo storage upgrade is blocked by another tab.'));
  });
  databasePromise.catch(() => {
    databasePromise = undefined;
  });
  return databasePromise;
}

function newPhotoId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function saveReportPhotos(files: File[]): Promise<string[]> {
  const db = await openDatabase();
  const ids = files.map(() => newPhotoId());

  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(PHOTO_STORE, 'readwrite');
    const store = transaction.objectStore(PHOTO_STORE);
    files.forEach((file, index) => store.put(file, ids[index]));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Unable to save report photos.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Saving report photos was aborted.'));
  });

  return ids;
}

export async function loadReportPhoto(id: string): Promise<Blob | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(PHOTO_STORE, 'readonly').objectStore(PHOTO_STORE).get(id);
    request.onsuccess = () => resolve(request.result instanceof Blob ? request.result : null);
    request.onerror = () => reject(request.error ?? new Error('Unable to read a report photo.'));
  });
}

export async function deleteReportPhotos(ids: string[]): Promise<void> {
  if (!ids.length) return;
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(PHOTO_STORE, 'readwrite');
    const store = transaction.objectStore(PHOTO_STORE);
    ids.forEach((id) => store.delete(id));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Unable to remove report photos.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Removing report photos was aborted.'));
  });
}
