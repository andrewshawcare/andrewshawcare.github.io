<html lang="en">

{% partial file="head.md" /%}

<body>

<article>

<header>

# {% $frontmatter.title %}

<nav>

{% table-of-contents type="headings" /%}

</nav>

</header>

<main>

{% $content %}

</main>

</article>

</body>

</html>
