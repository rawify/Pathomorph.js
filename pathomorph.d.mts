declare namespace Pathomorph {

    /**
     * Draws a straight line between two points.
     * @param p1 - start point
     * @param p2 - end point
     * @returns SVG path data string
     */
    function Line(p1: { ["x"]: number; ["y"]: number }, p2: { ["x"]: number; ["y"]: number }): string;

    /**
     * Draws an axis-aligned rectangle defined by two opposite corners.
     * @param p1 - one corner
     * @param p2 - opposite corner
     * @returns SVG path data string
     */
    function Rectangle(p1: { ["x"]: number; ["y"]: number }, p2: { ["x"]: number; ["y"]: number }): string;

    /**
     * Draws a full circle.
     * @param center - circle center
     * @param radius - circle radius
     * @returns SVG path data string
     */
    function Circle(center: { ["x"]: number; ["y"]: number }, radius: number): string;

    /**
     * Draws a full ellipse.
     * @param center - ellipse center
     * @param rx - horizontal radius
     * @param ry - vertical radius
     * @param rotation - rotation angle in degrees
     * @returns SVG path data string
     */
    function Ellipse(
        center: { ["x"]: number; ["y"]: number },
        rx: number,
        ry: number,
        rotation?: number
    ): string;

    /**
     * Draws an arc segment between two angles.
     * @param center - arc center
     * @param radius - arc radius
     * @param startAngle - start angle in radians
     * @param endAngle - end angle in radians
     * @returns SVG path data string
     */
    function Arc(
        center: { ["x"]: number; ["y"]: number },
        radius: number,
        startAngle?: number,
        endAngle?: number
    ): string;

    /**
     * Draws a polyline through an array of points.
     * @param pts - point list
     * @returns SVG path data string
     */
    function Polyline(pts: Array<{ ["x"]: number; ["y"]: number }>): string;

    /**
     * Closes a polyline to form a polygon.
     * @param pts - point list
     * @returns SVG path data string
     */
    function Polygon(pts: Array<{ ["x"]: number; ["y"]: number }>): string;

    /**
     * Draws a rounded rectangle between two corners.
     * @param p1 - top-left corner
     * @param p2 - bottom-right corner
     * @param rx - corner radius x
     * @param ry - corner radius y
     * @returns SVG path data string
     */
    function RoundedRect(
        p1: { ["x"]: number; ["y"]: number },
        p2: { ["x"]: number; ["y"]: number },
        rx?: number,
        ry?: number
    ): string;

    /**
     * Offsets the endpoints of a line segment.
     * @param a - start point
     * @param b - end point
     * @param offsetA - inset distance from a
     * @param offsetB - inset distance from b
     * @returns SVG path data string or empty if invalid
     */
    function LineOffset(
        a: { ["x"]: number; ["y"]: number },
        b: { ["x"]: number; ["y"]: number },
        offsetA?: number,
        offsetB?: number
    ): string;

    /**
     * Draws a cubic bezier that bows horizontally.
     * @param p1 - start point
     * @param p2 - end point
     * @returns SVG path data string
     */
    function CurvedHorizontalLine(
        p1: { ["x"]: number; ["y"]: number },
        p2: { ["x"]: number; ["y"]: number }
    ): string;

    /**
     * Draws a cubic bezier that bows vertically.
     * @param p1 - start point
     * @param p2 - end point
     * @returns SVG path data string
     */
    function CurvedVerticalLine(
        p1: { ["x"]: number; ["y"]: number },
        p2: { ["x"]: number; ["y"]: number }
    ): string;

    /**
     * Draws an organic 2D bezier curve between two points.
     * @param a - start point
     * @param b - end point
     * @param curvature - bend amount (0 = straight line)
     * @returns SVG path data string
     */
    function CurvedLine(
        a: { ["x"]: number; ["y"]: number },
        b: { ["x"]: number; ["y"]: number },
        curvature?: number
    ): string;

    /**
     * Creates an arrowhead at point b pointing from a to b.
     * @param a - tail point
     * @param b - head point
     * @returns SVG path data string
     */
    function ArrowTip(
        a: { ["x"]: number; ["y"]: number },
        b: { ["x"]: number; ["y"]: number }
    ): string;

    /**
     * Inserts a rounded fillet at B between segments A→B and B→C.
     * @param A - first segment start
     * @param B - corner point
     * @param C - second segment end
     * @param r - fillet radius
     * @returns SVG path data string
     */
    function FilletCorner(
        A: { ["x"]: number; ["y"]: number },
        B: { ["x"]: number; ["y"]: number },
        C: { ["x"]: number; ["y"]: number },
        r: number
    ): string;

    /**
     * Draws only a fraction of a polyline path.
     * @param path - full point list
     * @param pct - portion [0,1]
     * @returns SVG path data string
     */
    function PartialPolyline(
        path: Array<{ ["x"]: number; ["y"]: number }>,
        pct: number
    ): string;

    /**
     * Draws a thick arc with rounded caps.
     * @param center - ring center
     * @param radius - midline radius
     * @param thickness - full thickness
     * @param startAngle - start radian
     * @param endAngle - end radian
     * @returns SVG path data string
     */
    function RingSegment(
        center: { ["x"]: number; ["y"]: number },
        radius: number,
        thickness: number,
        startAngle?: number,
        endAngle?: number
    ): string;
}

export default Pathomorph;
