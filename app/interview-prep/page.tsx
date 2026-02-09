"use client"

import { useState, useEffect, useRef } from "react"
import { AppNav } from "@/components/app-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area" // Using ScrollArea
import { Mic, MicOff, Send, Volume2, Square, Play, User, Bot, Loader2 } from "lucide-react"
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
    const recognitionRef = useRef<any>(null)
    const synthesisRef = useRef<SpeechSynthesis | null>(null)

    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Initialize voice features
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Speech Recognition setup
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = false // Changed to false for better mobile/stop handling
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
                    // Optional: auto-send if desired, but manual send is safer
                }

                recognitionRef.current = recognition
            }

            // Speech Synthesis setup
            synthesisRef.current = window.speechSynthesis
        }
    }, [])

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isLoading])

    const startInterview = async () => {
        if (!role || !topic) return
        setIsStarted(true)
        setIsLoading(true)

        // Initial intro message triggers AI to start
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
                        text: m.text // Send text property, API maps it
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
            stopSpeaking() // Ensure AI stops talking when user wants to speak
            setInputText("")
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

        // Stop any current speech
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

    if (!isStarted) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <AppNav />
                <main className="flex-1 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full shadow-lg border-2">
                        <CardHeader className="text-center space-y-2">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                                <Bot className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">AI Interview Prep</CardTitle>
                            <CardDescription>
                                Configure your mock interview session.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Role Position</Label>
                                <Input
                                    placeholder="e.g. Senior React Developer"
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Focus Topic</Label>
                                <Input
                                    placeholder="e.g. System Design, Hooks, Performance"
                                    value={topic}
                                    onChange={e => setTopic(e.target.value)}
                                />
                            </div>
                            <Button
                                className="w-full text-lg py-6 mt-2"
                                onClick={startInterview}
                                disabled={!role || !topic}
                            >
                                Start Interview
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        )
    }

    return (
        <div className="flex h-screen flex-col bg-background">
            <AppNav />

            <header className="border-b px-6 py-3 flex items-center justify-between bg-muted/30">
                <div>
                    <h2 className="font-semibold text-sm">{role} Interview</h2>
                    <p className="text-xs text-muted-foreground">Focus: {topic}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsStarted(false)}>
                    End Session
                </Button>
            </header>

            {/* Chat Area */}
            <ScrollArea className="flex-1 p-4">
                <div className="mx-auto max-w-3xl space-y-6 pb-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={cn(
                            "flex gap-4 w-full animate-in fade-in slide-in-from-bottom-2",
                            msg.role === "user" ? "justify-end" : "justify-start"
                        )}>
                            {msg.role === "model" && (
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border">
                                    <Bot className="h-5 w-5 text-primary" />
                                </div>
                            )}

                            <div className={cn(
                                "flex flex-col gap-1 max-w-[80%]",
                                msg.role === "user" ? "items-end" : "items-start"
                            )}>
                                <div className={cn(
                                    "rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm",
                                    msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-background border rounded-tl-none"
                                )}>
                                    {msg.text}
                                </div>

                                {msg.role === "model" && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 text-xs text-muted-foreground hover:text-primary"
                                        onClick={() => speak(msg.text)}
                                    >
                                        <Volume2 className="h-3 w-3 mr-1" /> Listen
                                    </Button>
                                )}
                            </div>

                            {msg.role === "user" && (
                                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border">
                                    <User className="h-5 w-5 text-blue-500" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-4 w-full justify-start">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border">
                                <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <div className="bg-background border rounded-2xl px-5 py-3 rounded-tl-none flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <footer className="border-t bg-background/80 backdrop-blur-md p-4 sticky bottom-0 z-10">
                <div className="mx-auto max-w-3xl flex gap-3 items-end">
                    <Button
                        variant={isRecording ? "destructive" : "outline"}
                        size="icon"
                        className={cn(
                            "h-12 w-12 rounded-full shrink-0 shadow-sm transition-all",
                            isRecording && "animate-pulse"
                        )}
                        onClick={toggleRecording}
                    >
                        {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>

                    <div className="relative flex-1">
                        <Input
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && sendMessage()}
                            placeholder={isRecording ? "Listening..." : "Type your answer..."}
                            className="h-12 rounded-full px-5 pr-12 shadow-sm border-muted-foreground/20 focus-visible:ring-1"
                        />
                        {/* Status Indicator */}
                        {isSpeaking && (
                            <div className="absolute -top-10 left-0 right-0 mx-auto w-fit text-xs text-primary flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-1">
                                <Volume2 className="h-3 w-3 animate-pulse" />
                                AI Speaking...
                                <button onClick={stopSpeaking} className="hover:underline font-bold ml-1">Stop</button>
                            </div>
                        )}
                    </div>

                    <Button
                        size="icon"
                        className="h-12 w-12 rounded-full shrink-0 shadow-sm"
                        onClick={() => sendMessage()}
                        disabled={!inputText.trim() || isLoading}
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
                <div className="text-center mt-2 text-[10px] text-muted-foreground">
                    <p>Browser permission required for Microphone and Audio.</p>
                </div>
            </footer>
        </div>
    )
}
