const validAttributes = [
  "accept",
  "accept-charset",
  "accesskey",
  "action",
  "align",
  "alt",
  "async",
  "autocapitalize",
  "autocomplete",
  "autofocus",
  "autoplay",
  "background",
  "bgcolor",
  "border",
  "buffered",
  "challenge",
  "charset",
  "checked",
  "cite",
  "class",
  "code",
  "codebase",
  "color",
  "cols",
  "colspan",
  "content",
  "contenteditable",
  "contextmenu",
  "controls",
  "coords",
  "crossorigin",
  "data",
  "datetime",
  "decoding",
  "default",
  "defer",
  "dir",
  "dirname",
  "disabled",
  "download",
  "draggable",
  "dropzone",
  "enctype",
  "for",
  "form",
  "formaction",
  "formmethod",
  "formnovalidate",
  "formtarget",
  "headers",
  "height",
  "hidden",
  "high",
  "href",
  "hreflang",
  "http-equiv",
  "icon",
  "id",
  "importance",
  "inputmode",
  "integrity",
  "ismap",
  "itemprop",
  "itemscope",
  "itemtype",
  "keytype",
  "kind",
  "label",
  "lang",
  "language",
  "loading",
  "list",
  "loop",
  "low",
  "manifest",
  "max",
  "maxlength",
  "minlength",
  "media",
  "method",
  "min",
  "multiple",
  "muted",
  "name",
  "novalidate",
  "open",
  "optimum",
  "pattern",
  "ping",
  "placeholder",
  "poster",
  "preload",
  "radiogroup",
  "readonly",
  "referrerpolicy",
  "rel",
  "required",
  "reversed",
  "role",
  "rows",
  "rowspan",
  "sandbox",
  "scope",
  "scoped",
  "selected",
  "shape",
  "size",
  "sizes",
  "slot",
  "span",
  "spellcheck",
  "src",
  "srcdoc",
  "srclang",
  "srcset",
  "start",
  "step",
  "style",
  "summary",
  "tabindex",
  "target",
  "title",
  "translate",
  "type",
  "usemap",
  "value",
  "width",
  "wrap",
  "results",

  // ARIA attributes
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-busy",
  "aria-checked",
  "aria-colcount",
  "aria-colindex",
  "aria-colspan",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-details",
  "aria-disabled",
  "aria-dropeffect",
  "aria-errormessage",
  "aria-expanded",
  "aria-flowto",
  "aria-grabbed",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-level",
  "aria-live",
  "aria-modal",
  "aria-multiline",
  "aria-multiselectable",
  "aria-orientation",
  "aria-owns",
  "aria-placeholder",
  "aria-posinset",
  "aria-pressed",
  "aria-readonly",
  "aria-relevant",
  "aria-required",
  "aria-roledescription",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowspan",
  "aria-selected",
  "aria-setsize",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext",

  // svg attributes
  "accent-height",
  "accumulate",
  "additive",
  "alignment-baseline",
  "allowReorder",
  "alphabetic",
  "amplitude",
  "arabic-form",
  "ascent",
  "attributeName",
  "attributeType",
  "autoReverse",
  "azimuth",
  "baseFrequency",
  "baseline-shift",
  "baseProfile",
  "bbox",
  "begin",
  "bias",
  "by",
  "calcMode",
  "cap-height",
  "class",
  "clip",
  "clipPathUnits",
  "clip-path",
  "clip-rule",
  "color",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "contentScriptType",
  "contentStyleType",
  "cursor",
  "cx",
  "cy",
  "d",
  "decelerate",
  "descent",
  "diffuseConstant",
  "direction",
  "display",
  "divisor",
  "dominant-baseline",
  "dur",
  "dx",
  "dy",
  "edgeMode",
  "elevation",
  "enable-background",
  "end",
  "exponent",
  "externalResourcesRequired",
  "fill",
  "fill-opacity",
  "fill-rule",
  "filter",
  "filterRes",
  "filterUnits",
  "flood-color",
  "flood-opacity",
  "font-family",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-variant",
  "font-weight",
  "format",
  "from",
  "fr",
  "fx",
  "fy",
  "g1",
  "g2",
  "glyph-name",
  "glyph-orientation-horizontal",
  "glyph-orientation-vertical",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "hanging",
  "height",
  "href",
  "hreflang",
  "horiz-adv-x",
  "horiz-origin-x",
  "id",
  "ideographic",
  "image-rendering",
  "in",
  "in2",
  "intercept",
  "k",
  "k1",
  "k2",
  "k3",
  "k4",
  "kernelMatrix",
  "kernelUnitLength",
  "kerning",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lang",
  "lengthAdjust",
  "letter-spacing",
  "lighting-color",
  "limitingConeAngle",
  "local",
  "marker-end",
  "marker-mid",
  "marker-start",
  "markerHeight",
  "markerUnits",
  "markerWidth",
  "mask",
  "maskContentUnits",
  "maskUnits",
  "mathematical",
  "max",
  "media",
  "method",
  "min",
  "mode",
  "name",
  "numOctaves",
  "offset",
  "opacity",
  "operator",
  "order",
  "orient",
  "orientation",
  "origin",
  "overflow",
  "overline-position",
  "overline-thickness",
  "panose-1",
  "paint-order",
  "path",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointer-events",
  "points",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "r",
  "radius",
  "refX",
  "refY",
  "rendering-intent",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "restart",
  "result",
  "rotate",
  "rx",
  "ry",
  "scale",
  "seed",
  "shape-rendering",
  "slope",
  "spacing",
  "specularConstant",
  "specularExponent",
  "speed",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stemh",
  "stemv",
  "stitchTiles",
  "stop-color",
  "stop-opacity",
  "strikethrough-position",
  "strikethrough-thickness",
  "string",
  "stroke",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "target",
  "targetX",
  "targetY",
  "text-anchor",
  "text-decoration",
  "text-rendering",
  "textLength",
  "to",
  "transform",
  "type",
  "u1",
  "u2",
  "underline-position",
  "underline-thickness",
  "unicode",
  "unicode-bidi",
  "unicode-range",
  "units-per-em",
  "v-alphabetic",
  "v-hanging",
  "v-ideographic",
  "v-mathematical",
  "values",
  "vector-effect",
  "version",
  "vert-adv-y",
  "vert-origin-x",
  "vert-origin-y",
  "viewBox",
  "viewTarget",
  "visibility",
  "width",
  "widths",
  "word-spacing",
  "writing-mode",
  "x",
  "x-height",
  "x1",
  "x2",
  "xChannelSelector",
  "xlink:actuate",
  "xlink:arcrole",
  "xlink:href",
  "xlink:role",
  "xlink:show",
  "xlink:title",
  "xlink:type",
  "xml:base",
  "xml:lang",
  "xml:space",
  "y",
  "y1",
  "y2",
  "yChannelSelector",
  "z",
  "zoomAndPan",

  // htmljs specific attributes
  "if",
  "child",
  "children",
  "textContent",
  "innerHTML",
  "bind",
];

