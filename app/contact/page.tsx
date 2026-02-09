import Header from "@/components/Header";
import Footer from "@/components/Footer";

import Image from "next/image";

export default function Contact() {
    return (
        <main className="min-h-screen flex flex-col relative">
            <div className="fixed inset-0 z-0">
                <Image
                    src="/explore-background.jpg"
                    alt="Background"
                    fill
                    className="object-cover opacity-50"
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
            </div>
            <Header />
            <div className="pt-32 pb-20 px-6 flex-grow relative z-10">
                <div className="container mx-auto max-w-4xl">
                    <div className="grid md:grid-cols-2 gap-16">
                        <div className="space-y-8">
                            <h1 className="text-4xl md:text-5xl font-serif font-bold">Get in Touch</h1>
                            <p className="text-muted-foreground">
                                Interested in working together? Have a question?
                                Fill out the form or reach out directly via email or social media.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-white">Email</h3>
                                    <p className="text-muted-foreground">alphacrewphotographs@gmail.com</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-white">Socials</h3>
                                    <div className="flex gap-4 text-muted-foreground">
                                        <a href="https://www.facebook.com/alpha.crew.photography1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
                                        <a href="https://wa.me/94719445640" className="hover:text-white transition-colors">WhatsApp</a>
                                        <a href="https://www.instagram.com/alphacrew_photography/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">Message</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none"
                                    placeholder="Tell me about your project..."
                                />
                            </div>
                            <button
                                type="button"
                                className="w-full bg-white text-black font-medium py-3 rounded-md hover:bg-neutral-200 transition-colors"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
