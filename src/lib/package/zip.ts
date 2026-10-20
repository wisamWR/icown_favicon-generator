import JSZip from 'jszip';
import type { IconFile } from '../../types';

export async function createIconZip(files: IconFile[]): Promise<Blob> {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.name, file.data);
  }
  return zip.generateAsync({ type: 'blob' });
}
