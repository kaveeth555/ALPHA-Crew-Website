"use client";

import { MessageCircle } from "lucide-react";
import React from "react";

export default function WhatsAppButton() {
    // Replace with actual phone number in format: 1234567890
    const phoneNumber = "94719445640";
    const message = "Hello! I would like to inquire about your photography services.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 hover:bg-[#20bd5a] transition-all duration-300 animate-in fade-in slide-in-from-bottom-10 group"
            aria-label="Contact us on WhatsApp"
        >
            <MessageCircle className="w-8 h-8 fill-current" />
            <span className="absolute right-full mr-4 bg-white text-black px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md">
                Chat with us
            </span>
            {/* Pulse effect */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-0"></span>
        </a>
    );
}
