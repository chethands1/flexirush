(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/store/sessionStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSessionStore",
    ()=>useSessionStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const useSessionStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        token: null,
        user: null,
        isConnected: false,
        participants: [],
        questions: [],
        currentPoll: null,
        pollResults: null,
        quiz: null,
        quizScores: {},
        lastReaction: null,
        aiSummary: "",
        branding: {
            theme_color: "#3b82f6"
        },
        setToken: (token)=>set({
                token
            }),
        setUser: (user)=>set({
                user
            }),
        setConnected: (status)=>set({
                isConnected: status
            }),
        setParticipants: (list)=>set({
                participants: list
            }),
        setQuestions: (qs)=>set({
                questions: qs
            }),
        setPoll: (poll)=>set({
                currentPoll: poll
            }),
        setPollResults: (results)=>set({
                pollResults: results
            }),
        setQuiz: (quiz)=>set({
                quiz
            }),
        setQuizScores: (scores)=>set({
                quizScores: scores
            }),
        setLastReaction: (reaction)=>set({
                lastReaction: reaction
            }),
        setAiSummary: (summary)=>set({
                aiSummary: summary
            }),
        setBranding: (branding)=>set({
                branding
            })
    }), {
    name: 'flexirush-storage',
    partialize: (state)=>({
            token: state.token,
            user: state.user,
            branding: state.branding
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
    // Stable Store Selectors
    const setConnected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])({
        "useRealtime.useSessionStore[setConnected]": (s)=>s.setConnected
    }["useRealtime.useSessionStore[setConnected]"]);
    const setPoll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])({
        "useRealtime.useSessionStore[setPoll]": (s)=>s.setPoll
    }["useRealtime.useSessionStore[setPoll]"]);
    const setQuestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])({
        "useRealtime.useSessionStore[setQuestions]": (s)=>s.setQuestions
    }["useRealtime.useSessionStore[setQuestions]"]);
    const setParticipants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])({
        "useRealtime.useSessionStore[setParticipants]": (s)=>s.setParticipants
    }["useRealtime.useSessionStore[setParticipants]"]);
    const setQuiz = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])({
        "useRealtime.useSessionStore[setQuiz]": (s)=>s.setQuiz
    }["useRealtime.useSessionStore[setQuiz]"]);
    const setQuizScores = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])({
        "useRealtime.useSessionStore[setQuizScores]": (s)=>s.setQuizScores
    }["useRealtime.useSessionStore[setQuizScores]"]);
    const setLastReaction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])({
        "useRealtime.useSessionStore[setLastReaction]": (s)=>s.setLastReaction
    }["useRealtime.useSessionStore[setLastReaction]"]);
    const setBranding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])({
        "useRealtime.useSessionStore[setBranding]": (s)=>s.setBranding
    }["useRealtime.useSessionStore[setBranding]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useRealtime.useEffect": ()=>{
            // 1. Safety Check
            if (!sessionCode || sessionCode === "undefined" || myName === null) return;
            const connect = {
                "useRealtime.useEffect.connect": ()=>{
                    if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
                    const rolePath = myName ? encodeURIComponent(myName) : "presenter";
                    const wsUrl = `ws://localhost:8001/ws/${sessionCode}/${rolePath}`;
                    console.log(`🔌 Connecting WS to ${wsUrl}`);
                    ws.current = new WebSocket(wsUrl);
                    ws.current.onopen = ({
                        "useRealtime.useEffect.connect": ()=>{
                            console.log('✅ WS Connected');
                            setConnected(true);
                            // 2. Initial State Fetch
                            fetch(`http://localhost:8001/api/session/${sessionCode}/state`).then({
                                "useRealtime.useEffect.connect": (res)=>res.ok ? res.json() : null
                            }["useRealtime.useEffect.connect"]).then({
                                "useRealtime.useEffect.connect": (data)=>{
                                    if (!data) return;
                                    if (data.current_poll) setPoll(data.current_poll);
                                    if (data.questions) setQuestions(data.questions);
                                    // Handle Participants: Check if string or object
                                    if (data.participants) {
                                        const parts = data.participants.map({
                                            "useRealtime.useEffect.connect.parts": (p)=>typeof p === 'string' ? {
                                                    id: p,
                                                    name: p
                                                } : p
                                        }["useRealtime.useEffect.connect.parts"]);
                                        setParticipants(parts);
                                    }
                                    if (data.quiz) {
                                        setQuiz(data.quiz);
                                        if (data.quiz_scores) setQuizScores(data.quiz_scores);
                                    }
                                    if (data.branding) setBranding(data.branding);
                                }
                            }["useRealtime.useEffect.connect"]).catch({
                                "useRealtime.useEffect.connect": (err)=>console.error("❌ Initial sync failed:", err)
                            }["useRealtime.useEffect.connect"]);
                        }
                    })["useRealtime.useEffect.connect"];
                    ws.current.onmessage = ({
                        "useRealtime.useEffect.connect": (event)=>{
                            try {
                                const data = JSON.parse(event.data);
                                switch(data.type){
                                    case 'POLL_START':
                                    case 'POLL_UPDATE':
                                        setPoll(data.payload || data.poll);
                                        break;
                                    case 'QNA_UPDATE':
                                    case 'QUESTION_UPDATE':
                                        setQuestions(data.payload || data.questions || []);
                                        break;
                                    case 'PARTICIPANT_UPDATE':
                                        // Handle mixed formats safely
                                        const rawList = data.participants || data.names || data.payload || [];
                                        if (Array.isArray(rawList)) {
                                            const cleanList = rawList.map({
                                                "useRealtime.useEffect.connect.cleanList": (p)=>typeof p === 'string' ? {
                                                        id: p,
                                                        name: p
                                                    } : p
                                            }["useRealtime.useEffect.connect.cleanList"]);
                                            setParticipants(cleanList);
                                        }
                                        break;
                                    case 'REACTION':
                                        setLastReaction(`${data.emoji}-${Date.now()}`);
                                        break;
                                    case 'BRANDING_UPDATE':
                                        setBranding(data.payload || data.branding);
                                        break;
                                    case 'QUIZ_UPDATE':
                                        const quizData = data.quiz || (data.payload ? data.payload.quiz : null) || data.payload;
                                        const scoreData = data.scores || (data.payload ? data.payload.scores : null);
                                        if (quizData) setQuiz(quizData);
                                        if (scoreData) setQuizScores(scoreData);
                                        break;
                                    case 'USER_KICKED':
                                        if (myName && data.target_name === myName) {
                                            alert("You have been kicked from the session.");
                                            ws.current?.close();
                                            router.push('/');
                                        }
                                        break;
                                }
                            } catch (e) {
                                console.error("WS Parse Error:", e);
                            }
                        }
                    })["useRealtime.useEffect.connect"];
                    ws.current.onclose = ({
                        "useRealtime.useEffect.connect": (e)=>{
                            setConnected(false);
                            if (e.code !== 1000 && window.location.pathname.includes(sessionCode)) {
                                reconnectTimeout.current = setTimeout(connect, 3000);
                            }
                        }
                    })["useRealtime.useEffect.connect"];
                }
            }["useRealtime.useEffect.connect"];
            connect();
            return ({
                "useRealtime.useEffect": ()=>{
                    if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
                    ws.current?.close();
                }
            })["useRealtime.useEffect"];
        }
    }["useRealtime.useEffect"], [
        sessionCode,
        myName,
        router,
        setConnected,
        setPoll,
        setQuestions,
        setParticipants,
        setQuiz,
        setQuizScores,
        setLastReaction,
        setBranding
    ]);
}
_s(useRealtime, "hP5mkHoWEIAd+wcwa/0BtoMSFCc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"]
    ];
});
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/sessionStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRealtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useRealtime.ts [app-client] (ecmascript)");
;
;
;
;
;
;
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
// --- DYNAMIC IMPORTS ---
const ReactionOverlay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/ReactionOverlay.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/ReactionOverlay.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = ReactionOverlay;
const CreatePollForm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/CreatePollForm.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/CreatePollForm.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c1 = CreatePollForm;
const WinningWheel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/WinningWheel.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/WinningWheel.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c2 = WinningWheel;
const QuizCreator = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/QuizCreator.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/QuizCreator.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c3 = QuizCreator;
const AIQuizCreator = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/AIQuizCreator.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/AIQuizCreator.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c4 = AIQuizCreator;
const MagicMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/MagicMap.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/MagicMap.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c5 = MagicMap;
const TransientThoughts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/TransientThoughts.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/TransientThoughts.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c6 = TransientThoughts;
// --- CONFIGURATION ---
const API_URL = ("TURBOPACK compile-time value", "http://localhost:8001") || "http://localhost:8001";
function PresenterDashboard({ params }) {
    _s();
    const [resolvedParams, setResolvedParams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // --- SIDEBAR MODE LOGIC ---
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const isSidebar = searchParams.get("sidebar") === "true";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PresenterDashboard.useEffect": ()=>{
            params.then(setResolvedParams);
        }
    }["PresenterDashboard.useEffect"], [
        params
    ]);
    const code = resolvedParams?.code || "";
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRealtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRealtime"])(code, "presenter");
    const { token, isConnected, participants, currentPoll, pollResults, questions, quiz, quizScores, branding, setQuiz, setPoll, setQuestions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])();
    const [showPollForm, setShowPollForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showWheel, setShowWheel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showQuizCreator, setShowQuizCreator] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAIModal, setShowAIModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showMap, setShowMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSettings, setShowSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("poll");
    const [tempLogo, setTempLogo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [aiSummary, setAiSummary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [analyzing, setAnalyzing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [actionLoading, setActionLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PresenterDashboard.useEffect": ()=>{
            if (branding?.logo_url) setTempLogo(branding.logo_url);
        }
    }["PresenterDashboard.useEffect"], [
        branding
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PresenterDashboard.useEffect": ()=>{
            if (!token && resolvedParams) router.push("/login");
        }
    }["PresenterDashboard.useEffect"], [
        token,
        router,
        resolvedParams
    ]);
    const apiCall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PresenterDashboard.useCallback[apiCall]": async (endpoint, method = "GET", body)=>{
            if (!code) return;
            try {
                const res = await fetch(`${API_URL}/api/session/${code}${endpoint}`, {
                    method,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: body ? JSON.stringify(body) : undefined
                });
                if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
                return await res.json();
            } catch (err) {
                console.error(err);
                return null;
            }
        }
    }["PresenterDashboard.useCallback[apiCall]"], [
        code
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PresenterDashboard.useEffect": ()=>{
            if (!code) return;
            apiCall("/state").then({
                "PresenterDashboard.useEffect": (data)=>{
                    if (data) {
                        if (data.quiz) setQuiz(data.quiz);
                        if (data.current_poll) setPoll(data.current_poll);
                        if (data.questions) setQuestions(data.questions);
                    }
                }
            }["PresenterDashboard.useEffect"]);
        }
    }["PresenterDashboard.useEffect"], [
        code,
        apiCall,
        setQuiz,
        setPoll,
        setQuestions
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleQuizCreated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PresenterDashboard.useCallback[handleQuizCreated]": async (newQuizData)=>{
            if (newQuizData && newQuizData.title) {
                await apiCall("/quiz/start", "POST", newQuizData);
                apiCall("/state").then({
                    "PresenterDashboard.useCallback[handleQuizCreated]": (data)=>{
                        if (data?.quiz) setQuiz(data.quiz);
                    }
                }["PresenterDashboard.useCallback[handleQuizCreated]"]);
            } else {
                apiCall("/state").then({
                    "PresenterDashboard.useCallback[handleQuizCreated]": (data)=>{
                        if (data?.quiz) setQuiz(data.quiz);
                    }
                }["PresenterDashboard.useCallback[handleQuizCreated]"]);
            }
        }
    }["PresenterDashboard.useCallback[handleQuizCreated]"], [
        apiCall,
        setQuiz
    ]);
    const handleAiAnalyze = async ()=>{
        if (analyzing) return;
        setAnalyzing(true);
        setAiSummary("");
        let contextData = [];
        if (quiz) {
            contextData = [
                `Active Quiz: ${quiz.title}`
            ];
        } else if (currentPoll) {
            contextData = [
                `Poll Question: ${currentPoll.question}`
            ];
            if (currentPoll.type === 'word_cloud' && (pollResults || currentPoll.words)) {
                const words = pollResults || currentPoll.words || {};
                contextData.push(`Words: ${Object.keys(words).join(", ")}`);
            } else if (currentPoll.type === 'open_ended' && currentPoll.responses) {
                contextData = [
                    ...currentPoll.responses
                ];
            } else if (currentPoll.options) {
                currentPoll.options.forEach((opt)=>{
                    const votes = pollResults?.[opt.label] ?? opt.votes ?? 0;
                    contextData.push(`${opt.label}: ${votes} votes`);
                });
            }
        } else if (questions.length > 0) {
            contextData = questions.map((q)=>`Q: ${q.text} (${q.votes} votes)`);
        } else {
            setAiSummary("Nothing active to analyze right now.");
            setAnalyzing(false);
            return;
        }
        try {
            const res = await fetch(`${API_URL}/api/ai/summarize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    responses: contextData
                })
            });
            if (res.ok) {
                const data = await res.json();
                setAiSummary(data.summary || "AI couldn't generate a summary.");
            } else {
                setAiSummary("AI Service Temporarily Unavailable.");
            }
        } catch  {
            setAiSummary("Network Error: Could not reach AI service.");
        } finally{
            setAnalyzing(false);
        }
    };
    const handleAction = async (actionFn)=>{
        if (actionLoading) return;
        setActionLoading(true);
        await actionFn();
        setTimeout(()=>setActionLoading(false), 500);
    };
    const endPoll = ()=>handleAction(()=>apiCall("/poll/end", "POST"));
    const handleNextQuizStep = ()=>handleAction(()=>apiCall("/quiz/next", "POST"));
    const handleCloseQuiz = ()=>handleAction(()=>apiCall("/quiz/reset", "POST"));
    const handleToggleQuestion = (qId)=>apiCall(`/question/${qId}/toggle`, "POST");
    const handleExport = ()=>window.location.href = `${API_URL}/api/session/${code}/export`;
    const handleBanUser = async (userName)=>{
        if (!confirm(`Are you sure you want to ban ${userName}?`)) return;
        await apiCall("/ban", "POST", {
            name: userName
        });
    };
    const saveSettings = async ()=>{
        await apiCall("/branding", "POST", {
            logo_url: tempLogo,
            theme_color: branding?.theme_color
        });
        setShowSettings(false);
    };
    const totalPollVotes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PresenterDashboard.useMemo[totalPollVotes]": ()=>{
            if (!currentPoll?.options) return 0;
            return currentPoll.options.reduce({
                "PresenterDashboard.useMemo[totalPollVotes]": (acc, curr)=>{
                    const liveVotes = pollResults?.[curr.label];
                    return acc + (liveVotes !== undefined ? liveVotes : curr.votes || 0);
                }
            }["PresenterDashboard.useMemo[totalPollVotes]"], 0);
        }
    }["PresenterDashboard.useMemo[totalPollVotes]"], [
        currentPoll,
        pollResults
    ]);
    if (!resolvedParams || !token) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-slate-950 flex items-center justify-center text-white",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                        lineNumber: 209,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Connecting to Studio..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                        lineNumber: 210,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 208,
                columnNumber: 13
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/presenter/[code]/page.tsx",
            lineNumber: 207,
            columnNumber: 9
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `min-h-screen bg-slate-950 text-white transition-all relative overflow-hidden flex flex-col font-sans ${isSidebar ? 'p-2' : 'p-4 sm:p-8'}`,
        children: [
            !isSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReactionOverlay, {}, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 219,
                columnNumber: 22
            }, this),
            !isSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex justify-between items-center border-b border-slate-800 pb-4 mb-6 relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            branding?.logo_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative w-10 h-10",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: branding.logo_url,
                                    alt: "Logo",
                                    fill: true,
                                    className: "object-contain rounded-lg shadow-lg"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 227,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 226,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 rounded-lg flex items-center justify-center font-bold shadow-lg text-white",
                                /* webhint: ignore inline-styles */ style: {
                                    backgroundColor: branding?.theme_color || '#3b82f6'
                                },
                                children: "FR"
                            }, void 0, false, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 230,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "hidden sm:block text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400",
                                children: "FlexiRush Presenter"
                            }, void 0, false, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 238,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                        lineNumber: 224,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-end",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `w-2 h-2 rounded-full ${isConnected ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : "bg-red-500"} transition-colors duration-300`
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 245,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-2xl sm:text-4xl font-mono font-bold tracking-widest text-white select-all cursor-pointer",
                                        title: "Click to copy",
                                        onClick: ()=>navigator.clipboard.writeText(code),
                                        children: code
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 246,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 244,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] sm:text-xs text-slate-500 uppercase font-bold tracking-tighter",
                                children: "Join Code"
                            }, void 0, false, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 250,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                        lineNumber: 243,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 223,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: `grid gap-6 relative z-10 flex-1 overflow-hidden h-full ${isSidebar ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`,
                children: [
                    !isSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-2 bg-slate-900/50 backdrop-blur-sm p-4 sm:p-8 rounded-2xl border border-slate-800 flex flex-col shadow-2xl relative overflow-y-auto custom-scrollbar min-h-[60vh]",
                        children: quiz ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col h-full items-center justify-center text-center w-full animate-in fade-in zoom-in duration-300",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center w-full mb-4 absolute top-4 px-6 z-20",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-sm uppercase tracking-widest text-slate-400 font-bold max-w-[50%] truncate",
                                            children: quiz.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 266,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: [
                                                quiz.state !== "END" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleNextQuizStep,
                                                    disabled: actionLoading,
                                                    className: "px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold transition border border-slate-700",
                                                    children: "Skip ⏭"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 269,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        if (confirm("Are you sure you want to quit the quiz? Progress will be lost.")) handleCloseQuiz();
                                                    },
                                                    disabled: actionLoading,
                                                    className: "px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-200 border border-red-500/30 rounded text-xs font-bold transition",
                                                    children: "✕ Quit"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 273,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 267,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 265,
                                    columnNumber: 21
                                }, this),
                                quiz.state === "LOBBY" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-600",
                                            children: "Get Ready!"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 287,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-2xl text-white bg-slate-800/80 px-8 py-3 rounded-full inline-block border border-slate-700",
                                            children: [
                                                "👥 ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono font-bold text-blue-400",
                                                    children: participants.length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 36
                                                }, this),
                                                " players ready"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 290,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "pt-8",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleNextQuizStep,
                                                disabled: actionLoading,
                                                className: "px-8 py-4 bg-green-600 hover:bg-green-500 active:scale-95 rounded-xl font-bold text-xl shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-all flex items-center gap-2 mx-auto",
                                                children: actionLoading ? "Starting..." : "Start Game 🚀"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 294,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 293,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 286,
                                    columnNumber: 25
                                }, this),
                                quiz.state === "QUESTION" && quiz.questions[quiz.current_index] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full max-w-4xl pt-12",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-3xl sm:text-4xl font-bold leading-tight mb-8",
                                                    children: quiz.questions[quiz.current_index].text
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 308,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full bg-slate-800 h-3 rounded-full overflow-hidden relative",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-full bg-linear-to-r from-green-500 to-yellow-500 origin-left",
                                                        /* webhint: ignore inline-styles */ style: {
                                                            width: '100%',
                                                            animation: `width_linear ${quiz.questions[quiz.current_index].time_limit || 30}s linear forwards`
                                                        }
                                                    }, quiz.current_index, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 312,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 311,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 307,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-2 gap-4 w-full",
                                            children: quiz.questions[quiz.current_index].options.map((opt, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `p-6 rounded-xl text-xl font-bold flex items-center gap-4 text-white shadow-lg transition-transform hover:scale-[1.01] ${[
                                                        'bg-red-600',
                                                        'bg-blue-600',
                                                        'bg-yellow-600',
                                                        'bg-green-600'
                                                    ][i % 4]}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-2xl opacity-60 bg-black/20 w-10 h-10 flex items-center justify-center rounded-lg",
                                                            children: [
                                                                '▲',
                                                                '◆',
                                                                '●',
                                                                '■'
                                                            ][i]
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 332,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-left",
                                                            children: opt
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 335,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 326,
                                                    columnNumber: 37
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 324,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 306,
                                    columnNumber: 25
                                }, this),
                                quiz.state === "LEADERBOARD" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full max-w-lg pt-12",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-4xl font-bold mb-8 text-yellow-400 drop-shadow-lg",
                                            children: "🏆 Leaderboard"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 344,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3 mb-10",
                                            children: [
                                                Object.entries(quizScores || {}).sort(([, a], [, b])=>b - a).slice(0, 5).map(([name, score], i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700 animate-in slide-in-from-bottom-2 fade-in",
                                                        style: {
                                                            animationDelay: `${i * 100}ms`
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `font-black text-xl w-8 text-center ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-orange-400' : 'text-slate-500'}`,
                                                                        children: i + 1
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                        lineNumber: 352,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-lg font-medium",
                                                                        children: name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                        lineNumber: 355,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                lineNumber: 351,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-mono font-bold text-blue-400",
                                                                children: [
                                                                    score,
                                                                    " pts"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                lineNumber: 357,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, name, true, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 350,
                                                        columnNumber: 37
                                                    }, this)),
                                                Object.keys(quizScores || {}).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-slate-500 italic",
                                                    children: "Waiting for scores..."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 361,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 345,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleNextQuizStep,
                                            disabled: actionLoading,
                                            className: "px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition shadow-lg hover:shadow-blue-500/25",
                                            children: "Next Question →"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 364,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 343,
                                    columnNumber: 25
                                }, this),
                                quiz.state === "END" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-8 animate-in zoom-in duration-500 pt-12",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500 drop-shadow-sm",
                                            children: "GAME OVER"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 376,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-slate-800/80 p-10 rounded-3xl border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-slate-400 uppercase tracking-widest text-sm mb-4",
                                                    children: "The Winner is"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 380,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-5xl font-bold text-white mb-2",
                                                    children: Object.entries(quizScores || {}).sort(([, a], [, b])=>b - a)[0]?.[0] || "No one"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 381,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-yellow-400 text-xl font-mono",
                                                    children: [
                                                        Object.entries(quizScores || {}).sort(([, a], [, b])=>b - a)[0]?.[1] || 0,
                                                        " pts"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 384,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 379,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleCloseQuiz,
                                            disabled: actionLoading,
                                            className: "px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition font-medium text-slate-200",
                                            children: "Close Quiz & Return to Lobby"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 388,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 375,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                            lineNumber: 263,
                            columnNumber: 17
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-lg sm:text-xl font-semibold flex items-center gap-2",
                                            children: viewMode === "poll" ? "📊 Live Results" : "💬 Audience Q&A"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 397,
                                            columnNumber: 21
                                        }, this),
                                        currentPoll && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: endPoll,
                                            disabled: actionLoading,
                                            className: "text-xs bg-red-900/50 text-red-300 border border-red-900 px-3 py-1 rounded hover:bg-red-900 transition flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "w-2 h-2 bg-red-500 rounded-full animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 402,
                                                    columnNumber: 29
                                                }, this),
                                                " Stop Poll"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 401,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 396,
                                    columnNumber: 17
                                }, this),
                                viewMode === "poll" && (!currentPoll ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 flex flex-col items-center justify-center text-slate-600",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-6xl mb-4 grayscale opacity-20",
                                            children: "📊"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 410,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "opacity-50 text-lg",
                                            children: "No active poll"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 411,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowPollForm(true),
                                            className: "mt-4 text-blue-400 hover:text-blue-300 underline",
                                            children: "Launch one now"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 412,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 409,
                                    columnNumber: 21
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-8 animate-in fade-in slide-in-from-bottom-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-3xl font-bold text-center leading-snug",
                                            children: currentPoll.question
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 416,
                                            columnNumber: 25
                                        }, this),
                                        currentPoll.type === "multiple_choice" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4 max-w-2xl mx-auto w-full",
                                            children: [
                                                currentPoll.options?.map((opt, idx)=>{
                                                    const count = pollResults?.[opt.label] ?? opt.votes ?? 0;
                                                    const percent = totalPollVotes > 0 ? count / totalPollVotes * 100 : 0;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between text-base font-medium mb-1 px-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: opt.label
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                        lineNumber: 427,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-slate-400 text-sm",
                                                                                children: [
                                                                                    Math.round(percent),
                                                                                    "%"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                                lineNumber: 429,
                                                                                columnNumber: 45
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-mono bg-slate-800 px-2 py-0.5 rounded text-white",
                                                                                children: count
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                                lineNumber: 430,
                                                                                columnNumber: 45
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                        lineNumber: 428,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                lineNumber: 426,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-5 bg-slate-800 rounded-full overflow-hidden border border-slate-700",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-full bg-blue-500 transition-all duration-700 ease-out relative overflow-hidden",
                                                                    /* webhint: ignore inline-styles */ style: {
                                                                        width: `${percent}%`
                                                                    },
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "absolute inset-0 bg-white/10 w-full h-full animate-[shimmer_2s_infinite]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                        lineNumber: 439,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                    lineNumber: 434,
                                                                    columnNumber: 41
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                lineNumber: 433,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 425,
                                                        columnNumber: 33
                                                    }, this);
                                                }),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-center text-slate-500 text-sm mt-4",
                                                    children: [
                                                        totalPollVotes,
                                                        " total votes"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 445,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 419,
                                            columnNumber: 25
                                        }, this),
                                        currentPoll.type === "rating" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-center justify-center py-12",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-8xl font-black text-transparent bg-clip-text bg-linear-to-br from-yellow-300 to-yellow-600 flex items-baseline gap-2",
                                                        children: currentPoll.average || 0.0
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 452,
                                                        columnNumber: 33
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 451,
                                                    columnNumber: 29
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
                                                            className: `text-4xl ${star <= Math.round(currentPoll.average || 0) ? 'text-yellow-400' : 'text-slate-700'}`,
                                                            children: "★"
                                                        }, star, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 458,
                                                            columnNumber: 37
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 456,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-slate-500 mt-4",
                                                    children: [
                                                        Object.values(pollResults || {}).reduce((a, b)=>a + b, 0),
                                                        " votes"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 461,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 450,
                                            columnNumber: 25
                                        }, this),
                                        currentPoll.type === "word_cloud" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-4 justify-center items-center py-8 min-h-75",
                                            children: (()=>{
                                                const wordsToShow = pollResults && Object.keys(pollResults).length > 0 ? pollResults : currentPoll.words || {};
                                                const entries = Object.entries(wordsToShow);
                                                if (entries.length === 0) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-500",
                                                    children: "Waiting for words..."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 475,
                                                    columnNumber: 66
                                                }, this);
                                                return entries.map(([word, count])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-blue-400 font-bold transition-all duration-500 hover:scale-110 cursor-default animate-in zoom-in",
                                                        /* webhint: ignore inline-styles */ style: {
                                                            fontSize: `${Math.min(1.5 + count * 0.5, 5)}rem`,
                                                            opacity: Math.min(0.5 + count * 0.1, 1)
                                                        },
                                                        children: word
                                                    }, word, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 478,
                                                        columnNumber: 37
                                                    }, this));
                                            })()
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 466,
                                            columnNumber: 29
                                        }, this),
                                        currentPoll.type === "open_ended" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TransientThoughts, {
                                            responses: currentPoll.responses || []
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 495,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 415,
                                    columnNumber: 21
                                }, this)),
                                viewMode === "qna" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3 overflow-y-auto max-h-[65vh] pr-2 custom-scrollbar",
                                    children: [
                                        questions.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center py-10 text-slate-500",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: "No questions yet."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 506,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: "Audience can ask questions from their devices."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 507,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 505,
                                            columnNumber: 25
                                        }, this),
                                        questions.sort((a, b)=>b.votes - a.votes).map((q)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `p-4 rounded-xl border flex gap-4 transition group animate-in slide-in-from-right-2 ${q.visible !== false ? "bg-slate-800/50 border-slate-700 hover:border-blue-500/30" : "bg-slate-900/30 border-slate-800 opacity-50 grayscale"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col items-center justify-center min-w-12 text-blue-400 bg-slate-900/50 rounded-lg p-2 h-fit",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-lg font-bold",
                                                                children: "▲"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                lineNumber: 520,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm font-mono font-bold",
                                                                children: q.votes
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                lineNumber: 521,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 519,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `text-base font-medium ${q.visible !== false ? "text-slate-200" : "text-slate-500 italic line-through"}`,
                                                                children: q.text
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                lineNumber: 524,
                                                                columnNumber: 29
                                                            }, this),
                                                            q.visible === false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-red-400 uppercase font-bold tracking-wider mt-1 block",
                                                                children: "Hidden"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                lineNumber: 527,
                                                                columnNumber: 53
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 523,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleToggleQuestion(q.id),
                                                        className: `px-3 py-1 rounded text-sm font-bold transition h-fit self-center ${q.visible !== false ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"}`,
                                                        children: q.visible !== false ? "Hide" : "Show"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 529,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, q.id, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 511,
                                                columnNumber: 25
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 503,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                        lineNumber: 260,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6 h-full overflow-y-auto custom-scrollbar pr-1 pb-20",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-xl backdrop-blur-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-base font-bold text-slate-300 flex justify-between items-center mb-4 uppercase tracking-wider",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "👥 Participants"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 554,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-slate-800 px-2 py-1 rounded text-white border border-slate-700",
                                                children: participants.length
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 555,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 553,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1 max-h-48 overflow-y-auto custom-scrollbar",
                                        children: [
                                            participants.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-slate-500 text-sm italic text-center py-4",
                                                children: "Waiting for joiners..."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 558,
                                                columnNumber: 47
                                            }, this),
                                            participants.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between items-center bg-slate-800/30 p-2 rounded hover:bg-slate-800 transition group border border-transparent hover:border-slate-700",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm text-slate-300 font-medium truncate max-w-[70%]",
                                                            children: p.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 561,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleBanUser(p.name),
                                                            className: "text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition font-bold",
                                                            children: "KICK"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                            lineNumber: 562,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, p.id, true, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 560,
                                                    columnNumber: 21
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 557,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 552,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-xl backdrop-blur-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-base font-bold text-slate-300 mb-4 uppercase tracking-wider",
                                        children: "Control Deck"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 575,
                                        columnNumber: 13
                                    }, this),
                                    quiz && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg animate-pulse",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-blue-300 font-bold uppercase mb-2",
                                                children: [
                                                    "Active Quiz: ",
                                                    quiz.state
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 580,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-2",
                                                children: [
                                                    quiz.state === 'LOBBY' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handleNextQuizStep,
                                                        className: "p-3 bg-green-600 hover:bg-green-500 rounded font-bold transition",
                                                        children: "Start Game ▶"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 582,
                                                        columnNumber: 52
                                                    }, this),
                                                    quiz.state === 'QUESTION' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-center text-sm font-bold text-white bg-slate-800 p-2 rounded",
                                                        children: "Question Live..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 583,
                                                        columnNumber: 55
                                                    }, this),
                                                    quiz.state === 'LEADERBOARD' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handleNextQuizStep,
                                                        className: "p-3 bg-blue-600 hover:bg-blue-500 rounded font-bold transition",
                                                        children: "Next Question ➡"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 584,
                                                        columnNumber: 58
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handleCloseQuiz,
                                                        className: "p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-xs border border-red-500/20 transition",
                                                        children: "End Quiz"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 585,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 581,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 579,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setShowPollForm(true);
                                                    setViewMode("poll");
                                                },
                                                className: "p-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition text-left flex justify-between items-center group active:scale-[0.98]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Launch New Poll"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 595,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "group-hover:translate-x-1 transition",
                                                        children: "🚀"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 595,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 591,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setShowQuizCreator(true),
                                                        className: "p-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition flex flex-col items-center justify-center gap-1 active:scale-[0.98]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xl",
                                                                children: "🏆"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                lineNumber: 603,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs",
                                                                children: "Manual Quiz"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                lineNumber: 604,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 599,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setShowAIModal(true),
                                                        className: "p-3 bg-linear-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg transition flex flex-col items-center justify-center gap-1 shadow-lg active:scale-[0.98]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xl",
                                                                children: "✨"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                lineNumber: 610,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs",
                                                                children: "AI Quiz"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                lineNumber: 611,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 606,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 598,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowWheel(true),
                                                className: "p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition text-left flex justify-between items-center text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Spin Wheel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 619,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "🎲"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 619,
                                                        columnNumber: 40
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 615,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-slate-800/50 p-3 rounded-lg border border-slate-700 mt-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: "chat-input",
                                                        className: "text-xs text-slate-400 font-bold uppercase block mb-2",
                                                        children: "Paste Chat Log (Zoom/Teams)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 624,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        id: "chat-input",
                                                        className: "w-full bg-slate-900 text-xs text-white p-2 rounded h-16 border border-slate-700 mb-2 focus:ring-1 focus:ring-blue-500 outline-none",
                                                        placeholder: "Paste chat here..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 625,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: async ()=>{
                                                            const text = document.getElementById('chat-input').value;
                                                            if (!text) return;
                                                            // 1. Reset current state first (Visual feedback)
                                                            setPoll(null);
                                                            // 2. Simple NLP: Filter out short words, count frequency
                                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                            const words = text.split(/\s+/).filter((w)=>w.length > 3).reduce((acc, word)=>{
                                                                const clean = word.toLowerCase().replace(/[^a-z]/g, '');
                                                                if (clean.length > 3) {
                                                                    acc[clean] = (acc[clean] || 0) + 1;
                                                                }
                                                                return acc;
                                                            }, {});
                                                            // 3. Send to backend
                                                            await apiCall("/poll/start", "POST", {
                                                                type: "word_cloud",
                                                                question: "Chat Insights",
                                                                words: words
                                                            });
                                                            // 4. Force a fetch to ensure UI syncs if socket is slow
                                                            setTimeout(()=>{
                                                                apiCall("/state").then((data)=>{
                                                                    if (data?.current_poll) setPoll(data.current_poll);
                                                                });
                                                            }, 300);
                                                        },
                                                        className: "w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2 rounded transition",
                                                        children: "✨ Visualize Chat"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 630,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 623,
                                                columnNumber: 15
                                            }, this),
                                            !isSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setShowMap(true),
                                                        className: "p-3 bg-purple-900/30 hover:bg-purple-900/50 text-purple-200 border border-purple-500/30 rounded-lg transition text-left flex justify-between items-center text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Magic Map"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                lineNumber: 674,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "🌍"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                lineNumber: 674,
                                                                columnNumber: 47
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 670,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handleExport,
                                                        className: "p-3 bg-orange-900/20 hover:bg-orange-900/40 text-orange-200 border border-orange-500/20 rounded-lg transition text-left flex justify-between items-center text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Export CSV"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                lineNumber: 681,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "📥"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                                lineNumber: 681,
                                                                columnNumber: 48
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 677,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-px bg-slate-800 my-1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 686,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setViewMode("qna"),
                                                className: `p-3 font-bold rounded-lg transition text-left flex justify-between items-center text-sm ${viewMode === 'qna' ? "bg-slate-700 text-white ring-2 ring-blue-500" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "View Q&A Board"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 692,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "bg-slate-900 px-2 py-0.5 rounded text-xs border border-slate-700",
                                                        children: questions.length
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 693,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 688,
                                                columnNumber: 15
                                            }, this),
                                            !isSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowSettings(true),
                                                className: "p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition text-left flex justify-between items-center text-sm hover:text-white",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Settings"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 701,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "⚙️"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 701,
                                                        columnNumber: 42
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 697,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 590,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 574,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleAiAnalyze,
                                        disabled: analyzing,
                                        className: "w-full p-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition text-left border border-indigo-400/30 flex justify-between items-center shadow-lg active:scale-[0.98]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm",
                                                        children: "Analyze Room Vibe"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 715,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] opacity-70 font-normal",
                                                        children: "Powered by Gemini AI"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 716,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 714,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: analyzing ? "animate-spin text-xl" : "text-xl",
                                                children: analyzing ? "⚙️" : "🔮"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 718,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 709,
                                        columnNumber: 15
                                    }, this),
                                    aiSummary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 bg-slate-800/90 rounded-xl border border-purple-500/30 animate-in fade-in slide-in-from-top-2 shadow-lg backdrop-blur-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-lg",
                                                        children: "🤖"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 724,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-purple-400 text-xs font-bold uppercase tracking-widest",
                                                        children: "Hive Mind Insights"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                        lineNumber: 725,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 723,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-slate-300 text-sm leading-relaxed italic border-l-2 border-purple-500 pl-3",
                                                children: [
                                                    '"',
                                                    aiSummary,
                                                    '"'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                lineNumber: 727,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                        lineNumber: 722,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 708,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/presenter/[code]/page.tsx",
                        lineNumber: 549,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 256,
                columnNumber: 7
            }, this),
            showWheel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WinningWheel, {
                participants: participants.map((p)=>p.name) || [],
                onClose: ()=>setShowWheel(false)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 739,
                columnNumber: 10
            }, this),
            showPollForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CreatePollForm, {
                sessionCode: code,
                onClose: ()=>setShowPollForm(false)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 742,
                columnNumber: 24
            }, this),
            showQuizCreator && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuizCreator, {
                sessionCode: code,
                onClose: ()=>setShowQuizCreator(false)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 743,
                columnNumber: 27
            }, this),
            showAIModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AIQuizCreator, {
                sessionCode: code,
                onClose: ()=>setShowAIModal(false),
                onSuccess: handleQuizCreated
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 744,
                columnNumber: 23
            }, this),
            showMap && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 backdrop-blur-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-6xl h-[80vh] bg-slate-900 rounded-2xl relative flex flex-col overflow-hidden border border-slate-700 shadow-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 z-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-bold flex items-center gap-2",
                                    children: [
                                        "🌍 Magic Map ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700",
                                            children: "Live Locations"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 751,
                                            columnNumber: 38
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 750,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowMap(false),
                                    className: "text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded transition font-bold",
                                    children: "✕ Close"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 753,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                            lineNumber: 749,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 bg-black relative",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MagicMap, {}, void 0, false, {
                                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                lineNumber: 761,
                                columnNumber: 21
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                            lineNumber: 760,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                    lineNumber: 748,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 747,
                columnNumber: 9
            }, this),
            showSettings && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl scale-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold mb-6 flex items-center gap-2",
                            children: "⚙️ Session Settings"
                        }, void 0, false, {
                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                            lineNumber: 770,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "logo-url",
                                            className: "text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block",
                                            children: "Custom Logo URL"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 775,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "logo-url",
                                            "aria-label": "Custom Logo URL",
                                            type: "text",
                                            value: tempLogo,
                                            onChange: (e)=>setTempLogo(e.target.value),
                                            placeholder: "https://example.com/logo.png",
                                            className: "w-full bg-slate-800 border border-slate-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm placeholder:text-slate-600"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 776,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 774,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-slate-800/50 p-4 rounded-xl border border-slate-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 block",
                                            children: "Embed in Slides / Notion"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 789,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] text-slate-400 mb-3",
                                            children: 'Copy this URL into an iframe or the "Web Viewer" add-in for PowerPoint.'
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 790,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    readOnly: true,
                                                    "aria-label": "Embed Code URL",
                                                    value: `${("TURBOPACK compile-time truthy", 1) ? window.location.origin : "TURBOPACK unreachable"}/embed/presenter/${code}?transparent=true`,
                                                    className: "flex-1 bg-slate-950 border border-slate-800 p-2 rounded text-xs text-slate-300 font-mono select-all"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 794,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        const url = `${window.location.origin}/embed/presenter/${code}?transparent=true`;
                                                        navigator.clipboard.writeText(`<iframe src="${url}" width="100%" height="600" frameborder="0"></iframe>`);
                                                        alert("Iframe code copied to clipboard!");
                                                    },
                                                    className: "bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold transition",
                                                    children: "Copy"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                                    lineNumber: 800,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 793,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 788,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-3 pt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowSettings(false),
                                            className: "flex-1 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition font-bold border border-transparent hover:border-slate-700",
                                            children: "Close"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 814,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: saveSettings,
                                            className: "flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition shadow-lg",
                                            children: "Save Branding"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                            lineNumber: 815,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                                    lineNumber: 813,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/presenter/[code]/page.tsx",
                            lineNumber: 771,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/presenter/[code]/page.tsx",
                    lineNumber: 769,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/presenter/[code]/page.tsx",
                lineNumber: 768,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/presenter/[code]/page.tsx",
        lineNumber: 217,
        columnNumber: 5
    }, this);
}
_s(PresenterDashboard, "UX54CBORahyseBBREvRhKiBgVIg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRealtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRealtime"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"]
    ];
});
_c7 = PresenterDashboard;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "ReactionOverlay");
__turbopack_context__.k.register(_c1, "CreatePollForm");
__turbopack_context__.k.register(_c2, "WinningWheel");
__turbopack_context__.k.register(_c3, "QuizCreator");
__turbopack_context__.k.register(_c4, "AIQuizCreator");
__turbopack_context__.k.register(_c5, "MagicMap");
__turbopack_context__.k.register(_c6, "TransientThoughts");
__turbopack_context__.k.register(_c7, "PresenterDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_ccc1a819._.js.map