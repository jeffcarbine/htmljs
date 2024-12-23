// Standard Library Imports
import fs from "fs";
import path from "path";

import {
  Head,
  Meta,
  Title,
  Link,
  PreLoadStyle,
  Stylesheet,
  Style,
  Script,
  Body,
  Module,
} from "./elements.html.js";

class ServerHead extends Head {
  constructor(params) {
    super(params);

    this.children = [];

    if (params.title !== undefined) {
      const title = new Title({
        textContent: params.title,
      });

      this.children.push(title);
    }

    if (params.metas !== undefined && Array.isArray(params.metas)) {
      for (let i = 0; i < params.metas.length; i++) {
        const meta = params.metas[i];

        const metaChip = new Meta({
          name: meta.name,
          content: meta.content,
        });

        this.children.push(metaChip);
      }
    }

    if (params.links !== undefined && Array.isArray(params.links)) {
      for (let i = 0; i < params.links.length; i++) {
        const link = params.links[i],
          linkChip = new Link();

        for (let key in link) {
          linkChip[key] = link[key];
        }

        this.children.push(linkChip);
      }
    }

    if (
      params?.styles?.base !== undefined &&
      Array.isArray(params?.styles?.base) &&
      params?.styles?.base.length > 0
    ) {
      const baseStyles = params?.styles?.base;

      baseStyles.forEach((href) => {
        let stylesheetChip;

        // make sure the href doesn't have two leading slashes
        if (href.startsWith("//")) {
          href = href.slice(1);
        }

        if (process.env.NODE_ENV === "development") {
          stylesheetChip = new Link({
            rel: "stylesheet",
            class: "non-critical-style",
            href,
          });
        } else {
          stylesheetChip = new PreLoadStyle({
            href,
          });
        }

        this.children.push(stylesheetChip);
      });
    }

    if (
      params?.styles?.critical !== undefined &&
      Array.isArray(params?.styles?.critical) &&
      params?.styles?.critical.length > 0
    ) {
      const criticalStyles = params?.styles?.critical;

      let criticalStyle;

      // if the head tag is being generated on the server, then we need to
      // read the stylesheets and render them as inline styles
      criticalStyles.forEach((href) => {
        // make sure the href doesn't have two leading slashes
        if (href.startsWith("//")) {
          href = href.slice(1);
        }

        const filePath = path.join(process.cwd(), href),
          styles = fs.readFileSync(filePath, "utf8");

        if (process.env.NODE_ENV === "development") {
          // if we're in development, we can just link the stylesheets
          criticalStyle = new Stylesheet({
            href,
            onload: `setTimeout(() => {
            const nonCriticalStylesheets = document.querySelectorAll(
              ".non-critical-style"
            );

            nonCriticalStylesheets.forEach((stylesheet) => {
              stylesheet.rel = "stylesheet";
            });
          }, 2000);`,
          });
        } else {
          criticalStyle = new Style({
            textContent: styles,
            "data-critical": true,
          });
        }

        this.children.push(criticalStyle);
      });
    }

    if (params.typekit !== undefined && typeof params.typekit === "string") {
      const typekitLink = new PreLoadStyle({
        href: `https://use.typekit.net/${params.typekit}.css`,
      });

      this.children.push(typekitLink);
    }

    if (
      params.scripts !== undefined &&
      Array.isArray(params.scripts) &&
      params.scripts.length > 0
    ) {
      for (let i = 0; i < params.scripts.length; i++) {
        const script = params.scripts[i],
          scriptChip = new Script(script);

        // if the script is already a Module or Script, then don't wrap it
        if (script instanceof Script || script instanceof Module) {
          this.children.push(script);
          continue;
        } else {
          this.children.push(scriptChip);
        }
      }
    }

    if (
      params.favicons !== undefined &&
      Array.isArray(params.favicons) &&
      params.favicons.length > 0
    ) {
      for (let i = 0; i < params.favicons.length; i++) {
        const favicon = params.favicons[i],
          faviconChip = new Link(favicon);

        this.children.push(faviconChip);
      }
    }

    if (params.inlineStyles !== undefined) {
      const inlineStyles = new Style({
        textContent: params.inlineStyles,
      });

      this.children.push(inlineStyles);
    }
  }
}

/**
 * Class representing the layout of the HTML document.
 */
