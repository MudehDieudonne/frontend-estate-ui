import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FeedLayout } from "@/components/FeedLayout";
import { FaClock } from "react-icons/fa";

export const ComingSoon = ({ title }: { title: string }) => {
    return (
        <FeedLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="p-6 bg-primary/5 rounded-full border border-primary/10 animate-pulse">
                    <FaClock className="h-12 w-12 text-primary/40" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        {title} is Coming Soon!
                    </h1>
                    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        We're currently working hard to bring you the best experience for this feature.
                        Stay tuned for updates!
                    </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                    <Button asChild size="lg">
                        <Link to="/feed">Back to Feed</Link>
                    </Button>
                </div>
            </div>
        </FeedLayout>
    );
};
