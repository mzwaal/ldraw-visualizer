/// <reference path="../../typings/references.ts" />
var LdrawVisualizer;
(function (LdrawVisualizer) {
    var Renderer;
    (function (Renderer) {
        (function (Face3Edge) {
            Face3Edge[Face3Edge["AB"] = 0] = "AB";
            Face3Edge[Face3Edge["BC"] = 1] = "BC";
            Face3Edge[Face3Edge["CA"] = 2] = "CA";
        })(Renderer.Face3Edge || (Renderer.Face3Edge = {}));
        var Face3Edge = Renderer.Face3Edge;
        var EdgeMap = (function () {
            function EdgeMap() {
                // how close the vertices must be to be considered the same point
                this.precision = 10000;
                // a map of edge keys to faces.
                this.map = {};
            }
            // adds all of the faces in the geometry to the map, indexed by their edges.
            // note each face will appear in the internal map 3 times, once for each of its edges
            EdgeMap.prototype.addGeometry = function (geometry) {
                var _this = this;
                geometry.faces.forEach(function (f) {
                    [
                        { vertex1Index: f.a, vertex2Index: f.b },
                        { vertex1Index: f.b, vertex2Index: f.c },
                        { vertex1Index: f.c, vertex2Index: f.a }
                    ].forEach(function (edge, index) {
                        var edge1MapKey = _this.getMapKey(geometry.vertices[edge.vertex1Index], geometry.vertices[edge.vertex2Index]);
                        if (!_this.map[edge1MapKey]) {
                            _this.map[edge1MapKey] = {};
                        }
                        var entry = _this.map[edge1MapKey];
                        if (!entry.face1) {
                            entry.face1 = f;
                            entry.face1SharedEdge = index;
                        }
                        else if (!entry.face2) {
                            entry.face2 = f;
                            entry.face2SharedEdge = index;
                        }
                        else {
                            console.log('More than two faces share an edge.  Unable to smooth more than two faces.  This additional face has been ignored. map key: ' + edge1MapKey);
                        }
                    });
                });
            };
            // returns any faces that contain an edge defined by the given vertices
            EdgeMap.prototype.getFaces = function (vertex1, vertex2) {
                var foundContainer = this.map[this.getMapKey(vertex1, vertex2)];
                if (foundContainer && foundContainer.face1 && foundContainer.face2) {
                    return foundContainer;
                }
                else {
                    return;
                }
            };
            // returns an order-independent string key based on all six data points of the two vertices
            EdgeMap.prototype.getMapKey = function (vertexA, vertexB) {
                var first, second;
                if (vertexA.x < vertexB.x) {
                    first = vertexA;
                    second = vertexB;
                }
                else if (vertexA.x > vertexB.x) {
                    first = vertexB;
                    second = vertexA;
                }
                else {
                    if (vertexA.y < vertexB.y) {
                        first = vertexA;
                        second = vertexB;
                    }
                    else if (vertexA.y > vertexB.y) {
                        first = vertexB;
                        second = vertexA;
                    }
                    else {
                        if (vertexA.z < vertexB.z) {
                            first = vertexA;
                            second = vertexB;
                        }
                        else if (vertexA.z > vertexB.z) {
                            first = vertexB;
                            second = vertexA;
                        }
                        else {
                            // they're the same point
                            first = vertexA;
                            second = vertexB;
                        }
                    }
                }
                return [Math.round(first.x * this.precision),
                    Math.round(first.y * this.precision),
                    Math.round(first.z * this.precision),
                    Math.round(second.x * this.precision),
                    Math.round(second.y * this.precision),
                    Math.round(second.z * this.precision)].join('|');
            };
            return EdgeMap;
        })();
        Renderer.EdgeMap = EdgeMap;
    })(Renderer = LdrawVisualizer.Renderer || (LdrawVisualizer.Renderer = {}));
})(LdrawVisualizer || (LdrawVisualizer = {}));
//# sourceMappingURL=EdgeMap.js.map