export class Element {
  initialize(params) {
    if (typeof params === "object") {
      if (Array.isArray(params)) {
        switch (this.tagName) {
          case "ul":
          case "ol":
            this.children = params.map((item) =>
              item instanceof Li ? item : new Li(item)
            );
            break;
          case "dl":
            this.children = params.map((item) =>
              item instanceof Dt ? item : new Dt(item)
            );
            break;
          case "select":
            this.children = params.map((item) =>
              item instanceof Option ? item : new Option(item)
            );
            break;
          case "thead":
            this.child = new Tr(
              params.map((cell) => (cell instanceof Th ? cell : new Th(cell)))
            );
            break;
          case "tbody":
            this.children = params.map(
              (row) =>
                new Tr(
                  row.map((cell, index) =>
                    index === 0
                      ? cell instanceof Th
                        ? cell
                        : new Th(cell)
                      : cell instanceof Td
                      ? cell
                      : new Td(cell)
                  )
                )
            );
            break;
          default:
            this.children =
              this.children !== undefined
                ? this.children.concat(params)
                : params;
        }
      } else if (params instanceof Element) {
        this.child = params;
      } else {
        for (let key in params) {
          if (validAttributes.includes(key) || key.startsWith("data-")) {
            this[key] = params[key];
          }
        }
      }
    } else if (
      typeof params === "string" ||
      typeof params === "number" ||
      typeof params === "function"
    ) {
      switch (this.tagName) {
        case "img":
        case "script":
          this.src = params;
          break;
        case "link":
          this.href = params;
          break;
        default:
          this.textContent = params;
      }
    }
  }
}

