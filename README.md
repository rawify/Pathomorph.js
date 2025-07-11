# Pathomorph.js

[![NPM Package](https://img.shields.io/npm/v/pathomorph.svg?style=flat)](https://npmjs.org/package/pathomorph "View this project on npm")
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

> Convert and construct SVG path data programmatically.

Pathomorph is a compact utility for generating SVG path strings from geometric primitives and curves. It offers both transformation routines—such as converting rectangles or circles to path data and on the other hand path construction helpers like curved connectors, arrows, and rounded corners.

Rather than managing arc commands, sweep flags, or Bézier curves manually, Pathomorph provides simple function calls that generate valid SVG path `d` attributes.

---

## Example

```html
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <path id="rounded" stroke="#3498db" fill="none" stroke-width="4"/>
  <path id="connector" stroke="#e74c3c" fill="none" stroke-width="3"/>
  <path id="arrow" stroke="#2ecc71" fill="none" stroke-width="2"/>
</svg>

<script type="module">
  import Pathomorph from 'pathomorph';

  const p1 = { x: 20, y: 20 };
  const p2 = { x: 180, y: 120 };
  const from = { x: 30, y: 150 };
  const to = { x: 250, y: 50 };

  document.getElementById('rounded')
    .setAttribute('d', Pathomorph.RoundedRect(p1, p2, 15, 15));

  document.getElementById('connector')
    .setAttribute('d', Pathomorph.CurvedLine(from, to, 0.4));

  document.getElementById('arrow')
    .setAttribute('d', Pathomorph.ArrowTip(from, to));
</script>
````

---

## Installation

You can install `Pathomorph.js` via npm:

```bash
npm install pathomorph
```

Or with yarn:

```bash
yarn add pathomorph
```

Alternatively, download or clone the repository:

```bash
git clone https://github.com/rawify/Pathomorph.js
```

**Browser**

```html
<script src="js/pathomorph.min.js"></script>
<!-- Access via global `Pathomorph` -->
```

---

## API Documentation

All functions return a string suitable for use as an SVG path `d` attribute.

---

### Line(p1, p2)

Creates a straight line.

![](image/line.jpg)

```js
Pathomorph.Line({ x: 0, y: 0 }, { x: 100, y: 0 })
// → "M0 0L100 0"
```

---

### LineOffset(p1, p2, offsetA = 0, offsetB = 0)

Creates a line shortened on both ends by fixed distances.

![](image/lineoff.jpg)

* Useful for offsetting lines for arrows or gaps.
* Returns `""` if offsets exceed length.

---

### Rectangle(p1, p2)

Generates a rectangular path between two diagonal points.

![](image/rectangle.jpg)

---

### Circle(center, radius)

Shortcut for `Ellipse(center, radius, radius)`. Produces a circular path.

![](image/circle.jpg)

---

### Ellipse(center, rx, ry, rotation = 0)

Draws a full ellipse using two 180° arc segments.

![](image/ellipse.jpg)

---

### Arc(center, radius, startAngle = 0, endAngle = TAU)

Draws a circular arc from `startAngle` to `endAngle`. Handles full circles automatically.

![](image/arc.jpg)

---

### Polyline(points)

Connects a series of points with straight lines.

![](image/polyline.jpg)

---

### Polygon(points)

Same as `Polyline` but closes the shape with a `"z"` command.

![](image/polygon.jpg)

---

### RoundedRect(p1, p2, rx = 0, ry = 0)

Creates a rectangle with rounded corners. The rounding radii are clamped automatically if too large.

![](image/roundrect.jpg)

---

### CurvedHorizontalLine(p1, p2)

Creates a horizontal S-curve between two points using a cubic Bézier.

![](image/curvedH.jpg)

---

### CurvedVerticalLine(p1, p2)

Same as `CurvedHorizontalLine` but curves vertically.

![](image/curvedV.jpg)

---

### CurvedLine(a, b, curvature = 0.5)

Draws a cubic Bézier from `a` to `b`, with curvature perpendicular to the line direction.

* `curvature` controls bend magnitude (positive = right-turn from A→B)

![](image/curvedline.jpg)

---

### ArrowTip(a, b)

Draws an arrowhead at `b`, pointing from `a` to `b`.

* Returns a closed path suitable for filling.

![](image/arrowtip.jpg)

---

### FilletCorner(A, B, C, radius)

Rounds the corner at `B` (where A→B→C forms a bend) with a circular arc of given `radius`.

* Automatically picks sweep direction.

![](image/fillet.jpg)

---

### PartialPolyline(points, fraction)

Draws a partial polyline (first `fraction` ∈ \[0,1] of total length).

* Useful for animation or stroke-drawing effects.

![](image/partial.jpg)

---

### RingSegment(center, radius, thickness, startAngle, endAngle)

Draws a donut slice (thick circular arc), capped at both ends with rounded edges.

![](image/ringsegment.jpg)

---


## Coding Style

As every library I publish, Pathomorph.js is also built to be as small as possible after compressing it with Google Closure Compiler in advanced mode. Thus the coding style orientates a little on maxing-out the compression rate. Please make sure you keep this style if you plan to extend the library.

## Building the library

After cloning the Git repository run:

```
npm install
npm run build
```

## Copyright and Licensing

Copyright (c) 2025, [Robert Eisele](https://raw.org/)
Licensed under the MIT license.
