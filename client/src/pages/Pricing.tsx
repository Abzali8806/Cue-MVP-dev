import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start building powerful workflows with our AI-powered platform. 
            Choose the plan that fits your needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="relative border-2 border-primary shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Currently Available
              </span>
            </div>
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl font-bold">Free</CardTitle>
              <p className="text-muted-foreground">Perfect for getting started</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-muted-foreground">
                    Full suite of features included
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Experience all of Cue's powerful workflow automation capabilities 
                  at no cost while we develop our premium offerings.
                </p>
              </div>
              <Link href="/login?mode=signup">
                <Button className="w-full" size="lg">
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Standard Plan */}
          <Card className="relative border border-border shadow-md opacity-75">
            <div className="absolute inset-0 bg-muted/20 rounded-lg"></div>
            <CardHeader className="text-center relative z-10">
              <CardTitle className="text-2xl font-bold text-muted-foreground">Standard</CardTitle>
              <p className="text-muted-foreground">Enhanced capabilities</p>
            </CardHeader>
            <CardContent className="text-center relative z-10">
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Coming Soon
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This tier isn't currently available. All features are 
                  provided in the Free plan while we develop our premium offerings.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border border-border shadow-md opacity-75">
            <div className="absolute inset-0 bg-muted/20 rounded-lg"></div>
            <CardHeader className="text-center relative z-10">
              <CardTitle className="text-2xl font-bold text-muted-foreground">Premium</CardTitle>
              <p className="text-muted-foreground">Advanced enterprise features</p>
            </CardHeader>
            <CardContent className="text-center relative z-10">
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Coming Soon
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This tier isn't currently available. All features are 
                  provided in the Free plan while we develop our premium offerings.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <div className="bg-muted/50 rounded-lg p-6 max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold mb-2">Why Start with Free?</h3>
            <p className="text-muted-foreground">
              We're committed to providing an exceptional experience. While we develop our 
              premium tiers, enjoy unlimited access to all of Cue's powerful workflow 
              automation features. No restrictions, no time limits—just pure innovation 
              at your fingertips.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}