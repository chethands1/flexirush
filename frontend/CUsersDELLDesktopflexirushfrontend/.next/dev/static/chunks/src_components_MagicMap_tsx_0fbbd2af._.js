(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/MagicMap.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MagicMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/sessionStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function MagicMap() {
    _s();
    const { participants } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])();
    // FIX: Use deterministic "randomness" based on User ID.
    // This makes the function pure (Same Input = Same Output), satisfying the linter.
    const locations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MagicMap.useMemo[locations]": ()=>{
            return participants.map({
                "MagicMap.useMemo[locations]": (p)=>{
                    // Simple hash generation from string
                    let hash = 0;
                    for(let i = 0; i < p.id.length; i++){
                        hash = p.id.charCodeAt(i) + ((hash << 5) - hash);
                    }
                    // Map hash to coordinate ranges (Lat: -70 to 70, Lng: -180 to 180)
                    const lat = Math.abs(hash) % 140 - 70;
                    const lng = Math.abs(hash >> 16) % 360 - 180;
                    return {
                        id: p.id,
                        name: p.name,
                        lat,
                        lng
                    };
                }
            }["MagicMap.useMemo[locations]"]);
        }
    }["MagicMap.useMemo[locations]"], [
        participants
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full bg-slate-950 relative overflow-hidden flex items-center justify-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center",
                /* webhint: ignore inline-styles */ style: {
                    filter: "invert(1)"
                }
            }, void 0, false, {
                fileName: "[project]/src/components/MagicMap.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            locations.map((loc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out",
                    /* webhint: ignore inline-styles */ style: {
                        top: `${(loc.lat + 90) / 1.8}%`,
                        left: `${(loc.lng + 180) / 3.6}%`
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] animate-ping absolute"
                        }, void 0, false, {
                            fileName: "[project]/src/components/MagicMap.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-3 h-3 bg-white rounded-full relative z-10"
                        }, void 0, false, {
                            fileName: "[project]/src/components/MagicMap.tsx",
                            lineNumber: 52,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 bg-black/70 px-2 py-1 rounded text-xs font-bold text-white whitespace-nowrap z-20 backdrop-blur-sm border border-slate-700",
                            children: loc.name
                        }, void 0, false, {
                            fileName: "[project]/src/components/MagicMap.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this)
                    ]
                }, loc.id, true, {
                    fileName: "[project]/src/components/MagicMap.tsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, this)),
            locations.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "z-10 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-2xl font-bold text-slate-500",
                        children: "Waiting for signals..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/MagicMap.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-600",
                        children: "Audience locations will appear here."
                    }, void 0, false, {
                        fileName: "[project]/src/components/MagicMap.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/MagicMap.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/MagicMap.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s(MagicMap, "rG93EDodcb7BEYEDJZrRw0Uo9c8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"]
    ];
});
_c = MagicMap;
var _c;
__turbopack_context__.k.register(_c, "MagicMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/MagicMap.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/MagicMap.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_MagicMap_tsx_0fbbd2af._.js.map