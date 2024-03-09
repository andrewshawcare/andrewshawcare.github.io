import FileSystem from "node:fs";
import Path from "node:path";
import { globSync } from "glob";

type GlobSyncParameters = Parameters<typeof globSync>;
type StaticAsset = {
  pattern: GlobSyncParameters[0];
  options: GlobSyncParameters[1];
};

export const compileStaticAssets = async ({
  outputPath,
  staticAssets,
}: {
  outputPath: string;
  staticAssets: StaticAsset[];
}) => {
  for (const staticAsset of staticAssets) {
    for (const staticAssetPath of globSync(
      staticAsset.pattern,
      staticAsset.options,
    )) {
      const source = Path.resolve(
        staticAsset.options.cwd?.toString() || "",
        staticAssetPath.toString(),
      );

      const destination = Path.resolve(outputPath, staticAssetPath.toString());

      FileSystem.cpSync(source, destination);
    }
  }
};
