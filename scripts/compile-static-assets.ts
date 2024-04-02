import FileSystem from "node:fs";
import Path from "node:path";
import { globSync } from "glob";

type GlobParameters = Parameters<typeof globSync>;
type Glob = {
  pattern: GlobParameters[0];
  options: GlobParameters[1];
};

export const compileStaticAssets = async ({
  destinationDirectory,
  sourceGlobs,
}: {
  destinationDirectory: string;
  sourceGlobs: Glob[];
}) => {
  sourceGlobs.forEach(({ pattern, options }) => {
    const sourceDirectory = options.cwd?.toString() || "";

    globSync(pattern, options)
      .map(String)
      .forEach((relativePath) => {
        const sourcePath = Path.resolve(sourceDirectory, relativePath);
        const destinationPath = Path.resolve(
          destinationDirectory,
          relativePath,
        );
        FileSystem.cpSync(sourcePath, destinationPath);
      });
  });
};
