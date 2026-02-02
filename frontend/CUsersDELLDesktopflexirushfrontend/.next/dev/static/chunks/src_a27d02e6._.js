(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/store/sessionStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSessionStore",
    ()=>useSessionStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const useSessionStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        isConnected: false,
        participants: [],
        currentPoll: null,
        questions: [],
        lastReaction: null,
        quiz: null,
        quizScores: {},
        locations: [],
        setConnectionStatus: (status)=>set({
                isConnected: status
            }),
        setParticipants: (names)=>set({
                participants: names
            }),
        setPoll: (poll)=>set({
                currentPoll: poll
            }),
        setQuestions: (qs)=>set({
                questions: qs
            }),
        triggerReaction: (emoji)=>set({
                lastReaction: `${emoji}-${Date.now()}`
            }),
        setQuiz: (quiz, scores)=>set((state)=>({
                    quiz,
                    quizScores: scores || state.quizScores
                })),
        // <--- Action
        setLocations: (locs)=>set({
                locations: locs
            })
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useRealtime.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useRealtime",
    ()=>useRealtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/sessionStore.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
function useRealtime(sessionCode) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(4);
    if ($[0] !== "fb455ab52b820662476f97cc7d00264c178a7aba2030bceee8718b44a93c6bd3") {
        for(let $i = 0; $i < 4; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "fb455ab52b820662476f97cc7d00264c178a7aba2030bceee8718b44a93c6bd3";
    }
    const ws = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    let t0;
    let t1;
    if ($[1] !== sessionCode) {
        t0 = ({
            "useRealtime[useEffect()]": ()=>{
                if (!sessionCode) {
                    return;
                }
                const connect = {
                    "useRealtime[useEffect() > connect]": ()=>{
                        const wsUrl = `ws://localhost:8001/ws/${sessionCode}/presenter`;
                        ws.current = new WebSocket(wsUrl);
                        ws.current.onopen = ()=>{
                            console.log("\u2705 WebSocket Connected");
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"].getState().setConnectionStatus(true);
                            fetch(`http://localhost:8001/api/session/${sessionCode}/state`).then(_useRealtimeUseEffectConnectAnonymousAnonymous).then(_useRealtimeUseEffectConnectAnonymousAnonymous2).catch(_useRealtimeUseEffectConnectAnonymousAnonymous3);
                        };
                        ws.current.onmessage = _temp;
                        ws.current.onclose = ()=>{
                            console.log("\u274C WebSocket Disconnected");
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"].getState().setConnectionStatus(false);
                            setTimeout(connect, 3000);
                        };
                    }
                }["useRealtime[useEffect() > connect]"];
                connect();
                return ()=>{
                    ws.current?.close();
                };
            }
        })["useRealtime[useEffect()]"];
        t1 = [
            sessionCode
        ];
        $[1] = sessionCode;
        $[2] = t0;
        $[3] = t1;
    } else {
        t0 = $[2];
        t1 = $[3];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t0, t1);
}
_s(useRealtime, "ACfmnhMR+o55bWuVwUxYindyVBE=");
function _temp(event) {
    const data_0 = JSON.parse(event.data);
    console.log("\uD83D\uDCE9 WS Msg:", data_0.type);
    bb23: switch(data_0.type){
        case "POLL_START":
        case "POLL_UPDATE":
            {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"].getState().setPoll(data_0.payload);
                break bb23;
            }
        case "QNA_UPDATE":
            {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"].getState().setQuestions(data_0.payload);
                break bb23;
            }
        case "PARTICIPANT_UPDATE":
            {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"].getState().setParticipants(data_0.names);
                if (data_0.locations) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"].getState().setLocations(data_0.locations);
                }
                break bb23;
            }
        case "REACTION":
            {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"].getState().triggerReaction(data_0.emoji);
                break bb23;
            }
        case "QUIZ_UPDATE":
            {
                if (data_0.payload.quiz) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"].getState().setQuiz(data_0.payload.quiz, data_0.payload.scores);
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"].getState().setQuiz(data_0.payload);
                }
            }
    }
}
function _useRealtimeUseEffectConnectAnonymousAnonymous3(err) {
    return console.error("State sync failed", err);
}
function _useRealtimeUseEffectConnectAnonymousAnonymous2(data) {
    if (data.current_poll) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"].getState().setPoll(data.current_poll);
    }
    if (data.questions) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"].getState().setQuestions(data.questions);
    }
    if (data.participants) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"].getState().setParticipants(data.participants);
    }
    if (data.quiz) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"].getState().setQuiz(data.quiz, data.quiz_scores);
    }
    if (data.locations) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"].getState().setLocations(data.locations);
    }
}
function _useRealtimeUseEffectConnectAnonymousAnonymous(res) {
    return res.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/CreatePollForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CreatePollForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function CreatePollForm(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(38);
    if ($[0] !== "a113d6b757d91600722960691608e2c8cf5d6ddea3162362751b95c5eb539e88") {
        for(let $i = 0; $i < 38; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "a113d6b757d91600722960691608e2c8cf5d6ddea3162362751b95c5eb539e88";
    }
    const { sessionCode, onClose } = t0;
    const [question, setQuestion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [type, setType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("multiple_choice");
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = [
            "",
            ""
        ];
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const [options, setOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t2;
    if ($[2] !== onClose || $[3] !== options || $[4] !== question || $[5] !== sessionCode || $[6] !== type) {
        t2 = ({
            "CreatePollForm[handleSubmit]": async ()=>{
                if (!question) {
                    return;
                }
                const payload = {
                    question,
                    type
                };
                if (type === "multiple_choice") {
                    payload.options = options.filter(_CreatePollFormHandleSubmitOptionsFilter);
                    if (payload.options.length < 2) {
                        return alert("Add at least 2 options");
                    }
                }
                setLoading(true);
                await fetch(`http://localhost:8001/api/session/${sessionCode}/poll/start`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
                onClose();
            }
        })["CreatePollForm[handleSubmit]"];
        $[2] = onClose;
        $[3] = options;
        $[4] = question;
        $[5] = sessionCode;
        $[6] = type;
        $[7] = t2;
    } else {
        t2 = $[7];
    }
    const handleSubmit = t2;
    let t3;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-xl font-bold mb-4",
            children: "Launch Widget"
        }, void 0, false, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 68,
            columnNumber: 10
        }, this);
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    let t4;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = [
            {
                id: "multiple_choice",
                label: "\uD83D\uDCCA Poll"
            },
            {
                id: "rating",
                label: "\u2B50 Rating"
            },
            {
                id: "word_cloud",
                label: "\u2601\uFE0F Word Cloud"
            }
        ];
        $[9] = t4;
    } else {
        t4 = $[9];
    }
    let t5;
    if ($[10] !== type) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-2 mb-4",
            children: t4.map({
                "CreatePollForm[(anonymous)()]": (t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "CreatePollForm[(anonymous)() > <button>.onClick]": ()=>setType(t.id)
                        }["CreatePollForm[(anonymous)() > <button>.onClick]"],
                        className: `flex-1 py-2 text-sm rounded-lg border ${type === t.id ? "bg-blue-600 border-blue-500" : "bg-slate-800 border-slate-700 text-slate-400"}`,
                        children: t.label
                    }, t.id, false, {
                        fileName: "[project]/src/components/CreatePollForm.tsx",
                        lineNumber: 92,
                        columnNumber: 47
                    }, this)
            }["CreatePollForm[(anonymous)()]"])
        }, void 0, false, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 91,
            columnNumber: 10
        }, this);
        $[10] = type;
        $[11] = t5;
    } else {
        t5 = $[11];
    }
    let t6;
    if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = ({
            "CreatePollForm[<input>.onChange]": (e)=>setQuestion(e.target.value)
        })["CreatePollForm[<input>.onChange]"];
        $[12] = t6;
    } else {
        t6 = $[12];
    }
    let t7;
    if ($[13] !== question) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            className: "w-full bg-slate-800 border border-slate-700 p-3 rounded-lg mb-4 text-white",
            placeholder: "Ask a question...",
            value: question,
            onChange: t6
        }, void 0, false, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 112,
            columnNumber: 10
        }, this);
        $[13] = question;
        $[14] = t7;
    } else {
        t7 = $[14];
    }
    let t8;
    if ($[15] !== options || $[16] !== type) {
        t8 = type === "multiple_choice" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2 mb-4",
            children: [
                options.map({
                    "CreatePollForm[options.map()]": (opt, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            className: "w-full bg-slate-800/50 border border-slate-700 p-2 rounded text-sm text-white",
                            placeholder: `Option ${idx + 1}`,
                            value: opt,
                            onChange: {
                                "CreatePollForm[options.map() > <input>.onChange]": (e_0)=>{
                                    const newOpts = [
                                        ...options
                                    ];
                                    newOpts[idx] = e_0.target.value;
                                    setOptions(newOpts);
                                }
                            }["CreatePollForm[options.map() > <input>.onChange]"]
                        }, idx, false, {
                            fileName: "[project]/src/components/CreatePollForm.tsx",
                            lineNumber: 121,
                            columnNumber: 56
                        }, this)
                }["CreatePollForm[options.map()]"]),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: {
                        "CreatePollForm[<button>.onClick]": ()=>setOptions([
                                ...options,
                                ""
                            ])
                    }["CreatePollForm[<button>.onClick]"],
                    className: "text-xs text-blue-400",
                    children: "+ Add Option"
                }, void 0, false, {
                    fileName: "[project]/src/components/CreatePollForm.tsx",
                    lineNumber: 128,
                    columnNumber: 43
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 120,
            columnNumber: 40
        }, this);
        $[15] = options;
        $[16] = type;
        $[17] = t8;
    } else {
        t8 = $[17];
    }
    let t9;
    if ($[18] !== type) {
        t9 = type === "rating" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 bg-slate-800/50 rounded-lg text-center text-slate-400 text-sm mb-4",
            children: "Participants will see a 5-star input."
        }, void 0, false, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 139,
            columnNumber: 31
        }, this);
        $[18] = type;
        $[19] = t9;
    } else {
        t9 = $[19];
    }
    let t10;
    if ($[20] !== type) {
        t10 = type === "word_cloud" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 bg-slate-800/50 rounded-lg text-center text-slate-400 text-sm mb-4",
            children: "Participants will type free text responses."
        }, void 0, false, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 147,
            columnNumber: 36
        }, this);
        $[20] = type;
        $[21] = t10;
    } else {
        t10 = $[21];
    }
    let t11;
    if ($[22] !== onClose) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onClose,
            className: "flex-1 py-3 text-slate-400 hover:bg-slate-800 rounded-lg",
            children: "Cancel"
        }, void 0, false, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 155,
            columnNumber: 11
        }, this);
        $[22] = onClose;
        $[23] = t11;
    } else {
        t11 = $[23];
    }
    const t12 = loading ? "Launching..." : "Launch \uD83D\uDE80";
    let t13;
    if ($[24] !== handleSubmit || $[25] !== loading || $[26] !== t12) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: handleSubmit,
            disabled: loading,
            className: "flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg",
            children: t12
        }, void 0, false, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 164,
            columnNumber: 11
        }, this);
        $[24] = handleSubmit;
        $[25] = loading;
        $[26] = t12;
        $[27] = t13;
    } else {
        t13 = $[27];
    }
    let t14;
    if ($[28] !== t11 || $[29] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-3",
            children: [
                t11,
                t13
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 174,
            columnNumber: 11
        }, this);
        $[28] = t11;
        $[29] = t13;
        $[30] = t14;
    } else {
        t14 = $[30];
    }
    let t15;
    if ($[31] !== t10 || $[32] !== t14 || $[33] !== t5 || $[34] !== t7 || $[35] !== t8 || $[36] !== t9) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md",
                children: [
                    t3,
                    t5,
                    t7,
                    t8,
                    t9,
                    t10,
                    t14
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/CreatePollForm.tsx",
                lineNumber: 183,
                columnNumber: 96
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 183,
            columnNumber: 11
        }, this);
        $[31] = t10;
        $[32] = t14;
        $[33] = t5;
        $[34] = t7;
        $[35] = t8;
        $[36] = t9;
        $[37] = t15;
    } else {
        t15 = $[37];
    }
    return t15;
}
_s(CreatePollForm, "u+dymfEOmsM01u+1NZQsn4vDmQk=");
_c = CreatePollForm;
function _CreatePollFormHandleSubmitOptionsFilter(o) {
    return o.trim() !== "";
}
var _c;
__turbopack_context__.k.register(_c, "CreatePollForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ReactionOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReactionOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/sessionStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ReactionOverlay() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(10);
    if ($[0] !== "ec64a532ce7c20a3c9efadf6fe5cffa1e1b671a22ff20aecf5d6fa5060b30f01") {
        for(let $i = 0; $i < 10; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "ec64a532ce7c20a3c9efadf6fe5cffa1e1b671a22ff20aecf5d6fa5060b30f01";
    }
    const { lastReaction } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])();
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = [];
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const [emojis, setEmojis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t0);
    let t1;
    let t2;
    if ($[2] !== lastReaction) {
        t1 = ({
            "ReactionOverlay[useEffect()]": ()=>{
                if (!lastReaction) {
                    return;
                }
                const emojiChar = lastReaction.split("-")[0];
                const newEmoji = {
                    id: Date.now(),
                    emoji: emojiChar,
                    left: Math.random() * 90
                };
                setEmojis({
                    "ReactionOverlay[useEffect() > setEmojis()]": (prev)=>[
                            ...prev,
                            newEmoji
                        ]
                }["ReactionOverlay[useEffect() > setEmojis()]"]);
                setTimeout({
                    "ReactionOverlay[useEffect() > setTimeout()]": ()=>{
                        setEmojis({
                            "ReactionOverlay[useEffect() > setTimeout() > setEmojis()]": (prev_0)=>prev_0.filter({
                                    "ReactionOverlay[useEffect() > setTimeout() > setEmojis() > prev_0.filter()]": (e)=>e.id !== newEmoji.id
                                }["ReactionOverlay[useEffect() > setTimeout() > setEmojis() > prev_0.filter()]"])
                        }["ReactionOverlay[useEffect() > setTimeout() > setEmojis()]"]);
                    }
                }["ReactionOverlay[useEffect() > setTimeout()]"], 2000);
            }
        })["ReactionOverlay[useEffect()]"];
        t2 = [
            lastReaction
        ];
        $[2] = lastReaction;
        $[3] = t1;
        $[4] = t2;
    } else {
        t1 = $[3];
        t2 = $[4];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t1, t2);
    let t3;
    if ($[5] !== emojis) {
        t3 = emojis.map(_ReactionOverlayEmojisMap);
        $[5] = emojis;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            id: "180f269f546005df",
            children: "@keyframes float-up{0%{opacity:1;transform:translateY(0)scale(.5)}to{opacity:0;transform:translateY(-80vh)scale(1.5)}}.animate-float-up.jsx-180f269f546005df{animation:2s ease-out forwards float-up}"
        }, void 0, false, void 0, this);
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    let t5;
    if ($[8] !== t3) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 pointer-events-none overflow-hidden z-50",
            children: [
                t3,
                t4
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ReactionOverlay.tsx",
            lineNumber: 84,
            columnNumber: 10
        }, this);
        $[8] = t3;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    return t5;
}
_s(ReactionOverlay, "z38TDpq+1W5kLERu875i+yllBmA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"]
    ];
});
_c = ReactionOverlay;
function _ReactionOverlayEmojisMap(e_0) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute bottom-0 text-4xl animate-float-up opacity-0",
        style: {
            left: `${e_0.left}%`
        },
        children: e_0.emoji
    }, e_0.id, false, {
        fileName: "[project]/src/components/ReactionOverlay.tsx",
        lineNumber: 93,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "ReactionOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/WinningWheel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WinningWheel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function WinningWheel({ participants, onClose }) {
    _s();
    const [spinning, setSpinning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [winner, setWinner] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentName, setCurrentName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Ready?");
    const handleSpin = ()=>{
        if (participants.length === 0) return;
        setSpinning(true);
        setWinner(null);
        let counter = 0;
        // Fast shuffle effect
        const interval = setInterval(()=>{
            setCurrentName(participants[Math.floor(Math.random() * participants.length)]);
            counter++;
            if (counter > 20) {
                clearInterval(interval);
                // Pick Winner
                const finalWinner = participants[Math.floor(Math.random() * participants.length)];
                setWinner(finalWinner);
                setCurrentName(finalWinner);
                setSpinning(false);
            }
        }, 100);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-12 text-center shadow-2xl overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 bg-linear-to-br from-purple-900/20 to-blue-900/20"
                }, void 0, false, {
                    fileName: "[project]/src/components/WinningWheel.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold text-slate-400 mb-8 uppercase tracking-widest relative z-10",
                    children: "Picking a Winner"
                }, void 0, false, {
                    fileName: "[project]/src/components/WinningWheel.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-40 flex items-center justify-center mb-8 relative z-10",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `text-6xl sm:text-7xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400 transition-all ${winner ? "scale-125 animate-bounce" : ""}`,
                        children: participants.length > 0 ? currentName : "No Participants Yet"
                    }, void 0, false, {
                        fileName: "[project]/src/components/WinningWheel.tsx",
                        lineNumber: 45,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/WinningWheel.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this),
                winner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-xl text-yellow-400 font-bold mb-8 animate-pulse relative z-10",
                    children: "🎉 WINNER! 🎉"
                }, void 0, false, {
                    fileName: "[project]/src/components/WinningWheel.tsx",
                    lineNumber: 50,
                    columnNumber: 20
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-4 justify-center relative z-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "px-6 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition",
                            children: "Close"
                        }, void 0, false, {
                            fileName: "[project]/src/components/WinningWheel.tsx",
                            lineNumber: 55,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSpin,
                            disabled: spinning || participants.length === 0,
                            className: "px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                            children: spinning ? "Spinning..." : winner ? "Spin Again" : "Spin Wheel 🎲"
                        }, void 0, false, {
                            fileName: "[project]/src/components/WinningWheel.tsx",
                            lineNumber: 58,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/WinningWheel.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/WinningWheel.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/WinningWheel.tsx",
        lineNumber: 33,
        columnNumber: 10
    }, this);
}
_s(WinningWheel, "evYA0ck4HVNW8XuspTb3QleMxno=");
_c = WinningWheel;
var _c;
__turbopack_context__.k.register(_c, "WinningWheel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/QuizCreator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuizCreator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function QuizCreator(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(40);
    if ($[0] !== "6eadab6c2e0ac7db354d8ab3b5e0c47f4a153966b221bf519df00478485af9b0") {
        for(let $i = 0; $i < 40; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "6eadab6c2e0ac7db354d8ab3b5e0c47f4a153966b221bf519df00478485af9b0";
    }
    const { sessionCode, onClose } = t0;
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Fun Quiz");
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = [
            {
                id: "1",
                text: "",
                options: [
                    "",
                    "",
                    "",
                    ""
                ],
                correct_index: 0,
                time_limit: 30
            }
        ];
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const [questions, setQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t2;
    if ($[2] !== questions) {
        t2 = ({
            "QuizCreator[updateQuestion]": (idx, field, value)=>{
                const newQs = [
                    ...questions
                ];
                newQs[idx][field] = value;
                setQuestions(newQs);
            }
        })["QuizCreator[updateQuestion]"];
        $[2] = questions;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    const updateQuestion = t2;
    let t3;
    if ($[4] !== questions) {
        t3 = ({
            "QuizCreator[updateOption]": (qIdx, oIdx, val)=>{
                const newQs_0 = [
                    ...questions
                ];
                newQs_0[qIdx].options[oIdx] = val;
                setQuestions(newQs_0);
            }
        })["QuizCreator[updateOption]"];
        $[4] = questions;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    const updateOption = t3;
    let t4;
    if ($[6] !== onClose || $[7] !== questions || $[8] !== sessionCode || $[9] !== title) {
        t4 = ({
            "QuizCreator[handleLaunch]": async ()=>{
                setLoading(true);
                await fetch(`http://localhost:8001/api/session/${sessionCode}/quiz/start`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title,
                        questions
                    })
                });
                onClose();
            }
        })["QuizCreator[handleLaunch]"];
        $[6] = onClose;
        $[7] = questions;
        $[8] = sessionCode;
        $[9] = title;
        $[10] = t4;
    } else {
        t4 = $[10];
    }
    const handleLaunch = t4;
    let t5;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-2xl font-bold mb-4",
            children: "Create Quiz"
        }, void 0, false, {
            fileName: "[project]/src/components/QuizCreator.tsx",
            lineNumber: 92,
            columnNumber: 10
        }, this);
        $[11] = t5;
    } else {
        t5 = $[11];
    }
    let t6;
    if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = ({
            "QuizCreator[<input>.onChange]": (e)=>setTitle(e.target.value)
        })["QuizCreator[<input>.onChange]"];
        $[12] = t6;
    } else {
        t6 = $[12];
    }
    let t7;
    if ($[13] !== title) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            "aria-label": "Quiz Title",
            className: "w-full bg-slate-800 p-2 rounded mb-4 text-white border border-slate-700 focus:border-blue-500 outline-none",
            value: title,
            onChange: t6
        }, void 0, false, {
            fileName: "[project]/src/components/QuizCreator.tsx",
            lineNumber: 108,
            columnNumber: 10
        }, this);
        $[13] = title;
        $[14] = t7;
    } else {
        t7 = $[14];
    }
    let t8;
    if ($[15] !== questions || $[16] !== updateOption || $[17] !== updateQuestion) {
        let t9;
        if ($[19] !== updateOption || $[20] !== updateQuestion) {
            t9 = ({
                "QuizCreator[questions.map()]": (q, qIdx_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 bg-slate-800 rounded-xl border border-slate-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-bold",
                                        children: [
                                            "Question ",
                                            qIdx_0 + 1
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/QuizCreator.tsx",
                                        lineNumber: 119,
                                        columnNumber: 181
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        "aria-label": "Time limit per question",
                                        className: "bg-slate-700 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500",
                                        value: q.time_limit,
                                        onChange: {
                                            "QuizCreator[questions.map() > <select>.onChange]": (e_0)=>updateQuestion(qIdx_0, "time_limit", parseInt(e_0.target.value))
                                        }["QuizCreator[questions.map() > <select>.onChange]"],
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 10,
                                                children: "10s"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/QuizCreator.tsx",
                                                lineNumber: 121,
                                                columnNumber: 68
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 20,
                                                children: "20s"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/QuizCreator.tsx",
                                                lineNumber: 121,
                                                columnNumber: 99
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 30,
                                                children: "30s"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/QuizCreator.tsx",
                                                lineNumber: 121,
                                                columnNumber: 130
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/QuizCreator.tsx",
                                        lineNumber: 119,
                                        columnNumber: 237
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/QuizCreator.tsx",
                                lineNumber: 119,
                                columnNumber: 138
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                "aria-label": `Question ${qIdx_0 + 1} text`,
                                className: "w-full bg-slate-700 p-2 rounded mb-3 text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-blue-500",
                                placeholder: "e.g. What is the capital of France?",
                                value: q.text,
                                onChange: {
                                    "QuizCreator[questions.map() > <input>.onChange]": (e_1)=>updateQuestion(qIdx_0, "text", e_1.target.value)
                                }["QuizCreator[questions.map() > <input>.onChange]"]
                            }, void 0, false, {
                                fileName: "[project]/src/components/QuizCreator.tsx",
                                lineNumber: 121,
                                columnNumber: 176
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-2",
                                children: q.options.map({
                                    "QuizCreator[questions.map() > q.options.map()]": (opt, oIdx_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "radio",
                                                    name: `correct-${qIdx_0}`,
                                                    "aria-label": `Mark option ${oIdx_0 + 1} as correct`,
                                                    checked: q.correct_index === oIdx_0,
                                                    onChange: {
                                                        "QuizCreator[questions.map() > q.options.map() > <input>.onChange]": ()=>updateQuestion(qIdx_0, "correct_index", oIdx_0)
                                                    }["QuizCreator[questions.map() > q.options.map() > <input>.onChange]"],
                                                    className: "accent-green-500 w-4 h-4 cursor-pointer"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                                    lineNumber: 124,
                                                    columnNumber: 136
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    "aria-label": `Option ${oIdx_0 + 1} text`,
                                                    className: "w-full bg-slate-700 p-2 rounded text-sm text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-blue-500",
                                                    placeholder: `Option ${oIdx_0 + 1}`,
                                                    value: opt,
                                                    onChange: {
                                                        "QuizCreator[questions.map() > q.options.map() > <input>.onChange]": (e_2)=>updateOption(qIdx_0, oIdx_0, e_2.target.value)
                                                    }["QuizCreator[questions.map() > q.options.map() > <input>.onChange]"]
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                                    lineNumber: 126,
                                                    columnNumber: 143
                                                }, this)
                                            ]
                                        }, oIdx_0, true, {
                                            fileName: "[project]/src/components/QuizCreator.tsx",
                                            lineNumber: 124,
                                            columnNumber: 82
                                        }, this)
                                }["QuizCreator[questions.map() > q.options.map()]"])
                            }, void 0, false, {
                                fileName: "[project]/src/components/QuizCreator.tsx",
                                lineNumber: 123,
                                columnNumber: 67
                            }, this)
                        ]
                    }, qIdx_0, true, {
                        fileName: "[project]/src/components/QuizCreator.tsx",
                        lineNumber: 119,
                        columnNumber: 56
                    }, this)
            })["QuizCreator[questions.map()]"];
            $[19] = updateOption;
            $[20] = updateQuestion;
            $[21] = t9;
        } else {
            t9 = $[21];
        }
        t8 = questions.map(t9);
        $[15] = questions;
        $[16] = updateOption;
        $[17] = updateQuestion;
        $[18] = t8;
    } else {
        t8 = $[18];
    }
    let t9;
    if ($[22] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6 max-h-[50vh] overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-thumb-slate-700",
            children: t8
        }, void 0, false, {
            fileName: "[project]/src/components/QuizCreator.tsx",
            lineNumber: 147,
            columnNumber: 10
        }, this);
        $[22] = t8;
        $[23] = t9;
    } else {
        t9 = $[23];
    }
    let t10;
    if ($[24] !== questions) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: {
                "QuizCreator[<button>.onClick]": ()=>setQuestions([
                        ...questions,
                        {
                            id: Date.now().toString(),
                            text: "",
                            options: [
                                "",
                                "",
                                "",
                                ""
                            ],
                            correct_index: 0,
                            time_limit: 30
                        }
                    ])
            }["QuizCreator[<button>.onClick]"],
            className: "text-blue-400 text-sm mb-6 hover:underline",
            children: "+ Add Question"
        }, void 0, false, {
            fileName: "[project]/src/components/QuizCreator.tsx",
            lineNumber: 155,
            columnNumber: 11
        }, this);
        $[24] = questions;
        $[25] = t10;
    } else {
        t10 = $[25];
    }
    let t11;
    if ($[26] !== onClose) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onClose,
            className: "flex-1 py-3 bg-slate-800 rounded hover:bg-slate-700 transition",
            children: "Cancel"
        }, void 0, false, {
            fileName: "[project]/src/components/QuizCreator.tsx",
            lineNumber: 171,
            columnNumber: 11
        }, this);
        $[26] = onClose;
        $[27] = t11;
    } else {
        t11 = $[27];
    }
    const t12 = loading ? "Starting..." : "Launch Quiz";
    let t13;
    if ($[28] !== handleLaunch || $[29] !== loading || $[30] !== t12) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: handleLaunch,
            disabled: loading,
            className: "flex-1 py-3 bg-green-600 hover:bg-green-500 font-bold rounded transition disabled:opacity-50",
            children: t12
        }, void 0, false, {
            fileName: "[project]/src/components/QuizCreator.tsx",
            lineNumber: 180,
            columnNumber: 11
        }, this);
        $[28] = handleLaunch;
        $[29] = loading;
        $[30] = t12;
        $[31] = t13;
    } else {
        t13 = $[31];
    }
    let t14;
    if ($[32] !== t11 || $[33] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-4",
            children: [
                t11,
                t13
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/QuizCreator.tsx",
            lineNumber: 190,
            columnNumber: 11
        }, this);
        $[32] = t11;
        $[33] = t13;
        $[34] = t14;
    } else {
        t14 = $[34];
    }
    let t15;
    if ($[35] !== t10 || $[36] !== t14 || $[37] !== t7 || $[38] !== t9) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-slate-900 w-full max-w-2xl p-6 rounded-2xl border border-slate-700",
                children: [
                    t5,
                    t7,
                    t9,
                    t10,
                    t14
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/QuizCreator.tsx",
                lineNumber: 199,
                columnNumber: 112
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/QuizCreator.tsx",
            lineNumber: 199,
            columnNumber: 11
        }, this);
        $[35] = t10;
        $[36] = t14;
        $[37] = t7;
        $[38] = t9;
        $[39] = t15;
    } else {
        t15 = $[39];
    }
    return t15;
}
_s(QuizCreator, "eeBoPLhWDV4YMrBlc0UNduVEEEQ=");
_c = QuizCreator;
var _c;
__turbopack_context__.k.register(_c, "QuizCreator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/MagicMap.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MagicMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/sessionStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function MagicMap(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(23);
    if ($[0] !== "a45c47c5db524d4d297c324cb5226bf82126aef105277577682c2b3024aa2230") {
        for(let $i = 0; $i < 23; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "a45c47c5db524d4d297c324cb5226bf82126aef105277577682c2b3024aa2230";
    }
    const { onClose } = t0;
    const { locations } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])();
    const getXY = _MagicMapGetXY;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500",
            children: "🌍 Magic Map: Live Audience"
        }, void 0, false, {
            fileName: "[project]/src/components/MagicMap.tsx",
            lineNumber: 22,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== onClose) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 flex justify-between items-center border-b border-slate-800 bg-slate-900",
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    className: "px-4 py-2 bg-slate-800 rounded hover:bg-slate-700 text-white",
                    children: "Close Map"
                }, void 0, false, {
                    fileName: "[project]/src/components/MagicMap.tsx",
                    lineNumber: 29,
                    columnNumber: 108
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/MagicMap.tsx",
            lineNumber: 29,
            columnNumber: 10
        }, this);
        $[2] = onClose;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            src: "https://upload.wikimedia.org/wikipedia/commons/2/23/Blue_Marble_2002.png",
            alt: "World Map",
            className: "w-full h-full object-cover rounded-2xl opacity-50 shadow-2xl"
        }, void 0, false, {
            fileName: "[project]/src/components/MagicMap.tsx",
            lineNumber: 37,
            columnNumber: 10
        }, this);
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] !== locations) {
        let t5;
        if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
            t5 = ({
                "MagicMap[locations.map()]": (loc, i)=>{
                    const { x: x_0, y: y_0 } = getXY(loc.lat, loc.lng);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute w-4 h-4 bg-green-500 rounded-full shadow-[0_0_10px_#4ade80] border-2 border-white transform -translate-x-1/2 -translate-y-1/2 animate-pulse group cursor-pointer",
                        style: {
                            left: `${x_0}%`,
                            top: `${y_0}%`
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white text-black text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none",
                            children: [
                                loc.name,
                                " (",
                                loc.city,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/MagicMap.tsx",
                            lineNumber: 55,
                            columnNumber: 14
                        }, this)
                    }, i, false, {
                        fileName: "[project]/src/components/MagicMap.tsx",
                        lineNumber: 52,
                        columnNumber: 18
                    }, this);
                }
            })["MagicMap[locations.map()]"];
            $[7] = t5;
        } else {
            t5 = $[7];
        }
        t4 = locations.map(t5);
        $[5] = locations;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[8] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 relative bg-[#0a0f1c] flex items-center justify-center overflow-hidden p-10",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full max-w-6xl aspect-[2/1]",
                children: [
                    t3,
                    t4
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/MagicMap.tsx",
                lineNumber: 70,
                columnNumber: 110
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/MagicMap.tsx",
            lineNumber: 70,
            columnNumber: 10
        }, this);
        $[8] = t4;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    let t6;
    if ($[10] !== locations.length) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            children: [
                "📍 ",
                locations.length,
                " Active Users"
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/MagicMap.tsx",
            lineNumber: 78,
            columnNumber: 10
        }, this);
        $[10] = locations.length;
        $[11] = t6;
    } else {
        t6 = $[11];
    }
    let t7;
    if ($[12] !== locations) {
        t7 = new Set(locations.map(_MagicMapLocationsMap));
        $[12] = locations;
        $[13] = t7;
    } else {
        t7 = $[13];
    }
    let t8;
    if ($[14] !== t7.size) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            children: [
                "🌐 ",
                t7.size,
                " Cities"
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/MagicMap.tsx",
            lineNumber: 94,
            columnNumber: 10
        }, this);
        $[14] = t7.size;
        $[15] = t8;
    } else {
        t8 = $[15];
    }
    let t9;
    if ($[16] !== t6 || $[17] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 bg-slate-900 border-t border-slate-800 flex gap-6 text-slate-400 text-sm",
            children: [
                t6,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/MagicMap.tsx",
            lineNumber: 102,
            columnNumber: 10
        }, this);
        $[16] = t6;
        $[17] = t8;
        $[18] = t9;
    } else {
        t9 = $[18];
    }
    let t10;
    if ($[19] !== t2 || $[20] !== t5 || $[21] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 bg-slate-950 z-50 flex flex-col",
            children: [
                t2,
                t5,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/MagicMap.tsx",
            lineNumber: 111,
            columnNumber: 11
        }, this);
        $[19] = t2;
        $[20] = t5;
        $[21] = t9;
        $[22] = t10;
    } else {
        t10 = $[22];
    }
    return t10;
}
_s(MagicMap, "5aGCqjjpnrQE10Mm7HWPO4iPl1E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"]
    ];
});
_c = MagicMap;
function _MagicMapLocationsMap(l) {
    return l.city;
}
function _MagicMapGetXY(lat, lng) {
    const x = (lng + 180) * 0.2777777777777778;
    const y = (-lat + 90) * 0.5555555555555556;
    return {
        x,
        y
    };
}
var _c;
__turbopack_context__.k.register(_c, "MagicMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/presenter/[code]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PresenterDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/sessionStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRealtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useRealtime.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CreatePollForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CreatePollForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ReactionOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ReactionOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$WinningWheel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/WinningWheel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuizCreator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/QuizCreator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MagicMap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/MagicMap.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
function PresenterDashboard() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const code = params.code;
    // 1. Connect Presenter to WebSocket
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRealtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRealtime"])(code);
    // Destructure all necessary state, including the new QUIZ state
    const { currentPoll, questions, isConnected, participants, quiz, quizScores } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])();
    // 2. Local State
    const [showPollForm, setShowPollForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showWheel, setShowWheel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showQuizCreator, setShowQuizCreator] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // New: Quiz Creator Modal
    const [showMap, setShowMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // New: Magic Map Modal
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("poll");
    // AI State
    const [aiSummary, setAiSummary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [analyzing, setAnalyzing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 3. AI Analysis Handler
    const handleAiAnalyze = async ()=>{
        setAnalyzing(true);
        setAiSummary("");
        // Context depends on view mode or active quiz
        let contextData = [];
        if (quiz) {
            contextData = [
                `Quiz active: ${quiz.title}`,
                `State: ${quiz.state}`
            ];
        } else {
            contextData = viewMode === 'qna' ? questions.map((q)=>q.text) : [
                "Poll is active"
            ];
        }
        try {
            const res = await fetch("http://localhost:8001/api/ai/summarize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    responses: contextData
                })
            });
            const data = await res.json();
            setAiSummary(data.summary);
        } catch (err) {
            alert("AI Failed. Check backend console.");
        } finally{
            setAnalyzing(false);
        }
    };
    // 4. Quiz Progression Handler
    const handleNextQuizStep = async ()=>{
        await fetch(`http://localhost:8001/api/session/${code}/quiz/next`, {
            method: "POST"
        });
    };
    // 5. Export Data Handler
    const handleExport = ()=>{
        // Directly trigger a browser download
        window.location.href = `http://localhost:8001/api/session/${code}/export`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-slate-950 text-white p-4 sm:p-8 transition-all relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ReactionOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex justify-between items-center border-b border-slate-800 pb-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-8 h-8 bg-linear-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center font-bold shadow-lg shadow-purple-900/20",
                                children: "FR"
                            }, void 0, false, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "hidden sm:block text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500",
                                children: "FlexiRush Presenter"
                            }, void 0, false, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-end",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"} animate-pulse`
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 101,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-2xl sm:text-4xl font-mono font-bold tracking-widest text-white",
                                        children: code
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 102,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] sm:text-xs text-slate-500",
                                children: "JOIN CODE"
                            }, void 0, false, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-2 bg-slate-900 p-4 sm:p-8 rounded-2xl border border-slate-800 min-h-[400px] flex flex-col shadow-2xl relative overflow-hidden",
                        children: quiz ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col h-full items-center justify-center text-center w-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-sm uppercase tracking-widest text-slate-400 mb-2",
                                    children: quiz.title
                                }, void 0, false, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 116,
                                    columnNumber: 18
                                }, this),
                                quiz.state === "LOBBY" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-4xl font-bold",
                                            children: "Waiting for players..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 120,
                                            columnNumber: 26
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xl text-blue-400 bg-slate-800 px-6 py-2 rounded-full inline-block",
                                            children: [
                                                participants.length,
                                                " joined"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 121,
                                            columnNumber: 26
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "pt-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleNextQuizStep,
                                                className: "px-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-xl shadow-lg shadow-green-900/20 animate-bounce",
                                                children: "Start Game 🚀"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 125,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 124,
                                            columnNumber: 26
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 119,
                                    columnNumber: 45
                                }, this),
                                quiz.state === "QUESTION" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-3xl sm:text-4xl font-bold mb-10 leading-tight",
                                            children: quiz.questions[quiz.current_index].text
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 133,
                                            columnNumber: 26
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-4 w-full",
                                            children: quiz.questions[quiz.current_index].options.map((opt, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `p-6 rounded-xl text-xl font-bold flex items-center gap-4 text-white shadow-lg ${[
                                                        'bg-red-600',
                                                        'bg-blue-600',
                                                        'bg-yellow-600',
                                                        'bg-green-600'
                                                    ][i]}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-2xl opacity-50",
                                                            children: [
                                                                '▲',
                                                                '◆',
                                                                '●',
                                                                '■'
                                                            ][i]
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 138,
                                                            columnNumber: 38
                                                        }, this),
                                                        opt
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 137,
                                                    columnNumber: 90
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 136,
                                            columnNumber: 26
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-full bg-white animate-[width_30s_linear]",
                                                        style: {
                                                            width: '100%',
                                                            animationDuration: `${quiz.questions[quiz.current_index].time_limit}s`
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 145,
                                                        columnNumber: 34
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 144,
                                                    columnNumber: 30
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleNextQuizStep,
                                                    className: "text-slate-500 hover:text-white text-sm underline",
                                                    children: "Skip Timer / Reveal Answer"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 150,
                                                    columnNumber: 30
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 142,
                                            columnNumber: 26
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 132,
                                    columnNumber: 48
                                }, this),
                                quiz.state === "LEADERBOARD" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full max-w-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-3xl font-bold mb-6 text-yellow-400",
                                            children: "🏆 Leaderboard"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 158,
                                            columnNumber: 26
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2 mb-8",
                                            children: Object.entries(quizScores).sort(([, a], [, b])=>b - a).slice(0, 5).map(([name, score], i_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `font-bold w-6 ${i_0 === 0 ? 'text-yellow-400' : 'text-slate-400'}`,
                                                                    children: [
                                                                        "#",
                                                                        i_0 + 1
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                    lineNumber: 162,
                                                                    columnNumber: 42
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-lg",
                                                                    children: name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                    lineNumber: 165,
                                                                    columnNumber: 42
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 161,
                                                            columnNumber: 38
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-mono font-bold text-blue-400",
                                                            children: [
                                                                score,
                                                                " pts"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 167,
                                                            columnNumber: 38
                                                        }, this)
                                                    ]
                                                }, name, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 160,
                                                    columnNumber: 128
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 159,
                                            columnNumber: 26
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleNextQuizStep,
                                            className: "px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition",
                                            children: "Next Question →"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 170,
                                            columnNumber: 26
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 157,
                                    columnNumber: 51
                                }, this),
                                quiz.state === "END" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500",
                                            children: "GAME OVER"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 177,
                                            columnNumber: 26
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-slate-800 p-8 rounded-3xl border border-yellow-500/30 shadow-2xl",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-slate-400 uppercase tracking-widest text-sm mb-2",
                                                    children: "The Winner is"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 30
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-4xl font-bold text-white",
                                                    children: Object.entries(quizScores).sort(([, a_0], [, b_0])=>b_0 - a_0)[0]?.[0] || "No one"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 182,
                                                    columnNumber: 30
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 180,
                                            columnNumber: 26
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>window.location.reload(),
                                            className: "px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition",
                                            children: "Close Quiz"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 186,
                                            columnNumber: 26
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 176,
                                    columnNumber: 43
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                            lineNumber: 115,
                            columnNumber: 19
                        }, this) : // === B. STANDARD DASHBOARD (Polls & Q&A) ===
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-lg sm:text-xl font-semibold flex items-center gap-2",
                                            children: [
                                                viewMode === "poll" ? "📊 Live Results" : "💬 Audience Q&A",
                                                viewMode === "poll" && currentPoll?.is_open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] bg-red-500 text-white px-2 py-0.5 rounded animate-pulse font-bold",
                                                    children: "LIVE"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 67
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 194,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded",
                                            children: viewMode === 'poll' ? "Viewing Polls" : "Viewing Questions"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 198,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 193,
                                    columnNumber: 15
                                }, this),
                                viewMode === "poll" && (!currentPoll ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 flex flex-col items-center justify-center text-slate-600 opacity-50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-4xl mb-2",
                                            children: "💤"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 205,
                                            columnNumber: 21
                                        }, this),
                                        " No active widget."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 204,
                                    columnNumber: 55
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-2xl font-bold",
                                            children: currentPoll.question
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 207,
                                            columnNumber: 21
                                        }, this),
                                        currentPoll.type === "multiple_choice" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: currentPoll.options?.map((opt_0, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between text-sm mb-1 px-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: opt_0.label
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                    lineNumber: 213,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-mono bg-slate-800 px-1 rounded",
                                                                    children: opt_0.votes
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                    lineNumber: 214,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 212,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-4 bg-slate-800 rounded-full overflow-hidden",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-full bg-blue-500 transition-all duration-500",
                                                                style: {
                                                                    width: `${Math.max(opt_0.votes * 10, 2)}%`
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                lineNumber: 217,
                                                                columnNumber: 33
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 216,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, idx, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 211,
                                                    columnNumber: 80
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 210,
                                            columnNumber: 64
                                        }, this),
                                        currentPoll.type === "rating" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-center justify-center py-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-6xl font-bold text-yellow-400 flex items-center gap-2",
                                                    children: [
                                                        currentPoll.average || 0.0,
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-4xl text-slate-600",
                                                            children: "/ 5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 227,
                                                            columnNumber: 58
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 226,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-1 mt-4",
                                                    children: [
                                                        1,
                                                        2,
                                                        3,
                                                        4,
                                                        5
                                                    ].map((star)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-4xl ${star <= Math.round(currentPoll.average || 0) ? "text-yellow-400" : "text-slate-700"}`,
                                                            children: "★"
                                                        }, star, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 230,
                                                            columnNumber: 58
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 225,
                                            columnNumber: 55
                                        }, this),
                                        currentPoll.type === "word_cloud" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-3 justify-center items-center py-4",
                                            children: Object.entries(currentPoll.words || {}).map(([word, count])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-blue-400 font-bold transition-all duration-500",
                                                    style: {
                                                        fontSize: `${Math.min(1 + count * 0.5, 4)}rem`,
                                                        opacity: 0.8 + Math.min(count, 5) * 0.05
                                                    },
                                                    children: word
                                                }, word, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 91
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 235,
                                            columnNumber: 59
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 206,
                                    columnNumber: 28
                                }, this)),
                                viewMode === "qna" && (questions.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 flex flex-col items-center justify-center text-slate-600 opacity-50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-4xl mb-2",
                                            children: "🦗"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 247,
                                            columnNumber: 25
                                        }, this),
                                        " No questions."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 246,
                                    columnNumber: 64
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3 overflow-y-auto max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-slate-700",
                                    children: [
                                        ...questions
                                    ].sort((a_1, b_1)=>b_1.votes - a_1.votes).map((q_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex gap-4 hover:border-blue-500/30 transition",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-center justify-center min-w-[40px] text-blue-400",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-lg font-bold",
                                                            children: "▲"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 251,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm font-mono",
                                                            children: q_0.votes
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 252,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 250,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm sm:text-base text-slate-200",
                                                    children: q_0.text
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 254,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, q_0.id, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 249,
                                            columnNumber: 100
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 248,
                                    columnNumber: 30
                                }, this))
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-800 shadow-xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg sm:text-xl font-semibold mb-4 text-slate-300",
                                        children: "Quick Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 263,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setShowPollForm(true);
                                                    setViewMode("poll");
                                                },
                                                className: "p-3 sm:p-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition text-left flex justify-between items-center text-sm sm:text-base group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Launch New Poll"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 270,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "🚀"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 270,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 266,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowQuizCreator(true),
                                                className: "p-3 sm:p-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition text-left flex justify-between items-center text-sm sm:text-base",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Create Quiz"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 275,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "🏆"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 275,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 274,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowWheel(true),
                                                className: "p-3 sm:p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition text-left flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Spin Winning Wheel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 280,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "🎲"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 280,
                                                        columnNumber: 48
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 279,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowMap(true),
                                                className: "p-3 sm:p-4 bg-purple-900/50 hover:bg-purple-900 text-purple-200 border border-purple-500/30 rounded-lg transition text-left flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Open Magic Map"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 285,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "🌍"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 285,
                                                        columnNumber: 44
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 284,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleExport,
                                                className: "p-3 sm:p-4 bg-orange-600/20 hover:bg-orange-600/40 text-orange-200 border border-orange-500/30 rounded-lg transition text-left flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Export Results (CSV)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 290,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "📥"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 290,
                                                        columnNumber: 50
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 289,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setViewMode("qna"),
                                                className: `p-3 sm:p-4 font-bold rounded-lg transition text-left flex justify-between items-center ${viewMode === 'qna' ? "bg-slate-700 text-white border border-blue-500" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "View Q&A Board"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 295,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "bg-slate-900 px-2 py-0.5 rounded text-xs",
                                                        children: questions.length
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 296,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 294,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleAiAnalyze,
                                                disabled: analyzing,
                                                className: "mt-2 p-3 sm:p-4 bg-linear-to-r from-purple-700 to-purple-600 hover:from-purple-600 text-white font-bold rounded-lg transition text-left border border-purple-500/30",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Analyze Room Vibe (AI)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 301,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: analyzing ? "animate-spin" : "",
                                                        children: "✨"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 301,
                                                        columnNumber: 52
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 300,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 264,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 262,
                                columnNumber: 11
                            }, this),
                            aiSummary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 bg-slate-800 rounded-lg border border-purple-500/30 animate-fade-in shadow-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-lg",
                                                children: "🤖"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 309,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-purple-400 text-xs font-bold uppercase tracking-widest",
                                                children: "Hive Mind Insights"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 310,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 308,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-slate-300 text-xs sm:text-sm whitespace-pre-line leading-relaxed italic border-l-2 border-purple-500 pl-3",
                                        children: aiSummary
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 312,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 307,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                        lineNumber: 261,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this),
            showWheel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$WinningWheel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                participants: participants || [],
                onClose: ()=>setShowWheel(false)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 320,
                columnNumber: 21
            }, this),
            showPollForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CreatePollForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sessionCode: code,
                onClose: ()=>setShowPollForm(false)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 321,
                columnNumber: 24
            }, this),
            showQuizCreator && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuizCreator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sessionCode: code,
                onClose: ()=>setShowQuizCreator(false)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 322,
                columnNumber: 27
            }, this),
            showMap && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MagicMap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onClose: ()=>setShowMap(false)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 323,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/presenter/[code]/page.tsx",
        lineNumber: 83,
        columnNumber: 10
    }, this);
}
_s(PresenterDashboard, "eMbJl+xOwfqmFZFxdijcQyu/lmc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRealtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRealtime"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"]
    ];
});
_c = PresenterDashboard;
var _c;
__turbopack_context__.k.register(_c, "PresenterDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_a27d02e6._.js.map