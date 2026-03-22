import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  User, 
  Briefcase, 
  Code, 
  GraduationCap, 
  Mail, 
  Github, 
  Linkedin, 
  Download, 
  ExternalLink,
  ChevronRight,
  Heart,
  Coffee,
  MapPin,
  Calendar,
  Award,
  Send,
  ArrowRight,
  Sun,
  Zap,
  Upload,
  Eye,
  X
} from 'lucide-react';
// @ts-ignore
import myAvatar from './avatar.jpg';

// --- Components ---

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-full bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 flex flex-col"
        >
          <div className="p-4 border-b border-slate-200/50 flex justify-between items-center bg-white/50">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Eye size={20} className="text-teal-500" /> 简历预览
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
              <X size={24} />
            </button>
          </div>
          <div className="overflow-auto p-4 md:p-8 flex justify-center bg-slate-50/30">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div 
    whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    className={`glass-card p-8 ${className}`}
  >
    {children}
  </motion.div>
);

const RippleButton = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`ripple px-8 py-4 rounded-2xl font-bold transition-all ${className}`}
  >
    {children}
  </motion.button>
);

const SectionHeading = ({ children, icon }: { children: React.ReactNode; icon?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex items-center gap-4 mb-16"
  >
    <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-white/50">
      {icon}
    </div>
    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
      {children}
    </h2>
  </motion.div>
);

const CursorFollower = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 bg-teal-400/20 rounded-full pointer-events-none z-[100] blur-sm hidden md:block"
      animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
      transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.5 }}
    />
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [resumeImage, setResumeImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeImage(reader.result as string);
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['home', 'experience', 'projects', 'skills', 'education', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveTab(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: '首页', icon: <User size={18} /> },
    { id: 'experience', label: '经历', icon: <Briefcase size={18} /> },
    { id: 'projects', label: '作品', icon: <Code size={18} /> },
    { id: 'skills', label: '技能', icon: <Award size={18} /> },
    { id: 'education', label: '教育', icon: <GraduationCap size={18} /> },
    { id: 'contact', label: '联系', icon: <Mail size={18} /> },
  ];

  return (
    <div className="relative min-h-screen font-sans text-slate-800">
      <CursorFollower />
      {/* Background Magic */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="blob bg-teal-200 w-[500px] h-[500px] top-[-10%] left-[-10%] animation-delay-2000" />
        <div className="blob bg-orange-200 w-[500px] h-[500px] bottom-[-10%] right-[-10%] animation-delay-4000" />
        <div className="blob bg-cyan-200 w-[400px] h-[400px] top-[20%] right-[10%] animation-delay-1000" />
        <div className="blob bg-emerald-100 w-[300px] h-[300px] bottom-[20%] left-[10%] animation-delay-3000" />
        <div className="absolute inset-0 sunlight-pattern opacity-50" />
      </div>

      {/* Floating Decorative Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[5%] text-4xl opacity-20"
        >
          🍋
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[60%] right-[5%] text-4xl opacity-20"
        >
          🌿
        </motion.div>
        <motion.div 
          animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[10%] left-[20%] text-4xl opacity-20"
        >
          ☀️
        </motion.div>
      </div>

      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-teal-400 origin-left z-[60]" style={{ scaleX }} />

      {/* Navigation */}
      <nav className={`fixed top-6 left-0 right-0 z-50 transition-all duration-500 px-4`}>
        <div className="max-w-4xl mx-auto">
          <div className={`nav-glass px-4 py-2 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'shadow-2xl' : 'shadow-lg'}`}>
            <div className="text-2xl font-black text-teal-600 tracking-tighter ml-2">LX.</div>
            <div className="hidden md:flex items-center gap-1 relative">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === item.id ? 'text-teal-700' : 'text-slate-500 hover:text-teal-600'
                  }`}
                >
                  {activeTab === item.id && (
                    <motion.div 
                      layoutId="nav-active"
                      className="absolute inset-0 bg-teal-100/50 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="flex items-center gap-2">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <motion.a whileHover={{ scale: 1.1 }} href="#" className="p-2 text-slate-500 hover:text-teal-600 transition-colors"><Github size={20} /></motion.a>
              <motion.a whileHover={{ scale: 1.1 }} href="#" className="p-2 text-slate-500 hover:text-teal-600 transition-colors"><Linkedin size={20} /></motion.a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-40 pb-20">
        
        {/* Hero Section */}
        <section id="home" className="min-h-[80vh] flex flex-col md:flex-row items-center justify-between gap-12 mb-40">
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-black text-slate-900 mb-8 leading-[0.9] tracking-tighter">
                <span className="text-3xl sm:text-4xl md:text-5xl block mb-4 opacity-80">你好，我是</span>
                <span className="text-6xl sm:text-7xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500">孙晓云</span> 👋
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-slate-700 mb-10 tracking-tight leading-tight">
                AI Native 产品经理 | <span className="text-teal-600">出海 B2B 增长专家</span> | 英语专业八级 🍋
              </p>
              <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed">
                25 届翻译背景“非典型”开发者。我不仅拥有英语专八的敏锐直觉，更擅长通过 <span className="text-teal-600 font-bold">Vibe Coding</span> 将 AI 落地于北美 B2B 业务深水区，实现从痛点到闭环的快速原型开发。🌿
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <RippleButton 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-teal-500 text-white shadow-xl shadow-teal-200 hover:bg-teal-600 flex items-center gap-2"
                >
                  联系我合作 <Send size={20} />
                </RippleButton>
                
                <div className="flex gap-4">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                  
                  {resumeImage ? (
                    <RippleButton 
                      onClick={() => setIsModalOpen(true)}
                      className="bg-teal-50 text-teal-700 shadow-lg hover:bg-teal-100 border border-teal-200/50 flex items-center gap-2"
                    >
                      查看简历图片 <Eye size={20} />
                    </RippleButton>
                  ) : (
                    <RippleButton 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-emerald-50 text-emerald-700 shadow-lg hover:bg-emerald-100 border border-emerald-200/50 flex items-center gap-2"
                    >
                      上传简历图片 <Upload size={20} />
                    </RippleButton>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative"
          >
            {/* Green Glow Ring */}
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-4 border-4 border-emerald-400/40 rounded-full z-0" 
            />
            <motion.div 
              animate={{ scale: [1.1, 1.2, 1.1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -inset-8 border-2 border-emerald-300/20 rounded-full z-0" 
            />
            
            {/* Ripple Glow Effect */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-emerald-300/30 rounded-full blur-3xl" 
            />
            <motion.div 
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute inset-0 bg-orange-200/30 rounded-full blur-3xl" 
            />
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-white/80 shadow-2xl overflow-hidden relative z-10">
              <img 
                src={resumeImage || myAvatar} 
                alt="Avatar" 
                className="w-full h-full object-cover bg-teal-50"
                referrerPolicy="no-referrer"
              />
            </div>
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl z-20 border border-white"
            >
              <Sun className="text-orange-400" size={32} />
            </motion.div>
          </motion.div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="mb-40 scroll-mt-32">
          <SectionHeading icon="☀️">工作经历</SectionHeading>
          
          <div className="relative pl-8 border-l-4 border-teal-100 space-y-16">
            {[
              {
                company: "成都亚米科技",
                role: "AI 运营与研究负责人 (Owner)",
                period: "2025.03 - 至今",
                desc: "深耕 AI Native 产品落地，专注于出海 B2B 业务的增长与自动化。🍋",
                achievements: [
                  <><strong>北美餐饮营销自动化方案：</strong>利用 Gemini 1.5 + Prompt Engineering 搭建 AI 海报生成引擎，参数化适配北美主流审美。成果：海报产出效率提升 <span className="text-teal-600 font-black">90%+</span>，显著降低获客成本 (CAC)。</>,
                  <><strong>市场情报 AI Agent 体系：</strong>基于 Coze 设计多层级 Agent 矩阵，实现自动化信息抓取、清洗与结构化分析。成果：调研效率提升 <span className="text-teal-600 font-black">5 倍</span>，精准支撑 SaaS 产品在美定价策略。</>,
                  <><strong>AIGC 短视频获客流水线：</strong>整合 Midjourney 与 HeyGen 打造内容自动化工厂。成果：一周获取 <span className="text-teal-600 font-black">1500+</span> 精准 B2B 粉丝，转化率提升 <span className="text-teal-600 font-black">40%</span>。</>
                ]
              }
            ].map((exp, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Bubble Node */}
                <div className="absolute -left-[42px] top-0 w-6 h-6 bg-white border-4 border-teal-400 rounded-full shadow-lg shadow-teal-200" />
                
                <GlassCard className="hover:border-teal-300 transition-colors relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-teal-100/50 transition-colors" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">{exp.role}</h3>
                      <p className="text-teal-600 font-bold text-lg">{exp.company}</p>
                    </div>
                    <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2">
                      <Calendar size={16} /> {exp.period}
                    </div>
                  </div>
                  <p className="text-slate-600 mb-8 leading-relaxed text-lg">{exp.desc}</p>
                  <ul className="space-y-8">
                    {exp.achievements.map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-slate-600 leading-relaxed">
                        <div className="w-2 h-2 bg-teal-400 rounded-full mt-3 shrink-0 shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
                        <span className="text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mb-40 scroll-mt-32">
          <SectionHeading icon="🍋">项目作品</SectionHeading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "AI Poster Generator",
                desc: "针对北美餐厅老板研发的视觉营销工具，解决海外审美不匹配的痛点。",
                tags: ["Gemini Pro 🍋", "Visual Logic ☀️"],
                img: "https://picsum.photos/seed/poster/800/600"
              },
              {
                title: "B2B Intel Agent",
                desc: "自动化监测北美竞品动态与商机，将“人工检索”进化为“秒级推送”。",
                tags: ["Agentic Workflow 🌿", "Market Intelligence 🍋"],
                img: "https://picsum.photos/seed/intel/800/600"
              },
              {
                title: "Vibe Coding Labs",
                desc: "利用 Cursor 与 Claude 快速迭代的系列产品原型，探索人机协作的新型工作流。",
                tags: ["Cursor ☀️", "MVP Development 🌿"],
                img: "https://picsum.photos/seed/vibe/800/600"
              }
            ].map((project, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-0 overflow-hidden group h-full flex flex-col">
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={project.img} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <RippleButton className="bg-white/90 text-teal-600 backdrop-blur-sm px-6 py-2">
                        查看详情
                      </RippleButton>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-slate-900 mb-4">{project.title}</h3>
                    <p className="text-slate-600 mb-8 leading-relaxed line-clamp-3">{project.desc}</p>
                    <div className="mt-auto flex flex-wrap gap-3">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-4 py-1.5 bg-white/50 border border-white text-teal-700 text-xs font-black rounded-full shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="mb-40 scroll-mt-32">
          <SectionHeading icon="🌿">专业技能</SectionHeading>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <GlassCard>
              <div className="flex items-center gap-3 mb-8">
                <Zap className="text-teal-500" />
                <h3 className="text-2xl font-black text-slate-900">专业工具 (Pro Tools)</h3>
              </div>
              <div className="flex flex-wrap gap-6">
                {[
                  { name: "Cursor (Vibe Coding)", level: 95 },
                  { name: "Claude 3.5", level: 98 },
                  { name: "Gemini (AI Studio)", level: 92 },
                  { name: "Arena.ai", level: 85 },
                  { name: "DeepSeek", level: 88 },
                  { name: "Coze (Agentic)", level: 90 }
                ].map((skill, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -10 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-teal-50/50" />
                        <motion.circle 
                          cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" 
                          strokeDasharray={251.2}
                          initial={{ strokeDashoffset: 251.2 }}
                          whileInView={{ strokeDashoffset: 251.2 - (251.2 * skill.level) / 100 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="text-teal-500"
                        />
                      </svg>
                      <span className="absolute text-sm font-black text-slate-700">{skill.level}%</span>
                    </div>
                    <span className="font-bold text-slate-600 text-center text-sm">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
            
            <GlassCard>
              <div className="flex items-center gap-3 mb-8">
                <Heart className="text-orange-400" />
                <h3 className="text-2xl font-black text-slate-900">软技能与语言</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "英语专业八级 (TEM-8)", icon: "🎓", delay: 0 },
                  { name: "跨文化商业谈判", icon: "🤝", delay: 0.1 },
                  { name: "痛点挖掘", icon: "🔍", delay: 0.2 },
                  { name: "RAG & Function Calling", icon: "⚙️", delay: 0.3 }
                ].map((skill, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: skill.delay, type: "spring" }}
                    whileHover={{ 
                      scale: 1.05, 
                      backgroundColor: "rgba(255,255,255,0.8)",
                      boxShadow: "0 10px 30px -10px rgba(20, 184, 166, 0.3)"
                    }}
                    className="p-6 bg-white/40 rounded-2xl border border-white/60 flex items-center gap-4 shadow-sm group transition-all"
                  >
                    <span className="text-3xl group-hover:rotate-12 transition-transform">{skill.icon}</span>
                    <span className="font-black text-slate-700">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="mb-40 scroll-mt-32">
          <SectionHeading icon="🎓">教育背景</SectionHeading>
          
          <GlassCard className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 bg-teal-100 rounded-3xl flex items-center justify-center text-5xl">
                🏫
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">成都外国语学院</h3>
                <p className="text-xl text-teal-600 font-bold">翻译专业 · 本科 (25 届)</p>
                <p className="text-slate