export class Html extends Element {
  constructor(params) {
    super(params);
    this.tagName = "html";
    this.initialize(params);
  }
}

export class Base extends Element {
  constructor(params) {
    super(params);
    this.tagName = "base";
    this.initialize(params);
  }
}

/**
 * Represents the head section of an HTML document.
 */
export class Head extends Element {
  /**
   * Creates an instance of Head.
   *
   * @param {Object} params - The parameters for the head section.
   */
  constructor(params) {
    super(params);
    this.tagName = "head";
  }
}

export class Link extends Element {
  constructor(params) {
    super(params);
    this.tagName = "link";
    this.initialize(params);
  }
}

export class Stylesheet extends Link {
  constructor(params) {
    super(params);
    this.rel = "stylesheet";
  }
}

export class PreLoadStyle extends Link {
  constructor(params) {
    super(params);
    this.rel = "preload";
    this.as = "style";
    this.onload = `this.rel="stylesheet"`;
  }
}

export class Meta extends Element {
  constructor(params) {
    super(params);
    this.tagName = "meta";
    this.initialize(params);
  }
}

export class Style extends Element {
  constructor(params) {
    super(params);
    this.tagName = "style";
    this.initialize(params);
  }
}

export class Title extends Element {
  constructor(params) {
    super(params);
    this.tagName = "title";
    this.initialize(params);
  }
}

export class Body extends Element {
  constructor(params) {
    super(params);
    this.tagName = "body";
    this.initialize(params);
  }
}

export class Address extends Element {
  constructor(params) {
    super(params);
    this.tagName = "address";
    this.initialize(params);
  }
}

export class Article extends Element {
  constructor(params) {
    super(params);
    this.tagName = "article";
    this.initialize(params);
  }
}

export class Aside extends Element {
  constructor(params) {
    super(params);
    this.tagName = "aside";
    this.initialize(params);
  }
}

export class Footer extends Element {
  constructor(params) {
    super(params);
    this.tagName = "footer";
    this.initialize(params);
  }
}

export class Header extends Element {
  constructor(params) {
    super(params);
    this.tagName = "header";
    this.initialize(params);
  }
}

export class H1 extends Element {
  constructor(params) {
    super(params);
    this.tagName = "h1";
    this.initialize(params);
  }
}

export class H2 extends Element {
  constructor(params) {
    super(params);
    this.tagName = "h2";
    this.initialize(params);
  }
}

export class H3 extends Element {
  constructor(params) {
    super(params);
    this.tagName = "h3";
    this.initialize(params);
  }
}

export class H4 extends Element {
  constructor(params) {
    super(params);
    this.tagName = "h4";
    this.initialize(params);
  }
}

export class H5 extends Element {
  constructor(params) {
    super(params);
    this.tagName = "h5";
    this.initialize(params);
  }
}

export class H6 extends Element {
  constructor(params) {
    super(params);
    this.tagName = "h6";
    this.initialize(params);
  }
}

export class Hgroup extends Element {
  constructor(params) {
    super(params);
    this.tagName = "hgroup";

    if (!this.children) {
      this.children = [];
    }

    if (params.h) {
      const heading = new Element();
      heading.tagName = `h${params.h}`;
      heading.initialize({
        textContent: params.textContent,
      });

      this.children.push(heading);

      delete params.h;
      delete params.textContent;
    }

    if (params.subheading) {
      this.children.push(
        new P({
          textContent: params.subheading,
        })
      );

      delete params.subheading;
    }

    if (params.preheading) {
      this.children.unshift(
        new P({
          textContent: params.preheading,
        })
      );

      delete params.preheading;
    }

    this.initialize(params);
  }
}

export class Main extends Element {
  constructor(params) {
    super(params);
    this.tagName = "main";
    this.initialize(params);
  }
}

export class Nav extends Element {
  constructor(params) {
    super(params);
    this.tagName = "nav";
    this.initialize(params);
  }
}

