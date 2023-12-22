import { Config } from "@markdoc/markdoc";

import calloutMarkdocSchema from "./components/callout/markdoc-schema.js";

const markdocConfig: Config = {
    nodes: {},
    tags: {
        calloutMarkdocSchema
    },
    variables: {},
    functions: {},
    partials: {},
};

export default markdocConfig;