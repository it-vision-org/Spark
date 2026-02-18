"use server";

import { db } from "@monkeyprint/db";
import { sendContactFormEmail } from "@monkeyprint/utils/email";
import { getCurrentUser } from "./authActions";

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
  const name = data.name?.trim();
  const email = data.email?.trim();
  const subject = data.subject?.trim();
  const message = data.message?.trim();

  if (!name || !email || !subject || !message) {
    return { success: false, error: "Tous les champs sont obligatoires" };
  }

  try {
    const currentUser = await getCurrentUser();
    const subjectLabel = subjectLabels[subject] || subject || "Contact";

    const submission = await db.contactSubmission.create({
      data: {
        name,
        email,
        subject: subjectLabel,
        message,
        userId: currentUser?.id ?? null,
      },
    });

    await sendContactFormEmail({
      recipient: CONTACT_RECIPIENT,
      name,
      email,
      subject: subjectLabel,
      message,
    });

    return { success: true, id: submission.id };
  } catch (error) {
    console.error("[CONTACT] Error in sendContactEmail:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}
