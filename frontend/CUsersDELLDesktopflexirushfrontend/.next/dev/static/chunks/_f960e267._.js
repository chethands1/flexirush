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
"[project]/src/app/join/[code]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AudiencePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRealtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useRealtime.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/sessionStore.ts [app-client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// --- DYNAMIC IMPORTS (Fixes Hydration Errors) ---
const ReactionOverlay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/ReactionOverlay.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/ReactionOverlay.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = ReactionOverlay;
function AudiencePage(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(74);
    if ($[0] !== "cec4566895054b6f77a9def4036c22161de9c242ec5d85dbd4fc6069fc523ac4") {
        for(let $i = 0; $i < 74; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "cec4566895054b6f77a9def4036c22161de9c242ec5d85dbd4fc6069fc523ac4";
    }
    const { params } = t0;
    const { code } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(params);
    const { currentPoll, questions, isConnected, quiz } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])();
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isJoined, setIsJoined] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("poll");
    const [newQuestion, setNewQuestion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRealtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRealtime"])(code, isJoined ? name : "");
    let t1;
    if ($[1] !== code || $[2] !== name) {
        t1 = ({
            "AudiencePage[handleJoin]": async ()=>{
                if (!name.trim()) {
                    return;
                }
                try {
                    const res = await fetch(`http://localhost:8001/api/session/${code}/join`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name
                        })
                    });
                    if (res.ok) {
                        setIsJoined(true);
                    } else {
                        alert("Could not join session. It might be full or closed.");
                    }
                } catch  {
                    alert("Failed to connect to server.");
                }
            }
        })["AudiencePage[handleJoin]"];
        $[1] = code;
        $[2] = name;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    const handleJoin = t1;
    let t2;
    if ($[4] !== code || $[5] !== newQuestion) {
        t2 = ({
            "AudiencePage[handleAskQuestion]": async ()=>{
                if (!newQuestion.trim()) {
                    return;
                }
                await fetch(`http://localhost:8001/api/session/${code}/question`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        text: newQuestion
                    })
                });
                setNewQuestion("");
            }
        })["AudiencePage[handleAskQuestion]"];
        $[4] = code;
        $[5] = newQuestion;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    const handleAskQuestion = t2;
    let t3;
    if ($[7] !== code) {
        t3 = ({
            "AudiencePage[handleUpvote]": async (qId)=>{
                await fetch(`http://localhost:8001/api/session/${code}/question/${qId}/upvote`, {
                    method: "POST"
                });
            }
        })["AudiencePage[handleUpvote]"];
        $[7] = code;
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    const handleUpvote = t3;
    let t4;
    if ($[9] !== code) {
        t4 = ({
            "AudiencePage[sendReaction]": (emoji)=>{
                fetch(`http://localhost:8001/api/session/${code}/react`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        emoji
                    })
                });
            }
        })["AudiencePage[sendReaction]"];
        $[9] = code;
        $[10] = t4;
    } else {
        t4 = $[10];
    }
    const sendReaction = t4;
    if (!isJoined) {
        let t5;
        let t6;
        if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
            t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-12 h-12 bg-linear-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center font-bold text-xl mb-6 mx-auto",
                children: "FR"
            }, void 0, false, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 138,
                columnNumber: 12
            }, this);
            t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold text-center mb-2",
                children: "Join Session"
            }, void 0, false, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 139,
                columnNumber: 12
            }, this);
            $[11] = t5;
            $[12] = t6;
        } else {
            t5 = $[11];
            t6 = $[12];
        }
        let t7;
        if ($[13] !== code) {
            t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-slate-500 text-center mb-6 font-mono tracking-widest",
                children: code
            }, void 0, false, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 148,
                columnNumber: 12
            }, this);
            $[13] = code;
            $[14] = t7;
        } else {
            t7 = $[14];
        }
        let t8;
        if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
            t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "text-xs text-slate-400 font-bold ml-1",
                children: "YOUR NICKNAME"
            }, void 0, false, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 156,
                columnNumber: 12
            }, this);
            $[15] = t8;
        } else {
            t8 = $[15];
        }
        let t9;
        if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
            t9 = ({
                "AudiencePage[<input>.onChange]": (e)=>setName(e.target.value)
            })["AudiencePage[<input>.onChange]"];
            $[16] = t9;
        } else {
            t9 = $[16];
        }
        let t10;
        if ($[17] !== handleJoin) {
            t10 = ({
                "AudiencePage[<input>.onKeyDown]": (e_0)=>e_0.key === "Enter" && handleJoin()
            })["AudiencePage[<input>.onKeyDown]"];
            $[17] = handleJoin;
            $[18] = t10;
        } else {
            t10 = $[18];
        }
        let t11;
        if ($[19] !== name || $[20] !== t10) {
            t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    t8,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: "w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white mt-1 focus:ring-2 focus:ring-blue-500 outline-none",
                        placeholder: "e.g. Captain Kirk",
                        value: name,
                        onChange: t9,
                        onKeyDown: t10
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 182,
                        columnNumber: 22
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 182,
                columnNumber: 13
            }, this);
            $[19] = name;
            $[20] = t10;
            $[21] = t11;
        } else {
            t11 = $[21];
        }
        let t12;
        if ($[22] !== name) {
            t12 = name.trim();
            $[22] = name;
            $[23] = t12;
        } else {
            t12 = $[23];
        }
        const t13 = !t12;
        let t14;
        if ($[24] !== handleJoin || $[25] !== t13) {
            t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleJoin,
                disabled: t13,
                className: "w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition",
                children: "Enter Room →"
            }, void 0, false, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 200,
                columnNumber: 13
            }, this);
            $[24] = handleJoin;
            $[25] = t13;
            $[26] = t14;
        } else {
            t14 = $[26];
        }
        let t15;
        if ($[27] !== t11 || $[28] !== t14) {
            t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    t11,
                    t14
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 209,
                columnNumber: 13
            }, this);
            $[27] = t11;
            $[28] = t14;
            $[29] = t15;
        } else {
            t15 = $[29];
        }
        let t16;
        if ($[30] !== t15 || $[31] !== t7) {
            t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-sm bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl",
                    children: [
                        t5,
                        t6,
                        t7,
                        t15
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/join/[code]/page.tsx",
                    lineNumber: 218,
                    columnNumber: 113
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 218,
                columnNumber: 13
            }, this);
            $[30] = t15;
            $[31] = t7;
            $[32] = t16;
        } else {
            t16 = $[32];
        }
        return t16;
    }
    if (quiz && quiz.state !== "END") {
        let t5;
        if ($[33] !== code || $[34] !== name || $[35] !== quiz) {
            t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuizView, {
                quiz: quiz,
                code: code,
                name: name
            }, quiz.current_index, false, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 230,
                columnNumber: 12
            }, this);
            $[33] = code;
            $[34] = name;
            $[35] = quiz;
            $[36] = t5;
        } else {
            t5 = $[36];
        }
        return t5;
    }
    let t5;
    if ($[37] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReactionOverlay, {}, void 0, false, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 242,
            columnNumber: 10
        }, this);
        $[37] = t5;
    } else {
        t5 = $[37];
    }
    let t6;
    if ($[38] !== name) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            children: name
        }, void 0, false, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 249,
            columnNumber: 10
        }, this);
        $[38] = name;
        $[39] = t6;
    } else {
        t6 = $[39];
    }
    const t7 = isConnected ? "text-green-500" : "text-red-500";
    const t8 = isConnected ? "Live" : "Reconnecting...";
    let t9;
    if ($[40] !== t7 || $[41] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: t7,
            children: [
                "● ",
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 259,
            columnNumber: 10
        }, this);
        $[40] = t7;
        $[41] = t8;
        $[42] = t9;
    } else {
        t9 = $[42];
    }
    let t10;
    if ($[43] !== t6 || $[44] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-md flex justify-between text-xs text-slate-500 mb-6 uppercase font-bold tracking-widest",
            children: [
                t6,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 268,
            columnNumber: 11
        }, this);
        $[43] = t6;
        $[44] = t9;
        $[45] = t10;
    } else {
        t10 = $[45];
    }
    let t11;
    if ($[46] === Symbol.for("react.memo_cache_sentinel")) {
        t11 = ({
            "AudiencePage[<button>.onClick]": ()=>setActiveTab("poll")
        })["AudiencePage[<button>.onClick]"];
        $[46] = t11;
    } else {
        t11 = $[46];
    }
    const t12 = `flex-1 py-2 rounded-md text-sm font-semibold transition ${activeTab === "poll" ? "bg-blue-600 text-white shadow" : "text-slate-400"}`;
    let t13;
    if ($[47] !== t12) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: t11,
            className: t12,
            children: "Interactions"
        }, void 0, false, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 287,
            columnNumber: 11
        }, this);
        $[47] = t12;
        $[48] = t13;
    } else {
        t13 = $[48];
    }
    let t14;
    if ($[49] === Symbol.for("react.memo_cache_sentinel")) {
        t14 = ({
            "AudiencePage[<button>.onClick]": ()=>setActiveTab("qna")
        })["AudiencePage[<button>.onClick]"];
        $[49] = t14;
    } else {
        t14 = $[49];
    }
    const t15 = `flex-1 py-2 rounded-md text-sm font-semibold transition ${activeTab === "qna" ? "bg-purple-600 text-white shadow" : "text-slate-400"}`;
    let t16;
    if ($[50] !== questions) {
        t16 = questions.filter(_AudiencePageQuestionsFilter);
        $[50] = questions;
        $[51] = t16;
    } else {
        t16 = $[51];
    }
    let t17;
    if ($[52] !== t15 || $[53] !== t16.length) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: t14,
            className: t15,
            children: [
                "Q&A (",
                t16.length,
                ")"
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 313,
            columnNumber: 11
        }, this);
        $[52] = t15;
        $[53] = t16.length;
        $[54] = t17;
    } else {
        t17 = $[54];
    }
    let t18;
    if ($[55] !== t13 || $[56] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-md flex bg-slate-900 rounded-lg p-1 mb-6 border border-slate-800",
            children: [
                t13,
                t17
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 322,
            columnNumber: 11
        }, this);
        $[55] = t13;
        $[56] = t17;
        $[57] = t18;
    } else {
        t18 = $[57];
    }
    let t19;
    if ($[58] !== activeTab || $[59] !== code || $[60] !== currentPoll || $[61] !== handleAskQuestion || $[62] !== handleUpvote || $[63] !== newQuestion || $[64] !== questions) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-md flex-1",
            children: activeTab === "poll" ? !currentPoll ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-20 bg-slate-900 rounded-2xl border border-slate-800 animate-pulse",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold text-slate-300",
                        children: "Waiting for presenter..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 331,
                        columnNumber: 188
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 text-4xl",
                        children: "☕"
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 331,
                        columnNumber: 266
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 331,
                columnNumber: 90
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PollView, {
                poll: currentPoll,
                code: code
            }, currentPoll.id, false, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 331,
                columnNumber: 313
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col h-[60vh]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto space-y-3 mb-4 pr-1 custom-scrollbar",
                        children: questions.filter(_AudiencePageQuestionsFilter2).length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center text-slate-500 py-10",
                            children: "No questions yet. Be the first!"
                        }, void 0, false, {
                            fileName: "[project]/src/app/join/[code]/page.tsx",
                            lineNumber: 331,
                            columnNumber: 561
                        }, this) : questions.filter(_AudiencePageQuestionsFilter3).sort(_AudiencePageAnonymous).map({
                            "AudiencePage[(anonymous)()]": (q_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between gap-3 animate-fade-in",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-slate-200 text-sm",
                                            children: q_1.text
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/join/[code]/page.tsx",
                                            lineNumber: 332,
                                            columnNumber: 176
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: {
                                                "AudiencePage[(anonymous)() > <button>.onClick]": ()=>handleUpvote(q_1.id)
                                            }["AudiencePage[(anonymous)() > <button>.onClick]"],
                                            className: "flex flex-col items-center justify-center bg-slate-800 px-3 rounded-lg hover:bg-slate-700 transition min-w-10 active:scale-95",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lg text-blue-400",
                                                    children: "▲"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/join/[code]/page.tsx",
                                                    lineNumber: 334,
                                                    columnNumber: 206
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-bold",
                                                    children: q_1.votes
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/join/[code]/page.tsx",
                                                    lineNumber: 334,
                                                    columnNumber: 254
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/join/[code]/page.tsx",
                                            lineNumber: 332,
                                            columnNumber: 228
                                        }, this)
                                    ]
                                }, q_1.id, true, {
                                    fileName: "[project]/src/app/join/[code]/page.tsx",
                                    lineNumber: 332,
                                    columnNumber: 51
                                }, this)
                        }["AudiencePage[(anonymous)()]"])
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 331,
                        columnNumber: 420
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500",
                                placeholder: "Ask a question...",
                                value: newQuestion,
                                onChange: {
                                    "AudiencePage[<input>.onChange]": (e_1)=>setNewQuestion(e_1.target.value)
                                }["AudiencePage[<input>.onChange]"],
                                onKeyDown: {
                                    "AudiencePage[<input>.onKeyDown]": (e_2)=>e_2.key === "Enter" && handleAskQuestion()
                                }["AudiencePage[<input>.onKeyDown]"]
                            }, void 0, false, {
                                fileName: "[project]/src/app/join/[code]/page.tsx",
                                lineNumber: 335,
                                columnNumber: 79
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleAskQuestion,
                                className: "bg-purple-600 hover:bg-purple-500 px-4 rounded-lg font-bold active:scale-95 transition",
                                children: "Send"
                            }, void 0, false, {
                                fileName: "[project]/src/app/join/[code]/page.tsx",
                                lineNumber: 339,
                                columnNumber: 51
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 335,
                        columnNumber: 51
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 331,
                columnNumber: 380
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 331,
            columnNumber: 11
        }, this);
        $[58] = activeTab;
        $[59] = code;
        $[60] = currentPoll;
        $[61] = handleAskQuestion;
        $[62] = handleUpvote;
        $[63] = newQuestion;
        $[64] = questions;
        $[65] = t19;
    } else {
        t19 = $[65];
    }
    let t20;
    if ($[66] === Symbol.for("react.memo_cache_sentinel")) {
        t20 = [
            "\u2764\uFE0F",
            "\uD83D\uDD25",
            "\uD83D\uDC4F",
            "\uD83C\uDF89",
            "\uD83E\uDD14"
        ];
        $[66] = t20;
    } else {
        t20 = $[66];
    }
    let t21;
    if ($[67] !== sendReaction) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed bottom-6 flex gap-3 bg-slate-900/90 p-3 rounded-full border border-slate-700 shadow-2xl backdrop-blur-md z-50",
            children: t20.map({
                "AudiencePage[(anonymous)()]": (emoji_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "AudiencePage[(anonymous)() > <button>.onClick]": ()=>sendReaction(emoji_0)
                        }["AudiencePage[(anonymous)() > <button>.onClick]"],
                        className: "text-2xl hover:scale-125 transition active:scale-90",
                        children: emoji_0
                    }, emoji_0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 361,
                        columnNumber: 51
                    }, this)
            }["AudiencePage[(anonymous)()]"])
        }, void 0, false, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 360,
            columnNumber: 11
        }, this);
        $[67] = sendReaction;
        $[68] = t21;
    } else {
        t21 = $[68];
    }
    let t22;
    if ($[69] !== t10 || $[70] !== t18 || $[71] !== t19 || $[72] !== t21) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center pb-24 relative overflow-hidden",
            children: [
                t5,
                t10,
                t18,
                t19,
                t21
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 372,
            columnNumber: 11
        }, this);
        $[69] = t10;
        $[70] = t18;
        $[71] = t19;
        $[72] = t21;
        $[73] = t22;
    } else {
        t22 = $[73];
    }
    return t22;
}
_s(AudiencePage, "qOJGvf1LRe96z3GFoTbyQ2ljUUg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRealtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRealtime"]
    ];
});
_c1 = AudiencePage;
// === SUB-COMPONENTS (ISOLATED STATE MANAGEMENT) ===
// 1. QUIZ COMPONENT
// By isolating this, the "answered" state belongs only to this specific question instance.
// When the parent changes the key, this component unmounts (state lost) and remounts (state reset).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _AudiencePageAnonymous(a, b) {
    return b.votes - a.votes;
}
function _AudiencePageQuestionsFilter3(q_0) {
    return q_0.visible !== false;
}
function _AudiencePageQuestionsFilter2(q_2) {
    return q_2.visible !== false;
}
function _AudiencePageQuestionsFilter(q) {
    return q.visible !== false;
}
function QuizView(t0) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(18);
    if ($[0] !== "cec4566895054b6f77a9def4036c22161de9c242ec5d85dbd4fc6069fc523ac4") {
        for(let $i = 0; $i < 18; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "cec4566895054b6f77a9def4036c22161de9c242ec5d85dbd4fc6069fc523ac4";
    }
    const { quiz, code, name } = t0;
    const [answered, setAnswered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t1;
    if ($[1] !== answered || $[2] !== code || $[3] !== name) {
        t1 = ({
            "QuizView[submitAnswer]": async (index)=>{
                if (answered) {
                    return;
                }
                setAnswered(true);
                await fetch(`http://localhost:8001/api/session/${code}/quiz/answer`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_name: name,
                        option_index: index
                    })
                });
            }
        })["QuizView[submitAnswer]"];
        $[1] = answered;
        $[2] = code;
        $[3] = name;
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    const submitAnswer = t1;
    if (quiz.state === "LOBBY") {
        let t2;
        if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
            t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center animate-pulse pt-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl font-bold mb-4",
                        children: "Get Ready!"
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 447,
                        columnNumber: 61
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xl text-slate-400",
                        children: "Quiz starting..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 447,
                        columnNumber: 116
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 447,
                columnNumber: 12
            }, this);
            $[5] = t2;
        } else {
            t2 = $[5];
        }
        return t2;
    }
    if (quiz.state === "LEADERBOARD") {
        let t2;
        if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
            t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center pt-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-3xl font-bold mb-4 text-yellow-400",
                        children: "Time's Up!"
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 457,
                        columnNumber: 47
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-400",
                        children: "Check the big screen."
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 457,
                        columnNumber: 118
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 457,
                columnNumber: 12
            }, this);
            $[6] = t2;
        } else {
            t2 = $[6];
        }
        return t2;
    }
    const t2 = quiz.current_index + 1;
    let t3;
    if ($[7] !== quiz.questions.length || $[8] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center mb-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "bg-slate-800 px-3 py-1 rounded-full text-sm text-slate-300",
                children: [
                    "Question ",
                    t2,
                    " / ",
                    quiz.questions.length
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 467,
                columnNumber: 44
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 467,
            columnNumber: 10
        }, this);
        $[7] = quiz.questions.length;
        $[8] = t2;
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    let t4;
    if ($[10] !== answered || $[11] !== quiz.current_index || $[12] !== quiz.questions || $[13] !== submitAnswer) {
        t4 = answered ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-20 bg-slate-900 rounded-2xl border border-slate-800 animate-fade-in",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold mb-2 text-green-400",
                    children: "Answer Sent!"
                }, void 0, false, {
                    fileName: "[project]/src/app/join/[code]/page.tsx",
                    lineNumber: 476,
                    columnNumber: 121
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-slate-400",
                    children: "Wait for results..."
                }, void 0, false, {
                    fileName: "[project]/src/app/join/[code]/page.tsx",
                    lineNumber: 476,
                    columnNumber: 193
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 476,
            columnNumber: 21
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 gap-4 h-[50vh]",
            children: quiz.questions[quiz.current_index].options.map({
                "QuizView[(anonymous)()]": (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "QuizView[(anonymous)() > <button>.onClick]": ()=>submitAnswer(i)
                        }["QuizView[(anonymous)() > <button>.onClick]"],
                        className: `rounded-2xl shadow-lg transition active:scale-95 flex items-center justify-center text-4xl font-bold ${[
                            "bg-red-600",
                            "bg-blue-600",
                            "bg-yellow-600",
                            "bg-green-600"
                        ][i]}`,
                        children: [
                            "\u25B2",
                            "\u25C6",
                            "\u25CF",
                            "\u25A0"
                        ][i]
                    }, i, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 477,
                        columnNumber: 46
                    }, this)
            }["QuizView[(anonymous)()]"])
        }, void 0, false, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 476,
            columnNumber: 255
        }, this);
        $[10] = answered;
        $[11] = quiz.current_index;
        $[12] = quiz.questions;
        $[13] = submitAnswer;
        $[14] = t4;
    } else {
        t4 = $[14];
    }
    let t5;
    if ($[15] !== t3 || $[16] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-md pt-10",
            children: [
                t3,
                t4
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 491,
            columnNumber: 10
        }, this);
        $[15] = t3;
        $[16] = t4;
        $[17] = t5;
    } else {
        t5 = $[17];
    }
    return t5;
}
_s1(QuizView, "7U4SkanSBr33p2aXSmgvnRG2zp4=");
_c2 = QuizView;
// 2. POLL COMPONENT
// Same logic here: "hasVoted" resets automatically when the poll ID changes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PollView(t0) {
    _s2();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(24);
    if ($[0] !== "cec4566895054b6f77a9def4036c22161de9c242ec5d85dbd4fc6069fc523ac4") {
        for(let $i = 0; $i < 24; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "cec4566895054b6f77a9def4036c22161de9c242ec5d85dbd4fc6069fc523ac4";
    }
    const { poll, code } = t0;
    const [hasVoted, setHasVoted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [textInput, setTextInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    let t1;
    if ($[1] !== code || $[2] !== hasVoted || $[3] !== poll.type) {
        t1 = ({
            "PollView[handleVote]": async (value)=>{
                if (hasVoted && poll.type !== "word_cloud" && poll.type !== "open_ended") {
                    return;
                }
                if (poll.type !== "word_cloud" && poll.type !== "open_ended") {
                    setHasVoted(true);
                }
                await fetch(`http://localhost:8001/api/session/${code}/vote?value=${encodeURIComponent(value)}`, {
                    method: "POST"
                });
                if (poll.type === "word_cloud" || poll.type === "open_ended") {
                    setTextInput("");
                }
            }
        })["PollView[handleVote]"];
        $[1] = code;
        $[2] = hasVoted;
        $[3] = poll.type;
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    const handleVote = t1;
    let t2;
    if ($[5] !== poll.question) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-2xl font-bold mb-6",
            children: poll.question
        }, void 0, false, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 546,
            columnNumber: 10
        }, this);
        $[5] = poll.question;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] !== handleVote || $[8] !== hasVoted || $[9] !== poll.options || $[10] !== poll.type) {
        t3 = poll.type === "multiple_choice" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-3",
            children: poll.options?.map({
                "PollView[(anonymous)()]": (opt, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "PollView[(anonymous)() > <button>.onClick]": ()=>handleVote(idx)
                        }["PollView[(anonymous)() > <button>.onClick]"],
                        disabled: hasVoted,
                        className: `w-full p-4 text-left rounded-xl font-bold transition-all ${hasVoted ? "bg-slate-800 text-slate-500 border border-slate-700" : "bg-blue-600 hover:bg-blue-500 shadow-lg active:scale-95"}`,
                        children: [
                            opt.label,
                            " ",
                            hasVoted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "float-right",
                                children: "✔️"
                            }, void 0, false, {
                                fileName: "[project]/src/app/join/[code]/page.tsx",
                                lineNumber: 557,
                                columnNumber: 302
                            }, this)
                        ]
                    }, idx, true, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 555,
                        columnNumber: 50
                    }, this)
            }["PollView[(anonymous)()]"])
        }, void 0, false, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 554,
            columnNumber: 45
        }, this);
        $[7] = handleVote;
        $[8] = hasVoted;
        $[9] = poll.options;
        $[10] = poll.type;
        $[11] = t3;
    } else {
        t3 = $[11];
    }
    let t4;
    if ($[12] !== handleVote || $[13] !== poll.type) {
        t4 = poll.type === "rating" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center gap-2 py-4",
            children: [
                1,
                2,
                3,
                4,
                5
            ].map({
                "PollView[(anonymous)()]": (star)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "PollView[(anonymous)() > <button>.onClick]": ()=>handleVote(star)
                        }["PollView[(anonymous)() > <button>.onClick]"],
                        className: "text-4xl sm:text-5xl hover:scale-110 active:scale-90 transition",
                        children: "⭐"
                    }, star, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 570,
                        columnNumber: 44
                    }, this)
            }["PollView[(anonymous)()]"])
        }, void 0, false, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 569,
            columnNumber: 36
        }, this);
        $[12] = handleVote;
        $[13] = poll.type;
        $[14] = t4;
    } else {
        t4 = $[14];
    }
    let t5;
    if ($[15] !== handleVote || $[16] !== poll.type || $[17] !== textInput) {
        t5 = (poll.type === "word_cloud" || poll.type === "open_ended") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            className: "flex-1 bg-slate-800 p-3 rounded-lg text-white border border-slate-700 focus:border-blue-500 outline-none",
                            placeholder: poll.type === "word_cloud" ? "Type one word..." : "Share a thought...",
                            value: textInput,
                            onChange: {
                                "PollView[<input>.onChange]": (e)=>setTextInput(e.target.value)
                            }["PollView[<input>.onChange]"],
                            onKeyDown: {
                                "PollView[<input>.onKeyDown]": (e_0)=>e_0.key === "Enter" && textInput.trim() && handleVote(textInput)
                            }["PollView[<input>.onKeyDown]"]
                        }, void 0, false, {
                            fileName: "[project]/src/app/join/[code]/page.tsx",
                            lineNumber: 582,
                            columnNumber: 137
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: {
                                "PollView[<button>.onClick]": ()=>textInput.trim() && handleVote(textInput)
                            }["PollView[<button>.onClick]"],
                            className: "bg-blue-600 hover:bg-blue-500 px-5 rounded-lg font-bold transition active:scale-95",
                            children: "Send"
                        }, void 0, false, {
                            fileName: "[project]/src/app/join/[code]/page.tsx",
                            lineNumber: 586,
                            columnNumber: 45
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/join/[code]/page.tsx",
                    lineNumber: 582,
                    columnNumber: 109
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-[10px] text-slate-500 italic",
                    children: poll.type === "word_cloud" ? "Results appear in the cloud." : "Your thought will float up!"
                }, void 0, false, {
                    fileName: "[project]/src/app/join/[code]/page.tsx",
                    lineNumber: 588,
                    columnNumber: 156
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 582,
            columnNumber: 72
        }, this);
        $[15] = handleVote;
        $[16] = poll.type;
        $[17] = textInput;
        $[18] = t5;
    } else {
        t5 = $[18];
    }
    let t6;
    if ($[19] !== t2 || $[20] !== t3 || $[21] !== t4 || $[22] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-slate-900 p-6 rounded-2xl border border-slate-800 animate-slide-up",
            children: [
                t2,
                t3,
                t4,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 598,
            columnNumber: 10
        }, this);
        $[19] = t2;
        $[20] = t3;
        $[21] = t4;
        $[22] = t5;
        $[23] = t6;
    } else {
        t6 = $[23];
    }
    return t6;
}
_s2(PollView, "/61TIEtk7e1XGIGno6XROxBIHaY=");
_c3 = PollView;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "ReactionOverlay");
__turbopack_context__.k.register(_c1, "AudiencePage");
__turbopack_context__.k.register(_c2, "QuizView");
__turbopack_context__.k.register(_c3, "PollView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-compiler-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-compiler-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    var ReactSharedInternals = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)").__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    exports.c = function(size) {
        var dispatcher = ReactSharedInternals.H;
        null === dispatcher && console.error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.");
        return dispatcher.useMemoCache(size);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ 'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-compiler-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/dynamic-bailout-to-csr.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BailoutToCSR", {
    enumerable: true,
    get: function() {
        return BailoutToCSR;
    }
});
const _bailouttocsr = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js [app-client] (ecmascript)");
function BailoutToCSR({ reason, children }) {
    if (typeof window === 'undefined') {
        throw Object.defineProperty(new _bailouttocsr.BailoutToCSRError(reason), "__NEXT_ERROR_CODE", {
            value: "E394",
            enumerable: false,
            configurable: true
        });
    }
    return children;
} //# sourceMappingURL=dynamic-bailout-to-csr.js.map
}),
"[project]/node_modules/next/dist/shared/lib/encode-uri-path.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "encodeURIPath", {
    enumerable: true,
    get: function() {
        return encodeURIPath;
    }
});
function encodeURIPath(file) {
    return file.split('/').map((p)=>encodeURIComponent(p)).join('/');
} //# sourceMappingURL=encode-uri-path.js.map
}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/preload-chunks.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PreloadChunks", {
    enumerable: true,
    get: function() {
        return PreloadChunks;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _reactdom = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
const _workasyncstorageexternal = __turbopack_context__.r("[project]/node_modules/next/dist/server/app-render/work-async-storage.external.js [app-client] (ecmascript)");
const _encodeuripath = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/encode-uri-path.js [app-client] (ecmascript)");
const _deploymentid = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/deployment-id.js [app-client] (ecmascript)");
function PreloadChunks({ moduleIds }) {
    // Early return in client compilation and only load requestStore on server side
    if (typeof window !== 'undefined') {
        return null;
    }
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    if (workStore === undefined) {
        return null;
    }
    const allFiles = [];
    // Search the current dynamic call unique key id in react loadable manifest,
    // and find the corresponding CSS files to preload
    if (workStore.reactLoadableManifest && moduleIds) {
        const manifest = workStore.reactLoadableManifest;
        for (const key of moduleIds){
            if (!manifest[key]) continue;
            const chunks = manifest[key].files;
            allFiles.push(...chunks);
        }
    }
    if (allFiles.length === 0) {
        return null;
    }
    const dplId = (0, _deploymentid.getDeploymentIdQueryOrEmptyString)();
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_jsxruntime.Fragment, {
        children: allFiles.map((chunk)=>{
            const href = `${workStore.assetPrefix}/_next/${(0, _encodeuripath.encodeURIPath)(chunk)}${dplId}`;
            const isCss = chunk.endsWith('.css');
            // If it's stylesheet we use `precedence` o help hoist with React Float.
            // For stylesheets we actually need to render the CSS because nothing else is going to do it so it needs to be part of the component tree.
            // The `preload` for stylesheet is not optional.
            if (isCss) {
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
                    // @ts-ignore
                    precedence: "dynamic",
                    href: href,
                    rel: "stylesheet",
                    as: "style",
                    nonce: workStore.nonce
                }, chunk);
            } else {
                // If it's script we use ReactDOM.preload to preload the resources
                (0, _reactdom.preload)(href, {
                    as: 'script',
                    fetchPriority: 'low',
                    nonce: workStore.nonce
                });
                return null;
            }
        })
    });
} //# sourceMappingURL=preload-chunks.js.map
}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/loadable.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
const _dynamicbailouttocsr = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/dynamic-bailout-to-csr.js [app-client] (ecmascript)");
const _preloadchunks = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/preload-chunks.js [app-client] (ecmascript)");
// Normalize loader to return the module as form { default: Component } for `React.lazy`.
// Also for backward compatible since next/dynamic allows to resolve a component directly with loader
// Client component reference proxy need to be converted to a module.
function convertModule(mod) {
    // Check "default" prop before accessing it, as it could be client reference proxy that could break it reference.
    // Cases:
    // mod: { default: Component }
    // mod: Component
    // mod: { default: proxy(Component) }
    // mod: proxy(Component)
    const hasDefault = mod && 'default' in mod;
    return {
        default: hasDefault ? mod.default : mod
    };
}
const defaultOptions = {
    loader: ()=>Promise.resolve(convertModule(()=>null)),
    loading: null,
    ssr: true
};
function Loadable(options) {
    const opts = {
        ...defaultOptions,
        ...options
    };
    const Lazy = /*#__PURE__*/ (0, _react.lazy)(()=>opts.loader().then(convertModule));
    const Loading = opts.loading;
    function LoadableComponent(props) {
        const fallbackElement = Loading ? /*#__PURE__*/ (0, _jsxruntime.jsx)(Loading, {
            isLoading: true,
            pastDelay: true,
            error: null
        }) : null;
        // If it's non-SSR or provided a loading component, wrap it in a suspense boundary
        const hasSuspenseBoundary = !opts.ssr || !!opts.loading;
        const Wrap = hasSuspenseBoundary ? _react.Suspense : _react.Fragment;
        const wrapProps = hasSuspenseBoundary ? {
            fallback: fallbackElement
        } : {};
        const children = opts.ssr ? /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
            children: [
                typeof window === 'undefined' ? /*#__PURE__*/ (0, _jsxruntime.jsx)(_preloadchunks.PreloadChunks, {
                    moduleIds: opts.modules
                }) : null,
                /*#__PURE__*/ (0, _jsxruntime.jsx)(Lazy, {
                    ...props
                })
            ]
        }) : /*#__PURE__*/ (0, _jsxruntime.jsx)(_dynamicbailouttocsr.BailoutToCSR, {
            reason: "next/dynamic",
            children: /*#__PURE__*/ (0, _jsxruntime.jsx)(Lazy, {
                ...props
            })
        });
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(Wrap, {
            ...wrapProps,
            children: children
        });
    }
    LoadableComponent.displayName = 'LoadableComponent';
    return LoadableComponent;
}
const _default = Loadable; //# sourceMappingURL=loadable.js.map
}),
"[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return dynamic;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _loadable = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/loadable.js [app-client] (ecmascript)"));
function dynamic(dynamicOptions, options) {
    const loadableOptions = {};
    if (typeof dynamicOptions === 'function') {
        loadableOptions.loader = dynamicOptions;
    }
    const mergedOptions = {
        ...loadableOptions,
        ...options
    };
    return (0, _loadable.default)({
        ...mergedOptions,
        modules: mergedOptions.loadableGenerated?.modules
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=app-dynamic.js.map
}),
"[project]/node_modules/zustand/esm/vanilla.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createStore",
    ()=>createStore
]);
const createStoreImpl = (createState)=>{
    let state;
    const listeners = /* @__PURE__ */ new Set();
    const setState = (partial, replace)=>{
        const nextState = typeof partial === "function" ? partial(state) : partial;
        if (!Object.is(nextState, state)) {
            const previousState = state;
            state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
            listeners.forEach((listener)=>listener(state, previousState));
        }
    };
    const getState = ()=>state;
    const getInitialState = ()=>initialState;
    const subscribe = (listener)=>{
        listeners.add(listener);
        return ()=>listeners.delete(listener);
    };
    const api = {
        setState,
        getState,
        getInitialState,
        subscribe
    };
    const initialState = state = createState(setState, getState, api);
    return api;
};
const createStore = (createState)=>createState ? createStoreImpl(createState) : createStoreImpl;
;
}),
"[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "create",
    ()=>create,
    "useStore",
    ()=>useStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/vanilla.mjs [app-client] (ecmascript)");
;
;
const identity = (arg)=>arg;
function useStore(api, selector = identity) {
    const slice = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useSyncExternalStore(api.subscribe, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "useStore.useSyncExternalStore[slice]": ()=>selector(api.getState())
    }["useStore.useSyncExternalStore[slice]"], [
        api,
        selector
    ]), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "useStore.useSyncExternalStore[slice]": ()=>selector(api.getInitialState())
    }["useStore.useSyncExternalStore[slice]"], [
        api,
        selector
    ]));
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useDebugValue(slice);
    return slice;
}
const createImpl = (createState)=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createStore"])(createState);
    const useBoundStore = (selector)=>useStore(api, selector);
    Object.assign(useBoundStore, api);
    return useBoundStore;
};
const create = (createState)=>createState ? createImpl(createState) : createImpl;
;
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_f960e267._.js.map