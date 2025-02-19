import FileSystem from "node:fs";
import Path from "node:path";
import JSYAML from "js-yaml";
import Markdoc, { Schema } from "@markdoc/markdoc";
import { validateTypeUsingSchema } from "../../validate-type-using-schema.js";
import {
    default as variablesSchema,
    Schema as Variables,
} from "../../schemas/variables.json.js";
import {
    default as frontmatterSchema,
    Schema as Frontmatter,
} from "../../schemas/frontmatter.json.js";

const getVariablesFromConfig = (config: Markdoc.Config) =>
    validateTypeUsingSchema<Variables>(
        config.variables,
        variablesSchema,
    );

const addBreadcrumbs = async (navTag: Markdoc.Tag, config: Markdoc.Config) => {
    const { sourceDirectory, contentDirectory, filename } =  getVariablesFromConfig(config);
    
    const pathname = Path.join(sourceDirectory.replace(contentDirectory, ""), filename);
    const pathparts = pathname.split("/");

    let breadcrumbPathParts = [];

    console.log({contentDirectory, pathname, pathparts})

    for (const pathpart of pathparts) {
        breadcrumbPathParts.push(pathpart);
        const breadcrumbRelativePath = Path.join(...breadcrumbPathParts);

        console.log({breadcrumbPathParts, breadcrumbRelativePath})

        let path = Path.resolve(contentDirectory);

        // If the paths are the same and end in an index, we are at a directory, otherwise we need to continue
        if (breadcrumbPathParts.join("/") === pathname) {
            if (breadcrumbRelativePath.endsWith("index.md")) {
                break;
            }
            path = Path.resolve(path, breadcrumbRelativePath);
        } else {
            path = Path.resolve(path, breadcrumbRelativePath, "index.md");
        }

        console.log({path})

        const articleContents = await FileSystem.promises.readFile(
            path,
            "utf8"
        );

        const articleNode = Markdoc.parse(articleContents);

        const frontmatter = validateTypeUsingSchema<Frontmatter>(
            JSYAML.load(articleNode.attributes.frontmatter),
            frontmatterSchema,
        );

        const anchorTag = new Markdoc.Tag("a");

        anchorTag.children.push(frontmatter.title || "");

        anchorTag.attributes.href = `${breadcrumbPathParts.join("/")}/`;

        navTag.children.push(anchorTag);

        navTag.children.push(new Markdoc.Tag("span", { class: "arrow" }, ["→"]));
    }

    navTag.children.pop();

    if (navTag.children.length > 0) {
        const lastChild = navTag.children[navTag.children.length - 1];
        if (lastChild instanceof Markdoc.Tag) {
            delete lastChild.attributes.href;
        }
    }
}

const schema: Schema = {
    render: "nav",
    async transform(node, config) {
        const navTag = new Markdoc.Tag("nav", { class: "breadcrumb navigation" });
        await addBreadcrumbs(navTag, config);
        return navTag;
    }
};

export default schema;