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
        // --- INITIAL STATE ---
        isConnected: false,
        participants: [],
        locations: [],
        currentPoll: null,
        questions: [],
        lastReaction: null,
        quiz: null,
        quizScores: {},
        branding: {
            logo_url: null,
            theme_color: "#3b82f6"
        },
        // Check localStorage for token on load (Client-side only check)
        token: ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('token') : "TURBOPACK unreachable",
        user: null,
        // --- ACTIONS IMPLEMENTATION ---
        setConnectionStatus: (status)=>set({
                isConnected: status
            }),
        setParticipants: (names)=>set({
                participants: names
            }),
        setLocations: (locs)=>set({
                locations: locs
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
        setBranding: (branding)=>set({
                branding
            }),
        // Auth Actions with Persistence
        setToken: (token)=>{
            if ("TURBOPACK compile-time truthy", 1) {
                if (token) localStorage.setItem('token', token);
                else localStorage.removeItem('token');
            }
            set({
                token
            });
        },
        setUser: (user)=>set({
                user
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/sessionStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
function useRealtime(sessionCode, myName) {
    _s();
    const ws = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const reconnectTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useRealtime.useEffect": ()=>{
            // 1. Safety Check: Stop if code is missing or literally "undefined"
            // This prevents connection attempts before the URL params are ready.
            if (!sessionCode || sessionCode === "undefined" || sessionCode === "") {
                console.log("⏳ WebSocket: Waiting for a valid session code...");
                return;
            }
            const connect = {
                "useRealtime.useEffect.connect": ()=>{
                    // Clear any existing reconnect timers
                    if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
                    const wsUrl = `ws://localhost:8001/ws/${sessionCode}/presenter`;
                    console.log(`🔌 WebSocket: Attempting connection to ${wsUrl}`);
                    ws.current = new WebSocket(wsUrl);
                    ws.current.onopen = ({
                        "useRealtime.useEffect.connect": ()=>{
                            console.log('✅ WebSocket: Stable connection established for code:', sessionCode);
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"].getState().setConnectionStatus(true);
                            // 2. Initial Fetch: Grab current room state immediately upon connection
                            fetch(`http://localhost:8001/api/session/${sessionCode}/state`).then({
                                "useRealtime.useEffect.connect": (res)=>res.ok ? res.json() : null
                            }["useRealtime.useEffect.connect"]).then({
                                "useRealtime.useEffect.connect": (data)=>{
                                    if (!data) return;
                                    console.log("📥 WebSocket: Initial state sync successful");
                                    const store = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"].getState();
                                    // Map individual data points to store
                                    if (data.current_poll) store.setPoll(data.current_poll);
                                    if (data.questions) store.setQuestions(data.questions);
                                    if (data.participants) store.setParticipants(data.participants);
                                    if (data.quiz) store.setQuiz(data.quiz, data.quiz_scores);
                                    if (data.locations) store.setLocations(data.locations);
                                    if (data.branding) store.setBranding(data.branding);
                                }
                            }["useRealtime.useEffect.connect"]).catch({
                                "useRealtime.useEffect.connect": (err)=>console.error("❌ WebSocket: Initial sync failed:", err)
                            }["useRealtime.useEffect.connect"]);
                        }
                    })["useRealtime.useEffect.connect"];
                    ws.current.onmessage = ({
                        "useRealtime.useEffect.connect": (event)=>{
                            try {
                                const data_0 = JSON.parse(event.data);
                                const store_0 = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"].getState();
                                // DEBUG: Log every incoming push message
                                console.log(`📡 WebSocket: Received broadcast [${data_0.type}]`, data_0);
                                // 3. Dispatch incoming data to Zustand Store based on event type
                                switch(data_0.type){
                                    case 'POLL_START':
                                    case 'POLL_UPDATE':
                                        store_0.setPoll(data_0.payload);
                                        break;
                                    case 'QNA_UPDATE':
                                        store_0.setQuestions(data_0.payload);
                                        break;
                                    case 'PARTICIPANT_UPDATE':
                                        store_0.setParticipants(data_0.names);
                                        if (data_0.locations) store_0.setLocations(data_0.locations);
                                        break;
                                    case 'REACTION':
                                        store_0.triggerReaction(data_0.emoji);
                                        break;
                                    case 'BRANDING_UPDATE':
                                        store_0.setBranding(data_0.payload);
                                        break;
                                    case 'QUIZ_UPDATE':
                                        // Handle both direct payloads and object-wrapped payloads
                                        if (data_0.payload?.quiz) {
                                            store_0.setQuiz(data_0.payload.quiz, data_0.payload.scores);
                                        } else {
                                            store_0.setQuiz(data_0.payload);
                                        }
                                        break;
                                    case 'USER_KICKED':
                                        if (myName && data_0.target_name === myName) {
                                            alert("You have been kicked from the session.");
                                            ws.current?.close();
                                            router.push('/');
                                        }
                                        break;
                                    default:
                                        console.warn(`⚠️ WebSocket: Unhandled event type: ${data_0.type}`);
                                }
                            } catch (e) {
                                console.error("❌ WebSocket: Failed to parse incoming message:", e);
                            }
                        }
                    })["useRealtime.useEffect.connect"];
                    ws.current.onclose = ({
                        "useRealtime.useEffect.connect": (e_0)=>{
                            console.log(`❌ WebSocket: Disconnected (Code: ${e_0.code}).`);
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"].getState().setConnectionStatus(false);
                            // 4. Robust Reconnect: Only retry if not a clean intentional close
                            if (e_0.code !== 1000 && window.location.pathname.includes(sessionCode)) {
                                console.log("♻️ WebSocket: Attempting to reconnect in 3s...");
                                reconnectTimeout.current = setTimeout(connect, 3000);
                            }
                        }
                    })["useRealtime.useEffect.connect"];
                    ws.current.onerror = ({
                        "useRealtime.useEffect.connect": (err_0)=>{
                            console.error("❌ WebSocket: Socket encountered an error: ", err_0);
                            ws.current?.close();
                        }
                    })["useRealtime.useEffect.connect"];
                }
            }["useRealtime.useEffect.connect"];
            connect();
            return ({
                "useRealtime.useEffect": ()=>{
                    console.log("🛑 WebSocket: Cleaning up hook, closing connection.");
                    if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
                    ws.current?.close();
                }
            })["useRealtime.useEffect"];
        }
    }["useRealtime.useEffect"], [
        sessionCode,
        myName,
        router
    ]);
}
_s(useRealtime, "qq9qQD39iP5d6j/nmUbDh1DRHgM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
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
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(48);
    if ($[0] !== "7768567321ad3226c80c29f487cb67a19f99a179011cdfd7ad929e6a42e8fdc8") {
        for(let $i = 0; $i < 48; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7768567321ad3226c80c29f487cb67a19f99a179011cdfd7ad929e6a42e8fdc8";
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
                ;
                try {
                    await fetch(`http://localhost:8001/api/session/${sessionCode}/poll/start`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    });
                    onClose();
                } catch (t3) {
                    alert("Failed to start poll");
                    setLoading(false);
                }
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
            className: "text-xl font-bold mb-4 text-white",
            children: "Launch Widget"
        }, void 0, false, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 74,
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
                label: "\u2601\uFE0F Words"
            },
            {
                id: "open_ended",
                label: "\uD83D\uDCAD Thoughts"
            }
        ];
        $[9] = t4;
    } else {
        t4 = $[9];
    }
    let t5;
    if ($[10] !== type) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4",
            children: t4.map({
                "CreatePollForm[(anonymous)()]": (t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "CreatePollForm[(anonymous)() > <button>.onClick]": ()=>setType(t.id)
                        }["CreatePollForm[(anonymous)() > <button>.onClick]"],
                        className: `py-2 text-sm rounded-lg border font-medium transition-all ${type === t.id ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white"}`,
                        children: t.label
                    }, t.id, false, {
                        fileName: "[project]/src/components/CreatePollForm.tsx",
                        lineNumber: 101,
                        columnNumber: 47
                    }, this)
            }["CreatePollForm[(anonymous)()]"])
        }, void 0, false, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 100,
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
            "CreatePollForm[<input>.onChange]": (e_0)=>setQuestion(e_0.target.value)
        })["CreatePollForm[<input>.onChange]"];
        $[12] = t6;
    } else {
        t6 = $[12];
    }
    let t7;
    if ($[13] !== handleSubmit || $[14] !== type) {
        t7 = ({
            "CreatePollForm[<input>.onKeyDown]": (e_1)=>e_1.key === "Enter" && type !== "multiple_choice" && handleSubmit()
        })["CreatePollForm[<input>.onKeyDown]"];
        $[13] = handleSubmit;
        $[14] = type;
        $[15] = t7;
    } else {
        t7 = $[15];
    }
    let t8;
    if ($[16] !== question || $[17] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            autoFocus: true,
            className: "w-full bg-slate-800 border border-slate-700 p-3 rounded-lg mb-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition",
            placeholder: "Ask a question...",
            value: question,
            onChange: t6,
            onKeyDown: t7
        }, void 0, false, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 132,
            columnNumber: 10
        }, this);
        $[16] = question;
        $[17] = t7;
        $[18] = t8;
    } else {
        t8 = $[18];
    }
    let t9;
    if ($[19] !== options || $[20] !== type) {
        t9 = type === "multiple_choice" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2 mb-4 max-h-50 overflow-y-auto pr-1 custom-scrollbar",
            children: [
                options.map({
                    "CreatePollForm[options.map()]": (opt, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            className: "w-full bg-slate-800/50 border border-slate-700 p-2 rounded text-sm text-white focus:border-blue-500 outline-none",
                            placeholder: `Option ${idx + 1}`,
                            value: opt,
                            onChange: {
                                "CreatePollForm[options.map() > <input>.onChange]": (e_2)=>{
                                    const newOpts = [
                                        ...options
                                    ];
                                    newOpts[idx] = e_2.target.value;
                                    setOptions(newOpts);
                                }
                            }["CreatePollForm[options.map() > <input>.onChange]"]
                        }, idx, false, {
                            fileName: "[project]/src/components/CreatePollForm.tsx",
                            lineNumber: 142,
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
                    className: "text-xs text-blue-400 hover:text-blue-300 font-bold",
                    children: "+ Add Option"
                }, void 0, false, {
                    fileName: "[project]/src/components/CreatePollForm.tsx",
                    lineNumber: 149,
                    columnNumber: 43
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 141,
            columnNumber: 40
        }, this);
        $[19] = options;
        $[20] = type;
        $[21] = t9;
    } else {
        t9 = $[21];
    }
    let t10;
    if ($[22] !== type) {
        t10 = type === "rating" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg text-center text-slate-400 text-sm mb-4",
            children: "Participants will vote using a 5-star scale."
        }, void 0, false, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 160,
            columnNumber: 32
        }, this);
        $[22] = type;
        $[23] = t10;
    } else {
        t10 = $[23];
    }
    let t11;
    if ($[24] !== type) {
        t11 = type === "word_cloud" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg text-center text-slate-400 text-sm mb-4",
            children: "Participants will submit words to build a cloud."
        }, void 0, false, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 168,
            columnNumber: 36
        }, this);
        $[24] = type;
        $[25] = t11;
    } else {
        t11 = $[25];
    }
    let t12;
    if ($[26] !== type) {
        t12 = type === "open_ended" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg text-center text-slate-400 text-sm mb-4",
            children: "Participants will share thoughts that float up the screen as bubbles."
        }, void 0, false, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 176,
            columnNumber: 36
        }, this);
        $[26] = type;
        $[27] = t12;
    } else {
        t12 = $[27];
    }
    let t13;
    if ($[28] !== onClose) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onClose,
            className: "flex-1 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition",
            children: "Cancel"
        }, void 0, false, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 184,
            columnNumber: 11
        }, this);
        $[28] = onClose;
        $[29] = t13;
    } else {
        t13 = $[29];
    }
    let t14;
    if ($[30] !== loading || $[31] !== question) {
        t14 = loading || !question.trim();
        $[30] = loading;
        $[31] = question;
        $[32] = t14;
    } else {
        t14 = $[32];
    }
    const t15 = loading ? "Launching..." : "Launch \uD83D\uDE80";
    let t16;
    if ($[33] !== handleSubmit || $[34] !== t14 || $[35] !== t15) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: handleSubmit,
            disabled: t14,
            className: "flex-1 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95",
            children: t15
        }, void 0, false, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 202,
            columnNumber: 11
        }, this);
        $[33] = handleSubmit;
        $[34] = t14;
        $[35] = t15;
        $[36] = t16;
    } else {
        t16 = $[36];
    }
    let t17;
    if ($[37] !== t13 || $[38] !== t16) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-3 mt-6",
            children: [
                t13,
                t16
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 212,
            columnNumber: 11
        }, this);
        $[37] = t13;
        $[38] = t16;
        $[39] = t17;
    } else {
        t17 = $[39];
    }
    let t18;
    if ($[40] !== t10 || $[41] !== t11 || $[42] !== t12 || $[43] !== t17 || $[44] !== t5 || $[45] !== t8 || $[46] !== t9) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl",
                children: [
                    t3,
                    t5,
                    t8,
                    t9,
                    t10,
                    t11,
                    t12,
                    t17
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/CreatePollForm.tsx",
                lineNumber: 221,
                columnNumber: 113
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 221,
            columnNumber: 11
        }, this);
        $[40] = t10;
        $[41] = t11;
        $[42] = t12;
        $[43] = t17;
        $[44] = t5;
        $[45] = t8;
        $[46] = t9;
        $[47] = t18;
    } else {
        t18 = $[47];
    }
    return t18;
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
    if ($[0] !== "9370d1fa712e9052cd0d3a345a9e556874ca67430e52b479a494f41cc0f05b00") {
        for(let $i = 0; $i < 23; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9370d1fa712e9052cd0d3a345a9e556874ca67430e52b479a494f41cc0f05b00";
    }
    const { onClose } = t0;
    const { locations } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])();
    const getXY = _MagicMapGetXY;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500",
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
                className: "relative w-full max-w-6xl aspect-2/1",
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
"[project]/src/components/TransientThoughts.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TransientThoughts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function TransientThoughts(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(15);
    if ($[0] !== "76c97b326cab0ba584905b328e157518ee23dc295d2b11fc08544540ef1039ff") {
        for(let $i = 0; $i < 15; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "76c97b326cab0ba584905b328e157518ee23dc295d2b11fc08544540ef1039ff";
    }
    const { responses } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = [];
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const [bubbles, setBubbles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    let t2;
    if ($[2] !== responses[0] || $[3] !== responses.length) {
        t2 = ({
            "TransientThoughts[useEffect()]": ()=>{
                if (responses.length === 0) {
                    return;
                }
                const newest = responses[0];
                const newBubble = {
                    id: Date.now(),
                    text: newest,
                    left: Math.random() * 80 + 10,
                    speed: Math.random() * 5 + 5
                };
                setBubbles({
                    "TransientThoughts[useEffect() > setBubbles()]": (prev)=>[
                            ...prev,
                            newBubble
                        ]
                }["TransientThoughts[useEffect() > setBubbles()]"]);
            }
        })["TransientThoughts[useEffect()]"];
        $[2] = responses[0];
        $[3] = responses.length;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let t3;
    if ($[5] !== responses) {
        t3 = [
            responses
        ];
        $[5] = responses;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t2, t3);
    let t4;
    if ($[7] !== bubbles) {
        t4 = bubbles.map(_TransientThoughtsBubblesMap);
        $[7] = bubbles;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    let t5;
    if ($[9] !== bubbles.length) {
        t5 = bubbles.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute inset-0 flex items-center justify-center text-slate-500",
            children: "Waiting for thoughts..."
        }, void 0, false, {
            fileName: "[project]/src/components/TransientThoughts.tsx",
            lineNumber: 68,
            columnNumber: 34
        }, this);
        $[9] = bubbles.length;
        $[10] = t5;
    } else {
        t5 = $[10];
    }
    let t6;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            id: "c0037758b871c5ab",
            children: "@keyframes floatUp{0%{opacity:0;transform:translateY(100%)scale(.5)}10%{opacity:1;transform:translateY(0)scale(1)}90%{opacity:1}to{opacity:0;transform:translateY(-500px)scale(1)}}.animate-floatUp.jsx-c0037758b871c5ab{animation-name:floatUp;animation-timing-function:linear}"
        }, void 0, false, void 0, this);
        $[11] = t6;
    } else {
        t6 = $[11];
    }
    let t7;
    if ($[12] !== t4 || $[13] !== t5) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative w-full h-100 overflow-hidden bg-slate-900/50 rounded-xl border border-slate-700",
            children: [
                t4,
                t5,
                t6
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/TransientThoughts.tsx",
            lineNumber: 83,
            columnNumber: 10
        }, this);
        $[12] = t4;
        $[13] = t5;
        $[14] = t7;
    } else {
        t7 = $[14];
    }
    return t7;
}
_s(TransientThoughts, "gdw+7nshbGboGEGjIMbGl+x++AU=");
_c = TransientThoughts;
function _TransientThoughtsBubblesMap(b) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute bottom-0 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 rounded-full text-white font-bold shadow-lg animate-floatUp opacity-0",
        style: {
            left: `${b.left}%`,
            animationDuration: `${b.speed}s`,
            animationFillMode: "forwards"
        },
        children: b.text
    }, b.id, false, {
        fileName: "[project]/src/components/TransientThoughts.tsx",
        lineNumber: 93,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "TransientThoughts");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TransientThoughts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/TransientThoughts.tsx [app-client] (ecmascript)");
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
;
function PresenterDashboard() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const code = params?.code ? String(params.code) : "";
    // 1. Connect Presenter to WebSocket
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRealtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRealtime"])(code);
    // Destructure all necessary state, including the new Branding state
    const { currentPoll, questions, isConnected, participants, quiz, quizScores, branding } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])();
    // 2. Local State
    const [showPollForm, setShowPollForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showWheel, setShowWheel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showQuizCreator, setShowQuizCreator] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showMap, setShowMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSettings, setShowSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("poll");
    const [tempLogo, setTempLogo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(branding.logo_url || "");
    // AI State
    const [aiSummary, setAiSummary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [analyzing, setAnalyzing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // --- HANDLERS ---
    // 3. AI Analysis Handler
    const handleAiAnalyze = async ()=>{
        setAnalyzing(true);
        setAiSummary("");
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
        window.location.href = `http://localhost:8001/api/session/${code}/export`;
    };
    // 6. Moderation Handler
    const handleToggleQuestion = async (qId)=>{
        await fetch(`http://localhost:8001/api/session/${code}/question/${qId}/toggle`, {
            method: "POST"
        });
    };
    // 7. Ban User Handler
    const handleBanUser = async (userName)=>{
        if (!confirm(`Are you sure you want to ban ${userName}?`)) return;
        await fetch(`http://localhost:8001/api/session/${code}/ban`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: userName
            })
        });
    };
    // 8. Save Branding Settings
    const saveSettings = async ()=>{
        await fetch(`http://localhost:8001/api/session/${code}/branding`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                logo_url: tempLogo,
                theme_color: branding.theme_color
            })
        });
        setShowSettings(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-slate-950 text-white p-4 sm:p-8 transition-all relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ReactionOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex justify-between items-center border-b border-slate-800 pb-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            branding.logo_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: branding.logo_url,
                                alt: "Logo",
                                className: "w-10 h-10 object-contain rounded-lg shadow-lg"
                            }, void 0, false, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 129,
                                columnNumber: 32
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 rounded-lg flex items-center justify-center font-bold shadow-lg",
                                style: {
                                    backgroundColor: branding.theme_color
                                },
                                children: "FR"
                            }, void 0, false, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 129,
                                columnNumber: 135
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "hidden sm:block text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400",
                                children: "FlexiRush Presenter"
                            }, void 0, false, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 134,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                        lineNumber: 128,
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
                                        lineNumber: 141,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-2xl sm:text-4xl font-mono font-bold tracking-widest text-white",
                                        children: code
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 142,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 140,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] sm:text-xs text-slate-500 uppercase font-bold tracking-tighter",
                                children: "Join Code"
                            }, void 0, false, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-2 bg-slate-900 p-4 sm:p-8 rounded-2xl border border-slate-800 min-h-125 flex flex-col shadow-2xl relative overflow-hidden",
                        children: quiz ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col h-full items-center justify-center text-center w-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-sm uppercase tracking-widest text-slate-400 mb-2",
                                    children: quiz.title
                                }, void 0, false, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 156,
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
                                            lineNumber: 159,
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
                                            lineNumber: 160,
                                            columnNumber: 26
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "pt-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleNextQuizStep,
                                                className: "px-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-xl shadow-lg animate-bounce",
                                                children: "Start Game 🚀"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 164,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 163,
                                            columnNumber: 26
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 158,
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
                                            lineNumber: 171,
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
                                                            lineNumber: 176,
                                                            columnNumber: 38
                                                        }, this),
                                                        opt
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 175,
                                                    columnNumber: 90
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 174,
                                            columnNumber: 26
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-full bg-white animate-[width_linear]",
                                                        style: {
                                                            width: '100%',
                                                            animationDuration: `${quiz.questions[quiz.current_index].time_limit}s`
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 182,
                                                        columnNumber: 34
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 30
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleNextQuizStep,
                                                    className: "text-slate-500 hover:text-white text-sm underline",
                                                    children: "Skip Timer / Reveal Answer"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 187,
                                                    columnNumber: 30
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 180,
                                            columnNumber: 26
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 170,
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
                                            lineNumber: 194,
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
                                                                    lineNumber: 198,
                                                                    columnNumber: 42
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-lg",
                                                                    children: name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                    lineNumber: 201,
                                                                    columnNumber: 42
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 197,
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
                                                            lineNumber: 203,
                                                            columnNumber: 38
                                                        }, this)
                                                    ]
                                                }, name, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 128
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 195,
                                            columnNumber: 26
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleNextQuizStep,
                                            className: "px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg",
                                            children: "Next Question →"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 206,
                                            columnNumber: 26
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 193,
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
                                            lineNumber: 212,
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
                                                    lineNumber: 216,
                                                    columnNumber: 30
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-4xl font-bold text-white",
                                                    children: Object.entries(quizScores).sort(([, a_0], [, b_0])=>b_0 - a_0)[0]?.[0] || "No one"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 217,
                                                    columnNumber: 30
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 215,
                                            columnNumber: 26
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>window.location.reload(),
                                            className: "px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition",
                                            children: "Close Quiz"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 221,
                                            columnNumber: 26
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 211,
                                    columnNumber: 43
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                            lineNumber: 155,
                            columnNumber: 19
                        }, this) : // === B. STANDARD DASHBOARD (Polls & Q&A) ===
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center mb-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg sm:text-xl font-semibold flex items-center gap-2",
                                        children: viewMode === "poll" ? "📊 Live Results" : "💬 Audience Q&A"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 229,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 228,
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
                                            lineNumber: 235,
                                            columnNumber: 21
                                        }, this),
                                        " No active widget."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 234,
                                    columnNumber: 55
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-2xl font-bold",
                                            children: currentPoll.question
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 237,
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
                                                                    lineNumber: 242,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-mono bg-slate-800 px-1 rounded",
                                                                    children: opt_0.votes
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                    lineNumber: 243,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 241,
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
                                                                lineNumber: 246,
                                                                columnNumber: 33
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 245,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, idx, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 240,
                                                    columnNumber: 80
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 239,
                                            columnNumber: 64
                                        }, this),
                                        currentPoll.type === "rating" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-center justify-center py-8",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-6xl font-bold text-yellow-400 flex items-center gap-2",
                                                children: [
                                                    currentPoll.average || 0.0,
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-4xl text-slate-600",
                                                        children: "/ 5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 255,
                                                        columnNumber: 58
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 254,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 253,
                                            columnNumber: 55
                                        }, this),
                                        currentPoll.type === "word_cloud" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-3 justify-center items-center py-4",
                                            children: Object.entries(currentPoll.words || {}).map(([word, count])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-blue-400 font-bold transition-all duration-500",
                                                    style: {
                                                        fontSize: `${Math.min(1 + count * 0.5, 4)}rem`
                                                    },
                                                    children: word
                                                }, word, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 260,
                                                    columnNumber: 91
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 259,
                                            columnNumber: 59
                                        }, this),
                                        currentPoll.type === "open_ended" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TransientThoughts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            responses: currentPoll.responses || []
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 267,
                                            columnNumber: 59
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 236,
                                    columnNumber: 28
                                }, this)),
                                viewMode === "qna" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3 overflow-y-auto max-h-125 pr-2 scrollbar-thin",
                                    children: questions.sort((a_1, b_1)=>b_1.votes - a_1.votes).map((q_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `p-4 rounded-xl border flex gap-4 transition group ${q_0.visible ? "bg-slate-800/50 border-slate-700 hover:border-blue-500/30" : "bg-slate-900/30 border-slate-800 opacity-50"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-center justify-center min-w-10 text-blue-400",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-lg font-bold",
                                                            children: "▲"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 273,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm font-mono",
                                                            children: q_0.votes
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 274,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 272,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `text-sm sm:text-base ${q_0.visible ? "text-slate-200" : "text-slate-500 italic line-through"}`,
                                                            children: q_0.text
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 277,
                                                            columnNumber: 27
                                                        }, this),
                                                        !q_0.visible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] text-red-400 uppercase font-bold tracking-wider",
                                                            children: "Hidden from audience"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 280,
                                                            columnNumber: 44
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 276,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleToggleQuestion(q_0.id),
                                                    className: "opacity-0 group-hover:opacity-100 p-2 rounded hover:bg-slate-700 text-slate-400 transition",
                                                    children: q_0.visible ? "🚫" : "👁️"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 282,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, q_0.id, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 271,
                                            columnNumber: 95
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 270,
                                    columnNumber: 38
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-800 shadow-xl max-h-75 overflow-y-auto custom-scrollbar",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg sm:text-xl font-semibold mb-4 text-slate-300 flex justify-between items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "👥 Participants"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 296,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-slate-800 px-2 py-1 rounded text-sm",
                                                children: participants.length
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 297,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 295,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            participants.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-slate-500 text-sm italic",
                                                children: "No one joined yet."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 300,
                                                columnNumber: 47
                                            }, this),
                                            participants.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between items-center bg-slate-800/50 p-2 rounded hover:bg-slate-800 transition group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm text-slate-300",
                                                            children: p
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 302,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleBanUser(p),
                                                            className: "text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-900/50 transition",
                                                            children: "Ban 🚫"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 303,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, p, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 301,
                                                    columnNumber: 40
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 299,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 294,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-800 shadow-xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg sm:text-xl font-semibold mb-4 text-slate-300",
                                        children: "Quick Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 312,
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
                                                        lineNumber: 318,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "🚀"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 318,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 314,
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
                                                        lineNumber: 321,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "🏆"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 321,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 320,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowWheel(true),
                                                className: "p-3 sm:p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition text-left flex justify-between items-center text-sm sm:text-base",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Spin Winning Wheel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 324,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "🎲"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 324,
                                                        columnNumber: 48
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 323,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowMap(true),
                                                className: "p-3 sm:p-4 bg-purple-900/50 hover:bg-purple-900 text-purple-200 border border-purple-500/30 rounded-lg transition text-left flex justify-between items-center text-sm sm:text-base",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Open Magic Map"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 327,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "🌍"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 327,
                                                        columnNumber: 44
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 326,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleExport,
                                                className: "p-3 sm:p-4 bg-orange-600/20 hover:bg-orange-600/40 text-orange-200 border border-orange-500/30 rounded-lg transition text-left flex justify-between items-center text-sm sm:text-base",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Export Results (CSV)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 330,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "📥"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 330,
                                                        columnNumber: 50
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 329,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setViewMode("qna"),
                                                className: `p-3 sm:p-4 font-bold rounded-lg transition text-left flex justify-between items-center text-sm sm:text-base ${viewMode === 'qna' ? "bg-slate-700 text-white border border-blue-500" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "View Q&A Board"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 333,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "bg-slate-900 px-2 py-0.5 rounded text-xs",
                                                        children: questions.length
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 334,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 332,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowSettings(true),
                                                className: "p-3 sm:p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition text-left flex justify-between items-center text-sm sm:text-base",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Session Settings"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 337,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "⚙️"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 337,
                                                        columnNumber: 46
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 336,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleAiAnalyze,
                                                disabled: analyzing,
                                                className: "mt-2 p-3 sm:p-4 bg-linear-to-r from-purple-700 to-purple-600 hover:from-purple-600 text-white font-bold rounded-lg transition text-left border border-purple-500/30 text-sm sm:text-base flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Analyze Room Vibe (AI)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 340,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: analyzing ? "animate-spin" : "",
                                                        children: "✨"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 340,
                                                        columnNumber: 52
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 339,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 313,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 311,
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
                                                lineNumber: 348,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-purple-400 text-xs font-bold uppercase tracking-widest",
                                                children: "Hive Mind Insights"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 349,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 347,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-slate-300 text-xs sm:text-sm whitespace-pre-line leading-relaxed italic border-l-2 border-purple-500 pl-3",
                                        children: aiSummary
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 351,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 346,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                        lineNumber: 291,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 149,
                columnNumber: 7
            }, this),
            showWheel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$WinningWheel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                participants: participants || [],
                onClose: ()=>setShowWheel(false)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 359,
                columnNumber: 21
            }, this),
            showPollForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CreatePollForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sessionCode: code,
                onClose: ()=>setShowPollForm(false)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 360,
                columnNumber: 24
            }, this),
            showQuizCreator && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuizCreator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sessionCode: code,
                onClose: ()=>setShowQuizCreator(false)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 361,
                columnNumber: 27
            }, this),
            showMap && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MagicMap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onClose: ()=>setShowMap(false)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 362,
                columnNumber: 19
            }, this),
            showSettings && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-100 backdrop-blur-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold mb-4",
                            children: "Session Settings"
                        }, void 0, false, {
                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                            lineNumber: 367,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block",
                                            children: "Custom Logo URL"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 370,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: tempLogo,
                                            onChange: (e)=>setTempLogo(e.target.value),
                                            placeholder: "https://example.com/logo.png",
                                            className: "w-full bg-slate-800 border border-slate-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 371,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 369,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-3 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowSettings(false),
                                            className: "flex-1 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition font-bold",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 374,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: saveSettings,
                                            className: "flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition shadow-lg",
                                            children: "Save Changes"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 375,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 373,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                            lineNumber: 368,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                    lineNumber: 366,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 365,
                columnNumber: 24
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/presenter/[code]/page.tsx",
        lineNumber: 121,
        columnNumber: 10
    }, this);
}
_s(PresenterDashboard, "88GmpUi+MlN2snpjF/bu6Z0LXio=", false, function() {
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

//# sourceMappingURL=src_08d9a2db._.js.map