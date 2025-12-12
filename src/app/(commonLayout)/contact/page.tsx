/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  Loader2, 
  MessageSquare,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";


export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulated API Request
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Success simulation
      toast.success("Message sent successfully!", {
        description: "We'll get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-background relative overflow-hidden">

      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-20">
        
        {/* Left Column: Contact Information */}
        <div className="space-y-8 lg:sticky lg:top-24">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
              Get in touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Have a question about a travel plan? Need help with your booking? We are here to help you.
            </p>
          </div>

          <div className="grid gap-6">
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email Us</h3>
                  <p className="text-sm text-muted-foreground mb-1">Our friendly team is here to help.</p>
                  <a href="mailto:support@travelapp.com" className="text-sm font-medium hover:underline hover:text-primary transition-colors">
                    support@travelapp.com
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Visit Us</h3>
                  <p className="text-sm text-muted-foreground mb-1">Come say hello at our office.</p>
                  <p className="text-sm font-medium">
                    123 Adventure Lane, Dhaka<br />
                    Bangladesh, 1200
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Call Us</h3>
                  <p className="text-sm text-muted-foreground mb-1">Mon-Fri from 8am to 5pm.</p>
                  <a href="tel:+8801234567890" className="text-sm font-medium hover:underline hover:text-primary transition-colors">
                    +880 1234 567 890
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 pt-4">
            <Button variant="outline" size="icon" className="rounded-full hover:text-primary hover:border-primary transition-colors hover:text-accent-foreground">
              <Github className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full hover:text-primary hover:border-primary transition-colors hover:text-accent-foreground">
              <Twitter className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full hover:text-primary hover:border-primary transition-colors hover:text-accent-foreground">
              <Linkedin className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <Card className="shadow-2xl border-muted/40 overflow-hidden relative">
          {/* Subtle gradient border effect on top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Send us a message
            </CardTitle>
            <CardDescription>
              Fill out the form below and we will get back to you shortly.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="John Doe" 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  name="subject" 
                  placeholder="How can we help?" 
                  required 
                  value={formData.subject}
                  onChange={handleChange}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  placeholder="Tell us more about your inquiry..." 
                  className="min-h-[150px] bg-background/50 resize-y" 
                  required 
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}