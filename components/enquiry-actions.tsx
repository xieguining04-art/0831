import { Mail, MessageCircle, ArrowRight } from "lucide-react";
import { enquiryLinks } from "@/lib/company";
import type { Language } from "@/lib/localization";

export function EnquiryActions({ language, topic }: { language: Language; topic?: string }) {
  const zh = language === "zh-CN";
  const links = enquiryLinks(topic);
  return <div className="enquiry-actions"><a className="button accent" href={links.whatsapp} target="_blank" rel="noreferrer"><MessageCircle />{zh ? "WhatsApp 联系 Vinson" : "WhatsApp Vinson"}<ArrowRight /></a><a className="button outline-light" href={links.email}><Mail />{zh ? "通过邮件询价" : "Enquire by email"}</a><small>{zh ? "在您的应用中填写并发送，不会自动提交。" : "Complete and send in your own app. Nothing is sent automatically."}</small></div>;
}
