import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

function Hero() {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["ATS-Friendly", "Professional", "Optimized", "Impactful", "Smart"],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (titleNumber === titles.length - 1) {
                setTitleNumber(0);
            } else {
                setTitleNumber(titleNumber + 1);
            }
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    return (
        <div className="w-full">
            <div className="container mx-auto">
                <div className="flex gap-8 py-10 lg:py-14 items-center justify-center flex-col">
                    <div>
                        <Button variant="secondary" size="sm" className="gap-4">
                            New: AI Mock Interviews <MoveRight className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex gap-4 flex-col">
                        <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
                            <span className="text-foreground">Build a resume that is</span>
                            <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                                &nbsp;
                                {titles.map((title, index) => (
                                    <motion.span
                                        key={index}
                                        className="absolute font-semibold text-primary"
                                        initial={{ opacity: 0, y: "-100" }}
                                        transition={{ type: "spring", stiffness: 50 }}
                                        animate={
                                            titleNumber === index
                                                ? {
                                                    y: 0,
                                                    opacity: 1,
                                                }
                                                : {
                                                    y: titleNumber > index ? -150 : 150,
                                                    opacity: 0,
                                                }
                                        }
                                    >
                                        {title}
                                    </motion.span>
                                ))}
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
                            Stop struggling with generic templates. Our AI-powered platform helps
                            you craft the perfect resume, analyze it for ATS compatibility, and
                            prepare for your next interview.
                        </p>
                    </div>
                    <div className="flex flex-row gap-3">
                        <a href="/templates">
                            <Button size="lg" className="gap-4" variant="outline">
                                View Templates <Palette className="w-4 h-4" />
                            </Button>
                        </a>
                        <a href="/upload">
                            <Button size="lg" className="gap-4">
                                Get Started <MoveRight className="w-4 h-4" />
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Hero };
