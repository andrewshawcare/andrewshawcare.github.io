export default {
    render: "asc-callout",
    children: ["paragraph"],
    attributes: {
        type: {
            type: String,
            default: "note",
            matches: ["check", "error", "note", "warning"]
        }
    }
}