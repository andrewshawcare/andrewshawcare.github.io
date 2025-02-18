<html lang="en">

{% partial file="head.md" /%}

<body>

<article class="w-50 my-3 mx-auto p-3 card">

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
