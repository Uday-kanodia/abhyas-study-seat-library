export const LIBRARY_WHATSAPP = "919974912122";

export type InquiryDetails = {
  name: string;
  phone: string;
  email: string;
  timing: string;
  message?: string | null;
};

export const buildInquiryWhatsAppLink = (inquiry: InquiryDetails) => {
  const lines = [
    "New Admission Inquiry — Abhyas Reading Library",
    `Name: ${inquiry.name}`,
    `Phone: ${inquiry.phone}`,
    `Email: ${inquiry.email}`,
    `Preferred timing: ${inquiry.timing}`,
    inquiry.message ? `Message: ${inquiry.message}` : null,
  ].filter(Boolean);

  return `https://wa.me/${LIBRARY_WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
};

export const buildApplicantWhatsAppLink = (phone: string, name: string) => {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.length === 10 ? `91${digits}` : digits;
  const text = `Hello ${name}, thank you for your admission inquiry at Abhyas Reading Library. How can we help you?`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
};
