<html lang="en">

{% partial file="head.md" /%}

<body>

{% breadcrumb-navigation /%}

<article class="note">

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