export class Section extends Element {
  constructor(params) {
    super(params);
    this.tagName = "section";
    this.initialize(params);
  }
}

export class Blockquote extends Element {
  constructor(params) {
    super(params);
    this.tagName = "blockquote";
    this.initialize(params);
  }
}

export class Dd extends Element {
  constructor(params) {
    super(params);
    this.tagName = "dd";
    this.initialize(params);
  }
}

export class Div extends Element {
  constructor(params) {
    super(params);
    this.tagName = "div";
    this.initialize(params);
  }
}

export class Dl extends Element {
  constructor(params) {
    super(params);
    this.tagName = "dl";
    this.initialize(params);
  }
}

export class Dt extends Element {
  constructor(params) {
    super(params);
    this.tagName = "dt";
    this.initialize(params);
  }
}

export class Figcaption extends Element {
  constructor(params) {
    super(params);
    this.tagName = "figcaption";
    this.initialize(params);
  }
}

export class Figure extends Element {
  constructor(params) {
    super(params);
    this.tagName = "figure";
    this.initialize(params);
  }
}

export class Hr extends Element {
  constructor(params) {
    super(params);
    this.tagName = "hr";
    this.initialize(params);
  }
}

export class Menu extends Element {
  constructor(params) {
    super(params);
    this.tagName = "menu";
    this.initialize(params);
  }
}

export class P extends Element {
  constructor(params) {
    super(params);
    this.tagName = "p";
    this.initialize(params);
  }
}

export class Pre extends Element {
  constructor(params) {
    super(params);
    this.tagName = "pre";
    this.initialize(params);
  }
}

export class ListElement extends Element {
  constructor(params) {
    super(params);

    // if we have params.children
    if (params.children && Array.isArray(params.children)) {
      // ensure that they are all wrapped in Li elements
      params.children = params.children.map((child) =>
        child instanceof Li ? child : new Li(child)
      );
    }
  }
}

export class Ul extends ListElement {
  constructor(params) {
    super(params);
    this.tagName = "ul";

    this.initialize(params);
  }
}

export class Ol extends ListElement {
  constructor(params) {
    super(params);
    this.tagName = "ol";

    this.initialize(params);
  }
}

export class Li extends Element {
  constructor(params) {
    super(params);
    this.tagName = "li";
    this.initialize(params);
  }
}

export class A extends Element {
  constructor(params) {
    super(params);
    this.tagName = "a";

    // if the href is an external link, then add the noopener and noreferrer attributes
    if (params.href && params.href.startsWith("http")) {
      if (!params.rel) {
        params.rel = "noopener noreferrer";
      } else if (!params.rel.includes("noopener noreferrer")) {
        params.rel += " noopener noreferrer";
      }
    }

    this.initialize(params);
  }
}

export class Abbr extends Element {
  constructor(params) {
    super(params);
    this.tagName = "abbr";
    this.initialize(params);
  }
}

export class B extends Element {
  constructor(params) {
    super(params);
    this.tagName = "b";
    this.initialize(params);
  }
}

export class Bdi extends Element {
  constructor(params) {
    super(params);
    this.tagName = "bdi";
    this.initialize(params);
  }
}

export class Bdo extends Element {
  constructor(params) {
    super(params);
    this.tagName = "bdo";
    this.initialize(params);
  }
}

export class Br extends Element {
  constructor(params) {
    super(params);
    this.tagName = "br";
    this.initialize(params);
  }
}

export class Cite extends Element {
  constructor(params) {
    super(params);
    this.tagName = "cite";
    this.initialize(params);
  }
}

export class Code extends Element {
  constructor(params) {
    super(params);
    this.tagName = "code";
    this.initialize(params);
  }
}

export class Data extends Element {
  constructor(params) {
    super(params);
    this.tagName = "data";
    this.initialize(params);
  }
}

export class Dfn extends Element {
  constructor(params) {
    super(params);
    this.tagName = "dfn";
    this.initialize(params);
  }
}

export class Em extends Element {
  constructor(params) {
    super(params);
    this.tagName = "em";
    this.initialize(params);
  }
}

export class I extends Element {
  constructor(params) {
    super(params);
    this.tagName = "i";
    this.initialize(params);
  }
}

