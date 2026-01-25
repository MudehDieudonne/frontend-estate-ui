import { FeedLayout } from "@/components/FeedLayout";
import { FAQ } from "@/components/FAQ";

export const FAQPage = () => {
    return (
        <FeedLayout>
            <div className="max-w-4xl mx-auto">
                <FAQ />
            </div>
        </FeedLayout>
    );
};
