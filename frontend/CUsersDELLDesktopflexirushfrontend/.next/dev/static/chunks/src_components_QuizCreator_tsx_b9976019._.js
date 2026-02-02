(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
        const newQs = [
            ...questions
        ];
        // Create a new array for options to ensure React detects the change
        const newOptions = [
            ...newQs[qIdx].options
        ];
        newOptions[oIdx] = val;
        newQs[qIdx].options = newOptions;
        setQuestions(newQs);
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
                    lineNumber: 63,
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
                    lineNumber: 65,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6 max-h-[50vh] overflow-y-auto mb-4 pr-2 custom-scrollbar",
                    children: questions.map((q, qIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 bg-slate-800 rounded-xl border border-slate-700",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold text-slate-300",
                                            children: [
                                                "Question ",
                                                qIdx + 1
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/QuizCreator.tsx",
                                            lineNumber: 77,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            "aria-label": "Time limit per question",
                                            className: "bg-slate-700 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500 text-white",
                                            value: q.time_limit,
                                            onChange: (e)=>updateQuestion(qIdx, "time_limit", parseInt(e.target.value)),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: 10,
                                                    children: "10s"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                                    lineNumber: 85,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: 20,
                                                    children: "20s"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                                    lineNumber: 86,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: 30,
                                                    children: "30s"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                                    lineNumber: 87,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: 60,
                                                    children: "60s"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                                    lineNumber: 88,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/QuizCreator.tsx",
                                            lineNumber: 79,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                    lineNumber: 76,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    "aria-label": `Question ${qIdx + 1} text`,
                                    className: "w-full bg-slate-700 p-2 rounded mb-3 text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-blue-500 transition",
                                    placeholder: "e.g. What is the capital of France?",
                                    value: q.text,
                                    onChange: (e)=>updateQuestion(qIdx, "text", e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                    lineNumber: 92,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-2",
                                    children: q.options.map((opt, oIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "radio",
                                                    name: `correct-${q.id}`,
                                                    "aria-label": `Mark option ${oIdx + 1} as correct`,
                                                    checked: q.correct_index === oIdx,
                                                    onChange: ()=>updateQuestion(qIdx, "correct_index", oIdx),
                                                    className: "accent-green-500 w-4 h-4 cursor-pointer"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                                    lineNumber: 103,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    "aria-label": `Option ${oIdx + 1} text`,
                                                    className: "w-full bg-slate-700 p-2 rounded text-sm text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-blue-500 transition",
                                                    placeholder: `Option ${oIdx + 1}`,
                                                    value: opt,
                                                    onChange: (e)=>updateOption(qIdx, oIdx, e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                                    lineNumber: 112,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, oIdx, true, {
                                            fileName: "[project]/src/components/QuizCreator.tsx",
                                            lineNumber: 102,
                                            columnNumber: 29
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/QuizCreator.tsx",
                                    lineNumber: 100,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, q.id, true, {
                            fileName: "[project]/src/components/QuizCreator.tsx",
                            lineNumber: 75,
                            columnNumber: 17
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/QuizCreator.tsx",
                    lineNumber: 73,
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
                    lineNumber: 126,
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
                            lineNumber: 134,
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
                                        lineNumber: 142,
                                        columnNumber: 24
                                    }, this),
                                    "Starting..."
                                ]
                            }, void 0, true) : "Launch Quiz"
                        }, void 0, false, {
                            fileName: "[project]/src/components/QuizCreator.tsx",
                            lineNumber: 135,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/QuizCreator.tsx",
                    lineNumber: 133,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/QuizCreator.tsx",
            lineNumber: 62,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/QuizCreator.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
_s(QuizCreator, "7zzlbsuCBTyN/zEWQdn5RNhHxrQ=");
_c = QuizCreator;
var _c;
__turbopack_context__.k.register(_c, "QuizCreator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/QuizCreator.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/QuizCreator.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_QuizCreator_tsx_b9976019._.js.map