<html lang="en">

{% partial file="head.md" /%}

<body>

{% breadcrumb-navigation /%}

<article>

# {% $frontmatter.title %}

{% $content %}

</article>

</body>

</html>
