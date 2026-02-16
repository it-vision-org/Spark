"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  HeartHandshake,
  Loader2,
  MapPin,
  MessageSquare,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { sendContactEmail } from "@/actions/contactActions";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const contactInfo = [
  {
    icon: MapPin,
    title: "Point de ralliement",
    details: ["Wake Up & Spark", "Lycée Habib Thameur, Tunisie"],
  },
  {
    icon: MessageSquare,
    title: "Email principal",
    details: ["contact@wakeupandspark.com", "Réponse sous 48h"],
  },
  {
    icon: Clock,
    title: "Délai de réponse",
    details: ["48h max pour les demandes générales", "24h pour les situations sensibles"],
  },
  {
    icon: ShieldCheck,
    title: "Confidentialité",
    details: ["Les messages sensibles restent privés", "Espace sûr pour élèves, parents, enseignants"],
  },
];

const channels = [
  {
    title: "Écoute et soutien",
    description: "Partage anonyme ou accompagné pour gérer les émotions et les situations difficiles.",
    tags: ["Bienveillance", "Anonymat possible", "Réponses humaines"],
  },
  {
    title: "Parents & enseignants",
    description: "Questions sur l’accompagnement, la vie du club ou les besoins d’une classe.",
    tags: ["Parents", "Enseignants", "Orientation"],
  },
  {
    title: "Partenariats & ateliers",
    description: "Envie d’apporter un atelier, un témoignage ou un soutien matériel au club.",
    tags: ["Entreprises", "Associations", "Invités"],
  },
  {
    title: "Technique & accès",
    description: "Problèmes de connexion, de publication ou de notification sur la plateforme.",
    tags: ["Support", "Accès", "Compte"],
  },
];

const pledges = [
  "Réponse en 48h (24h si sensible)",
  "Confidentialité et respect",
  "Guides et ressources émotionnelles",
];

const faqItems = [
  {
    question: "Puis-je écrire anonymement ?",
    answer:
      "Oui. Mentionnez-le dans votre message ; nous traiterons votre demande sans révéler votre identité aux autres membres.",
  },
  {
    question: "Qui lit les messages sensibles ?",
    answer:
      "Seule l’équipe encadrante Wake Up & Spark, engagée sur la confidentialité et la bienveillance.",
  },
  {
    question: "Comment proposer un atelier ou un partenariat ?",
    answer:
      "Choisissez “Partenariat / sponsor” ou “Événement / atelier” dans le sujet, décrivez votre idée et vos disponibilités.",
  },
];

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const result = await sendContactEmail(formData);
      if (result.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Une erreur est survenue");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#2563eb] text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#38bdf8,transparent_30%),radial-gradient(circle_at_80%_10%,#3b82f6,transparent_30%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur">
                <Sparkles className="w-4 h-4 text-[#bae6fd]" />
                <span className="text-sm font-medium">Wake Up & Spark · Espace sûr</span>
              </div>
              <h1 className="mt-5 text-4xl md:text-5xl font-bold leading-tight">
                Parlons de ce qui compte <span className="text-[#fbbf24]">pour vous</span>
              </h1>
              <p className="mt-4 text-lg text-slate-200 max-w-2xl">
                Élèves, parents et enseignants : partagez vos questions, vos besoins ou vos idées. Notre équipe répond avec bienveillance et confidentialité pour soutenir l’intelligence émotionnelle de chacun.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
                <span className="px-3 py-2 rounded-full bg-white/10 border border-white/15">Réponse sous 48h</span>
                <span className="px-3 py-2 rounded-full bg-white/10 border border-white/15">Anonymat possible</span>
                <span className="px-3 py-2 rounded-full bg-white/10 border border-white/15">Communauté bienveillante</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-lg shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <HeartHandshake className="w-10 h-10 text-[#bae6fd]" />
                <div>
                  <p className="text-sm text-slate-200">Nous sommes là pour vous</p>
                  <p className="text-lg font-semibold text-white">Une équipe à l’écoute</p>
                </div>
              </div>
              <div className="grid gap-4">
                {contactInfo.map((item, idx) => (
                  <div key={idx} className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <item.icon className="w-5 h-5 text-[#bae6fd] mt-1" />
                    <div>
                      <p className="text-sm text-slate-200">{item.title}</p>
                      {item.details.map((d, i) => (
                        <p key={i} className="text-white font-medium">
                          {d}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-b border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {channels.map((channel) => (
              <motion.div
                key={channel.title}
                variants={fadeInUp}
                className="p-6 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-semibold text-[#0f172a]">{channel.title}</h3>
                <p className="mt-2 text-sm text-[#475569]">{channel.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {channel.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 text-xs font-semibold rounded-full bg-[#e0f2fe] text-[#0ea5e9]">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="p-8 rounded-3xl bg-white border border-[#e2e8f0] shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-[#2563eb]" />
                  <p className="text-sm font-semibold text-[#0f172a]">Formulaire de contact</p>
                </div>
                <h2 className="text-2xl font-bold text-[#0f172a]">Écrivons ensemble</h2>
                <p className="text-[#475569] mb-6">
                  Dites-nous comment nous pouvons vous aider. Précisez si votre message doit rester confidentiel.
                </p>

                {status === "success" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <p className="text-sm text-green-800">Votre message a bien été envoyé. Nous revenons vers vous très vite.</p>
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <p className="text-sm text-red-800">{errorMessage}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-[#0f172a] mb-2" htmlFor="name">
                        Nom complet *
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none transition"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#0f172a] mb-2" htmlFor="email">
                        Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none transition"
                        placeholder="vous@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#0f172a] mb-2" htmlFor="subject">
                      Sujet *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-[#0f172a] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none transition"
                    >
                      <option value="">Choisissez le motif</option>
                      <option value="general">Question générale</option>
                      <option value="student_support">Soutien étudiant</option>
                      <option value="parent_question">Question parent</option>
                      <option value="teacher_collaboration">Collaboration enseignant</option>
                      <option value="partnership">Partenariat / sponsor</option>
                      <option value="event">Événement / atelier</option>
                      <option value="technical">Problème technique</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#0f172a] mb-2" htmlFor="message">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none transition resize-none"
                      placeholder="Expliquez votre besoin. Précisez si vous souhaitez rester anonyme."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] px-6 py-3 text-white font-semibold shadow-lg shadow-[#2563eb]/25 transition hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#0f172a] text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#38bdf8]" />
                  <p className="text-sm font-semibold">Nos engagements</p>
                </div>
                <ul className="mt-4 space-y-3 text-sm text-slate-200">
                  {pledges.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#38bdf8]" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-3xl border border-[#e2e8f0] bg-white">
                <p className="text-sm font-semibold text-[#0f172a] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2563eb]" />
                  Pourquoi nous écrire ?
                </p>
                <p className="mt-3 text-sm text-[#475569]">
                  Pour une idée de post, une situation émotionnelle, un besoin d’accompagnement ou une question sur les activités du club.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e0f2fe] text-[#0ea5e9] text-sm font-semibold">
              FAQ
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#0f172a]">Questions fréquentes</h2>
            <p className="mt-2 text-[#475569]">
              Les réponses rapides pour continuer à grandir ensemble.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {faqItems.map((item) => (
              <motion.div
                key={item.question}
                variants={fadeInUp}
                className="p-5 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc]"
              >
                <h3 className="text-lg font-semibold text-[#0f172a]">{item.question}</h3>
                <p className="mt-2 text-sm text-[#475569]">{item.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}