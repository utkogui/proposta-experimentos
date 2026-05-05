import path from "node:path";

export function getUploadDir(): string {
  return (
    process.env.UPLOAD_DIR ||
    path.resolve(process.cwd(), "public", "uploads")
  );
}

export function getUploadPath(fileName: string): string {
  return path.join(getUploadDir(), fileName);
}

export function getPublicUploadPath(fileName: string): string {
  return path.join(process.cwd(), "public", "uploads", fileName);
}

export function getContentType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}
