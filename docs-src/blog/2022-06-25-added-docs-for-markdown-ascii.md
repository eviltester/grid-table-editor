---
slug: docs-markdown-ascii
title: Added Documentation for Markdown and Ascii
authors: alan
tags: [release]
date: 2022-06-25T16:00
---

We now have documentation for [Markdown](/docs/data-formats/markdown/markdown) and [Ascii Tables](/docs/data-formats/ascii-tables/ascii-tables)

<!--truncate-->

## Added Markdown Documentation

I'm starting to add more documentation to the tool.

I've now documented the [options for Markdown output](/docs/data-formats/markdown/options) with some additional information as to [what Markdown is](/docs/data-formats/markdown/markdown)

I personally use Markdown for everything.

I write my daily logs in Markdown, all my [recent books](https://www.eviltester.com/page/books/) have been written in Markdown.

I primarily use [pandoc](https://pandoc.org/) to convert long form Markdown files into PDF and that works very well for me.

To preview markdown when I want to view it I either use the preview pane in [Visual Studio Code](https://code.visualstudio.com/docs/languages/markdown) although other plugins are available.

When I want to review the content that I've written, I'll typically use [MarkdownLivePreview.com](https://markdownlivepreview.com/) and if you want to preview the tables that you create in AnyWayData.com then I recommend copy and pasting the Markdown generated here into the MarkdownLivePreview text pane. It handles tables very well and formats them nicely by default.

MarkdownLivePreview also works well with the AnyWayData.com options to embolden or italicize headers and columns.

## Added Ascii Table Documentation

I grew up in the age of text files so I'm used to seeing Ascii Tables to represent tabular formatted data.

e.g.

```
+---------------+---------------+-------------+
|    Country    |  Population   | World Share |
+---------------+---------------+-------------+
| China         | 1,439,323,776 | 18.47 %     |
| India         | 1,380,004,385 | 17.70 %     |
| United States | 331,002,651   | 4.25 %      |
+---------------+---------------+-------------+
```

The Ascii conversion used in AnyWayData.com is provided by the open-source [Ascii Table 3](https://www.npmjs.com/package/ascii-table3) library.

I chose this because of the numerous out of the box styles which I could use as [styling options for the Ascii Table](/docs/data-formats/ascii-tables/options) conversion.

I had to make a few tweaks to the library code to get it working in the browser but I haven't expanded or changed any of the styles yet.


