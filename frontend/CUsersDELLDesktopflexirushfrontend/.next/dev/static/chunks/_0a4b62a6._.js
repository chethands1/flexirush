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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRealtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useRealtime.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/sessionStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function AudiencePage() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(99);
    if ($[0] !== "4cf8323920c32386a923c2bf04c85a7aad83f2b8a02cc5a482d4125d94f9d8bc") {
        for(let $i = 0; $i < 99; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4cf8323920c32386a923c2bf04c85a7aad83f2b8a02cc5a482d4125d94f9d8bc";
    }
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const code = params.code;
    const { currentPoll, questions, isConnected, quiz } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])();
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isJoined, setIsJoined] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("poll");
    const [newQuestion, setNewQuestion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [hasVoted, setHasVoted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [textInput, setTextInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [quizAnswered, setQuizAnswered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRealtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRealtime"])(code, name);
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = ({
            "AudiencePage[useEffect()]": ()=>{
                setQuizAnswered(false);
            }
        })["AudiencePage[useEffect()]"];
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const t1 = quiz?.current_index;
    let t2;
    if ($[2] !== t1) {
        t2 = [
            t1
        ];
        $[2] = t1;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t0, t2);
    let t3;
    if ($[4] !== code || $[5] !== name) {
        t3 = ({
            "AudiencePage[handleJoin]": async ()=>{
                if (!name.trim()) {
                    return;
                }
                ;
                try {
                    await fetch(`http://localhost:8001/api/session/${code}/join`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name
                        })
                    });
                    setIsJoined(true);
                } catch (t4) {
                    alert("Failed to join session");
                }
            }
        })["AudiencePage[handleJoin]"];
        $[4] = code;
        $[5] = name;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    const handleJoin = t3;
    let t4;
    if ($[7] !== code || $[8] !== currentPoll?.type) {
        t4 = ({
            "AudiencePage[handleVote]": async (value)=>{
                if (currentPoll?.type !== "word_cloud" && currentPoll?.type !== "open_ended") {
                    setHasVoted(true);
                }
                await fetch(`http://localhost:8001/api/session/${code}/vote?value=${encodeURIComponent(value)}`, {
                    method: "POST"
                });
            }
        })["AudiencePage[handleVote]"];
        $[7] = code;
        $[8] = currentPoll?.type;
        $[9] = t4;
    } else {
        t4 = $[9];
    }
    const handleVote = t4;
    let t5;
    if ($[10] !== handleVote || $[11] !== textInput) {
        t5 = ({
            "AudiencePage[handleTextSubmit]": ()=>{
                if (textInput.trim()) {
                    handleVote(textInput);
                    setTextInput("");
                }
            }
        })["AudiencePage[handleTextSubmit]"];
        $[10] = handleVote;
        $[11] = textInput;
        $[12] = t5;
    } else {
        t5 = $[12];
    }
    const handleTextSubmit = t5;
    let t6;
    if ($[13] !== code || $[14] !== newQuestion) {
        t6 = ({
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
        $[13] = code;
        $[14] = newQuestion;
        $[15] = t6;
    } else {
        t6 = $[15];
    }
    const handleAskQuestion = t6;
    let t7;
    if ($[16] !== code) {
        t7 = ({
            "AudiencePage[handleUpvote]": async (qId)=>{
                await fetch(`http://localhost:8001/api/session/${code}/question/${qId}/upvote`, {
                    method: "POST"
                });
            }
        })["AudiencePage[handleUpvote]"];
        $[16] = code;
        $[17] = t7;
    } else {
        t7 = $[17];
    }
    const handleUpvote = t7;
    let t8;
    if ($[18] !== code) {
        t8 = ({
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
        $[18] = code;
        $[19] = t8;
    } else {
        t8 = $[19];
    }
    const sendReaction = t8;
    let t9;
    if ($[20] !== code || $[21] !== name || $[22] !== quizAnswered) {
        t9 = ({
            "AudiencePage[submitQuizAnswer]": async (index)=>{
                if (quizAnswered) {
                    return;
                }
                setQuizAnswered(true);
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
        })["AudiencePage[submitQuizAnswer]"];
        $[20] = code;
        $[21] = name;
        $[22] = quizAnswered;
        $[23] = t9;
    } else {
        t9 = $[23];
    }
    const submitQuizAnswer = t9;
    if (!isJoined) {
        let t10;
        let t11;
        if ($[24] === Symbol.for("react.memo_cache_sentinel")) {
            t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-12 h-12 bg-linear-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center font-bold text-xl mb-6 mx-auto",
                children: "FR"
            }, void 0, false, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 214,
                columnNumber: 13
            }, this);
            t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold text-center mb-2",
                children: "Join Session"
            }, void 0, false, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 215,
                columnNumber: 13
            }, this);
            $[24] = t10;
            $[25] = t11;
        } else {
            t10 = $[24];
            t11 = $[25];
        }
        let t12;
        if ($[26] !== code) {
            t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-slate-500 text-center mb-6 font-mono tracking-widest",
                children: code
            }, void 0, false, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 224,
                columnNumber: 13
            }, this);
            $[26] = code;
            $[27] = t12;
        } else {
            t12 = $[27];
        }
        let t13;
        if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
            t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "text-xs text-slate-400 font-bold ml-1",
                children: "YOUR NICKNAME"
            }, void 0, false, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 232,
                columnNumber: 13
            }, this);
            $[28] = t13;
        } else {
            t13 = $[28];
        }
        let t14;
        if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
            t14 = ({
                "AudiencePage[<input>.onChange]": (e)=>setName(e.target.value)
            })["AudiencePage[<input>.onChange]"];
            $[29] = t14;
        } else {
            t14 = $[29];
        }
        let t15;
        if ($[30] !== handleJoin) {
            t15 = ({
                "AudiencePage[<input>.onKeyDown]": (e_0)=>e_0.key === "Enter" && handleJoin()
            })["AudiencePage[<input>.onKeyDown]"];
            $[30] = handleJoin;
            $[31] = t15;
        } else {
            t15 = $[31];
        }
        let t16;
        if ($[32] !== name || $[33] !== t15) {
            t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    t13,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: "w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white mt-1 focus:ring-2 focus:ring-blue-500 outline-none",
                        placeholder: "e.g. Captain Kirk",
                        value: name,
                        onChange: t14,
                        onKeyDown: t15
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 258,
                        columnNumber: 23
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 258,
                columnNumber: 13
            }, this);
            $[32] = name;
            $[33] = t15;
            $[34] = t16;
        } else {
            t16 = $[34];
        }
        let t17;
        if ($[35] !== name) {
            t17 = name.trim();
            $[35] = name;
            $[36] = t17;
        } else {
            t17 = $[36];
        }
        const t18 = !t17;
        let t19;
        if ($[37] !== handleJoin || $[38] !== t18) {
            t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleJoin,
                disabled: t18,
                className: "w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg",
                children: "Enter Room →"
            }, void 0, false, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 276,
                columnNumber: 13
            }, this);
            $[37] = handleJoin;
            $[38] = t18;
            $[39] = t19;
        } else {
            t19 = $[39];
        }
        let t20;
        if ($[40] !== t16 || $[41] !== t19) {
            t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    t16,
                    t19
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 285,
                columnNumber: 13
            }, this);
            $[40] = t16;
            $[41] = t19;
            $[42] = t20;
        } else {
            t20 = $[42];
        }
        let t21;
        if ($[43] !== t12 || $[44] !== t20) {
            t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-sm bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl",
                    children: [
                        t10,
                        t11,
                        t12,
                        t20
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/join/[code]/page.tsx",
                    lineNumber: 294,
                    columnNumber: 113
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 294,
                columnNumber: 13
            }, this);
            $[43] = t12;
            $[44] = t20;
            $[45] = t21;
        } else {
            t21 = $[45];
        }
        return t21;
    }
    if (quiz && quiz.state !== "END") {
        let t10;
        if ($[46] !== quiz.state) {
            t10 = quiz.state === "LOBBY" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center animate-pulse",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl font-bold mb-4",
                        children: "Get Ready!"
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 306,
                        columnNumber: 82
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xl text-slate-400",
                        children: "Quiz is starting soon..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 306,
                        columnNumber: 137
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 306,
                columnNumber: 39
            }, this);
            $[46] = quiz.state;
            $[47] = t10;
        } else {
            t10 = $[47];
        }
        let t11;
        if ($[48] !== quiz.current_index || $[49] !== quiz.questions || $[50] !== quiz.state || $[51] !== quizAnswered || $[52] !== submitQuizAnswer) {
            t11 = quiz.state === "QUESTION" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "bg-slate-800 px-3 py-1 rounded-full text-sm text-slate-300",
                            children: [
                                "Question ",
                                quiz.current_index + 1,
                                " of ",
                                quiz.questions.length
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/join/[code]/page.tsx",
                            lineNumber: 314,
                            columnNumber: 109
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 314,
                        columnNumber: 75
                    }, this),
                    quizAnswered ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-20 bg-slate-900 rounded-2xl border border-slate-800",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold mb-2 text-green-400",
                                children: "Answer Sent!"
                            }, void 0, false, {
                                fileName: "[project]/src/app/join/[code]/page.tsx",
                                lineNumber: 314,
                                columnNumber: 359
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-slate-400",
                                children: "Wait for results..."
                            }, void 0, false, {
                                fileName: "[project]/src/app/join/[code]/page.tsx",
                                lineNumber: 314,
                                columnNumber: 431
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 314,
                        columnNumber: 275
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-4 h-[50vh]",
                        children: quiz.questions[quiz.current_index].options.map({
                            "AudiencePage[(anonymous)()]": (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "AudiencePage[(anonymous)() > <button>.onClick]": ()=>submitQuizAnswer(i)
                                    }["AudiencePage[(anonymous)() > <button>.onClick]"],
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
                                    lineNumber: 315,
                                    columnNumber: 54
                                }, this)
                        }["AudiencePage[(anonymous)()]"])
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 314,
                        columnNumber: 493
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 314,
                columnNumber: 42
            }, this);
            $[48] = quiz.current_index;
            $[49] = quiz.questions;
            $[50] = quiz.state;
            $[51] = quizAnswered;
            $[52] = submitQuizAnswer;
            $[53] = t11;
        } else {
            t11 = $[53];
        }
        let t12;
        if ($[54] !== quiz.state) {
            t12 = quiz.state === "LEADERBOARD" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-3xl font-bold mb-4 text-yellow-400",
                        children: "Time's Up!"
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 330,
                        columnNumber: 74
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-400",
                        children: "Look at the big screen for scores."
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 330,
                        columnNumber: 145
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 330,
                columnNumber: 45
            }, this);
            $[54] = quiz.state;
            $[55] = t12;
        } else {
            t12 = $[55];
        }
        let t13;
        if ($[56] !== t10 || $[57] !== t11 || $[58] !== t12) {
            t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center text-white",
                children: [
                    t10,
                    t11,
                    t12
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 338,
                columnNumber: 13
            }, this);
            $[56] = t10;
            $[57] = t11;
            $[58] = t12;
            $[59] = t13;
        } else {
            t13 = $[59];
        }
        return t13;
    }
    let t10;
    if ($[60] !== name) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            children: name
        }, void 0, false, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 350,
            columnNumber: 11
        }, this);
        $[60] = name;
        $[61] = t10;
    } else {
        t10 = $[61];
    }
    const t11 = isConnected ? "text-green-500" : "text-red-500";
    const t12 = isConnected ? "Live" : "Reconnecting...";
    let t13;
    if ($[62] !== t11 || $[63] !== t12) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: t11,
            children: [
                "● ",
                t12
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 360,
            columnNumber: 11
        }, this);
        $[62] = t11;
        $[63] = t12;
        $[64] = t13;
    } else {
        t13 = $[64];
    }
    let t14;
    if ($[65] !== t10 || $[66] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-md flex justify-between text-xs text-slate-500 mb-6 uppercase font-bold tracking-widest",
            children: [
                t10,
                t13
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 369,
            columnNumber: 11
        }, this);
        $[65] = t10;
        $[66] = t13;
        $[67] = t14;
    } else {
        t14 = $[67];
    }
    let t15;
    if ($[68] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = ({
            "AudiencePage[<button>.onClick]": ()=>setActiveTab("poll")
        })["AudiencePage[<button>.onClick]"];
        $[68] = t15;
    } else {
        t15 = $[68];
    }
    const t16 = `flex-1 py-2 rounded-md text-sm font-semibold transition ${activeTab === "poll" ? "bg-blue-600 text-white shadow" : "text-slate-400"}`;
    let t17;
    if ($[69] !== t16) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: t15,
            className: t16,
            children: "Interactions"
        }, void 0, false, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 388,
            columnNumber: 11
        }, this);
        $[69] = t16;
        $[70] = t17;
    } else {
        t17 = $[70];
    }
    let t18;
    if ($[71] === Symbol.for("react.memo_cache_sentinel")) {
        t18 = ({
            "AudiencePage[<button>.onClick]": ()=>setActiveTab("qna")
        })["AudiencePage[<button>.onClick]"];
        $[71] = t18;
    } else {
        t18 = $[71];
    }
    const t19 = `flex-1 py-2 rounded-md text-sm font-semibold transition ${activeTab === "qna" ? "bg-purple-600 text-white shadow" : "text-slate-400"}`;
    let t20;
    if ($[72] !== questions) {
        t20 = questions.filter(_AudiencePageQuestionsFilter);
        $[72] = questions;
        $[73] = t20;
    } else {
        t20 = $[73];
    }
    let t21;
    if ($[74] !== t19 || $[75] !== t20.length) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: t18,
            className: t19,
            children: [
                "Q&A (",
                t20.length,
                ")"
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 414,
            columnNumber: 11
        }, this);
        $[74] = t19;
        $[75] = t20.length;
        $[76] = t21;
    } else {
        t21 = $[76];
    }
    let t22;
    if ($[77] !== t17 || $[78] !== t21) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-md flex bg-slate-900 rounded-lg p-1 mb-6 border border-slate-800",
            children: [
                t17,
                t21
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 423,
            columnNumber: 11
        }, this);
        $[77] = t17;
        $[78] = t21;
        $[79] = t22;
    } else {
        t22 = $[79];
    }
    let t23;
    if ($[80] !== activeTab || $[81] !== currentPoll || $[82] !== handleAskQuestion || $[83] !== handleTextSubmit || $[84] !== handleUpvote || $[85] !== handleVote || $[86] !== hasVoted || $[87] !== newQuestion || $[88] !== questions || $[89] !== textInput) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-md",
            children: activeTab === "poll" ? !currentPoll ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-20 bg-slate-900 rounded-2xl border border-slate-800 animate-pulse",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl font-bold text-slate-300",
                    children: "Waiting for presenter..."
                }, void 0, false, {
                    fileName: "[project]/src/app/join/[code]/page.tsx",
                    lineNumber: 432,
                    columnNumber: 181
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 432,
                columnNumber: 83
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-slate-900 p-6 rounded-2xl border border-slate-800",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold mb-6",
                        children: currentPoll.question
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 432,
                        columnNumber: 338
                    }, this),
                    currentPoll.type === "multiple_choice" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: currentPoll.options?.map({
                            "AudiencePage[(anonymous)()]": (opt, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "AudiencePage[(anonymous)() > <button>.onClick]": ()=>handleVote(idx)
                                    }["AudiencePage[(anonymous)() > <button>.onClick]"],
                                    disabled: hasVoted,
                                    className: `w-full p-4 text-left rounded-xl font-bold transition-all ${hasVoted ? "bg-slate-800 text-slate-500" : "bg-blue-600 hover:bg-blue-500 shadow-lg"}`,
                                    children: opt.label
                                }, idx, false, {
                                    fileName: "[project]/src/app/join/[code]/page.tsx",
                                    lineNumber: 433,
                                    columnNumber: 58
                                }, this)
                        }["AudiencePage[(anonymous)()]"])
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 432,
                        columnNumber: 448
                    }, this),
                    currentPoll.type === "rating" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center gap-2 py-4",
                        children: [
                            1,
                            2,
                            3,
                            4,
                            5
                        ].map({
                            "AudiencePage[(anonymous)()]": (star)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "AudiencePage[(anonymous)() > <button>.onClick]": ()=>handleVote(star)
                                    }["AudiencePage[(anonymous)() > <button>.onClick]"],
                                    className: "text-5xl hover:scale-110 active:scale-90 transition",
                                    children: "⭐"
                                }, star, false, {
                                    fileName: "[project]/src/app/join/[code]/page.tsx",
                                    lineNumber: 437,
                                    columnNumber: 52
                                }, this)
                        }["AudiencePage[(anonymous)()]"])
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 436,
                        columnNumber: 86
                    }, this),
                    (currentPoll.type === "word_cloud" || currentPoll.type === "open_ended") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "flex-1 bg-slate-800 p-3 rounded-lg text-white border border-slate-700 focus:border-blue-500 outline-none",
                                        placeholder: currentPoll.type === "word_cloud" ? "Type one word..." : "Share a thought...",
                                        value: textInput,
                                        onChange: {
                                            "AudiencePage[<input>.onChange]": (e_1)=>setTextInput(e_1.target.value)
                                        }["AudiencePage[<input>.onChange]"],
                                        onKeyDown: {
                                            "AudiencePage[<input>.onKeyDown]": (e_2)=>e_2.key === "Enter" && handleTextSubmit()
                                        }["AudiencePage[<input>.onKeyDown]"]
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/join/[code]/page.tsx",
                                        lineNumber: 440,
                                        columnNumber: 194
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleTextSubmit,
                                        className: "bg-blue-600 hover:bg-blue-500 px-5 rounded-lg font-bold transition active:scale-95",
                                        children: "Send"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/join/[code]/page.tsx",
                                        lineNumber: 444,
                                        columnNumber: 53
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/join/[code]/page.tsx",
                                lineNumber: 440,
                                columnNumber: 166
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] text-slate-500 italic",
                                children: currentPoll.type === "word_cloud" ? "Results appear in the cloud." : "Your thought will float up!"
                            }, void 0, false, {
                                fileName: "[project]/src/app/join/[code]/page.tsx",
                                lineNumber: 444,
                                columnNumber: 202
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 440,
                        columnNumber: 129
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 432,
                columnNumber: 268
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col h-[60vh]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto space-y-3 mb-4 pr-1 scrollbar-thin",
                        children: questions.filter(_AudiencePageQuestionsFilter2).length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center text-slate-500 py-10",
                            children: "No questions yet."
                        }, void 0, false, {
                            fileName: "[project]/src/app/join/[code]/page.tsx",
                            lineNumber: 444,
                            columnNumber: 550
                        }, this) : questions.filter(_AudiencePageQuestionsFilter3).sort(_AudiencePageAnonymous).map({
                            "AudiencePage[(anonymous)()]": (q_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-slate-200 text-sm",
                                            children: q_1.text
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/join/[code]/page.tsx",
                                            lineNumber: 445,
                                            columnNumber: 160
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: {
                                                "AudiencePage[(anonymous)() > <button>.onClick]": ()=>handleUpvote(q_1.id)
                                            }["AudiencePage[(anonymous)() > <button>.onClick]"],
                                            className: "flex flex-col items-center justify-center bg-slate-800 px-3 rounded-lg hover:bg-slate-700 transition min-w-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lg text-blue-400",
                                                    children: "▲"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/join/[code]/page.tsx",
                                                    lineNumber: 447,
                                                    columnNumber: 190
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-bold",
                                                    children: q_1.votes
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/join/[code]/page.tsx",
                                                    lineNumber: 447,
                                                    columnNumber: 238
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/join/[code]/page.tsx",
                                            lineNumber: 445,
                                            columnNumber: 212
                                        }, this)
                                    ]
                                }, q_1.id, true, {
                                    fileName: "[project]/src/app/join/[code]/page.tsx",
                                    lineNumber: 445,
                                    columnNumber: 51
                                }, this)
                        }["AudiencePage[(anonymous)()]"])
                    }, void 0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 444,
                        columnNumber: 411
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500",
                                placeholder: "Ask a question...",
                                value: newQuestion,
                                onChange: {
                                    "AudiencePage[<input>.onChange]": (e_3)=>setNewQuestion(e_3.target.value)
                                }["AudiencePage[<input>.onChange]"]
                            }, void 0, false, {
                                fileName: "[project]/src/app/join/[code]/page.tsx",
                                lineNumber: 448,
                                columnNumber: 79
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleAskQuestion,
                                className: "bg-purple-600 px-4 rounded-lg font-bold active:scale-95",
                                children: "Send"
                            }, void 0, false, {
                                fileName: "[project]/src/app/join/[code]/page.tsx",
                                lineNumber: 450,
                                columnNumber: 50
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 448,
                        columnNumber: 51
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/join/[code]/page.tsx",
                lineNumber: 444,
                columnNumber: 371
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 432,
            columnNumber: 11
        }, this);
        $[80] = activeTab;
        $[81] = currentPoll;
        $[82] = handleAskQuestion;
        $[83] = handleTextSubmit;
        $[84] = handleUpvote;
        $[85] = handleVote;
        $[86] = hasVoted;
        $[87] = newQuestion;
        $[88] = questions;
        $[89] = textInput;
        $[90] = t23;
    } else {
        t23 = $[90];
    }
    let t24;
    if ($[91] === Symbol.for("react.memo_cache_sentinel")) {
        t24 = [
            "\u2764\uFE0F",
            "\uD83D\uDD25",
            "\uD83D\uDC4F",
            "\uD83C\uDF89",
            "\uD83E\uDD14"
        ];
        $[91] = t24;
    } else {
        t24 = $[91];
    }
    let t25;
    if ($[92] !== sendReaction) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed bottom-6 flex gap-3 bg-slate-900/90 p-3 rounded-full border border-slate-700 shadow-2xl backdrop-blur z-50",
            children: t24.map({
                "AudiencePage[(anonymous)()]": (emoji_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "AudiencePage[(anonymous)() > <button>.onClick]": ()=>sendReaction(emoji_0)
                        }["AudiencePage[(anonymous)() > <button>.onClick]"],
                        className: "text-2xl hover:scale-125 transition active:scale-90",
                        children: emoji_0
                    }, emoji_0, false, {
                        fileName: "[project]/src/app/join/[code]/page.tsx",
                        lineNumber: 475,
                        columnNumber: 51
                    }, this)
            }["AudiencePage[(anonymous)()]"])
        }, void 0, false, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 474,
            columnNumber: 11
        }, this);
        $[92] = sendReaction;
        $[93] = t25;
    } else {
        t25 = $[93];
    }
    let t26;
    if ($[94] !== t14 || $[95] !== t22 || $[96] !== t23 || $[97] !== t25) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center pb-24",
            children: [
                t14,
                t22,
                t23,
                t25
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/join/[code]/page.tsx",
            lineNumber: 486,
            columnNumber: 11
        }, this);
        $[94] = t14;
        $[95] = t22;
        $[96] = t23;
        $[97] = t25;
        $[98] = t26;
    } else {
        t26 = $[98];
    }
    return t26;
}
_s(AudiencePage, "PbN3e00uvPvrXt1hw5ggWcIPJWg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRealtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRealtime"]
    ];
});
_c = AudiencePage;
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
var _c;
__turbopack_context__.k.register(_c, "AudiencePage");
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
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
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
]);

//# sourceMappingURL=_0a4b62a6._.js.map