/**
 * Converts an SVG string to a PNG Blob of specific dimensions
 */
export const svgToPngBlob = (
  svgUrl: string,
  width: number,
  height: number,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create blob"));
      }, "image/png");
    };
    img.onerror = reject;
    img.src = svgUrl;
  });
};

/**
 * Generates an ICO file from an SVG URL and a list of sizes.
 * The ICO format supports embedding PNGs directly (Vista+), which is standard now.
 */
export const generateIco = async (
  svgUrl: string,
  sizes: number[] = [16, 32, 48],
): Promise<Blob> => {
  // 1. Generate PNGs for all requested sizes
  const pngPromises = sizes.map((size) => svgToPngBlob(svgUrl, size, size));
  const pngBlobs = await Promise.all(pngPromises);
  const pngBuffers = await Promise.all(
    pngBlobs.map((blob) => blob.arrayBuffer()),
  );

  // 2. Calculate offsets and sizes
  const headerSize = 6;
  const directorySize = 16;
  const totalHeaderSize = headerSize + sizes.length * directorySize;

  let currentOffset = totalHeaderSize;
  const directoryData: Uint8Array[] = [];

  // 3. Create Directory Entries
  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i] || 0;
    const buffer = pngBuffers[i];
    if (!buffer) continue;

    const entry = new Uint8Array(16);
    const view = new DataView(entry.buffer);

    // Width (0 means 256)
    const widthByte = size === 256 ? 0 : size;
    view.setUint8(0, widthByte);
    // Height
    const heightByte = size === 256 ? 0 : size;
    view.setUint8(1, heightByte);
    // Palette count (0 for PNG)
    view.setUint8(2, 0);
    // Reserved
    view.setUint8(3, 0);
    // Color planes (0 or 1, usually 1)
    view.setUint16(4, 1, true);
    // Bits per pixel (32 for RGBA)
    view.setUint16(6, 32, true);
    // Size of image data
    view.setUint32(8, buffer.byteLength, true);
    // Offset
    view.setUint32(12, currentOffset, true);

    directoryData.push(entry);
    currentOffset += buffer.byteLength;
  }

  // 4. Construct the final file
  const header = new Uint8Array(6);
  const headerView = new DataView(header.buffer);
  headerView.setUint16(0, 0, true); // Reserved
  headerView.setUint16(2, 1, true); // Type 1 = ICO
  headerView.setUint16(4, sizes.length, true); // Count

  // Combine parts: Header + Directories + PNG Data
  const parts = [header, ...directoryData, ...pngBuffers] as BlobPart[];

  return new Blob(parts, { type: "image/x-icon" });
};
