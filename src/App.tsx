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
