"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { FileText, BookOpen, Shield, Cloud } from "lucide-react";

const HeroSection = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-accent">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">


                <h1 className="text-4xl lg:text-6xl font-bold">
                  <span className="bg-primary bg-clip-text text-transparent">
                    Organize
                  </span>{" "}
                  <span className="text-foreground">your recipes</span>
                  <br />
                  <span className="text-foreground">and documents</span>
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed">
                  Store, organize, and access all your favorite recipes and important documents in one beautiful, secure place. Never lose another recipe again.
                </p>
              </div>


              {/* CTA Buttons */}
              <div className="flex flex-row gap-4">
                <Button
                  onClick={() => router.push("/login")}
                  className="bg-primary hover:opacity-90 transition-opacity text-lg px-8 py-6 h-auto"
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/login")}
                  className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-card/80 text-lg px-8 py-6 h-auto"
                >
                  Sign In
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-medium">
                <img
                  src="/hero-documents.jpg"
                  alt="Organized recipe documents and cooking workspace"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-card/95 backdrop-blur-sm p-4 rounded-xl shadow-soft animate-fade-in">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-sm font-medium">Recipe Collection</span>
                </div>
              </div>

              <div
                className="absolute -bottom-4 -left-4 bg-card/95 backdrop-blur-sm p-4 rounded-xl shadow-soft animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <span className="text-sm font-medium">Smart Categories</span>
                </div>
              </div>
            </div>
            {/* End Image */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