export class Kbd extends Element {
  constructor(params) {
    super(params);
    this.tagName = "kbd";
    this.initialize(params);
  }
}

export class Mark extends Element {
  constructor(params) {
    super(params);
    this.tagName = "mark";
    this.initialize(params);
  }
}

export class Q extends Element {
  constructor(params) {
    super(params);
    this.tagName = "q";
    this.initialize(params);
  }
}

export class Rp extends Element {
  constructor(params) {
    super(params);
    this.tagName = "rp";
    this.initialize(params);
  }
}

export class Rt extends Element {
  constructor(params) {
    super(params);
    this.tagName = "rt";
    this.initialize(params);
  }
}

export class Ruby extends Element {
  constructor(params) {
    super(params);
    this.tagName = "ruby";
    this.initialize(params);
  }
}

export class S extends Element {
  constructor(params) {
    super(params);
    this.tagName = "s";
    this.initialize(params);
  }
}

export class Samp extends Element {
  constructor(params) {
    super(params);
    this.tagName = "samp";
    this.initialize(params);
  }
}

export class Small extends Element {
  constructor(params) {
    super(params);
    this.tagName = "small";
    this.initialize(params);
  }
}

export class Span extends Element {
  constructor(params) {
    super(params);
    this.tagName = "span";
    this.initialize(params);
  }
}

export class Strong extends Element {
  constructor(params) {
    super(params);
    this.tagName = "strong";
    this.initialize(params);
  }
}

export class Sub extends Element {
  constructor(params) {
    super(params);
    this.tagName = "sub";
    this.initialize(params);
  }
}

export class Sup extends Element {
  constructor(params) {
    super(params);
    this.tagName = "sup";
    this.initialize(params);
  }
}

export class Time extends Element {
  constructor(params) {
    super(params);
    this.tagName = "time";
    this.initialize(params);
  }
}

export class U extends Element {
  constructor(params) {
    super(params);
    this.tagName = "u";
    this.initialize(params);
  }
}

export class Var extends Element {
  constructor(params) {
    super(params);
    this.tagName = "var";
    this.initialize(params);
  }
}

export class Wbr extends Element {
  constructor(params) {
    super(params);
    this.tagName = "wbr";
    this.initialize(params);
  }
}

export class Area extends Element {
  constructor(params) {
    super(params);
    this.tagName = "area";
    this.initialize(params);
  }
}

export class Audio extends Element {
  constructor(params) {
    super(params);
    this.tagName = "audio";
    this.initialize(params);
  }
}

export class Img extends Element {
  constructor(params) {
    super(params);
    this.tagName = "img";
    this.initialize(params);
  }
}

export class LazyImg extends Img {
  constructor(params) {
    super(params);
    this.loading = "lazy";
  }
}

export class Map extends Element {
  constructor(params) {
    super(params);
    this.tagName = "map";
    this.initialize(params);
  }
}

export class Track extends Element {
  constructor(params) {
    super(params);
    this.tagName = "track";
    this.initialize(params);
  }
}

export class Video extends Element {
  constructor(params) {
    super(params);
    this.tagName = "video";
    this.initialize(params);
  }
}

export class Embed extends Element {
  constructor(params) {
    super(params);
    this.tagName = "embed";
    this.initialize(params);
  }
}

export class Iframe extends Element {
  constructor(params) {
    super(params);
    this.tagName = "iframe";
    this.initialize(params);
  }
}

export class Object extends Element {
  constructor(params) {
    super(params);
    this.tagName = "object";
    this.initialize(params);
  }
}

export class Param extends Element {
  constructor(params) {
    super(params);
    this.tagName = "param";
    this.initialize(params);
  }
}

export class Picture extends Element {
  constructor(params) {
    super(params);
    this.tagName = "picture";
    this.initialize(params);
  }
}

export class Source extends Element {
  constructor(params) {
    super(params);
    this.tagName = "source";
    this.initialize(params);
  }
}

export class Canvas extends Element {
  constructor(params) {
    super(params);
    this.tagName = "canvas";
    this.initialize(params);
  }
}

export class Noscript extends Element {
  constructor(params) {
    super(params);
    this.tagName = "noscript";
    this.initialize(params);
  }
}

