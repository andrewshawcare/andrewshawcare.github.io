import FileSystem from "node:fs";

const overwriteDirectory = ({
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

export const compileStaticAssets = async ({
  outputPath,
  staticAssetsPath,
}: {
  outputPath: string;
  staticAssetsPath: string;
}) => {
  overwriteDirectory({ srcDir: staticAssetsPath, destDir: outputPath });
};
