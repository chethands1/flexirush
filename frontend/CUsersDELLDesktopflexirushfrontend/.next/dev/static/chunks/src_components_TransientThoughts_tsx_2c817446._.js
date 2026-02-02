(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/TransientThoughts.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TransientThoughts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function TransientThoughts({ responses }) {
    _s();
    const [bubbles, setBubbles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // PATCH: Tracking state to prevent render loops
    const processedCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const timeoutsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TransientThoughts.useEffect": ()=>{
            // 1. Safety Check: Only proceed if new responses have arrived
            if (responses.length <= processedCount.current) return;
            // 2. Data Extraction
            const newestText = responses[0];
            const newId = Date.now();
            const speed = 4 + Math.random() * 3;
            const newBubble = {
                id: newId,
                text: newestText,
                left: Math.random() * 80 + 10,
                speed: speed,
                scale: Math.random() * 0.3 + 0.9
            };
            // 3. PATCH: Use requestAnimationFrame to prevent cascading render warnings
            requestAnimationFrame({
                "TransientThoughts.useEffect": ()=>{
                    setBubbles({
                        "TransientThoughts.useEffect": (prev)=>[
                                ...prev,
                                newBubble
                            ]
                    }["TransientThoughts.useEffect"]);
                    processedCount.current = responses.length;
                }
            }["TransientThoughts.useEffect"]);
            // 4. Cleanup Timer: Fixed variable name to 'setBubbles'
            const timer = setTimeout({
                "TransientThoughts.useEffect.timer": ()=>{
                    setBubbles({
                        "TransientThoughts.useEffect.timer": (prev)=>prev.filter({
                                "TransientThoughts.useEffect.timer": (b)=>b.id !== newId
                            }["TransientThoughts.useEffect.timer"])
                    }["TransientThoughts.useEffect.timer"]);
                    timeoutsRef.current.delete(timer);
                }
            }["TransientThoughts.useEffect.timer"], speed * 1000);
            timeoutsRef.current.add(timer);
            // 5. PATCH: Capture the current ref value for stable cleanup
            const activeTimeouts = timeoutsRef.current;
            return ({
                "TransientThoughts.useEffect": ()=>{
                    activeTimeouts.forEach(clearTimeout);
                    activeTimeouts.clear();
                }
            })["TransientThoughts.useEffect"];
        }
    }["TransientThoughts.useEffect"], [
        responses
    ]); // Dependency on responses is sufficient with ref check
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full h-96 overflow-hidden bg-slate-900/50 rounded-xl border border-slate-700",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @keyframes floatUp {
          0% { transform: translateY(100%) scale(0.5); opacity: 0; }
          10% { opacity: 1; transform: translateY(0) scale(1); }
          90% { opacity: 1; }
          100% { transform: translateY(-400px) scale(1.5); opacity: 0; }
        }
        .animate-float-thought {
          animation-name: floatUp;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `
            }, void 0, false, {
                fileName: "[project]/src/components/TransientThoughts.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            bubbles.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute bottom-0 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 rounded-full text-white font-bold shadow-lg animate-float-thought whitespace-nowrap z-10",
                    style: {
                        left: `${b.left}%`,
                        animationDuration: `${b.speed}s`,
                        transform: `scale(${b.scale})`
                    },
                    children: b.text
                }, b.id, false, {
                    fileName: "[project]/src/components/TransientThoughts.tsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, this)),
            responses.length === 0 && bubbles.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 flex items-center justify-center text-slate-500 italic",
                children: "Waiting for audience thoughts..."
            }, void 0, false, {
                fileName: "[project]/src/components/TransientThoughts.tsx",
                lineNumber: 90,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/TransientThoughts.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_s(TransientThoughts, "TPnvE+T0BNCtDL4jgnrjG4Cr5ec=");
_c = TransientThoughts;
var _c;
__turbopack_context__.k.register(_c, "TransientThoughts");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/TransientThoughts.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/TransientThoughts.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_TransientThoughts_tsx_2c817446._.js.map