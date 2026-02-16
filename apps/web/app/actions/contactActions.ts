"use server";

import { sendContactFormEmail } from "@monkeyprint/utils/email";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const CONTACT_RECIPIENT =
  process.env.CONTACT_RECIPIENT || "ahmedzouaghi2003@gmail.com";

const subjectLabels: Record<string, string> = {
  general: "Question générale",
  student_support: "Soutien étudiant",
  parent_question: "Question parent",
  teacher_collaboration: "Collaboration enseignant",
  partnership: "Partenariat / sponsor",
  event: "Événement ou atelier",
  technical: "Problème technique",
  other: "Autre",
};

export async function sendContactEmail(data: ContactFormData) {
  const { name, email, subject, message } = data;

  if (!name || !email || !subject || !message) {
    return { success: false, error: "Tous les champs sont obligatoires" };
  }

  try {
    const subjectLabel = subjectLabels[subject] || subject;
    await sendContactFormEmail({
      recipient: CONTACT_RECIPIENT,
      name,
      email,
      subject: subjectLabel,
      message,
    });

    return { success: true };
  } catch (error) {
    console.error("[CONTACT] Error in sendContactEmail:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}