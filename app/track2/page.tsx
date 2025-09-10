"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Mail, ExternalLink, Users2, FileText, Rocket, Presentation, ClipboardList, NotebookPen } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"

/**
 * TRACK2 Landing Page (1920×1080)
 * - Modern minimal, white/black with mint/blue highlights
 * - Sections: Header, Hero, About, Key Points, Program, Partners, CTA Footer
 * - Responsive & production‑ready with shadcn/ui + Tailwind
 */

const palette = {
  bg: "bg-white",
  text: "text-black",
  subtle: "text-slate-600",
  mint: "#4CC9C0",
  blue: "#4895EF",
}

const navItems = [
  { id: "about", label: "소개" },
  { id: "program", label: "프로그램" },
  { id: "team", label: "팀" },
  { id: "apply", label: "지원하기" },
]

const keyPoints = [
  { icon: FileText, title: "사업계획서 집중", desc: "구조/문항/지표 중심 작성법" },
  { icon: ClipboardList, title: "고객검증 실습", desc: "인터뷰·서베이·JP/PMF" },
  { icon: NotebookPen, title: "MVP 제작", desc: "Figma·노코드로 빠른 프로토타입" },
  { icon: Presentation, title: "IR 피칭", desc: "IR Deck·Q&A·모의심사" },
  { icon: Users2, title: "멘토링", desc: "현업 네트워크/코칭" },
]

const partners = ["INHA Venture Club", "GDGoC", "INCOM", "IGRUS", "ADGON", "SUNY Korea"]

