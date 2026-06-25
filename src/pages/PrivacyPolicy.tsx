import type { ReactNode } from "react";

const sections: {
  title: string;
  content: ReactNode;
}[] = [
  {
    title: "جمع المعلومات واستخدامها",
    content: (
      <>
        <p className="mb-3">
          نقوم بجمع بعض البيانات عند التسجيل أو استخدام الخدمات، مثل:
        </p>
        <ul className="list-disc pr-5 space-y-1 mb-3">
          <li>الاسم ورقم الهاتف والرقم القومي.</li>
        </ul>
        <p className="mb-2">نستخدم هذه المعلومات فقط من أجل:</p>
        <ul className="list-disc pr-5 space-y-1 mb-3">
          <li>تحسين تجربة المستخدم والخدمات المقدمة.</li>
          <li>إتمام عمليات الشراء والمزادات والدفع.</li>
          <li>التواصل معك بشأن الطلبات أو العروض الخاصة.</li>
        </ul>
        <p>
          جميع البيانات يتم حفظها بشكل آمن ولا يتم مشاركتها مع أي طرف ثالث دون
          موافقتك.
        </p>
      </>
    ),
  },
  {
    title: "حماية المعلومات",
    content: (
      <p>
        نستخدم أنظمة حماية متقدمة وتقنيات تشفير لضمان أمان معلوماتك الشخصية
        والمالية، ونتخذ جميع التدابير اللازمة لمنع الوصول غير المصرح به أو
        التعديل أو الاستخدام غير المشروع للبيانات.
      </p>
    ),
  },
  {
    title: "استخدام المنصة",
    content: (
      <>
        <p className="mb-2">عند استخدامك للمنصة، فإنك توافق على ما يلي:</p>
        <ul className="list-disc pr-5 space-y-1">
          <li>عدم استخدام المنصة لأي غرض غير قانوني أو مسيء.</li>
          <li>الالتزام بالشروط الخاصة بالمزادات والدفع والاسترجاع.</li>
          <li>الامتناع عن محاولة اختراق أو التلاعب بنظام المنصة بأي شكل.</li>
          <li>
            مسؤوليتك الكاملة عن دقة المعلومات التي تقدمها أثناء التسجيل أو
            الدفع.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "حقوق المستخدم",
    content: (
      <>
        <ul className="list-disc pr-5 space-y-1 mb-3">
          <li>
            يمكنك طلب حذف حسابك أو بياناتك في أي وقت من خلال التواصل مع فريق
            الدعم.
          </li>
          <li>
            لك الحق في معرفة كيفية استخدام بياناتك ومتابعة أي تحديث في
            السياسة.
          </li>
          <li>سيتم إشعارك بأي تعديل على هذه السياسات قبل تطبيقها.</li>
        </ul>
        <p>
          كما تحتفظ المنصة بحقها في تعديل أو إيقاف أي من الخدمات أو البنود دون
          إشعار مسبق.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F4F7F5] pb-12">
      <div className="container py-8 sm:py-10">
        <header className="text-center mb-8 sm:mb-10">
          <span className="inline-block type-caption font-semibold text-[#285240] bg-[#E8F5EE] px-3 py-1 rounded-full mb-4">
            خصوصيتك أولوية
          </span>
          <h1 className="type-heading text-[#1a3329] mb-3">
            سياسة الخصوصية والاستخدام
          </h1>
          <p className="type-body text-[#6B7280] max-w-2xl mx-auto">
            نشكرك على استخدامك <strong className="text-[#285240]">مزاد</strong>.
            نلتزم بحماية خصوصيتك وضمان تجربة استخدام آمنة وشفافة — ونوضح هنا
            كيف نتعامل مع بياناتك.
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
            لأي استفسار بخصوص خصوصية بياناتك أو حسابك، يمكنك التواصل معنا عبر:
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
