"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, ExternalLink, Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface NewsArticle {
  id: number
  title: string
  content: string
  date: string
  author: string
  category: string
  imageUrl?: string
  externalLink?: string
  slug: string
}

const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "인하벤처클럽, 30년 전통의 창업 동아리로 주목받아",
    content: `
      <div class="prose prose-lg max-w-none">
        <p>한국경제 매거진에서 인하벤처클럽의 30년 역사와 성과를 조명했습니다.</p>
        
        <h3>30년 전통의 실전 창업 교육</h3>
        <p>인하벤처클럽은 1990년대부터 시작된 인하대학교의 대표적인 창업 동아리로, 30년간 축적된 노하우와 전통을 바탕으로 실전 창업 교육을 제공하고 있습니다.</p>
        
        <h3>성공적인 멘토링 프로그램</h3>
        <p>현업 전문가들과의 멘토링 프로그램을 통해 학생들이 실제 창업 현장에서 필요한 지식과 경험을 쌓을 수 있도록 지원하고 있습니다.</p>
        
        <h3>다양한 성공 사례</h3>
        <p>지금까지 수많은 성공적인 창업 사례를 배출하며, 대학생 창업 생태계에서 중요한 역할을 담당하고 있습니다.</p>
        
        <blockquote>
          <p>"인하벤처클럽은 단순한 동아리가 아닌, 실제 창업을 꿈꾸는 학생들에게 실질적인 도움을 제공하는 플랫폼입니다."</p>
        </blockquote>
      </div>
    `,
    date: "2020-10-19",
    author: "한국경제",
    category: "언론보도",
    imageUrl: "/placeholder.svg?height=400&width=800&text=한국경제+매거진+특집",
    externalLink: "https://magazine.hankyung.com/job-joy/article/202010193231b",
    slug: "hankyung-magazine-feature",
  },
  {
    id: 2,
    title: "인하벤처클럽 활동 및 성과 소개",
    content: `
      <div class="prose prose-lg max-w-none">
        <p>인하벤처클럽의 다양한 활동과 창업 지원 프로그램, 그리고 동아리 멤버들의 성공 스토리를 소개합니다.</p>
        
        <h3>주요 활동 프로그램</h3>
        <ul>
          <li>정기 창업 세미나 및 워크샵</li>
          <li>멘토-멘티 매칭 프로그램</li>
          <li>창업 아이디어 경진대회</li>
          <li>네트워킹 이벤트</li>
        </ul>
        
        <h3>창업 지원 시스템</h3>
        <p>체계적인 창업 지원 시스템을 통해 아이디어 단계부터 실제 사업화까지 전 과정을 지원합니다.</p>
        
        <h3>멤버 성공 스토리</h3>
        <p>많은 동아리 출신들이 성공적인 창업을 이루어내며, 후배들에게 좋은 롤모델이 되고 있습니다.</p>
      </div>
    `,
    date: "2024-01-15",
    author: "인하벤처클럽",
    category: "활동소개",
    imageUrl: "/placeholder.svg?height=400&width=800&text=인하벤처클럽+활동+소개",
    externalLink: "https://blog.myslice.is/ssp_inha/",
    slug: "venture-club-activities",
  },
  {
    id: 3,
    title: "대학 창업동아리의 새로운 패러다임 제시",
    content: `
      <div class="prose prose-lg max-w-none">
        <p>렉처러뉴스에서 인하벤처클럽이 제시하는 새로운 창업 교육 모델과 실전 경험의 중요성에 대해 다뤘습니다.</p>
        
        <h3>새로운 창업 교육 모델</h3>
        <p>기존의 이론 중심 교육에서 벗어나 실전 경험을 중시하는 새로운 교육 패러다임을 제시하고 있습니다.</p>
        
        <h3>실전 경험의 중요성</h3>
        <p>실제 창업 과정에서 겪는 다양한 문제들을 미리 경험해볼 수 있는 기회를 제공합니다.</p>
        
        <h3>산학협력 강화</h3>
        <p>기업과의 협력을 통해 학생들이 실제 비즈니스 환경을 체험할 수 있도록 지원합니다.</p>
      </div>
    `,
    date: "2023-08-20",
    author: "렉처러뉴스",
    category: "언론보도",
    imageUrl: "/placeholder.svg?height=400&width=800&text=렉처러뉴스+특집",
    externalLink: "https://www.lecturernews.com/news/articleView.html?idxno=18038",
    slug: "lecturer-news-feature",
  },
  {
    id: 4,
    title: "인하벤처클럽, 대학생 창업 생태계 선도",
    content: `
      <div class="prose prose-lg max-w-none">
        <p>교수신문에서 인하벤처클럽이 대학생 창업 생태계에서 차지하는 위치와 역할에 대해 심층 분석했습니다.</p>
        
        <h3>창업 생태계에서의 역할</h3>
        <p>대학생 창업 생태계의 핵심 허브 역할을 담당하며, 다양한 이해관계자들을 연결하는 플랫폼 기능을 수행합니다.</p>
        
        <h3>지속가능한 성장 모델</h3>
        <p>단기적 성과에 그치지 않고 장기적으로 지속가능한 창업 생태계 구축에 기여하고 있습니다.</p>
        
        <h3>네트워크 효과</h3>
        <p>동문 네트워크를 활용한 멘토링과 투자 연결 등 다양한 지원 시스템을 구축하고 있습니다.</p>
      </div>
    `,
    date: "2023-06-10",
    author: "교수신문",
    category: "언론보도",
    imageUrl: "/placeholder.svg?height=400&width=800&text=교수신문+심층분석",
    externalLink: "https://www.kyosu.net/news/articleView.html?idxno=132445",
    slug: "kyosu-news-feature",
  },
  {
    id: 5,
    title: "지역 창업 생태계 활성화에 기여하는 인하벤처클럽",
    content: `
      <div class="prose prose-lg max-w-none">
        <p>기호일보에서 인하벤처클럽이 지역 창업 생태계 발전에 미치는 긍정적 영향과 향후 계획을 소개했습니다.</p>
        
        <h3>지역 사회와의 연계</h3>
        <p>인천 지역의 창업 생태계 활성화를 위해 지역 기업 및 기관과의 협력을 강화하고 있습니다.</p>
        
        <h3>지역 경제 발전 기여</h3>
        <p>지역 내 창업 활동 증가와 일자리 창출을 통해 지역 경제 발전에 기여하고 있습니다.</p>
        
        <h3>향후 발전 계획</h3>
        <p>더욱 체계적이고 전문적인 창업 지원 시스템 구축을 통해 지역 창업 생태계의 중심 역할을 확대해 나갈 계획입니다.</p>
      </div>
    `,
    date: "2023-03-25",
    author: "기호일보",
    category: "언론보도",
    imageUrl: "/placeholder.svg?height=400&width=800&text=기호일보+지역+특집",
    externalLink: "https://www.kihoilbo.co.kr/news/articleView.html?idxno=316319",
    slug: "kiho-news-feature",
  },
]

