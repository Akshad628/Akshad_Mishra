import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Send, Calendar, Mail, Phone, User, Globe } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const empty = { name: "", email: "", phone: "", subject: "", body: "", website: "" };

export default function Reach() {
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
      toast.success("Message sent — we will be in touch soon.");
      setForm(empty);
    } catch (err) {
      const msg = err?.response?.data?.detail || "Could not send. Try again.";
      toast.error(typeof msg === "string" ? msg : "Could not send. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="reach"
      data-testid="reach-section"
      className="relative py-32 sm:py-44"
    >
      <div className="mx-auto w-[min(1240px,94%)] grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <p className="overline mb-4">reach out · 03</p>
          <h2 className="font-display text-5xl sm:text-6xl tracking-tighter text-neutral-900">
            Let's build a world
          </h2>
          <p className="mt-5 text-neutral-600 text-base sm:text-lg max-w-md">
            Guidance, collaboration or a quiet query — drop us a line. We
            answer in two business days.
          </p>

          <motion.a
            href="https://calendar.app.google/"
            target="_blank"
            rel="noreferrer"
            data-testid="reach-book-call"
            whileHover={{ y: -3 }}
            className="mt-8 wr-glass rounded-2xl p-5 flex items-center gap-4 group"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(180deg, #fff 0%, #e9e9e9 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.06)",
              }}
            >
              <Calendar size={20} />
            </div>
            <div className="flex-1">
              <div className="font-display text-lg leading-tight">Book a 30-min call</div>
              <div className="text-xs text-neutral-500 mt-0.5">
                Google Calendar · pick a slot that works for you
              </div>
            </div>
            <span className="font-mono text-xs underline underline-offset-4">
              Open ↗
            </span>
          </motion.a>

          <div className="mt-10 space-y-2 text-sm text-neutral-600">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-500">
              direct
            </p>
            <p>hello@wandelreality.studio</p>
            <p>+91 · on request</p>
          </div>
        </div>

        <form
          onSubmit={submit}
          data-testid="reach-form"
          className="md:col-span-7 wr-glass rounded-3xl p-6 sm:p-10"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              icon={User}
              label="Name"
              testid="reach-name"
              value={form.name}
              onChange={update("name")}
              required
            />
            <Field
              icon={Mail}
              label="Email"
              type="email"
              testid="reach-email"
              value={form.email}
              onChange={update("email")}
              required
            />
            <Field
              icon={Phone}
              label="Phone"
              testid="reach-phone"
              value={form.phone}
              onChange={update("phone")}
            />
            <Field
              icon={Globe}
              label="Website"
              testid="reach-website"
              value={form.website}
              onChange={update("website")}
              placeholder="https://"
            />
          </div>

          <div className="mt-4">
            <Field
              label="Subject"
              testid="reach-subject"
              value={form.subject}
              onChange={update("subject")}
              required
            />
          </div>

          <div className="mt-4">
            <label className="overline">Body</label>
            <textarea
              data-testid="reach-body"
              className="wr-skeu-input mt-2 min-h-[140px] resize-y"
              value={form.body}
              onChange={update("body")}
              placeholder="Tell us what you're building, dreaming or stuck on…"
              required
            />
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-xs text-neutral-500">
              By submitting you agree to our friendly use of your information.
            </p>
            <button
              type="submit"
              data-testid="reach-submit"
              disabled={loading}
              className="wr-skeu-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending
                </>
              ) : (
                <>
                  Send message <Send size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ icon: Icon, label, testid, ...props }) {
  return (
    <div>
      <label className="overline">{label}</label>
      <div className="relative mt-2">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
          />
        )}
        <input
          data-testid={testid}
          className={`wr-skeu-input ${Icon ? "pl-9" : ""}`}
          {...props}
        />
      </div>
    </div>
  );
}
