<html lang="en">

{% partial file="head.md" /%}

<body>

# {% $frontmatter.title %}

{% table-of-contents type="headings" /%}

{% $content %}

</body>

</html>
