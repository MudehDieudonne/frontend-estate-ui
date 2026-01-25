import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";

export const Newsletter = () => {
  const navigate = useNavigate();
  const { openChatWith } = useChat();
  const { user } = useAuth();

  const handleSubscribe = () => {
    navigate("/register");
  };

  const handleInvest = () => {
    if (!user) {
      navigate("/register");
      return;
    }
    // Mukum Winston's ID placeholder - in a real app this would be a constant or fetched
    openChatWith("mukum-id-placeholder");
  };

  return (
    <section id="contact">
      <hr className="w-11/12 mx-auto" />

      <div className="container py-24 sm:py-32">
        <h3 className="text-center text-4xl md:text-5xl font-bold">
          Stay Connected with{" "}
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            IRED
          </span>
        </h3>
        <p className="text-xl text-muted-foreground text-center mt-4 mb-8">
          Subscribe for exclusive luxury listings, market insights, and real
          estate opportunities delivered directly to your inbox.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <Button onClick={handleSubscribe} className="w-full md:w-auto px-10 py-6 text-lg font-bold">
            Subscribe Now
          </Button>
          <Button onClick={handleInvest} variant="outline" className="w-full md:w-auto px-10 py-6 text-lg font-bold border-primary text-primary">
            Invest with IRED
          </Button>
        </div>
      </div>

      <hr className="w-11/12 mx-auto" />
    </section>
  );
};