export default function NewsDetailPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const params = useParams()
  const slug = params.slug as string

  const article = newsArticles.find((article) => article.slug === slug)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(prefersDark)
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">기사를 찾을 수 없습니다</h1>
          <Link href="/media">
            <Button>미디어 센터로 돌아가기</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-950 dark:via-gray-900 dark:to-slate-950 text-gray-900 dark:text-white transition-colors duration-500">
      {/* Navigation */}
      <nav className="fixed top-4 md:top-8 right-4 md:right-8 z-50" role="navigation" aria-label="Main navigation">
        <div className="flex items-center gap-3 md:gap-6">
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="text-sm md:text-lg font-light text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/5 transition-all duration-300 px-2 md:px-4 rounded-full group"
            aria-label="Toggle between light and dark theme"
          >
            <div className="group-hover:rotate-180 transition-transform duration-500">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </div>
          </Button>
          <Link href="/media">
            <Button
              variant="ghost"
              className="text-sm md:text-lg font-light text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/5 transition-all duration-300 px-2 md:px-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              미디어 센터
            </Button>
          </Link>
        </div>
      </nav>

      {/* Article Content */}
      <main className="relative z-10 pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-8 md:px-12 lg:px-16">
          {/* Article Header */}
          <header className="mb-12">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-4">
                {article.category}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">{article.title}</h1>
              <div className="flex items-center gap-6 text-gray-600 dark:text-white/70">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(article.date).toLocaleDateString("ko-KR")}</span>
                </div>
              </div>
            </div>

            {article.imageUrl && (
              <div className="relative overflow-hidden rounded-2xl mb-8">
                <img
                  src={article.imageUrl || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            )}
          </header>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none dark:prose-invert mb-12"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* External Link */}
          {article.externalLink && (
            <div className="border-t border-gray-200 dark:border-white/10 pt-8">
              <Button
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-500 dark:via-pink-500 dark:to-cyan-500 text-white hover:scale-105 transition-all duration-300 hover:shadow-xl"
                onClick={() => window.open(article.externalLink, "_blank")}
              >
                원문 보기
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </article>
      </main>
    </div>
  )
}
