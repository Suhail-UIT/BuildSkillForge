import React from 'react';
import { MapPin, Calendar, Users, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { Project } from '../types/index.js';

interface ProjectCardProps {
  project: Project;
  onSelect: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">ACCEPTING APPLICANTS</span>;
      case 'ACTIVE':
        return <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">IN PROGRESS</span>;
      case 'COMPLETED':
        return <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">COMPLETED</span>;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => onSelect(project._id)}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:border-orange-400/80 hover:shadow-md transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
    >
      <div>
        {/* Top business row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src={project.businessLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${project.businessName}`}
              alt={project.businessName}
              className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {project.businessName}
                </span>
                <ShieldCheck className="h-3.5 w-3.5 text-orange-500" />
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" />
                  {project.location}
                </span>
                <span>·</span>
                <span className="font-medium text-orange-600 dark:text-orange-400">{project.projectType}</span>
              </div>
            </div>
          </div>
          {getStatusBadge(project.status)}
        </div>

        {/* Title & Description */}
        <div className="mt-3.5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-orange-500 transition-colors">
            {project.title}
          </h3>
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Required Skills */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {project.requiredSkills.slice(0, 4).map((sk, idx) => (
            <span
              key={idx}
              className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {sk}
            </span>
          ))}
          {project.requiredSkills.length > 4 && (
            <span className="rounded-lg bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-slate-850">
              +{project.requiredSkills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Budget & Action Bar */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            Student Payout (Net)
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              ₹{project.studentAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[10.5px] text-slate-400">
              (Total: ₹{project.budget.toLocaleString('en-IN')})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1 justify-end">
              <Clock className="h-3 w-3" />
              <span>Due {project.deadline}</span>
            </div>
            <div className="flex items-center gap-1 justify-end text-[10px] text-slate-400">
              <Users className="h-3 w-3" />
              <span>{project.applicationsCount || 0} applicants</span>
            </div>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white dark:bg-orange-950/40 dark:text-orange-400 dark:group-hover:bg-orange-600 dark:group-hover:text-white transition-all">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
