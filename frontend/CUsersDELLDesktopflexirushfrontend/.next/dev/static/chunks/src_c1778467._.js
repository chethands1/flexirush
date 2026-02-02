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
"[project]/src/components/AIQuizCreator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AIQuizCreator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function AIQuizCreator({ sessionCode, onClose }) {
    _s();
    const [topic, setTopic] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const handleGenerate = async ()=>{
        if (!topic.trim()) return;
        setIsLoading(true);
        setError("");
        try {
            // 1. Call the AI Endpoint
            const res = await fetch("http://localhost:8001/api/ai/generate-quiz", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    topic,
                    num_questions: 5
                })
            });
            if (!res.ok) throw new Error("AI failed to generate quiz");
            const data = await res.json();
            // 2. Automatically Start the Quiz with Generated Data
            const startRes = await fetch(`http://localhost:8001/api/session/${sessionCode}/quiz/start`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: `Quiz: ${topic}`,
                    questions: data.questions
                })
            });
            if (startRes.ok) {
                onClose(); // Close modal on success
            } else {
                throw new Error("Failed to start quiz session");
            }
        } catch (err) {
            setError("Something went wrong. Try a different topic.");
            console.error(err);
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-slate-900 w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl animate-in fade-in zoom-in duration-200",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent",
                            children: "✨ AI Quiz Generator"
                        }, void 0, false, {
                            fileName: "[project]/src/components/AIQuizCreator.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-slate-400 hover:text-white",
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/src/components/AIQuizCreator.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/AIQuizCreator.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-slate-400 mb-1",
                                    children: "What is the quiz about?"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AIQuizCreator.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    autoFocus: true,
                                    className: "w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 outline-none transition",
                                    placeholder: "e.g. Python Basics, 90s Pop Music, Solar System",
                                    value: topic,
                                    onChange: (e)=>setTopic(e.target.value),
                                    onKeyDown: (e_0)=>e_0.key === "Enter" && handleGenerate()
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AIQuizCreator.tsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/AIQuizCreator.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-red-400 text-sm bg-red-400/10 p-3 rounded-lg",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/components/AIQuizCreator.tsx",
                            lineNumber: 74,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleGenerate,
                            disabled: isLoading || !topic.trim(),
                            className: "w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2",
                            children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AIQuizCreator.tsx",
                                        lineNumber: 78,
                                        columnNumber: 17
                                    }, this),
                                    "Generating Magic..."
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "🚀"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AIQuizCreator.tsx",
                                        lineNumber: 81,
                                        columnNumber: 17
                                    }, this),
                                    " Generate & Launch"
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/src/components/AIQuizCreator.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-center text-slate-500",
                            children: "Powered by Google Gemini 1.5 Flash"
                        }, void 0, false, {
                            fileName: "[project]/src/components/AIQuizCreator.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/AIQuizCreator.tsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/AIQuizCreator.tsx",
            lineNumber: 58,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/AIQuizCreator.tsx",
        lineNumber: 57,
        columnNumber: 10
    }, this);
}
_s(AIQuizCreator, "qimXj83UaaaKQRDJTWKSRgYOZH8=");
_c = AIQuizCreator;
var _c;
__turbopack_context__.k.register(_c, "AIQuizCreator");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const POLL_TYPES = [
    {
        id: "multiple_choice",
        label: "📊 Poll"
    },
    {
        id: "rating",
        label: "⭐ Rating"
    },
    {
        id: "word_cloud",
        label: "☁️ Words"
    },
    {
        id: "open_ended",
        label: "💭 Thoughts"
    }
];
function CreatePollForm({ sessionCode, onClose }) {
    _s();
    const [question, setQuestion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [type, setType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("multiple_choice");
    const [options, setOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        "",
        ""
    ]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSubmit = async ()=>{
        if (!question.trim()) return;
        // PATCH: Construct payload with strict typing
        const payload = {
            question,
            type
        };
        if (type === "multiple_choice") {
            // Filter out empty options
            const cleanOptions = options.map((o)=>o.trim()).filter((o_0)=>o_0 !== "");
            if (cleanOptions.length < 2) {
                alert("Please add at least 2 valid options.");
                return;
            }
            payload.options = cleanOptions;
        }
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8001/api/session/${sessionCode}/poll/start`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Backend refused connection");
            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to start poll. Is the backend running?");
        } finally{
            setLoading(false);
        }
    };
    const handleOptionChange = (index, value)=>{
        const newOpts = [
            ...options
        ];
        newOpts[index] = value;
        setOptions(newOpts);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl font-bold mb-4 text-white",
                    children: "Launch Widget"
                }, void 0, false, {
                    fileName: "[project]/src/components/CreatePollForm.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4",
                    children: POLL_TYPES.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setType(t.id),
                            className: `py-2 text-sm rounded-lg border font-medium transition-all ${type === t.id ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white"}`,
                            children: t.label
                        }, t.id, false, {
                            fileName: "[project]/src/components/CreatePollForm.tsx",
                            lineNumber: 86,
                            columnNumber: 34
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/CreatePollForm.tsx",
                    lineNumber: 85,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    autoFocus: true,
                    className: "w-full bg-slate-800 border border-slate-700 p-3 rounded-lg mb-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition",
                    placeholder: "Ask a question...",
                    value: question,
                    onChange: (e)=>setQuestion(e.target.value),
                    onKeyDown: (e_0)=>e_0.key === 'Enter' && type !== 'multiple_choice' && handleSubmit()
                }, void 0, false, {
                    fileName: "[project]/src/components/CreatePollForm.tsx",
                    lineNumber: 91,
                    columnNumber: 9
                }, this),
                type === "multiple_choice" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2 mb-4 max-h-50 overflow-y-auto pr-1 custom-scrollbar",
                    children: [
                        options.map((opt, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "w-full bg-slate-800/50 border border-slate-700 p-2 rounded text-sm text-white focus:border-blue-500 outline-none",
                                placeholder: `Option ${idx + 1}`,
                                value: opt,
                                onChange: (e_1)=>handleOptionChange(idx, e_1.target.value)
                            }, idx, false, {
                                fileName: "[project]/src/components/CreatePollForm.tsx",
                                lineNumber: 95,
                                columnNumber: 40
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setOptions([
                                    ...options,
                                    ""
                                ]),
                            className: "text-xs text-blue-400 hover:text-blue-300 font-bold transition",
                            children: "+ Add Option"
                        }, void 0, false, {
                            fileName: "[project]/src/components/CreatePollForm.tsx",
                            lineNumber: 96,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/CreatePollForm.tsx",
                    lineNumber: 94,
                    columnNumber: 40
                }, this),
                type === "rating" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg text-center text-slate-400 text-sm mb-4",
                    children: "Participants will vote using a 5-star scale."
                }, void 0, false, {
                    fileName: "[project]/src/components/CreatePollForm.tsx",
                    lineNumber: 102,
                    columnNumber: 31
                }, this),
                type === "word_cloud" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg text-center text-slate-400 text-sm mb-4",
                    children: "Participants will submit words to build a cloud."
                }, void 0, false, {
                    fileName: "[project]/src/components/CreatePollForm.tsx",
                    lineNumber: 106,
                    columnNumber: 35
                }, this),
                type === "open_ended" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg text-center text-slate-400 text-sm mb-4",
                    children: "Participants will share thoughts that float up the screen as bubbles."
                }, void 0, false, {
                    fileName: "[project]/src/components/CreatePollForm.tsx",
                    lineNumber: 110,
                    columnNumber: 35
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3 mt-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "flex-1 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/src/components/CreatePollForm.tsx",
                            lineNumber: 115,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSubmit,
                            disabled: loading || !question.trim(),
                            className: "flex-1 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95",
                            children: loading ? "Launching..." : "Launch 🚀"
                        }, void 0, false, {
                            fileName: "[project]/src/components/CreatePollForm.tsx",
                            lineNumber: 116,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/CreatePollForm.tsx",
                    lineNumber: 114,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CreatePollForm.tsx",
            lineNumber: 81,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/CreatePollForm.tsx",
        lineNumber: 80,
        columnNumber: 10
    }, this);
}
_s(CreatePollForm, "BR7/1rnKOD2M9M/XY634JS85eOU=");
_c = CreatePollForm;
var _c;
__turbopack_context__.k.register(_c, "CreatePollForm");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function QuizCreator({ sessionCode, onClose }) {
    _s();
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Fun Quiz");
    const [questions, setQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
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
    ]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // PATCH: Typed helper to update question fields safely
    const updateQuestion = (idx, field, value)=>{
        const newQs = [
            ...questions
        ];
        newQs[idx][field] = value;
        setQuestions(newQs);
    };
    const updateOption = (qIdx, oIdx, val)=>{
        const newQs_0 = [
            ...questions
        ];
        // Create a new array for options to ensure React detects the change
        const newOptions = [
            ...newQs_0[qIdx].options
        ];
        newOptions[oIdx] = val;
        newQs_0[qIdx].options = newOptions;
        setQuestions(newQs_0);
    };
    const handleLaunch = async ()=>{
        // Basic validation
        if (questions.some((q)=>!q.text.trim() || q.options.some((o)=>!o.trim()))) {
            alert("Please fill in all questions and options.");
            return;
        }
        setLoading(true);
        try {
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
        } catch (error) {
            console.error(error);
            alert("Failed to start quiz.");
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-slate-900 w-full max-w-2xl p-6 rounded-2xl border border-slate-700 animate-in fade-in zoom-in duration-200",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold mb-4 text-white",
                    children: "Create Quiz"
                }, void 0, false, {
                    fileName: "[project]/src/components/QuizCreator.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    "aria-label": "Quiz Title",
                    className: "w-full bg-slate-800 p-2 rounded mb-4 text-white border border-slate-700 focus:border-blue-500 outline-none transition",
                    value: title,
                    onChange: (e)=>setTitle(e.target.value),
                    placeholder: "Enter Quiz Title..."
                }, void 0, false, {
                    fileName: "[project]/src/components/QuizCreator.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6 max-h-[50vh] overflow-y-auto mb-4 pr-2 custom-scrollbar",
                    children: questions.map((q_0, qIdx_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 bg-slate-800 rounded-xl border border-slate-700",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold text-slate-300",
                                            children: [
                                                "Question ",
                                                qIdx_0 + 1
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/QuizCreator.tsx",
                                            lineNumber: 79,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            "aria-label": "Time limit per question",
                                            className: "bg-slate-700 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500 text-white",
                                            value: q_0.time_limit,
                                            onChange: (e_0)=>updateQuestion(qIdx_0, "time_limit", parseInt(e_0.target.value)),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: 10,
                                                    children: "10s"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                                    lineNumber: 82,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: 20,
                                                    children: "20s"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                                    lineNumber: 83,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: 30,
                                                    children: "30s"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                                    lineNumber: 84,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: 60,
                                                    children: "60s"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                                    lineNumber: 85,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/QuizCreator.tsx",
                                            lineNumber: 81,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                    lineNumber: 78,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    "aria-label": `Question ${qIdx_0 + 1} text`,
                                    className: "w-full bg-slate-700 p-2 rounded mb-3 text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-blue-500 transition",
                                    placeholder: "e.g. What is the capital of France?",
                                    value: q_0.text,
                                    onChange: (e_1)=>updateQuestion(qIdx_0, "text", e_1.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                    lineNumber: 89,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-2",
                                    children: q_0.options.map((opt, oIdx_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "radio",
                                                    name: `correct-${q_0.id}`,
                                                    "aria-label": `Mark option ${oIdx_0 + 1} as correct`,
                                                    checked: q_0.correct_index === oIdx_0,
                                                    onChange: ()=>updateQuestion(qIdx_0, "correct_index", oIdx_0),
                                                    className: "accent-green-500 w-4 h-4 cursor-pointer"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                                    lineNumber: 93,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    "aria-label": `Option ${oIdx_0 + 1} text`,
                                                    className: "w-full bg-slate-700 p-2 rounded text-sm text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-blue-500 transition",
                                                    placeholder: `Option ${oIdx_0 + 1}`,
                                                    value: opt,
                                                    onChange: (e_2)=>updateOption(qIdx_0, oIdx_0, e_2.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                                    lineNumber: 95,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, oIdx_0, true, {
                                            fileName: "[project]/src/components/QuizCreator.tsx",
                                            lineNumber: 92,
                                            columnNumber: 59
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                    lineNumber: 91,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, q_0.id, true, {
                            fileName: "[project]/src/components/QuizCreator.tsx",
                            lineNumber: 77,
                            columnNumber: 45
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/QuizCreator.tsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setQuestions([
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
                        ]),
                    className: "text-blue-400 text-sm mb-6 hover:underline font-bold",
                    children: "+ Add Question"
                }, void 0, false, {
                    fileName: "[project]/src/components/QuizCreator.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "flex-1 py-3 bg-slate-800 rounded hover:bg-slate-700 text-slate-300 transition",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/src/components/QuizCreator.tsx",
                            lineNumber: 112,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleLaunch,
                            disabled: loading,
                            className: "flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded transition disabled:opacity-50 flex justify-center items-center gap-2",
                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/QuizCreator.tsx",
                                        lineNumber: 115,
                                        columnNumber: 24
                                    }, this),
                                    "Starting..."
                                ]
                            }, void 0, true) : "Launch Quiz"
                        }, void 0, false, {
                            fileName: "[project]/src/components/QuizCreator.tsx",
                            lineNumber: 113,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/QuizCreator.tsx",
                    lineNumber: 111,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/QuizCreator.tsx",
            lineNumber: 71,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/QuizCreator.tsx",
        lineNumber: 70,
        columnNumber: 10
    }, this);
}
_s(QuizCreator, "w/LtTSPcaHUy4/FSF3YpxjH4KCA=");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/sessionStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function MagicMap(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(23);
    if ($[0] !== "43bdb4a503224a8b86aa6416e808c7a31d578169171de09648e89e6666c65cc0") {
        for(let $i = 0; $i < 23; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "43bdb4a503224a8b86aa6416e808c7a31d578169171de09648e89e6666c65cc0";
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
            lineNumber: 23,
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
                    lineNumber: 30,
                    columnNumber: 108
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/MagicMap.tsx",
            lineNumber: 30,
            columnNumber: 10
        }, this);
        $[2] = onClose;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            src: "https://upload.wikimedia.org/wikipedia/commons/2/23/Blue_Marble_2002.png",
            alt: "World Map",
            fill: true,
            className: "w-full h-full object-cover rounded-2xl opacity-50 shadow-2xl"
        }, void 0, false, {
            fileName: "[project]/src/components/MagicMap.tsx",
            lineNumber: 38,
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
                            lineNumber: 56,
                            columnNumber: 14
                        }, this)
                    }, i, false, {
                        fileName: "[project]/src/components/MagicMap.tsx",
                        lineNumber: 53,
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
                lineNumber: 71,
                columnNumber: 110
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/MagicMap.tsx",
            lineNumber: 71,
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
            lineNumber: 79,
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
            lineNumber: 95,
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
            lineNumber: 103,
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
            lineNumber: 112,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function TransientThoughts(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(17);
    if ($[0] !== "74950d81dbeb9c917cf57ae0f26a7f37bc10f3214bc483e5d03e807936fd8f58") {
        for(let $i = 0; $i < 17; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "74950d81dbeb9c917cf57ae0f26a7f37bc10f3214bc483e5d03e807936fd8f58";
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
    const processedCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = new Set();
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const timeoutsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(t2);
    let t3;
    if ($[3] !== responses[0] || $[4] !== responses.length) {
        t3 = ({
            "TransientThoughts[useEffect()]": ()=>{
                if (responses.length <= processedCount.current) {
                    return;
                }
                const newestText = responses[0];
                const newId = Date.now();
                const speed = 4 + Math.random() * 3;
                const newBubble = {
                    id: newId,
                    text: newestText,
                    left: Math.random() * 80 + 10,
                    speed,
                    scale: Math.random() * 0.3 + 0.9
                };
                requestAnimationFrame({
                    "TransientThoughts[useEffect() > requestAnimationFrame()]": ()=>{
                        setBubbles({
                            "TransientThoughts[useEffect() > requestAnimationFrame() > setBubbles()]": (prev)=>[
                                    ...prev,
                                    newBubble
                                ]
                        }["TransientThoughts[useEffect() > requestAnimationFrame() > setBubbles()]"]);
                        processedCount.current = responses.length;
                    }
                }["TransientThoughts[useEffect() > requestAnimationFrame()]"]);
                const timer = setTimeout({
                    "TransientThoughts[useEffect() > setTimeout()]": ()=>{
                        setBubbles({
                            "TransientThoughts[useEffect() > setTimeout() > setBubbles()]": (prev_0)=>prev_0.filter({
                                    "TransientThoughts[useEffect() > setTimeout() > setBubbles() > prev_0.filter()]": (b)=>b.id !== newId
                                }["TransientThoughts[useEffect() > setTimeout() > setBubbles() > prev_0.filter()]"])
                        }["TransientThoughts[useEffect() > setTimeout() > setBubbles()]"]);
                        timeoutsRef.current.delete(timer);
                    }
                }["TransientThoughts[useEffect() > setTimeout()]"], speed * 1000);
                timeoutsRef.current.add(timer);
                const activeTimeouts = timeoutsRef.current;
                return ()=>{
                    activeTimeouts.forEach(clearTimeout);
                    activeTimeouts.clear();
                };
            }
        })["TransientThoughts[useEffect()]"];
        $[3] = responses[0];
        $[4] = responses.length;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    let t4;
    if ($[6] !== responses) {
        t4 = [
            responses
        ];
        $[6] = responses;
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t3, t4);
    let t5;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
            children: "\n        @keyframes floatUp {\n          0% { transform: translateY(100%) scale(0.5); opacity: 0; }\n          10% { opacity: 1; transform: translateY(0) scale(1); }\n          90% { opacity: 1; }\n          100% { transform: translateY(-400px) scale(1.5); opacity: 0; }\n        }\n        .animate-float-thought {\n          animation-name: floatUp;\n          animation-timing-function: linear;\n          animation-fill-mode: forwards;\n        }\n      "
        }, void 0, false, {
            fileName: "[project]/src/components/TransientThoughts.tsx",
            lineNumber: 100,
            columnNumber: 10
        }, this);
        $[8] = t5;
    } else {
        t5 = $[8];
    }
    let t6;
    if ($[9] !== bubbles) {
        t6 = bubbles.map(_TransientThoughtsBubblesMap);
        $[9] = bubbles;
        $[10] = t6;
    } else {
        t6 = $[10];
    }
    let t7;
    if ($[11] !== bubbles.length || $[12] !== responses.length) {
        t7 = responses.length === 0 && bubbles.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute inset-0 flex items-center justify-center text-slate-500 italic",
            children: "Waiting for audience thoughts..."
        }, void 0, false, {
            fileName: "[project]/src/components/TransientThoughts.tsx",
            lineNumber: 115,
            columnNumber: 60
        }, this);
        $[11] = bubbles.length;
        $[12] = responses.length;
        $[13] = t7;
    } else {
        t7 = $[13];
    }
    let t8;
    if ($[14] !== t6 || $[15] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative w-full h-96 overflow-hidden bg-slate-900/50 rounded-xl border border-slate-700",
            children: [
                t5,
                t6,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/TransientThoughts.tsx",
            lineNumber: 124,
            columnNumber: 10
        }, this);
        $[14] = t6;
        $[15] = t7;
        $[16] = t8;
    } else {
        t8 = $[16];
    }
    return t8;
}
_s(TransientThoughts, "GG8bUmjDYC3KjQO7m0thEDemIjw=");
_c = TransientThoughts;
function _TransientThoughtsBubblesMap(b_0) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute bottom-0 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 rounded-full text-white font-bold shadow-lg animate-float-thought whitespace-nowrap z-10",
        style: {
            left: `${b_0.left}%`,
            animationDuration: `${b_0.speed}s`,
            transform: `scale(${b_0.scale})`
        },
        children: b_0.text
    }, b_0.id, false, {
        fileName: "[project]/src/components/TransientThoughts.tsx",
        lineNumber: 134,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/sessionStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRealtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useRealtime.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AIQuizCreator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AIQuizCreator.tsx [app-client] (ecmascript)");
// --- COMPONENTS ---
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CreatePollForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CreatePollForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$WinningWheel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/WinningWheel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuizCreator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/QuizCreator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MagicMap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/MagicMap.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TransientThoughts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/TransientThoughts.tsx [app-client] (ecmascript)");
;
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
;
// Fix Hydration Error: Load overlay only on client
const ReactionOverlay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/ReactionOverlay.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/ReactionOverlay.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = ReactionOverlay;
function PresenterDashboard({ params }) {
    _s();
    // Unwrap params using React.use()
    const { code } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(params);
    // 1. Initialize Real-time Connection
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRealtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRealtime"])(code);
    // Destructure State
    const { currentPoll, questions, isConnected, participants, quiz, quizScores, branding } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])();
    // 2. Local View State
    const [showPollForm, setShowPollForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showWheel, setShowWheel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showQuizCreator, setShowQuizCreator] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showMap, setShowMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSettings, setShowSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("poll");
    const [tempLogo, setTempLogo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(branding?.logo_url || "");
    const [showAIModal, setShowAIModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
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
        } else if (currentPoll) {
            if (currentPoll.type === 'open_ended') {
                contextData = currentPoll.responses || [];
            } else if (currentPoll.type === 'word_cloud') {
                contextData = Object.keys(currentPoll.words || {});
            } else {
                contextData = [
                    `Poll Question: ${currentPoll.question}`
                ];
            }
        } else if (viewMode === 'qna') {
            contextData = questions.map((q)=>q.text);
        } else {
            contextData = [
                "No active content to analyze."
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
        } catch  {
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
        className: "min-h-screen bg-slate-950 text-white p-4 sm:p-8 transition-all relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReactionOverlay, {}, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex justify-between items-center border-b border-slate-800 pb-4 mb-6 relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            branding?.logo_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: branding.logo_url,
                                alt: "Logo",
                                width: 40,
                                height: 40,
                                className: "object-contain rounded-lg shadow-lg"
                            }, void 0, false, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 156,
                                columnNumber: 33
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 rounded-lg flex items-center justify-center font-bold shadow-lg text-white",
                                style: {
                                    backgroundColor: branding?.theme_color || '#3b82f6'
                                },
                                children: "FR"
                            }, void 0, false, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 156,
                                columnNumber: 151
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "hidden sm:block text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400",
                                children: "FlexiRush Presenter"
                            }, void 0, false, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                        lineNumber: 155,
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
                                        lineNumber: 168,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-2xl sm:text-4xl font-mono font-bold tracking-widest text-white",
                                        children: code
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 169,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] sm:text-xs text-slate-500 uppercase font-bold tracking-tighter",
                                children: "Join Code"
                            }, void 0, false, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 171,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10",
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
                                    lineNumber: 183,
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
                                            lineNumber: 186,
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
                                            lineNumber: 187,
                                            columnNumber: 26
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "pt-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleNextQuizStep,
                                                className: "px-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-xl shadow-lg animate-bounce transition",
                                                children: "Start Game 🚀"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 191,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 190,
                                            columnNumber: 26
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 185,
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
                                            lineNumber: 198,
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
                                                            lineNumber: 203,
                                                            columnNumber: 39
                                                        }, this),
                                                        opt
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 202,
                                                    columnNumber: 90
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 201,
                                            columnNumber: 26
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-full bg-white transition-all duration-1000 ease-linear",
                                                        style: {
                                                            width: '100%',
                                                            animation: `width_linear ${quiz.questions[quiz.current_index].time_limit}s linear forwards`
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 209,
                                                        columnNumber: 34
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 208,
                                                    columnNumber: 30
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleNextQuizStep,
                                                    className: "text-slate-500 hover:text-white text-sm underline",
                                                    children: "Skip Timer / Reveal Answer"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 30
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 207,
                                            columnNumber: 26
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 197,
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
                                            lineNumber: 221,
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
                                                                    lineNumber: 225,
                                                                    columnNumber: 42
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-lg",
                                                                    children: name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                    lineNumber: 228,
                                                                    columnNumber: 42
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 224,
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
                                                            lineNumber: 230,
                                                            columnNumber: 38
                                                        }, this)
                                                    ]
                                                }, name, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 223,
                                                    columnNumber: 128
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 222,
                                            columnNumber: 26
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleNextQuizStep,
                                            className: "px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition",
                                            children: "Next Question →"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 233,
                                            columnNumber: 26
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 220,
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
                                            lineNumber: 239,
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
                                                    lineNumber: 243,
                                                    columnNumber: 30
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-4xl font-bold text-white",
                                                    children: Object.entries(quizScores).sort(([, a_0], [, b_0])=>b_0 - a_0)[0]?.[0] || "No one"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 244,
                                                    columnNumber: 30
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 242,
                                            columnNumber: 26
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>window.location.reload(),
                                            className: "px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition",
                                            children: "Close Quiz"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 248,
                                            columnNumber: 26
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 238,
                                    columnNumber: 43
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                            lineNumber: 182,
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
                                        lineNumber: 256,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 255,
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
                                            lineNumber: 262,
                                            columnNumber: 21
                                        }, this),
                                        " No active widget."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 261,
                                    columnNumber: 55
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-2xl font-bold text-center",
                                            children: currentPoll.question
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 264,
                                            columnNumber: 21
                                        }, this),
                                        currentPoll.type === "multiple_choice" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3 max-w-2xl mx-auto w-full",
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
                                                                    lineNumber: 272,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-mono bg-slate-800 px-1 rounded",
                                                                    children: opt_0.votes
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                    lineNumber: 273,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 271,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-4 bg-slate-800 rounded-full overflow-hidden",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-full bg-blue-500 transition-all duration-500",
                                                                style: {
                                                                    width: `${Math.max(opt_0.votes / (currentPoll.total_responses || 1) * 100, 0)}%`
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                lineNumber: 276,
                                                                columnNumber: 33
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 275,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, idx, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 270,
                                                    columnNumber: 34
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 266,
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
                                                        lineNumber: 285,
                                                        columnNumber: 58
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 284,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 283,
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
                                                    lineNumber: 290,
                                                    columnNumber: 91
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 289,
                                            columnNumber: 59
                                        }, this),
                                        currentPoll.type === "open_ended" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TransientThoughts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            responses: currentPoll.responses || []
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 297,
                                            columnNumber: 59
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 263,
                                    columnNumber: 28
                                }, this)),
                                viewMode === "qna" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3 overflow-y-auto max-h-125 pr-2 custom-scrollbar",
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
                                                            lineNumber: 303,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm font-mono",
                                                            children: q_0.votes
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 304,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 302,
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
                                                            lineNumber: 307,
                                                            columnNumber: 27
                                                        }, this),
                                                        !q_0.visible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] text-red-400 uppercase font-bold tracking-wider",
                                                            children: "Hidden from audience"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 310,
                                                            columnNumber: 44
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 306,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleToggleQuestion(q_0.id),
                                                    className: "opacity-0 group-hover:opacity-100 p-2 rounded hover:bg-slate-700 text-slate-400 transition",
                                                    children: q_0.visible ? "🚫" : "👁️"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 312,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, q_0.id, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 301,
                                            columnNumber: 95
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 300,
                                    columnNumber: 38
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                        lineNumber: 179,
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
                                                lineNumber: 326,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-slate-800 px-2 py-1 rounded text-sm",
                                                children: participants.length
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 327,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 325,
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
                                                lineNumber: 330,
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
                                                            lineNumber: 332,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleBanUser(p),
                                                            className: "text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-900/50 transition",
                                                            children: "Ban 🚫"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 333,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, p, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 331,
                                                    columnNumber: 40
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 329,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 324,
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
                                        lineNumber: 342,
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
                                                        lineNumber: 348,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "🚀"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 348,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 344,
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
                                                        lineNumber: 351,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "🏆"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 351,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 350,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowAIModal(true),
                                                className: "flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 p-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition transform hover:scale-[1.02]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xl",
                                                        children: "✨"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 354,
                                                        columnNumber: 17
                                                    }, this),
                                                    " AI Quiz"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 353,
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
                                                        lineNumber: 357,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "🎲"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 357,
                                                        columnNumber: 48
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 356,
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
                                                        lineNumber: 360,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "🌍"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 360,
                                                        columnNumber: 44
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 359,
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
                                                        lineNumber: 363,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "📥"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 363,
                                                        columnNumber: 50
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 362,
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
                                                        lineNumber: 366,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "bg-slate-900 px-2 py-0.5 rounded text-xs",
                                                        children: questions.length
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 367,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 365,
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
                                                        lineNumber: 370,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "⚙️"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 370,
                                                        columnNumber: 46
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 369,
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
                                                        lineNumber: 373,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: analyzing ? "animate-spin" : "",
                                                        children: "✨"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 373,
                                                        columnNumber: 52
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 372,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 343,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 341,
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
                                                lineNumber: 381,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-purple-400 text-xs font-bold uppercase tracking-widest",
                                                children: "Hive Mind Insights"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 382,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 380,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-slate-300 text-xs sm:text-sm whitespace-pre-line leading-relaxed italic border-l-2 border-purple-500 pl-3",
                                        children: aiSummary
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 384,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 379,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                        lineNumber: 321,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 176,
                columnNumber: 7
            }, this),
            showWheel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$WinningWheel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                participants: participants || [],
                onClose: ()=>setShowWheel(false)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 392,
                columnNumber: 21
            }, this),
            showPollForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CreatePollForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sessionCode: code,
                onClose: ()=>setShowPollForm(false)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 393,
                columnNumber: 24
            }, this),
            showQuizCreator && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuizCreator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sessionCode: code,
                onClose: ()=>setShowQuizCreator(false)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 394,
                columnNumber: 27
            }, this),
            showMap && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MagicMap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onClose: ()=>setShowMap(false)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 395,
                columnNumber: 19
            }, this),
            showAIModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AIQuizCreator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sessionCode: code,
                onClose: ()=>setShowAIModal(false)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 397,
                columnNumber: 25
            }, this),
            showSettings && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold mb-4",
                            children: "Session Settings"
                        }, void 0, false, {
                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                            lineNumber: 403,
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
                                            lineNumber: 406,
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
                                            lineNumber: 407,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 405,
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
                                            lineNumber: 410,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: saveSettings,
                                            className: "flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition shadow-lg",
                                            children: "Save Changes"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 411,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 409,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                            lineNumber: 404,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                    lineNumber: 402,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 401,
                columnNumber: 24
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/presenter/[code]/page.tsx",
        lineNumber: 148,
        columnNumber: 10
    }, this);
}
_s(PresenterDashboard, "UygdAm0/k/XAvOvb/d4tM/neS+o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRealtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRealtime"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"]
    ];
});
_c1 = PresenterDashboard;
var _c, _c1;
__turbopack_context__.k.register(_c, "ReactionOverlay");
__turbopack_context__.k.register(_c1, "PresenterDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_c1778467._.js.map