export default function Track2LandingPage() {
  const router = useRouter()
  const googleFormUrl = "https://forms.gle/Zwxk5TGNiQ52X5WX6"

  const companyLogos = [
    { name: "Apple", src: "/images/logos/apple.svg" },
    { name: "Amazon", src: "/images/logos/amazon.svg" },
    { name: "배달의민족", src: "/images/logos/baemin.svg" },
    { name: "Toss", src: "/images/logos/toss.svg" },
    { name: "Kakao", src: "/images/logos/kakao.svg" },
    { name: "Airbnb", src: "/images/logos/airbnb.svg" },
  ]

  return (
    <div className={`${palette.bg} ${palette.text} min-h-screen w-full`}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="h-9 w-9 rounded-xl hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Image
                src="/images/ivc-logo-black.svg"
                alt="IVC Logo"
                width={36}
                height={36}
                className="h-full w-full object-contain rounded-xl"
              />
            </button>
            <span className="font-semibold tracking-tight">TRACK2</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="text-sm text-slate-700 transition-colors hover:text-black">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button
              asChild
              className="rounded-xl"
              style={{ backgroundColor: palette.blue }}
              onClick={() => window.open(googleFormUrl, "_blank")}
            >
              <button className="text-white">지원하기</button>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero (viewport‑height to suit 1920×1080) */}
      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-screen-2xl items-center px-6 py-16">
        <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold leading-tight md:text-5xl"
            >
              TRACK2 – 2026 예비창업패키지 대비 스터디 트랙
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-4 text-base text-slate-700 md:text-lg"
            >
              아이디어를{" "}
              <span className="font-semibold" style={{ color: palette.mint }}>
                사업계획서
              </span>
              로, 계획을{" "}
              <span className="font-semibold" style={{ color: palette.blue }}>
                MVP·IR
              </span>
              로. 4개월 8회차 실전형 트랙으로 함께 배우고 실행합니다.
            </motion.p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="rounded-xl px-6 text-base"
                style={{ backgroundColor: palette.mint, color: "black" }}
                onClick={() => window.open(googleFormUrl, "_blank")}
              >
                지원하기
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge className="rounded-full" style={{ backgroundColor: palette.blue }}>
                4개월 8회차
              </Badge>
              <Badge variant="secondary" className="rounded-full">
                문제정의 → IR 피칭
              </Badge>
              <Badge variant="secondary" className="rounded-full">
                Figma/노코드
              </Badge>
            </div>
          </div>

          {/* Right mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative mx-auto w-full max-w-xl">
              <Card className="rounded-2xl shadow-lg">
                <CardContent className="p-0">
                  {/* Fake app mock */}
                  <div className="rounded-2xl border bg-white p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: palette.mint }} />
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: palette.blue }} />
                        <div className="h-4 w-16 rounded-full bg-slate-200" />
                      </div>
                      <Button size="sm" variant="outline" className="rounded-lg bg-transparent">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                    <Separator className="my-4" />

                    <div className="grid grid-cols-3 gap-4">
                      {companyLogos.map((company, i) => (
                        <div key={i} className="rounded-xl border p-3 bg-white hover:shadow-md transition-shadow">
                          <div className="h-24 rounded-lg bg-gray-50 flex items-center justify-center p-2">
                            <Image
                              src={company.src || "/placeholder.svg"}
                              alt={company.name}
                              width={60}
                              height={60}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="mt-3 text-center">
                            <div className="text-xs font-medium text-gray-600">{company.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Glow */}
              <div
                className="pointer-events-none absolute inset-0 -z-10 rounded-[24px] blur-2xl"
                style={{
                  background: `radial-gradient(600px 200px at 80% 20%, ${palette.mint}22, transparent), radial-gradient(600px 200px at 20% 80%, ${palette.blue}22, transparent)`,
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-screen-2xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">왜 TRACK2인가?</h2>
            <p className="mt-4 text-slate-700">
              TRACK2는 정부지원사업 <b>예비창업패키지 선정</b>을 목표로 하는 실전 준비 트랙입니다. 문제정의, 시장조사,
              솔루션 기획, MVP 제작, BM 설계, IR 피칭까지 4개월간 8회차 커리큘럼으로
              <span className="font-medium"> 함께 배우고 실행</span>하며 최종 <b>사업계획서</b> 완성을 돕습니다.
            </p>
            <ul className="mt-6 space-y-3 text-slate-700">
              <li>
                • 문항-by-문항 가이드와 <b>샘플 템플릿</b> 제공
              </li>
              <li>• 고객 인터뷰/서베이 설계 및 데이터 기반 의사결정</li>
              <li>• Figma/노코드 MVP 제작과 사용자 피드백 반영</li>
              <li>• IR Deck / 모의심사 / 코칭으로 실전 감각 확보</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { k: "문제정의", v: "Week 1" },
              { k: "시장검증", v: "Week 2-3" },
              { k: "MVP", v: "Week 4-6" },
              { k: "IR", v: "Week 7-8" },
            ].map((item, i) => (
              <Card key={i} className="rounded-xl border">
                <CardContent className="p-5">
                  <div className="text-sm text-slate-500">{item.k}</div>
                  <div className="mt-2 text-lg font-semibold" style={{ color: i % 2 ? palette.blue : palette.mint }}>
                    {item.v}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Points */}
      <section className="mx-auto max-w-screen-2xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold md:text-3xl">핵심 포인트</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {keyPoints.map((kp, idx) => (
            <Card key={kp.title} className="rounded-2xl border">
              <CardContent className="p-6 text-center">
                <div
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: `linear-gradient(135deg, ${palette.mint}, ${palette.blue})` }}
                >
                  <kp.icon className="h-6 w-6 text-white" />
                </div>
                <div className="mt-3 font-semibold">{kp.title}</div>
                <div className="mt-1 text-sm text-slate-600">{kp.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Program Outline */}
      <section id="program" className="mx-auto max-w-screen-2xl px-6 py-16">
        <h2 className="text-2xl font-bold md:text-3xl">4개월 8회차 커리큘럼</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { w: "W1", t: "문제정의 & 타깃 설정", d: "문제 가설, 고객 페르소나, 가치 제안" },
            { w: "W2", t: "시장조사 & 데이터", d: "경쟁/대체재 분석, TAM/SAM/SOM" },
            { w: "W3", t: "고객검증 실습", d: "인터뷰/서베이 설계 및 실행" },
            { w: "W4", t: "솔루션 구체화", d: "핵심 기능 정의, Lo‑Fi 프로토타입" },
            { w: "W5", t: "MVP 제작", d: "Figma/노코드로 시나리오 구현" },
            { w: "W6", t: "MVP 개선", d: "사용자 피드백 수집·반영" },
            { w: "W7", t: "IR Deck 작성", d: "문항별 스토리라인·지표·재무" },
            { w: "W8", t: "모의심사 & 피칭", d: "Q&A, 제출 체크리스트 완료" },
          ].map((s, i) => (
            <Card key={s.w} className="rounded-xl border">
              <CardContent className="flex items-start gap-4 p-5">
                <div
                  className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                  style={{ background: i % 2 ? palette.blue : palette.mint }}
                >
                  {s.w}
                </div>
                <div>
                  <div className="font-semibold">{s.t}</div>
                  <div className="text-sm text-slate-600">{s.d}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team / Partners */}
      <section id="team" className="mx-auto max-w-screen-2xl px-6 py-16">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">함께하는 파트너</h2>
            <p className="mt-4 text-slate-700">현업 멘토링과 네트워크를 통해 실행력을 끌어올립니다.</p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {partners.map((p) => (
                <Card key={p} className="rounded-xl border">
                  <CardContent className="flex h-24 items-center justify-center p-4">
                    <span className="text-center text-sm font-medium text-slate-600">{p}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Simple contact card */}
          <Card className="rounded-2xl border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">문의하기</h3>
              <p className="mt-1 text-sm text-slate-600">관심 있으신가요? 이메일을 남겨 주세요.</p>
              <div className="mt-4 flex gap-2">
                <Input type="email" placeholder="you@example.com" className="rounded-xl" />
                <Button className="rounded-xl" style={{ backgroundColor: palette.blue }}>
                  <Mail className="mr-2 h-4 w-4" />
                  제출
                </Button>
              </div>
              <p className="mt-3 text-xs text-slate-500">개인정보는 문의 대응 이외의 용도로 사용되지 않습니다.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Apply / Footer CTA */}
      <section id="apply" className="mx-auto max-w-screen-2xl px-6 py-16">
        <div className="rounded-2xl border p-8 md:p-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-bold md:text-3xl">지금 신청하고 4개월 후, IR 무대에 서보세요</h3>
              <p className="mt-2 text-slate-700">문제정의부터 사업계획서, MVP, IR까지 — TRACK2가 함께합니다.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="lg"
                className="rounded-xl px-6 text-base"
                style={{ backgroundColor: palette.mint, color: "black" }}
                onClick={() => window.open(googleFormUrl, "_blank")}
              >
                지원하기
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-6 text-base bg-transparent"
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = "/pdfs/track2-curriculum.pdf"
                  link.download = "TRACK2_커리큘럼_안내.pdf"
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}
              >
                커리큘럼 PDF
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-xl"
              style={{ background: `linear-gradient(135deg, ${palette.mint}, ${palette.blue})` }}
            />
            <span className="text-sm text-slate-600">© {new Date().getFullYear()} TRACK2. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="rounded-xl text-slate-600 hover:text-black">
              <Rocket className="mr-2 h-4 w-4" />
              Notion
            </Button>
            <Button variant="ghost" className="rounded-xl text-slate-600 hover:text-black">
              <Presentation className="mr-2 h-4 w-4" />
              IR
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