export class Script extends Element {
  constructor(params) {
    super(params);
    this.tagName = "script";
    this.defer = true;
    this.initialize(params);
  }
}

export class Module extends Script {
  constructor(params) {
    super(params);
    this.type = "module";
  }
}

export class Del extends Element {
  constructor(params) {
    super(params);
    this.tagName = "del";
    this.initialize(params);
  }
}

export class Ins extends Element {
  constructor(params) {
    super(params);
    this.tagName = "ins";
    this.initialize(params);
  }
}

export class Caption extends Element {
  constructor(params) {
    super(params);
    this.tagName = "caption";
    this.initialize(params);
  }
}

export class Col extends Element {
  constructor(params) {
    super(params);
    this.tagName = "col";
    this.initialize(params);
  }
}

export class Colgroup extends Element {
  constructor(params) {
    super(params);
    this.tagName = "colgroup";
    this.initialize(params);
  }
}

export class Table extends Element {
  constructor(params) {
    super(params);
    this.tagName = "table";
    this.initialize(params);
  }
}

export class TBody extends Element {
  constructor(params) {
    super(params);
    this.tagName = "tbody";
    this.initialize(params);
  }
}

export class Td extends Element {
  constructor(params) {
    super(params);
    this.tagName = "td";
    this.initialize(params);
  }
}

export class Tfoot extends Element {
  constructor(params) {
    super(params);
    this.tagName = "tfoot";
    this.initialize(params);
  }
}

export class Th extends Element {
  constructor(params) {
    super(params);
    this.tagName = "th";
    this.initialize(params);
  }
}

export class THead extends Element {
  constructor(params) {
    super(params);
    this.tagName = "thead";
    this.initialize(params);
  }
}

export class Tr extends Element {
  constructor(params) {
    super(params);
    this.tagName = "tr";
    this.initialize(params);
  }
}

export class Button extends Element {
  constructor(params) {
    super(params);
    this.tagName = "button";
    this.initialize(params);
  }
}

export class Datalist extends Element {
  constructor(params) {
    super(params);
    this.tagName = "datalist";
    this.initialize(params);
  }
}

export class Fieldset extends Element {
  constructor(params) {
    super(params);
    this.tagName = "fieldset";
    this.initialize(params);
  }
}

export class Form extends Element {
  constructor(params) {
    super(params);
    this.tagName = "form";

    // if no params, create an empty object
    if (!params) {
      params = {};
    }

    if (!params?.method) {
      params.method = "POST";
    }

    this.initialize(params);
  }
}

export class Input extends Element {
  constructor(params) {
    super(params);

    if (params.label) {
      // Set the tagName to "label" and create a child Input element
      this.tagName = "label";
      this.initialize(params.label);

      const paramsNoLabel = { ...params };
      delete paramsNoLabel.label;

      this.child = new Input({ ...paramsNoLabel });
    } else {
      // Set the tagName to "input"
      this.tagName = "input";
      this.initialize(params);
    }
  }
}

export class HiddenInput extends Input {
  constructor(params) {
    super(params);
    this.type = "hidden";
  }
}

export class TextInput extends Input {
  constructor(params) {
    super(params);
    this.type = "text";
  }
}

export class SearchInput extends Input {
  constructor(params) {
    super(params);
    this.type = "search";
  }
}

export class TelInput extends Input {
  constructor(params) {
    super(params);
    this.type = "tel";
  }
}

export class UrlInput extends Input {
  constructor(params) {
    super(params);
    this.type = "url";
  }
}

export class EmailInput extends Input {
  constructor(params) {
    super(params);
    this.type = "email";
  }
}

export class PasswordInput extends Input {
  constructor(params) {
    super(params);
    this.type = "password";
  }
}

export class DateInput extends Input {
  constructor(params) {
    super(params);
    this.type = "date";
  }
}

export class MonthInput extends Input {
  constructor(params) {
    super(params);
    this.type = "month";
  }
}

export class WeekInput extends Input {
  constructor(params) {
    super(params);
    this.type = "week";
  }
}

export class TimeInput extends Input {
  constructor(params) {
    super(params);
    this.type = "time";
  }
}

export class DatetimeLocalInput extends Input {
  constructor(params) {
    super(params);
    this.type = "datetime-local";
  }
}

