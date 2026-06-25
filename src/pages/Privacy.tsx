import type { ReactNode } from "react";

const sections: {
  title: string;
  content: ReactNode;
}[] = [
  {
    title: "في حالة عدم استكمال المزاد",
    content: (
      <>
        إذا لم يكتمل المزاد لأي سبب، يتم استرجاع المبلغ بالكامل خلال{" "}
        <strong>48 ساعة عمل</strong> من تاريخ الإلغاء، بنفس وسيلة الدفع التي تم
        استخدامها.
      </>
    ),
  },
  {
    title: "في حالة عدم ربحك بالمزاد",
    content: (
      <>
        يتم استرجاع المبلغ بالكامل خلال <strong>48 ساعة عمل</strong> من تاريخ
        الإلغاء، بنفس وسيلة الدفع التي تم استخدامها.
      </>
    ),
  },
  {
    title: "في حالة ربح المزاد",
    content: (
      <>
        في حال ربحك المزاد ولم يتم إتمام عملية الشراء أو التسليم لأي سبب مشروع،
        يتم استرجاع المبلغ خلال <strong>7 أيام عمل</strong> من تاريخ الإلغاء،
        بعد مراجعة البيانات والتأكد من صحة العملية.
      </>
    ),
  },
  {
    title: "طريقة الاسترجاع",
    content: (
      <>
        <p>
          تتم عملية الاسترجاع إلى نفس الحساب البنكي أو المحفظة الإلكترونية أو
          البطاقة المستخدمة في الدفع.
        </p>
        <p className="mt-2 type-small text-[#6B7280]">
          قد تستغرق العملية وقتًا إضافيًا حسب سياسة البنك أو شركة الدفع
          الإلكتروني.
        </p>
      </>
    ),
  },
  {
    title: "الشفافية وحماية الحقوق",
    content: (
      <>
        <p>
          نلتزم بإبلاغ المستخدم بأي تحديث في حالة الطلب أو عملية الاسترجاع عبر
          البريد الإلكتروني أو إشعار داخل التطبيق.
        </p>
        <p className="mt-2">
          جميع العمليات المالية محمية ومشفرة لضمان أقصى درجات الأمان.
        </p>
      </>
    ),
  },
];

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#F4F7F5] pb-12">
      <div className="container py-8 sm:py-10">
        <header className="text-center mb-8 sm:mb-10">
          <span className="inline-block type-caption font-semibold text-[#285240] bg-[#E8F5EE] px-3 py-1 rounded-full mb-4">
            سياسة واضحة ومباشرة
          </span>
          <h1 className="type-heading text-[#1a3329] mb-3">سياسة الاسترجاع</h1>
          <p className="type-body text-[#6B7280] max-w-2xl mx-auto">
            نشكرك على ثقتك في <strong className="text-[#285240]">مزاد</strong>.
            نحرص على تجربة آمنة وشفافة — ونوضح هنا حقوقك في الاسترجاع خطوة بخطوة.
          </p>
        </header>

        <div className="space-y-4 max-w-3xl mx-auto">
          {sections.map((section, index) => (
            <article
              key={section.title}
              className="bg-white rounded-2xl border border-[#E6EDEA] p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="shrink-0 w-8 h-8 rounded-lg bg-[#285240] text-white type-caption font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <h2 className="type-subheading text-[#1a3329]">
                  {section.title}
                </h2>
              </div>
              <div className="type-body text-[#5C6B64] text-justify leading-relaxed pr-11">
                {section.content}
              </div>
            </article>
          ))}
        </div>

        <section className="mt-8 sm:mt-10 max-w-3xl mx-auto bg-[#285240] rounded-2xl p-6 sm:p-8 text-white">
          <h2 className="type-subheading text-white mb-2">للاستفسارات</h2>
          <p className="type-body text-white/85 mb-5">
            لأي استفسار بخصوص عمليات الدفع أو الاسترجاع، يمكنك التواصل معنا عبر:
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:01095665809"
              className="flex-1 bg-white/10 hover:bg-white/15 rounded-xl px-4 py-3 transition-colors"
            >
              <p className="type-caption text-white/70 mb-0.5">الهاتف</p>
              <p className="type-body font-semibold">01095665809</p>
            </a>
            <a
              href="mailto:Finance@mazzad.ai"
              className="flex-1 bg-white/10 hover:bg-white/15 rounded-xl px-4 py-3 transition-colors"
            >
              <p className="type-caption text-white/70 mb-0.5">البريد الإلكتروني</p>
              <p className="type-body font-semibold">Finance@mazzad.ai</p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
