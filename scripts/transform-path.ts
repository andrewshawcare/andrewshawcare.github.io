import Path, { FormatInputPathObject } from "node:path";

export const transformPath = ({
  path,
  transform,
}: {
  path: string;
  transform: FormatInputPathObject;
}) => {
  return Path.format({
    ...Path.parse(path),
    ...{ base: undefined },
    ...transform,
  });
};
