import Link from 'next/link';
import {
  Layers, ChevronDown, ArrowRight, Search, User, Briefcase,
  GraduationCap, Code, Wand2, Target, Check, CheckCircle2,
  AlertCircle, Mic, Building2, Twitter, Linkedin, Instagram
} from 'lucide-react';

export default function EntrancePage() {
  return (
    <div className="bg-white text-black font-sans w-full h-full overflow-x-hidden selection:bg-indigo-100 antialiased">
      {/* Navigation */}
      <nav className="w-full fixed top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                <Layers className="h-4 w-4" />
              </div>
              AI Resume Studio
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <div className="text-sm font-medium text-gray-600 hover:text-black transition-colors flex items-center gap-1 group cursor-pointer">
                Products
                <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-black transition-colors" />
              </div>
              <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Templates</Link>
              <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Pricing</Link>
              <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Resources</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="hidden md:block text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
              Log in
            </Link>
            <Link href="/auth/login" className="text-sm font-bold border-2 border-black rounded-full px-6 py-2 hover:bg-black hover:text-white transition-all duration-300">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="pt-40 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-[1440px] mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 mb-8 border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">New Feature: AI Interview Prep</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-bold tracking-tight text-black mb-8 max-w-5xl leading-[1.1]">
            Your career journey,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 opacity-90">accelerated.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-12 leading-relaxed">
            Build ATS-friendly resumes, get instant AI analysis scores, and practice with personalized interview simulations. All in one workspace.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center mb-20">
            <Link href="/auth/login" className="w-full md:w-auto border-2 border-black bg-black text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
              Start Building Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/auth/login" className="w-full md:w-auto border-2 border-black bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              <Search className="h-5 w-5" />
              Analyze Existing Resume
            </Link>
          </div>

          {/* Builder Mockup UI */}
          <div className="w-full max-w-6xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-purple-200 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-white rounded-[2rem] border border-gray-200 shadow-2xl overflow-hidden text-left">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 bg-white h-8 rounded-md border border-gray-200 mx-4 shadow-sm flex items-center px-4 text-xs text-gray-400">
                  airesumestudio.com/editor/johndoe/v2
                </div>
              </div>
              <div className="grid grid-cols-12 h-[500px] md:h-[600px] bg-white">

                <div className="col-span-3 border-r border-gray-100 p-6 hidden md:flex flex-col gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sections</h3>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl cursor-pointer border border-blue-100">
                      <User className="h-4 w-4" />
                      <span className="font-medium text-sm">Contact Info</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-600 rounded-xl cursor-pointer transition-colors">
                      <Briefcase className="h-4 w-4" />
                      <span className="font-medium text-sm">Experience</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-600 rounded-xl cursor-pointer transition-colors">
                      <GraduationCap className="h-4 w-4" />
                      <span className="font-medium text-sm">Education</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-600 rounded-xl cursor-pointer transition-colors">
                      <Code className="h-4 w-4" />
                      <span className="font-medium text-sm">Skills</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="bg-gray-900 text-white p-5 rounded-2xl">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-medium text-gray-300">ATS Score</span>
                        <span className="text-2xl font-bold">92</span>
                      </div>
                      <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-400 h-full rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <div className="mt-4 text-xs text-gray-400">Excellent keyword matching found.</div>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-6 bg-gray-50 p-8 md:p-12 overflow-y-auto">
                  <div className="bg-white shadow-sm border border-gray-200 min-h-[600px] w-full p-8 md:p-12 mx-auto max-w-[500px]">
                    <div className="border-b-2 border-black pb-6 mb-6">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">Alex Morgan</h1>
                      <p className="text-gray-600 text-sm">Senior Product Designer &bull; San Francisco, CA</p>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Professional Experience</h2>
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <h3 className="font-bold text-sm">Lead Designer, TechCorp</h3>
                          <span className="text-xs text-gray-500">2020 - Present</span>
                        </div>
                        <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                          <li>Spearheaded redesign of core product interface resulting in 40% engagement increase.</li>
                          <li>Managed team of 5 designers and conducted weekly critiques.</li>
                          <li>Implemented design system reducing dev time by 25%.</li>
                        </ul>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <h3 className="font-bold text-sm">UI Designer, StartUp Inc</h3>
                          <span className="text-xs text-gray-500">2018 - 2020</span>
                        </div>
                        <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                          <li>Collaborated with engineering to ship MVP in 3 months.</li>
                          <li>Designed marketing assets and landing pages.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-3 border-l border-gray-100 bg-white p-6 hidden md:flex flex-col">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">AI Suggestions</h3>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/50">
                      <div className="flex items-start gap-3">
                        <Wand2 className="h-4 w-4 text-orange-500 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-1">Action Verbs</h4>
                          <p className="text-xs text-gray-600 leading-relaxed">Consider changing &quot;Managed&quot; to &quot;Orchestrated&quot; for stronger impact.</p>
                          <button className="mt-2 text-xs font-bold text-orange-600 hover:text-orange-700">Apply Change</button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                      <div className="flex items-start gap-3">
                        <Target className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-1">Quantify Results</h4>
                          <p className="text-xs text-gray-600 leading-relaxed">Add specific metrics to your second bullet point under TechCorp.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Social Proof */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-10">Candidates hired at top companies</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 transition-opacity duration-500 hover:opacity-100 text-gray-500 grayscale hover:grayscale-[50%]">
            <div className="text-2xl md:text-3xl font-extrabold tracking-tighter">Google</div>
            <div className="text-2xl md:text-3xl font-extrabold tracking-tight">Amazon</div>
            <div className="text-2xl md:text-3xl font-extrabold tracking-tighter">Microsoft</div>
            <div className="text-2xl md:text-3xl font-extrabold tracking-tighter">Spotify</div>
            <div className="text-2xl md:text-3xl font-extrabold tracking-tighter italic">Uber</div>
            <div className="text-2xl md:text-3xl font-extrabold tracking-tighter text-[#FF5A5F] grayscale">Airbnb</div>
          </div>
        </div>
      </section>

      {/* Feature 1 */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="bg-gray-50 rounded-[3rem] p-8 md:p-20 overflow-hidden relative border border-gray-100">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-blue-100 to-transparent rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
              <div className="order-2 md:order-1">
                <div className="inline-block px-4 py-2 rounded-full border border-black mb-6 border-opacity-20 text-black">
                  <span className="text-xs font-bold uppercase tracking-wider">01 &mdash; Builder</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">Create standout resumes in minutes.</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-md">
                  Forget formatting nightmares. Use our professional templates designed to pass Applicant Tracking Systems (ATS) and catch recruiter eyes.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-lg font-medium text-gray-700">
                    <Check className="h-5 w-5 text-black" />
                    ATS-Optimized Templates
                  </li>
                  <li className="flex items-center gap-3 text-lg font-medium text-gray-700">
                    <Check className="h-5 w-5 text-black" />
                    Smart Content Suggestions
                  </li>
                  <li className="flex items-center gap-3 text-lg font-medium text-gray-700">
                    <Check className="h-5 w-5 text-black" />
                    One-Click Formatting
                  </li>
                </ul>
                <Link href="/auth/login" className="inline-block border-2 border-black rounded-full px-8 py-3 font-bold hover:bg-black hover:text-white transition-all text-center">
                  Start Building
                </Link>
              </div>
              <div className="order-1 md:order-2 relative">
                <div className="relative bg-white rounded-3xl p-6 shadow-xl border border-gray-100 rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex gap-4 mb-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 animate-pulse"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-900 rounded w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-2 bg-gray-100 rounded w-full"></div>
                    <div className="h-2 bg-gray-100 rounded w-full"></div>
                    <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                    <div className="h-2 bg-gray-100 rounded w-4/6"></div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-4 bg-gray-900 rounded w-1/3 animate-pulse"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/6 animate-pulse"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-2 bg-gray-100 rounded w-full"></div>
                      <div className="h-2 bg-gray-100 rounded w-11/12"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2 */}
      <section className="py-12 md:py-12 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[3rem] p-8 md:p-20 overflow-hidden relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
              <div className="relative">
                <div className="bg-white rounded-[2rem] p-8 shadow-xl max-w-md mx-auto relative border border-purple-100">
                  <div className="absolute -top-6 -right-6 bg-black text-white px-6 py-3 rounded-full font-bold shadow-lg text-sm">
                    Top 5%
                  </div>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-40 h-40 rounded-full border-[12px] border-blue-500 mb-4 relative shadow-sm">
                      <span className="text-5xl font-bold text-blue-600">92</span>
                    </div>
                    <h3 className="text-xl font-bold">Resume Score</h3>
                    <p className="text-gray-500 text-sm">Excellent work!</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-sm text-gray-700">Impactful Verbs</span>
                      </div>
                      <span className="font-bold text-sm">100%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-sm text-gray-700">Quantifiable Data</span>
                      </div>
                      <span className="font-bold text-sm">95%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <span className="font-medium text-sm text-gray-700">Keywords</span>
                      </div>
                      <span className="font-bold text-sm text-yellow-600">80%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-block px-4 py-2 rounded-full border border-black border-opacity-20 mb-6 bg-white/50 backdrop-blur-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-black">02 &mdash; Analyzer</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">Data-driven feedback for your CV.</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-md">
                  Our AI analyzes your resume against thousands of successful job applications to tell you exactly what&#39;s missing and how to fix it.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div>
                    <h4 className="font-bold text-xl mb-2 text-gray-900">Keyword Gap</h4>
                    <p className="text-sm text-gray-600">Identify missing skills required by the job description.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 text-gray-900">Impact Analysis</h4>
                    <p className="text-sm text-gray-600">Ensure your bullet points demonstrate real value.</p>
                  </div>
                </div>
                <Link href="/auth/login" className="inline-block border-2 border-black rounded-full px-8 py-3 font-bold bg-black text-white hover:bg-white hover:text-black transition-all text-center shadow-lg">
                  Analyze My Resume
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3 */}
      <section className="py-24 md:py-32 px-6 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-block px-4 py-2 rounded-full border border-black border-opacity-20 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-black">03 &mdash; Preparation</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Practice makes hired.</h2>
            <p className="text-xl text-gray-600">Simulate real interviews with AI that adapts to your target role and company.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group border border-gray-200 rounded-[2rem] p-8 hover:shadow-xl transition-all duration-300 hover:border-blue-200 hover:bg-blue-50/50">
              <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-md">
                <Mic className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Mock Interviews</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Answer role-specific questions via voice or text. Get instant feedback on your tone, pacing, and content quality.
              </p>
              <Link href="/auth/login" className="font-bold text-sm flex items-center gap-2 text-black group-hover:gap-3 transition-all">
                Try Simulator <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="group border border-gray-200 rounded-[2rem] p-8 hover:shadow-xl transition-all duration-300 hover:border-purple-200 hover:bg-purple-50/50">
              <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-md">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Company Specifics</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Access a database of recent interview questions from top tech companies like Google, Meta, and Amazon.
              </p>
              <Link href="/auth/login" className="font-bold text-sm flex items-center gap-2 text-black group-hover:gap-3 transition-all">
                View Database <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="group border border-gray-200 rounded-[2rem] p-8 hover:shadow-xl transition-all duration-300 hover:border-green-200 hover:bg-green-50/50">
              <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-md">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Technical Challenges</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Solve coding problems or case studies directly in the browser with AI hints when you get stuck.
              </p>
              <Link href="/auth/login" className="font-bold text-sm flex items-center gap-2 text-black group-hover:gap-3 transition-all">
                Start Coding <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="bg-black text-white rounded-[3rem] p-12 md:p-32 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-[100px] opacity-20 translate-x-1/2 translate-y-1/2"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">Ready to launch?</h2>
              <p className="text-xl text-gray-400 mb-12">Join 50,000+ candidates landing their dream jobs with AI Resume Studio.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/auth/login" className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors inline-block">
                  Get Started for Free
                </Link>
                <Link href="/auth/login" className="bg-transparent border border-white/30 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors inline-block">
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2 mb-6 text-black">
                <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                  <Layers className="h-4 w-4" />
                </div>
                AI Resume Studio
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed pr-4">
                The all-in-one platform for career acceleration. Build, analyze, and prepare to succeed.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-gray-900">Product</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link href="/auth/login" className="hover:text-black transition-colors">Resume Builder</Link></li>
                <li><Link href="/auth/login" className="hover:text-black transition-colors">AI Analyzer</Link></li>
                <li><Link href="/auth/login" className="hover:text-black transition-colors">Interview Prep</Link></li>
                <li><Link href="/auth/login" className="hover:text-black transition-colors">Cover Letter Gen</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-gray-900">Resources</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link href="/auth/login" className="hover:text-black transition-colors">Blog</Link></li>
                <li><Link href="/auth/login" className="hover:text-black transition-colors">Resume Templates</Link></li>
                <li><Link href="/auth/login" className="hover:text-black transition-colors">Career Guide</Link></li>
                <li><Link href="/auth/login" className="hover:text-black transition-colors">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-gray-900">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link href="/auth/login" className="hover:text-black transition-colors">About Us</Link></li>
                <li><Link href="/auth/login" className="hover:text-black transition-colors">Careers</Link></li>
                <li><Link href="/auth/login" className="hover:text-black transition-colors">Privacy Policy</Link></li>
                <li><Link href="/auth/login" className="hover:text-black transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">© 2026 AI Resume Studio Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/auth/login" className="text-gray-400 hover:text-black transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="/auth/login" className="text-gray-400 hover:text-black transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="/auth/login" className="text-gray-400 hover:text-black transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
