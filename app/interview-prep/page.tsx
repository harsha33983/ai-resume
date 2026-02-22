"use client"

import { useState, useEffect, useRef } from "react"
import { AppNav } from "@/components/app-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
    Mic,
    MicOff,
    Send,
    Volume2,
    Bot,
    Loader2,
    Keyboard,
    Check,
    Timer,
    Smile,
    Zap,
    Target,
    Lightbulb
} from "lucide-react"
import { cn } from "@/lib/utils"

// Type for chat messages
type Message = {
    role: "user" | "model"
    text: string
}

export default function InterviewPrepPage() {
    // Setup state
    const [role, setRole] = useState("")
    const [topic, setTopic] = useState("")
    const [isStarted, setIsStarted] = useState(false)

    // Chat state
    const [messages, setMessages] = useState<Message[]>([])
    const [inputText, setInputText] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Voice state
    const [isRecording, setIsRecording] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [sessionTime, setSessionTime] = useState(0)
    const [isInputMode, setIsInputMode] = useState<"voice" | "keyboard">("voice")

    const recognitionRef = useRef<any>(null)
    const synthesisRef = useRef<SpeechSynthesis | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    // Format time (MM:SS)
    const formattedTime = `${String(Math.floor(sessionTime / 60)).padStart(2, '0')}:${String(sessionTime % 60).padStart(2, '0')}`

    // Initialize voice features & Timer
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Speech Recognition setup
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = false
                recognition.interimResults = true
                recognition.lang = "en-US"

                recognition.onresult = (event: any) => {
                    let transcript = ""
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript
                    }
                    setInputText(transcript)
                }

                recognition.onend = () => {
                    setIsRecording(false)
                }

                recognitionRef.current = recognition
            }

            // Speech Synthesis setup
            synthesisRef.current = window.speechSynthesis
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
            if (recognitionRef.current) recognitionRef.current.stop()
            if (synthesisRef.current) synthesisRef.current.cancel()
        }
    }, [])

    // Timer logic
    useEffect(() => {
        if (isStarted) {
            timerRef.current = setInterval(() => {
                setSessionTime(prev => prev + 1)
            }, 1000)
        } else {
            if (timerRef.current) clearInterval(timerRef.current)
            setSessionTime(0)
        }
    }, [isStarted])

    // Keyboard shortcut to pause/record
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && isStarted && isInputMode === "voice" && document.activeElement?.tagName !== 'INPUT') {
                e.preventDefault()
                toggleRecording()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isStarted, isRecording, isInputMode])

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isLoading, inputText])

    const startInterview = async () => {
        if (!role || !topic) return
        setIsStarted(true)
        setIsLoading(true)

        try {
            const res = await fetch("/api/interview-prep", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role,
                    topic,
                    messages: []
                })
            })

            const data = await res.json()
            if (data.content) {
                const aiMsg: Message = { role: "model", text: data.content }
                setMessages([aiMsg])
                speak(data.content)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const sendMessage = async () => {
        if (!inputText.trim()) return

        const userMsg: Message = { role: "user", text: inputText }
        const newMessages = [...messages, userMsg]
        setMessages(newMessages)
        setInputText("")
        setIsLoading(true)

        if (isRecording) {
            toggleRecording() // Stop recording when sending
        }

        // Stop speaking if user interrupts
        stopSpeaking()

        try {
            const res = await fetch("/api/interview-prep", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role,
                    topic,
                    messages: newMessages.map(m => ({
                        role: m.role,
                        text: m.text
                    }))
                })
            })

            const data = await res.json()
            if (data.content) {
                const aiMsg: Message = { role: "model", text: data.content }
                setMessages(prev => [...prev, aiMsg])
                speak(data.content)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop()
        } else {
            stopSpeaking()
            try {
                recognitionRef.current?.start()
                setIsRecording(true)
            } catch (e) {
                console.error("Mic error:", e)
            }
        }
    }

    const speak = (text: string) => {
        if (!synthesisRef.current) return
        synthesisRef.current.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 1.0
        utterance.pitch = 1.0
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)
        synthesisRef.current.speak(utterance)
    }

    const stopSpeaking = () => {
        if (!synthesisRef.current) return
        synthesisRef.current.cancel()
        setIsSpeaking(false)
    }

    const formatTimeWithAMPM = (date: Date = new Date()) => {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    }

    if (!isStarted) {
        return (
            <div className="min-h-screen bg-transparent flex flex-col font-sans text-black">
                <AppNav />
                <main className="flex-1 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full shadow-2xl border-0 rounded-[2.5rem] bg-white pt-6">
                        <CardHeader className="text-center space-y-4">
                            <div className="mx-auto bg-blue-50 p-5 rounded-full w-fit">
                                <Bot className="h-10 w-10 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold tracking-tight">AI Interview Prep</CardTitle>
                                <CardDescription className="text-gray-500 mt-2">
                                    Configure your highly realistic mock interview session.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4 pb-8">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Role Position</Label>
                                <Input
                                    placeholder="e.g. Senior Product Designer"
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                    className="h-14 rounded-2xl px-5 bg-gray-50 border-gray-100 focus-visible:ring-blue-600"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Focus Topic</Label>
                                <Input
                                    placeholder="e.g. Behavioral, Technical"
                                    value={topic}
                                    onChange={e => setTopic(e.target.value)}
                                    className="h-14 rounded-2xl px-5 bg-gray-50 border-gray-100 focus-visible:ring-blue-600"
                                />
                            </div>
                            <Button
                                className="w-full text-lg h-14 rounded-full font-bold mt-4"
                                onClick={startInterview}
                                disabled={!role || !topic}
                            >
                                Start Interview Session
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        )
    }

    // Determine current interview step based on message count (mock logic)
    const stepCount = Math.min(Math.floor(messages.length / 2) + 1, 4)

    return (
        <div className="font-sans text-black overflow-hidden h-screen flex flex-col bg-[#F9FAFB]">

            {/* Top Navigation */}
            <nav className="w-full bg-white border-b border-gray-100 h-20 flex-shrink-0 relative z-50">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-full flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                                <span className="font-bold text-sm">RA</span>
                            </div>
                            ResumAI
                        </div>
                        <div className="hidden md:flex items-center gap-4 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Active Session: {role}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsStarted(false)}
                            className="text-sm font-bold text-gray-500 hover:text-red-600 transition-colors"
                        >
                            End Session
                        </button>
                        <div className="h-8 w-px bg-gray-200 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                YOU
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 overflow-hidden flex">

                {/* Left Sidebar (Progress) */}
                <aside className="w-80 border-r border-gray-100 bg-white p-8 flex flex-col gap-8 overflow-y-auto hidden lg:flex">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Interview Progress</h3>
                        <div className="space-y-6">

                            <div className={`flex gap-4 items-start ${stepCount > 1 ? '' : 'opacity-40'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${stepCount > 1 ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
                                    {stepCount > 1 ? <Check className="w-3 h-3" /> : '1'}
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Introduction</p>
                                    <p className={`text-xs ${stepCount > 1 ? 'text-gray-500' : 'text-blue-600 font-medium'}`}>{stepCount > 1 ? 'Completed' : 'In Progress...'}</p>
                                </div>
                            </div>

                            <div className={`flex gap-4 items-start ${stepCount > 2 ? '' : stepCount === 2 ? '' : 'opacity-40'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${stepCount > 2 ? 'bg-green-500 text-white' : stepCount === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                    {stepCount > 2 ? <Check className="w-3 h-3" /> : '2'}
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Technical Skills</p>
                                    <p className={`text-xs ${stepCount > 2 ? 'text-gray-500' : stepCount === 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>{stepCount > 2 ? 'Completed' : stepCount === 2 ? 'In Progress...' : 'Up next'}</p>
                                </div>
                            </div>

                            <div className={`flex gap-4 items-start ${stepCount > 3 ? '' : stepCount === 3 ? '' : 'opacity-40'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${stepCount > 3 ? 'bg-green-500 text-white' : stepCount === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                    {stepCount > 3 ? <Check className="w-3 h-3" /> : '3'}
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Behavioral</p>
                                    <p className={`text-xs ${stepCount > 3 ? 'text-gray-500' : stepCount === 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>{stepCount > 3 ? 'Completed' : stepCount === 3 ? 'In Progress...' : 'Up next'}</p>
                                </div>
                            </div>

                            <div className={`flex gap-4 items-start ${stepCount === 4 ? '' : 'opacity-40'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${stepCount === 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                    4
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Closing</p>
                                    <p className={`text-xs ${stepCount === 4 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>{stepCount === 4 ? 'In Progress...' : 'Pending'}</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="mt-auto bg-gray-900 rounded-3xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-blue-400"><Timer className="w-4 h-4" /></span>
                            <span className="text-sm font-medium text-gray-400">Session Time</span>
                        </div>
                        <div className="text-3xl font-bold mb-4">{formattedTime}</div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                                    <span>Confidence Score</span>
                                    <span>84%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: '84%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <section className="flex-1 flex flex-col relative bg-gray-50/50">

                    {/* Chat History */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-12" style={{ scrollbarWidth: 'thin' }}>
                        <div className="max-w-3xl mx-auto space-y-10">

                            {messages.map((msg, i) => (
                                msg.role === "model" ? (
                                    <div key={i} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="w-10 h-10 rounded-xl bg-black text-white flex-shrink-0 flex items-center justify-center">
                                            <Bot className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-4 max-w-[85%]">
                                            <div className="bg-white p-6 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm relative">
                                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                                    {msg.text}
                                                </p>
                                                {/* Speaker Indicator */}
                                                {isSpeaking && i === messages.length - 1 && (
                                                    <div className="absolute -bottom-3 left-4 mt-2 flex gap-1 bg-white border border-gray-100 px-2 py-1 rounded-full shadow-sm">
                                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                                {formatTimeWithAMPM()} • AI Recruiter
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={i} className="flex gap-4 flex-row-reverse animate-in fade-in slide-in-from-bottom-2">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex-shrink-0 flex items-center justify-center font-bold text-xs shadow-sm">
                                            YOU
                                        </div>
                                        <div className="space-y-4 max-w-[85%] flex flex-col items-end">
                                            <div className="bg-gray-900 text-white p-6 rounded-2xl rounded-tr-none shadow-lg">
                                                <p className="leading-relaxed whitespace-pre-wrap">
                                                    {msg.text}
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                                {formatTimeWithAMPM()} • You
                                            </span>
                                        </div>
                                    </div>
                                )
                            ))}

                            {/* Live Transcription Box */}
                            {(inputText.trim() || isRecording) && (
                                <div className="flex gap-4 flex-row-reverse animate-in fade-in">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex-shrink-0 flex items-center justify-center font-bold text-xs shadow-sm opacity-50">
                                        YOU
                                    </div>
                                    <div className="space-y-4 max-w-[85%] flex flex-col items-end">
                                        <div className="bg-gray-900 text-white p-6 rounded-2xl rounded-tr-none shadow-lg border border-gray-700">
                                            <p className="leading-relaxed">
                                                {inputText || "Listening..."}
                                            </p>
                                            {isRecording && (
                                                <div className="mt-4 flex items-center gap-2">
                                                    <div className="flex gap-0.5 h-4 items-center">
                                                        <div className="w-1 bg-blue-400 h-2 rounded-full animate-pulse"></div>
                                                        <div className="w-1 bg-blue-400 h-3 rounded-full animate-pulse"></div>
                                                        <div className="w-1 bg-blue-400 h-4 rounded-full animate-pulse"></div>
                                                        <div className="w-1 bg-blue-400 h-2 rounded-full animate-pulse"></div>
                                                        <div className="w-1 bg-blue-400 h-1 rounded-full animate-pulse"></div>
                                                        <div className="w-1 bg-blue-400 h-4 rounded-full animate-pulse"></div>
                                                        <div className="w-1 bg-blue-400 h-3 rounded-full animate-pulse"></div>
                                                    </div>
                                                    <span className="text-[10px] font-medium text-gray-400">Transcribing voice response...</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* AI Loading State */}
                            {isLoading && (
                                <div className="flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-xl bg-black text-white flex-shrink-0 flex items-center justify-center">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div className="flex gap-1.5 p-4 py-3 bg-white border border-gray-100 rounded-2xl rounded-tl-none">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Bottom Controls */}
                    <div className="p-6 md:p-12 pt-0 z-10 w-full mb-0 sticky bottom-0">
                        <div className="max-w-3xl mx-auto">
                            <div className="relative bg-white border border-gray-200 rounded-[2rem] shadow-2xl p-2 flex items-center gap-2">

                                <button
                                    onClick={() => setIsInputMode(prev => prev === "voice" ? "keyboard" : "voice")}
                                    className="w-12 h-12 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors shrink-0"
                                >
                                    {isInputMode === "keyboard" ? <Mic className="w-5 h-5" /> : <Keyboard className="w-5 h-5" />}
                                </button>

                                {isInputMode === "voice" ? (
                                    <div className="flex-1 px-4 text-gray-400 font-medium select-none truncate">
                                        {isRecording ? "Listening to your response..." : "Click record to speak your response..."}
                                    </div>
                                ) : (
                                    <Input
                                        value={inputText}
                                        onChange={e => setInputText(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && sendMessage()}
                                        placeholder="Type your response..."
                                        className="flex-1 h-12 border-none shadow-none focus-visible:ring-0 px-2 text-base"
                                    />
                                )}

                                <div className="flex items-center gap-2 pr-1">
                                    {isInputMode === "voice" ? (
                                        <button
                                            onClick={toggleRecording}
                                            disabled={isLoading}
                                            className={cn(
                                                "px-6 md:px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shrink-0",
                                                isRecording
                                                    ? "bg-black text-white shadow-black/20 hover:bg-gray-800"
                                                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20"
                                            )}
                                        >
                                            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                            <span className="hidden sm:inline">{isRecording ? "Stop" : "Record"}</span>
                                        </button>
                                    ) : null}

                                    {/* Only show send button if we have text to send */}
                                    {(inputText.trim().length > 0 || isInputMode === "keyboard") && (
                                        <button
                                            onClick={sendMessage}
                                            disabled={isLoading || !inputText.trim()}
                                            className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-800 transition-all shadow-lg shadow-black/20 disabled:opacity-50 shrink-0"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {isInputMode === "voice" && (
                                <p className="text-center mt-4 text-xs text-gray-400">
                                    Press <span className="px-1.5 py-0.5 border border-gray-200 rounded bg-white font-mono text-gray-500">Space</span> to pause recording
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Right Sidebar (Insights) */}
                <aside className="w-[380px] border-l border-gray-100 bg-white p-8 overflow-y-auto hidden xl:block">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-8">Live AI Insights</h3>

                    <div className="space-y-6">

                        {/* Static Insight Cards to match design */}
                        <div className="p-6 rounded-3xl border border-blue-100 bg-blue-50/30 group hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                                    <Smile className="w-5 h-5" />
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-blue-600">92%</div>
                                    <div className="text-[10px] font-bold text-blue-400 uppercase">Tone</div>
                                </div>
                            </div>
                            <h4 className="font-bold text-sm mb-2">Highly Professional</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">Your vocal text analysis is stable and confident. You sound prepared and authoritative on the subject matter.</p>
                        </div>

                        <div className="p-6 rounded-3xl border border-purple-100 bg-purple-50/30 group hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-purple-600">78%</div>
                                    <div className="text-[10px] font-bold text-purple-400 uppercase">Delivery</div>
                                </div>
                            </div>
                            <h4 className="font-bold text-sm mb-2">Watch your Pacing</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">You're responding at a strong pace. Make sure to pause completely between complex topics for better clarity.</p>
                        </div>

                        <div className="p-6 rounded-3xl border border-green-100 bg-green-50/30 group hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-green-600">85%</div>
                                    <div className="text-[10px] font-bold text-green-400 uppercase">Relevance</div>
                                </div>
                            </div>
                            <h4 className="font-bold text-sm mb-2">Excellent Match</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">Your answers are hitting the core requirements directly. Keep focusing heavily on your exact experience.</p>
                        </div>

                        {/* Dynamic Suggestion based on topic */}
                        <div className="p-5 rounded-2xl bg-gray-900 text-white shadow-xl">
                            <div className="flex items-center gap-3 mb-3">
                                <Lightbulb className="w-4 h-4 text-yellow-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">AI Suggestion</span>
                            </div>
                            <p className="text-sm leading-relaxed font-medium">
                                Try using the <span className="text-blue-400 font-bold">STAR method</span> for the next question to structure your impact clearly around {topic || 'your skills'}.
                            </p>
                        </div>

                    </div>
                </aside>
            </main>
        </div>
    )
}