export class NumberInput extends Input {
  constructor(params) {
    super(params);
    this.type = "number";
  }
}

export class RangeInput extends Input {
  constructor(params) {
    super(params);
    this.type = "range";
  }
}

export class ColorInput extends Input {
  constructor(params) {
    super(params);
    this.type = "color";
  }
}

export class CheckboxInput extends Input {
  constructor(params) {
    super(params);
    this.type = "checkbox";
  }
}

export class RadioInput extends Input {
  constructor(params) {
    params.type = "radio";
    super(params);
  }
}

export class FileInput extends Input {
  constructor(params) {
    super(params);
    this.type = "file";
  }
}

export class SubmitInput extends Input {
  constructor(params) {
    super(params);
    this.type = "submit";
  }
}

export class ImageInput extends Input {
  constructor(params) {
    super(params);
    this.type = "image";
  }
}

export class ResetInput extends Input {
  constructor(params) {
    super(params);
    this.type = "reset";
  }
}

export class ButtonInput extends Input {
  constructor(params) {
    super(params);
    this.type = "button";
  }
}

export class Label extends Element {
  constructor(params) {
    super(params);
    this.tagName = "label";
    this.initialize(params);
  }
}

export class Legend extends Element {
  constructor(params) {
    super(params);
    this.tagName = "legend";
    this.initialize(params);
  }
}

export class Meter extends Element {
  constructor(params) {
    super(params);
    this.tagName = "meter";
    this.initialize(params);
  }
}

export class Optgroup extends Element {
  constructor(params) {
    super(params);
    this.tagName = "optgroup";
    this.initialize(params);
  }
}

export class Option extends Element {
  constructor(params) {
    super(params);
    this.tagName = "option";
    this.initialize(params);
  }
}

export class Output extends Element {
  constructor(params) {
    super(params);
    this.tagName = "output";
    this.initialize(params);
  }
}

export class Progress extends Element {
  constructor(params) {
    super(params);
    this.tagName = "progress";
    this.initialize(params);
  }
}

export class Select extends Element {
  constructor(params) {
    super(params);
    this.tagName = "select";
    this.initialize(params);
  }
}

export class Textarea extends Element {
  constructor(params) {
    super(params);
    this.tagName = "textarea";
    this.initialize(params);
  }
}

export class Details extends Element {
  constructor(params) {
    super(params);
    this.tagName = "details";
    this.initialize(params);
  }
}

export class Dialog extends Element {
  constructor(params) {
    super(params);
    this.tagName = "dialog";
    this.initialize(params);
  }
}

export class Summary extends Element {
  constructor(params) {
    super(params);
    this.tagName = "summary";
    this.initialize(params);
  }
}

export class Slot extends Element {
  constructor(params) {
    super(params);
    this.tagName = "slot";
    this.initialize(params);
  }
}

export class Template extends Element {
  constructor(params) {
    super(params);
    this.tagName = "template";
    this.initialize(params);
  }
}

export class Svg extends Element {
  constructor(params) {
    super(params);
    this.tagName = "svg";
    this.initialize(params);
  }
}

export class Circle extends Element {
  constructor(params) {
    super(params);
    this.tagName = "circle";
    this.initialize(params);
  }
}

export class Ellipse extends Element {
  constructor(params) {
    super(params);
    this.tagName = "ellipse";
    this.initialize(params);
  }
}

export class Line extends Element {
  constructor(params) {
    super(params);
    this.tagName = "line";
    this.initialize(params);
  }
}

export class Path extends Element {
  constructor(params) {
    super(params);
    this.tagName = "path";
    this.initialize(params);
  }
}

export class Polygon extends Element {
  constructor(params) {
    super(params);
    this.tagName = "polygon";
    this.initialize(params);
  }
}

export class Polyline extends Element {
  constructor(params) {
    super(params);
    this.tagName = "polyline";
    this.initialize(params);
  }
}

export class Rect extends Element {
  constructor(params) {
    super(params);
    this.tagName = "rect";
    this.initialize(params);
  }
}

export class Text extends Element {
  constructor(params) {
    super(params);
    this.tagName = "text";
    this.initialize(params);
  }
}

