(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ReactionOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReactionOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/sessionStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ReactionOverlay() {
    _s();
    const lastReaction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])({
        "ReactionOverlay.useSessionStore[lastReaction]": (state)=>state.lastReaction
    }["ReactionOverlay.useSessionStore[lastReaction]"]);
    const [emojis, setEmojis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const prevReactionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const timeoutsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReactionOverlay.useEffect": ()=>{
            if (!lastReaction || lastReaction === prevReactionRef.current) return;
            prevReactionRef.current = lastReaction;
            const emojiChar = lastReaction.split("-")[0];
            const newId = Date.now();
            const duration = 2 + Math.random() * 2;
            const newEmoji = {
                id: newId,
                emoji: emojiChar,
                left: Math.random() * 90,
                duration: duration
            };
            requestAnimationFrame({
                "ReactionOverlay.useEffect": ()=>{
                    setEmojis({
                        "ReactionOverlay.useEffect": (prev)=>[
                                ...prev,
                                newEmoji
                            ]
                    }["ReactionOverlay.useEffect"]);
                }
            }["ReactionOverlay.useEffect"]);
            const timer = setTimeout({
                "ReactionOverlay.useEffect.timer": ()=>{
                    setEmojis({
                        "ReactionOverlay.useEffect.timer": (prev)=>prev.filter({
                                "ReactionOverlay.useEffect.timer": (e)=>e.id !== newId
                            }["ReactionOverlay.useEffect.timer"])
                    }["ReactionOverlay.useEffect.timer"]);
                }
            }["ReactionOverlay.useEffect.timer"], duration * 1000);
            timeoutsRef.current.add(timer);
            // PATCH: Copy ref to local variable for stable cleanup
            const currentTimeouts = timeoutsRef.current;
            return ({
                "ReactionOverlay.useEffect": ()=>{
                    currentTimeouts.forEach(clearTimeout);
                    currentTimeouts.clear();
                }
            })["ReactionOverlay.useEffect"];
        }
    }["ReactionOverlay.useEffect"], [
        lastReaction
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 pointer-events-none overflow-hidden z-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @keyframes float-up {
          0% { transform: translateY(100%) scale(0.5); opacity: 1; }
          100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
        }
        .animate-float {
          animation-name: float-up;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
      `
            }, void 0, false, {
                fileName: "[project]/src/components/ReactionOverlay.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            emojis.map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute bottom-0 text-4xl animate-float",
                    /* webhint: ignore inline-styles */ style: {
                        left: `${e.left}%`,
                        animationDuration: `${e.duration}s`
                    },
                    children: e.emoji
                }, e.id, false, {
                    fileName: "[project]/src/components/ReactionOverlay.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ReactionOverlay.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_s(ReactionOverlay, "ANFgTkq2rvc/t0+gWRYImzGKPpE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"]
    ];
});
_c = ReactionOverlay;
var _c;
__turbopack_context__.k.register(_c, "ReactionOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ReactionOverlay.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/ReactionOverlay.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_ReactionOverlay_tsx_7e2282a4._.js.map