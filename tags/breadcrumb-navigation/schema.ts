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
    
    const isDirectory = filename === "index.md";
    const pathname = Path.join(sourceDirectory.replace(contentDirectory, ""), filename);
    const pathparts = pathname.split("/");

    const breadcrumbPathParts = [];

    for (const pathpart of pathparts) {
        breadcrumbPathParts.push(pathpart);
        const breadcrumbRelativePath = Path.join(...breadcrumbPathParts);

        const isFirstPart = breadcrumbPathParts.length === 1;
        const isLastPart = breadcrumbPathParts.join("/") === pathname;

        if (!isFirstPart && isLastPart && isDirectory) {
            break;
        }

        const path = isLastPart ?
            Path.resolve(contentDirectory, breadcrumbRelativePath) :
            Path.resolve(contentDirectory, breadcrumbRelativePath, "index.md");

        const articleContents = await FileSystem.promises.readFile(path, "utf8");

        const articleNode = Markdoc.parse(articleContents);

        const frontmatter = validateTypeUsingSchema<Frontmatter>(
            JSYAML.load(articleNode.attributes.frontmatter),
            frontmatterSchema,
        );

        const href = `${breadcrumbPathParts.map(part => encodeURIComponent(part)).join("/")}/`;
        const anchorTag = new Markdoc.Tag("a", { href }, [ frontmatter.title || "" ]);
        navTag.children.push(anchorTag);

        const spanTag = new Markdoc.Tag("span", { class: "arrow" }, ["→"]);
        navTag.children.push(spanTag);
    }

    // Remove the last arrow and link from the last breadcrumb
    if (navTag.children.length > 1) {
        navTag.children.pop();

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