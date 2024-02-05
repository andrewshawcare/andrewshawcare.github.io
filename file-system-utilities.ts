import FileSystem from "node:fs";

export const ensureDirectoryExists = (directory: string) => {
  if (directory.length > 0) {
    FileSystem.mkdirSync(directory, { recursive: true });
  }
};

export const overwriteDirectory = ({
  srcDir,
  destDir,
}: {
  srcDir: string;
  destDir: string;
}) => {
  if (FileSystem.existsSync(destDir)) {
    FileSystem.rmSync(destDir, { recursive: true, force: true });
  }
  FileSystem.mkdirSync(destDir);
  FileSystem.cpSync(srcDir, destDir, { recursive: true });
};
