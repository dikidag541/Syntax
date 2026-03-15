'use client';

import { motion } from 'framer-motion';

interface Project {
    id: string;
    name: string;
    url: string;
}

const projects: Project[] = [
    { id: 'ukm', name: 'UKM Etalase', url: 'http://ukmketalase.com/' },
    { id: 'sugoi', name: 'Sugoi8 Management', url: 'https://sugoi8management.com/' },
    { id: 'af', name: 'AF Studio', url: 'https://afstudio.my.id/' },
    { id: 'bk', name: 'Balik Kucing Studio', url: 'https://balikkucingstudio.com/' },
    { id: 'strategix', name: 'Strategix Grapadi', url: 'https://strategix.grapadikonsultan.co.id/' },
    { id: 'hmrp', name: 'HMRP Munej', url: 'https://hmrpmunej.id/' },
    { id: 'mahapena', name: 'Mahapena', url: 'https://mahapena.feb.unej.ac.id/' },
];

interface Props {
    activeId: string | null;
    onHover: (id: string | null) => void;
    isVisible: boolean;
}

export default function ProjectSidebar({ activeId, onHover, isVisible }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
            className="fixed right-12 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-12 items-end pointer-events-auto"
        >
            <div className="text-[10px] tracking-[0.5em] opacity-30 mb-8 font-['JetBrains_Mono'] leading-relaxed">PROJECT_ARCHIVE_v1.0</div>

            {projects.map((project, index) => (
                <div
                    key={project.id}
                    className="group relative flex items-center gap-8 cursor-pointer"
                    onMouseEnter={() => onHover(project.id)}
                    onMouseLeave={() => onHover(null)}
                    onClick={() => window.open(project.url, '_blank')}
                >
                    {/* Index number */}
                    <span className={`text-[9px] font-mono opacity-20 transition-opacity duration-500 tracking-[0.3em] ${activeId === project.id ? 'opacity-60' : 'group-hover:opacity-40'}`}>
                        {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className={`text-[11px] tracking-[0.3em] uppercase font-['JetBrains_Mono'] transition-all duration-500 leading-none
            ${activeId === project.id ? 'text-[#22d3ee] opacity-100 -translate-x-2' : 'opacity-30 group-hover:opacity-60 group-hover:text-[#22d3ee]'}`}>
                        {project.name}
                    </span>

                    <div
                        className={`w-1.5 h-1.5 rounded-full border border-white/40 transition-all duration-500 
            ${activeId === project.id ? 'bg-[#22d3ee] border-[#22d3ee] shadow-[0_0_8px_#22d3ee] scale-150' : 'bg-transparent'}`}
                    />
                </div>
            ))}
        </motion.div>
    );
}
