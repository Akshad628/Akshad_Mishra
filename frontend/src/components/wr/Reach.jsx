import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Send, Mail, Phone, User, Globe, Github, Linkedin, Trophy, MapPin, FileDown } from "lucide-react";
import { useAchievement } from "./Achievements";
import CollectibleSpot from "./CollectibleSpot";
import { useRef } from "react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const EMAIL = process.env.REACT_APP_CONTACT_EMAIL || "akshadmishra628@gmail.com";
const PHONE = process.env.REACT_APP_CONTACT_PHONE || "+91 74164 47332";
const GH = process.env.REACT_APP_SOCIAL_GITHUB || "https://github.com/Akshad628";
const LN = process.env.REACT_APP_SOCIAL_LINKEDIN || "https://www.linkedin.com/in/akshadmishra";
const LC = "https://leetcode.com/akshad_mishra/";
const RESUME = process.env.REACT_APP_RESUME_URL || (process.env.PUBLIC_URL + "/assets/resume.pdf");

const empty = { name: "", email: "", phone: "", subject: "", body: "", website: "" };

export default function Reach() {
  const ref = useRef(null);
  useAchievement(ref, "reach", { title: "Endgame · Contact", icon: Trophy });
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.body) {
      toast.error("Please fill name, email, subject and body.");
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.phone) delete payload.phone;
      if (!payload.website) delete payload.website;
      await axios.post(`${API}/reach-out`, payload);
      toast.success("Message sent — I will get back to you within 2 business days.");
      setForm(empty);
    } catch (err) {
      const msg = err?.response?.data?.detail || "Could not send. Try again.";
      toast.error(typeof msg === "string" ? msg : "Could not send. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reach" ref={ref} data-testid="reach-section" className="relative py-32 sm:py-44">
      <CollectibleSpot id="c-reach" top="10%" left="6%" />
      <div className="mx-auto w-[min(1240px,94%)] grid md:grid-cols-12 gap-10">
        {/* Left: identity + quick actions */}
        <div className="md:col-span-5">
          <p className="overline mb-4">reach · endgame</p>
          <h2 className="font-display text-5xl sm:text-6xl tracking-tighter">
            {"say hi"} <span className="italic font-light">— i reply</span>
          </h2>
          <p className="mt-5 text-neutral-600 text-base sm:text-lg max-w-md">
            Collaboration, questions, or a quiet {"\u201C"}hey, cool site{"\u201D"} — all welcome.
            I read every message.
          </p>

          {/* Quick action grid */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <QuickAction icon={Mail} label="Email" value={EMAIL} href={`mailto:${EMAIL}`} testid="quick-email" />
            <QuickAction icon={Github} label="GitHub" value="@Akshad628" href={GH} testid="quick-github" external />
            <QuickAction icon={Linkedin} label="LinkedIn" value="in/akshadmishra" href={LN} testid="quick-linkedin" external />
            <QuickAction icon={Trophy} label="LeetCode" value="@akshad_mishra" href={LC} testid="quick-leetcode" external />
            <QuickAction icon={FileDown} label="Resume" value="download .docx" href={RESUME} testid="quick-resume" external />
            <QuickAction icon={Phone} label="Phone" value={PHONE} href={`tel:${PHONE.replace(/\s/g, "")}`} testid="quick-phone" />
          </div>

          <div className="mt-8 text-sm text-neutral-600 flex items-center gap-2">
            <MapPin size={14} /> Hyderabad, Telangana · IST
          </div>
        </div>

        {/* Right: form */}
        <form onSubmit={submit} noValidate data-testid="reach-form"
          className="md:col-span-7 wr-glass rounded-3xl p-6 sm:p-10">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field icon={User} label="Name" testid="reach-name" value={form.name} onChange={update("name")} />
            <Field icon={Mail} label="Email" type="email" testid="reach-email" value={form.email} onChange={update("email")} />
            <Field icon={Phone} label="Phone" testid="reach-phone" value={form.phone} onChange={update("phone")} />
            <Field icon={Globe} label="Website" testid="reach-website" value={form.website} onChange={update("website")} placeholder="https://" />
          </div>
          <div className="mt-4">
            <Field label="Subject" testid="reach-subject" value={form.subject} onChange={update("subject")} />
          </div>
          <div className="mt-4">
            <label className="overline">Body</label>
            <textarea data-testid="reach-body" className="wr-skeu-input mt-2 min-h-[140px] resize-y"
              value={form.body} onChange={update("body")}
              placeholder="What are you building or dreaming about?" />
          </div>
          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-xs text-neutral-500 flex items-center gap-2">
              <kbd className="wr-glass rounded px-1.5 py-0.5">⌘</kbd>+<kbd className="wr-glass rounded px-1.5 py-0.5">K</kbd>
              for quick actions
            </p>
            <button type="submit" data-testid="reach-submit" disabled={loading} className="wr-skeu-btn">
              {loading ? (<><Loader2 size={16} className="animate-spin" /> Sending</>) : (<>Send message <Send size={16} /></>)}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function QuickAction({ icon: Icon, label, value, href, testid, external }) {
  return (
    <motion.a href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      data-testid={testid}
      whileHover={{ y: -3 }}
      className="wr-glass rounded-2xl p-3 flex items-center gap-3 group">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: "linear-gradient(180deg, #fff 0%, #e9e9e9 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.06)",
        }}>
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">{label}</p>
        <p className="text-sm text-neutral-900 truncate">{value}</p>
      </div>
    </motion.a>
  );
}

function Field({ icon: Icon, label, testid, value, ...props }) {
  const [focused, setFocused] = useState(false);
  const hide = focused || (typeof value === "string" && value.length > 0);
  return (
    <div>
      <label className="overline">{label}</label>
      <div className="relative mt-2">
        {Icon && (
          <Icon size={16}
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none transition-all duration-300 ${
              hide ? "opacity-0 -translate-x-2" : "opacity-100"
            }`} />
        )}
        <input data-testid={testid}
          className={`wr-skeu-input transition-[padding] duration-300 ${Icon ? (hide ? "pl-3.5" : "pl-9") : ""}`}
          value={value} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} {...props} />
      </div>
    </div>
  );
}