export class Tspan extends Element {
  constructor(params) {
    super(params);
    this.tagName = "tspan";
    this.initialize(params);
  }
}

export class G extends Element {
  constructor(params) {
    super(params);
    this.tagName = "g";
    this.initialize(params);
  }
}

export class Defs extends Element {
  constructor(params) {
    super(params);
    this.tagName = "defs";
    this.initialize(params);
  }
}

export class LinearGradient extends Element {
  constructor(params) {
    super(params);
    this.tagName = "linearGradient";
    this.initialize(params);
  }
}

export class RadialGradient extends Element {
  constructor(params) {
    super(params);
    this.tagName = "radialGradient";
    this.initialize(params);
  }
}

export class Stop extends Element {
  constructor(params) {
    super(params);
    this.tagName = "stop";
    this.initialize(params);
  }
}

export class Use extends Element {
  constructor(params) {
    super(params);
    this.tagName = "use";
    this.initialize(params);
  }
}

export class Symbol extends Element {
  constructor(params) {
    super(params);
    this.tagName = "symbol";
    this.initialize(params);
  }
}

export class ClipPath extends Element {
  constructor(params) {
    super(params);
    this.tagName = "clipPath";
    this.initialize(params);
  }
}

export class Pattern extends Element {
  constructor(params) {
    super(params);
    this.tagName = "pattern";
    this.initialize(params);
  }
}

export class Mask extends Element {
  constructor(params) {
    super(params);
    this.tagName = "mask";
    this.initialize(params);
  }
}

export class Filter extends Element {
  constructor(params) {
    super(params);
    this.tagName = "filter";
    this.initialize(params);
  }
}

export class FeGaussianBlur extends Element {
  constructor(params) {
    super(params);
    this.tagName = "feGaussianBlur";
    this.initialize(params);
  }
}

export class FeOffset extends Element {
  constructor(params) {
    super(params);
    this.tagName = "feOffset";
    this.initialize(params);
  }
}

export class FeBlend extends Element {
  constructor(params) {
    super(params);
    this.tagName = "feBlend";
    this.initialize(params);
  }
}

export class FeColorMatrix extends Element {
  constructor(params) {
    super(params);
    this.tagName = "feColorMatrix";
    this.initialize(params);
  }
}

export class FeComponentTransfer extends Element {
  constructor(params) {
    super(params);
    this.tagName = "feComponentTransfer";
    this.initialize(params);
  }
}

export class FeComposite extends Element {
  constructor(params) {
    super(params);
    this.tagName = "feComposite";
    this.initialize(params);
  }
}

export class FeConvolveMatrix extends Element {
  constructor(params) {
    super(params);
    this.tagName = "feConvolveMatrix";
    this.initialize(params);
  }
}

export class FeDiffuseLighting extends Element {
  constructor(params) {
    super(params);
    this.tagName = "feDiffuseLighting";
    this.initialize(params);
  }
}

export class FeDisplacementMap extends Element {
  constructor(params) {
    super(params);
    this.tagName = "feDisplacementMap";
    this.initialize(params);
  }
}

export class FeFlood extends Element {
  constructor(params) {
    super(params);
    this.tagName = "feFlood";
    this.initialize(params);
  }
}

export class FeImage extends Element {
  constructor(params) {
    super(params);
    this.tagName = "feImage";
    this.initialize(params);
  }
}

export class FeMerge extends Element {
  constructor(params) {
    super(params);
    this.tagName = "feMerge";
    this.initialize(params);
  }
}

export class FeMorphology extends Element {
  constructor(params) {
    super(params);
    this.tagName = "feMorphology";
    this.initialize(params);
  }
}

export class FeSpecularLighting extends Element {
  constructor(params) {
    super(params);
    this.tagName = "feSpecularLighting";
    this.initialize(params);
  }
}

export class FeTile extends Element {
  constructor(params) {
    super(params);
    this.tagName = "feTile";
    this.initialize(params);
  }
}

export class FeTurbulence extends Element {
  constructor(params) {
    super(params);
    this.tagName = "feTurbulence";
    this.initialize(params);
  }
}

export class Math extends Element {
  constructor(params) {
    super(params);
    this.tagName = "math";
    this.initialize(params);
  }
}
