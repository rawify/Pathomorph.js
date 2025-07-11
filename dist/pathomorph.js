'use strict';
const Vector2 = require('vector2');

const TAU = 2 * Math.PI;
const EPS = 1e-6;

const Pathomorph = {

    /**
     * Draws a straight line between two points.
     * @param {{"x":number,"y":number}} p1 - start point
     * @param {{"x":number,"y":number}} p2 - end point
     * @returns {string} SVG path data
     */
    "Line": ({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
        `M${x1} ${y1}L${x2} ${y2}`,

    /**
     * Draws an axis-aligned rectangle defined by two opposite corners.
     * @param {{"x":number,"y":number}} p1 - one corner
     * @param {{"x":number,"y":number}} p2 - opposite corner
     * @returns {string} SVG path data
     */
    "Rectangle": ({ x: x1, y: y1 }, { x: x2, y: y2 }) => // from 2 points
        `M${x1} ${y1}L${x1} ${y2}L${x2} ${y2}L${x2} ${y1}z`,

    /**
     * Draws a full circle.
     * @param {{"x":number,"y":number}} center - circle center
     * @param {number} radius - circle radius
     * @returns {string} SVG path data
     */
    "Circle": (center, radius) =>
        Pathomorph['Ellipse'](center, radius, radius),

    /**
     * Draws a full ellipse.
     * @param {{"x":number,"y":number}} center - ellipse center
     * @param {number} rx - horizontal radius
     * @param {number} ry - vertical radius
     * @param {number} [rotation=0] - rotation angle in degrees
     * @returns {string} SVG path data
     */
    "Ellipse": ({ x: cx, y: cy }, rx, ry, rotation = 0) => {

        const startX = cx - rx;
        const startY = cy;

        const endX = cx + rx;
        const endY = cy;

        return `M ${startX} ${startY}` +
            `A ${rx} ${ry} ${rotation} 0 1 ${endX} ${endY}` +
            `A ${rx} ${ry} ${rotation} 0 1 ${startX} ${startY}`
    },

    /**
     * Draws an arc segment between two angles.
     * @param {{"x":number,"y":number}} center - arc center
     * @param {number} radius - arc radius
     * @param {number} [startAngle=0] - start angle in radians
     * @param {number} [endAngle=TAU] - end angle in radians
     * @returns {string} SVG path data
     */
    "Arc": ({ x: centerX, y: centerY }, radius, startAngle = 0, endAngle = TAU) => { //

        const start = {
            "x": centerX + radius * Math.cos(startAngle),
            "y": centerY + radius * Math.sin(startAngle)
        };

        const end = {
            "x": centerX + radius * Math.cos(endAngle),
            "y": centerY + radius * Math.sin(endAngle)
        };

        let delta = (endAngle - startAngle) % TAU;
        if (delta < 0) delta += TAU;

        if (Math.abs(delta) < EPS || Math.abs(delta - TAU) < EPS) {
            return `M ${start['x']} ${start['y']} A ${radius} ${radius} 0 1 1 ${centerX - radius} ${centerY} A ${radius} ${radius} 0 1 1 ${start['x']} ${start['y']}z`;
        }

        const largeArcFlag = delta > Math.PI ? 1 : 0;
        const sweepFlag = 1;

        return `M ${start['x']} ${start['y']} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end['x']} ${end['y']}`;
    },

    /**
     * Draws a polyline through an array of points.
     * @param {Array<{"x":number,"y":number}>} pts - point list
     * @returns {string} SVG path data
     */
    "Polyline": (pts) => {
        if (pts.length < 2) return '';

        let p = "M";
        for (let i = 0; i < pts.length; i++) {
            if (i > 0)
                p += "L";
            p += pts[i]['x'];
            p += " ";
            p += pts[i]['y'];
        }
        return p;
    },

    /**
     * Closes a polyline to form a polygon.
     * @param {Array<{"x":number,"y":number}>} pts - point list
     * @returns {string} SVG path data
     */
    "Polygon": (pts) =>
        Pathomorph['Polyline'](pts) + "z",

    /**
     * Draws a rounded rectangle between two corners.
     * @param {{"x":number,"y":number}} p1 - top-left corner
     * @param {{"x":number,"y":number}} p2 - bottom-right corner
     * @param {number} [rx=0] - corner radius x
     * @param {number} [ry=0] - corner radius y
     * @returns {string} SVG path data
     */
    "RoundedRect": ({ x: x1, y: y1 }, { x: x2, y: y2 }, rx = 0, ry = 0) =>
        `M${x1} ${y2 - ry}` +
        `A ${rx} ${ry} 0 0 0 ${x1 + rx} ${y2}` +
        `L${x2 - rx} ${y2}` +
        `A ${rx} ${ry} 0 0 0 ${x2} ${y2 - ry}` +
        `L${x2} ${y1 + ry}` +
        `A ${rx} ${ry} 0 0 0 ${x2 - rx} ${y1}` +
        `L${x1 + rx} ${y1}` +
        `A ${rx} ${ry} 0 0 0 ${x1} ${y1 + ry}z`,

    /**
     * Offsets the endpoints of a line segment.
     * @param {{"x":number,"y":number}} a - start point
     * @param {{"x":number,"y":number}} b - end point
     * @param {number} [offsetA=0] - inset distance from a
     * @param {number} [offsetB=0] - inset distance from b
     * @returns {string} SVG path data or empty if invalid
     */
    "LineOffset": (a, b, offsetA = 0, offsetB = 0) => {
        const v = Vector2['fromPoints'](a, b);
        const len = v['norm']();
        if (offsetA + offsetB >= len || len === 0) return "";

        const u = v.scale(1 / len);
        return Pathomorph['Line'](
            { "x": a['x'] + u['x'] * offsetA, "y": a['y'] + u['y'] * offsetA },
            { "x": b['x'] - u['x'] * offsetB, "y": b['y'] - u['y'] * offsetB });
    },

    /**
     * Draws a cubic bezier that bows horizontally.
     * @param {{"x":number,"y":number}} p1 - start
     * @param {{"x":number,"y":number}} p2 - end
     * @returns {string} SVG path data
     */
    "CurvedHorizontalLine": ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
        const mx = x1 + (x2 - x1) / 2;
        return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
    },

    /**
     * Draws a cubic bezier that bows vertically.
     * @param {{"x":number,"y":number}} p1 - start
     * @param {{"x":number,"y":number}} p2 - end
     * @returns {string} SVG path data
     */
    "CurvedVerticalLine": ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
        const my = y1 + (y2 - y1) / 2;
        return `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`;
    },

    /**
     * Draws an organic 2D bezier curve between two points.
     * @param {{"x":number,"y":number}} a - start
     * @param {{"x":number,"y":number}} b - end
     * @param {number} [curvature=0.5] - bend amount
     * @returns {string} SVG path data
     */
    "CurvedLine": (a, b, curvature = 0.5) => {

        let v = Vector2['fromPoints'](a, b);
        const len = v['norm']();

        if (!len) return "";

        v = v['scale'](1 / len);

        const p = v['perp']();
        const d = len * curvature;

        return `M${a['x']} ${a['y']}` +
            `C${a['x'] + (p['x'] + v['x']) * d} ${a['y'] + (p['y'] + v['y']) * d}` +
            ` ${b['x'] + (p['x'] - v['x']) * d} ${b['y'] + (p['y'] - v['y']) * d}` +
            ` ${b['x']} ${b['y']}`;
    },

    /**
     * Creates an arrowhead at point b pointing from a to b.
     * @param {{"x":number,"y":number}} a - tail point
     * @param {{"x":number,"y":number}} b - head point
     * @returns {string} SVG path data
     */
    "ArrowTip": (a, b) => {
        const v = Vector2['fromPoints'](a, b)['normalize']()['scale'](-6);
        const featherCut = 0.75;
        const C = 0.951057, S = 0.309017; // sin/cos of theta = Math.PI / 10 = 18°

        /*
        const p1 = v.rotate(theta).add(b);
        const p2 = v.scale(featherCut).add(b);
        const p3 = v.rotate(-theta).add(b);
        */
        const p1x = b['x'] + C * v['x'] - S * v['y'];
        const p1y = b['y'] + S * v['x'] + C * v['y'];

        const p2x = b['x'] + v['x'] * featherCut;
        const p2y = b['y'] + v['y'] * featherCut;

        const p3x = b['x'] + C * v['x'] + S * v['y'];
        const p3y = b['y'] - S * v['x'] + C * v['y'];

        return `M${b['x']} ${b['y']}L${p1x} ${p1y}L${p2x} ${p2y}L${p3x} ${p3y}Z`;
    },

    /**
     * Inserts a rounded fillet at B between segments A→B and B→C.
     * @param {{"x":number,"y":number}} A - first segment start
     * @param {{"x":number,"y":number}} B - corner point
     * @param {{"x":number,"y":number}} C - second segment end
     * @param {number} r - fillet radius
     * @returns {string} SVG path data
     */
    "FilletCorner": (A, B, C, r) => {

        // https://raw.org/proof/rounded-corners-on-path-segment/

        const a = Vector2['fromPoints'](B, A)['normalize']();
        const b = Vector2['fromPoints'](B, C)['normalize']();

        // const w = r * Math.sqrt(1 + a.dot(b)) / Math.sqrt(1 - a.dot(b));
        const w = r * Math.sqrt(2 / (1 - a['dot'](b)) - 1);

        // compute the two tangent points
        const X = a['scale'](w)['add'](B);
        const Y = b['scale'](w)['add'](B);

        // choose sweep flag based on orientation
        const sweep = a['cross'](b) < 0 ? 1 : 0;

        return (
            `M${A.x} ${A.y}` +
            `L${X.x} ${X.y}` +
            `A${r} ${r} 0 0 ${sweep} ${Y.x} ${Y.y}` +
            `L${C.x} ${C.y}`);
    },

    /**
     * Draws only a fraction of a polyline path.
     * @param {Array<{"x":number,"y":number}>} path - full point list
     * @param {number} pct - portion [0,1]
     * @returns {string} SVG path data
     */
    "PartialPolyline": (path, pct) => {
        if (path.length < 2) return '';

        const segmentLengths = [];
        let total = 0;

        for (let i = 1; i < path.length; i++) {
            const segmentLength = Math.hypot(
                path[i]['x'] - path[i - 1]['x'],
                path[i]['y'] - path[i - 1]['y']);
            total += segmentLength;
            segmentLengths.push(segmentLength);
        }

        let rem = pct * total;
        let ret = `M${path[0]['x']} ${path[0]['y']}`;

        for (let i = 1; i < path.length; i++) {

            const segmentLength = segmentLengths[i - 1];
            const a = path[i - 1], b = path[i];

            if (segmentLength <= rem) {
                ret += `L${b['x']} ${b['y']}`;
                rem -= segmentLength;
            } else {
                const t = rem / segmentLength;
                const x = a['x'] + t * (b['x'] - a['x']);
                const y = a['y'] + t * (b['y'] - a['y']);
                ret += `L${x} ${y}`;
                break;
            }
        }
        return ret;
    },

    /**
     * Draws a thick arc with rounded caps.
     * @param {{"x":number,"y":number}} center - ring center
     * @param {number} radius - midline radius
     * @param {number} thickness - full thickness
     * @param {number} [startAngle=0] - start radian
     * @param {number} [endAngle=TAU]   - end radian
     * @returns {string} SVG path data
     */
    "RingSegment": ({ x, y }, radius, thickness, startAngle = 0, endAngle = TAU) => {

        const half = thickness / 2;

        // Inner and outer radii:
        const r0 = radius - half;
        const r1 = radius + half;

        // Compute the four key points at the true start/end angles:
        const sin1 = Math.sin(startAngle), cos1 = Math.cos(startAngle);
        const sin2 = Math.sin(endAngle), cos2 = Math.cos(endAngle);

        const p0 = { x: x + r0 * cos1, y: y + r0 * sin1 }; // inner start
        const p1 = { x: x + r0 * cos2, y: y + r0 * sin2 }; // inner end
        const p2 = { x: x + r1 * cos2, y: y + r1 * sin2 }; // outer end
        const p3 = { x: x + r1 * cos1, y: y + r1 * sin1 }; // outer start

        let delta = (endAngle - startAngle) % TAU;
        if (delta < 0) delta += TAU;
        const largeArc = delta > Math.PI ? 1 : 0;

        return (
            `M${p0.x} ${p0.y}` +
            `A${r0} ${r0} 0 ${largeArc} 1 ${p1.x} ${p1.y}` + // Inner arc to inner end
            `A${half} ${half} 0 0 0 ${p2.x} ${p2.y}` +       // Cap at the outer radius
            `A${r1} ${r1} 0 ${largeArc} 0 ${p3.x} ${p3.y}` + // Outer arc back to outer start
            `A${half} ${half} 0 0 0 ${p0.x} ${p0.y}` +       // Cap back to inner start and close
            `Z`);
    }
};

Object.defineProperty(Pathomorph, "__esModule", { 'value': true });
Pathomorph['default'] = Pathomorph;
Pathomorph['Pathomorph'] = Pathomorph;
module['exports'] = Pathomorph;
