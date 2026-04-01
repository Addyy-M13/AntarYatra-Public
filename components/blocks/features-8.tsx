import { Card, CardContent } from '@/components/ui/card'
import { Frown, Smile, Moon, Sun, UserX, Users, HelpCircle, Compass, TrendingUp, Zap, Heart } from 'lucide-react'

export function Features() {
    return (
        <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
            <div className="mx-auto max-w-3xl lg:max-w-5xl px-6">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
                        Your{" "}
                        <span className="text-primary">Transformation</span>{" "}
                        Journey
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        See how AntarYatra helps you move from struggle to strength
                    </p>
                </div>

                <div className="relative">
                    <div className="relative z-10 grid grid-cols-6 gap-3">
                        {/* Card 1 - 87% Less Anxiety */}
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-2 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/30">
                            <CardContent className="relative m-auto size-fit pt-6">
                                <div className="relative flex h-24 w-56 items-center">
                                    <div className="text-muted absolute inset-0 size-full flex items-center justify-center">
                                        <Zap className="size-20 opacity-10" />
                                    </div>
                                    <span className="mx-auto block w-fit text-5xl font-semibold text-red-600 dark:text-red-400">87%</span>
                                </div>
                                <h2 className="mt-6 text-center text-2xl font-semibold text-red-700 dark:text-red-300">Reduced Anxiety</h2>
                                <p className="mt-2 text-center text-sm text-muted-foreground">anxiety levels reported by users</p>
                            </CardContent>
                        </Card>

                        {/* Card 2 - Before */}
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 border-red-200 dark:border-red-900/30">
                            <CardContent className="pt-6">
                                <div className="relative mx-auto flex aspect-square size-14 rounded-full border border-red-300 bg-red-50 items-center justify-center before:absolute before:-inset-2 before:rounded-full before:border before:border-red-100 dark:bg-red-950/20 dark:border-red-900/40">
                                    <Frown className="size-6 text-red-600 dark:text-red-400" strokeWidth={1.5} />
                                </div>
                                <div className="relative z-10 mt-6 space-y-4 text-center">
                                    <h2 className="text-xl font-semibold text-red-700 dark:text-red-300">Before</h2>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-center justify-center gap-2">
                                            <Frown className="size-3.5 shrink-0 text-red-500 dark:text-red-400" strokeWidth={1.5} />
                                            Constant anxiety
                                        </li>
                                        <li className="flex items-center justify-center gap-2">
                                            <Moon className="size-3.5 shrink-0 text-red-500 dark:text-red-400" strokeWidth={1.5} />
                                            Sleepless nights
                                        </li>
                                        <li className="flex items-center justify-center gap-2">
                                            <UserX className="size-3.5 shrink-0 text-red-500 dark:text-red-400" strokeWidth={1.5} />
                                            Feeling isolated
                                        </li>
                                        <li className="flex items-center justify-center gap-2">
                                            <HelpCircle className="size-3.5 shrink-0 text-red-500 dark:text-red-400" strokeWidth={1.5} />
                                            No clear direction
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 3 - After */}
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 border-primary/30 dark:border-primary/20">
                            <CardContent className="pt-6">
                                <div className="relative mx-auto flex aspect-square size-14 rounded-full border border-primary/40 bg-primary/10 items-center justify-center before:absolute before:-inset-2 before:rounded-full before:border before:border-primary/10">
                                    <Smile className="size-6 text-primary" strokeWidth={1.5} />
                                </div>
                                <div className="relative z-10 mt-6 space-y-4 text-center">
                                    <h2 className="text-xl font-semibold text-primary">After</h2>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-center justify-center gap-2">
                                            <Heart className="size-3.5 shrink-0 text-primary/70" strokeWidth={1.5} />
                                            Inner peace
                                        </li>
                                        <li className="flex items-center justify-center gap-2">
                                            <Sun className="size-3.5 shrink-0 text-primary/70" strokeWidth={1.5} />
                                            Restful sleep
                                        </li>
                                        <li className="flex items-center justify-center gap-2">
                                            <Users className="size-3.5 shrink-0 text-primary/70" strokeWidth={1.5} />
                                            Supportive community
                                        </li>
                                        <li className="flex items-center justify-center gap-2">
                                            <Compass className="size-3.5 shrink-0 text-primary/70" strokeWidth={1.5} />
                                            Clear mental clarity
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 4 - 92% Improved Mood */}
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-2 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30">
                            <CardContent className="relative m-auto size-fit pt-6">
                                <div className="relative flex h-24 w-56 items-center">
                                    <div className="text-muted absolute inset-0 size-full flex items-center justify-center">
                                        <Zap className="size-20 opacity-10" />
                                    </div>
                                    <span className="mx-auto block w-fit text-5xl font-semibold text-amber-600 dark:text-amber-400">92%</span>
                                </div>
                                <h2 className="mt-6 text-center text-2xl font-semibold text-amber-700 dark:text-amber-300">Better Mood</h2>
                                <p className="mt-2 text-center text-sm text-muted-foreground">improved mood consistency</p>
                            </CardContent>
                        </Card>

                        {/* Card 5 - 95% Confidence */}
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-2 bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/30">
                            <CardContent className="relative m-auto size-fit pt-6">
                                <div className="relative flex h-24 w-56 items-center">
                                    <div className="text-muted absolute inset-0 size-full flex items-center justify-center">
                                        <TrendingUp className="size-20 opacity-10" />
                                    </div>
                                    <span className="mx-auto block w-fit text-5xl font-semibold text-green-600 dark:text-green-400">95%</span>
                                </div>
                                <h2 className="mt-6 text-center text-2xl font-semibold text-green-700 dark:text-green-300">More Confident</h2>
                                <p className="mt-2 text-center text-sm text-muted-foreground">feel more confident journey</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
