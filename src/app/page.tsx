"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Header        from "@/components/Header";
import Footer        from "@/components/Footer";
import LoginPanel    from "@/components/LoginPanel";
import { HR }        from "@/components/ui";

import HeroSection     from "@/app/(landing)/sections/HeroSection";
import StatsSection    from "@/app/(landing)/sections/StatsSection";
import AboutSection    from "@/app/(landing)/sections/AboutSection";
import PlatformSection from "@/app/(landing)/sections/PlatformSection";
import SocialSection   from "@/app/(landing)/sections/SocialSection";
import FAQSection      from "@/app/(landing)/sections/FAQSection";
import SupportSection  from "@/app/(landing)/sections/SupportSection";

export default function Page() {
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("admin_token")) {
      router.replace("/photos");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header/>
      <HeroSection onOpenLogin={() => setLoginOpen(true)}/>
      <StatsSection/>
      <HR/>
      <AboutSection/>
      <HR/>
      <PlatformSection/>
      <HR/>
      <SocialSection/>
      <HR/>
      <FAQSection/>
      <HR/>
      <SupportSection/>
      <Footer/>
      {loginOpen && <LoginPanel onClose={() => setLoginOpen(false)}/>}
    </div>
  );
}
