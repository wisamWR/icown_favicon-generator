/**
 * Encode multiple PNG blobs into a single .ico file.
 * ICO format: ICONDIR header (6 bytes) + ICONDIRENTRY per image (16 bytes each) + PNG data.
 */
export async function encodeICO(
  entries: { size: number; blob: Blob }[],
): Promise<Blob> {
  const count = entries.length;
  const headerSize = 6;
  const entrySize = 16;
  const dirSize = headerSize + count * entrySize;

  const pngArrays: Uint8Array[] = [];
  for (const { blob } of entries) {
    pngArrays.push(new Uint8Array(await blob.arrayBuffer()));
  }

  const totalSize =
    dirSize + pngArrays.reduce((sum, arr) => sum + arr.length, 0);
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  // ICONDIR
  view.setUint16(0, 0, true);      // reserved
  view.setUint16(2, 1, true);      // type = ICO
  view.setUint16(4, count, true);  // image count

  let dataOffset = dirSize;
  for (let i = 0; i < count; i++) {
    const size = entries[i].size;
    const png = pngArrays[i];
    const off = headerSize + i * entrySize;

    view.setUint8(off + 0, size >= 256 ? 0 : size); // width
    view.setUint8(off + 1, size >= 256 ? 0 : size); // height
    view.setUint8(off + 2, 0);                       // color palette
    view.setUint8(off + 3, 0);                       // reserved
    view.setUint16(off + 4, 1, true);                // color planes
    view.setUint16(off + 6, 32, true);               // bits per pixel
    view.setUint32(off + 8, png.length, true);       // data size
    view.setUint32(off + 12, dataOffset, true);      // data offset

    bytes.set(png, dataOffset);
    dataOffset += png.length;
  }

  return new Blob([buffer], { type: 'image/x-icon' });
}