export class Layout {
  /**
   * Creates an instance of Layout.
   *
   * @param {Object} params - The parameters for the layout.
   */
  constructor(params) {
    this.tagName = "html";
    this.lang = params.lang || "en";

    const criticals = [],
      bases = [],
      scripts = [];

    const dist = params.dist || "dist";

    // check if the base critical, base and script exist
    try {
      if (
        fs.existsSync(path.resolve(process.cwd(), `${dist}/styles/base.css`))
      ) {
        bases.push(`/${dist}/styles/base.css`);
      }

      if (
        fs.existsSync(
          path.resolve(process.cwd(), `${dist}/styles/critical.css`)
        )
      ) {
        criticals.push(`/${dist}/styles/critical.css`);
      }

      if (
        fs.existsSync(
          path.resolve(process.cwd(), `${dist}/scripts/base.scripts.js`)
        )
      ) {
        scripts.push(new Module({ src: `/${dist}/scripts/base.scripts.js` }));
      }
    } catch (e) {
      console.warn(e);
    }

    // first check if the corresponding critical and base styles and page script exist
    // based on the page path (ie: /pages/about-us) by splitting the path and checking
    // for each part of the path in it's corresponding directory
    const urlPaths =
      params.data.path === "/"
        ? ["home"]
        : params.data.path
            .split("/")
            .filter((part) => part !== "" && part !== params.pathModifier);

    let filepaths = [];

    for (let i = 0; i < urlPaths.length; i++) {
      let urlPath = urlPaths.slice(0, i + 1);

      if (
        (params.data.wildcard &&
          params.data?.wildcard !== "none" &&
          i === urlPaths.length - 1) ||
        urlPath[urlPath.length - 1] === "*"
      ) {
        // make two wildcard paths, one with the previous_path/path + _$
        // and another with the previous_path/path/path + _s
        let wildcardPath1 = `${urlPath.slice(0, -2).join("/")}/${
          urlPath[urlPath.length - 2]
        }_$`;

        filepaths.push(wildcardPath1);

        let wildcardPath2 = `${urlPath.slice(0, -1).join("/")}/${
          urlPath[urlPath.length - 2]
        }_$`;

        filepaths.push(wildcardPath2);
      } else {
        filepaths.push(urlPath.join("/"));
        let formattedPath = `${urlPath.join("/")}/${
          urlPath[urlPath.length - 1]
        }`;

        filepaths.push(formattedPath);
      }
    }

    // if not including parent scripts, then we need to modify the filepaths
    if (!params.inherit) {
      // if the last path is a *, then we need to reduce the array to the ones that contain a _$
      // if (filepaths[filepaths.length - 1].includes("_$")) {
      //   filepaths = [filepaths[filepaths.length - 1]];
      // } else if (params.data.wildcard && params.data?.wildcard !== "none") {
      //   // if this is a wildcard page, then we need to reduce it to the third/fourth to last entires
      //   filepaths = [
      //     filepaths[filepaths.length - 4],
      //     filepaths[filepaths.length - 3],
      //   ];
      if (filepaths[filepaths.length - 1].includes("_$")) {
        // reduce the array to only entries that contain a _$
        filepaths = filepaths.filter((path) => path.includes("_$"));
      } else {
        // then we need to reduce the array to just the last two entries, if there are more than two entires
        if (filepaths.length > 2) {
          filepaths = [
            filepaths[filepaths.length - 2],
            filepaths[filepaths.length - 1],
          ];
        }
      }
    }

    for (let i = 0; i < filepaths.length; i++) {
      const formattedPath = filepaths[i];

      const critical = `${dist}/styles/pages/${formattedPath}.critical.css`,
        base = `${dist}/styles/pages/${formattedPath}.base.css`,
        script = `${dist}/scripts/${formattedPath}.scripts.js`;

      if (fs.existsSync(path.resolve(process.cwd(), critical))) {
        criticals.push(`/${critical}`);
      }

      if (fs.existsSync(path.resolve(process.cwd(), base))) {
        bases.push(`/${base}`);
      }

      if (fs.existsSync(path.resolve(process.cwd(), script))) {
        scripts.push(new Module({ src: `/${script}` }));
      }
    }

    const styles = {
      critical: [
        ...criticals,
        ...(Array.isArray(params.styles?.critical)
          ? params.styles.critical
          : params.styles?.critical
          ? Array.of(params.styles.critical)
          : []),
      ],
      base: [
        ...bases,
        ...(Array.isArray(params.styles?.base)
          ? params.styles.base
          : params.styles?.base
          ? Array.of(params.styles.base)
          : []),
      ],
    };

    // now check to see if we are in production or not - if so, loop through ALL of the base styles
    // and check to see if any of them start with a / - if so, then prepend the CDN url to it
    if (process.env.NODE_ENV === "production" && process.env.CDN_BASE_URL) {
      styles.base = styles.base.map((style) => {
        if (style.startsWith("/")) {
          return `${process.env.CDN_BASE_URL}${style}`;
        }
        return style;
        x;
      });
    }

    const head = {
      title: params.title,
      links: params.links,
      styles,
      typekit: params.typekit,
      metas: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        ...(params.description
          ? [{ name: "description", content: params.description }]
          : []),
        ...(params?.metas || []),
      ],
    };

    const body = params.body;

    const pageScripts = [
      new Module({
        src: "/premmio/public/components/component-loader.js",
      }),
      ...scripts,
      ...(typeof params.scripts === "string"
        ? Array.of(params.scripts)
        : params.scripts ?? []),
    ];

    // now check to see if we are in production or not - if so, loop through ALL of the scripts
    // and check to see if any of them start with a / - if so, then prepend the CDN url to it
    if (process.env.NODE_ENV === "production" && process.env.CDN_BASE_URL) {
      pageScripts.forEach((script) => {
        if (script.src && script.src.startsWith("/")) {
          script.src = `${process.env.CDN_BASE_URL}${script.src}`;
        }
      });
    }

    if (Array.isArray(body)) {
      body.push(...pageScripts);
    } else {
      body.children.push(...pageScripts);
    }

    if (params.style) {
      this.style = params.style;
    }

    if (params["data-theme"] !== undefined) {
      this["data-theme"] = params["data-theme"];
    }

    this.children = [new ServerHead(head), new Body(body)];
  }
}
