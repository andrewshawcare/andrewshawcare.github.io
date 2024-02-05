import { overwriteDirectory } from "./file-system-utilities.js";

export const compileStaticAssets = async ({
  outputPath,
  staticAssetsPath,
}: {
  outputPath: string;
  staticAssetsPath: string;
}) => {
  overwriteDirectory({ srcDir: staticAssetsPath, destDir: outputPath });
};
