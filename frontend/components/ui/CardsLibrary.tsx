import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Progress } from './Progress';
import { PlayCircle, ArrowRight, Activity, Cpu, Radio, Shield, Server, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LessonCard: React.FC<{ title: string; type: string; duration: string; completed?: boolean; onClick?: () => void }> = ({
  title,
  type,
  duration,
  completed = false,
  onClick,
}) => (
  <Card interactive glowColor={completed ? 'emerald' : 'cyan'} onClick={onClick} className="p-4 flex items-center justify-between">
    <div>
      <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
      <div className="flex items-center gap-2">
        <Badge variant={completed ? 'emerald' : 'cyan'}>{type}</Badge>
        <span className="text-[10px] font-mono text-zinc-500">{duration}</span>
      </div>
    </div>
    <Button variant={completed ? 'secondary' : 'cyan'} size="sm" leftIcon={<PlayCircle className="w-4 h-4" />}>
      {completed ? 'Review' : 'Start'}
    </Button>
  </Card>
);

export const CourseCard: React.FC<{ title: string; level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'; desc: string; progress?: number }> = ({
  title,
  level,
  desc,
  progress = 0,
}) => (
  <Card interactive glowColor="cyan" className="p-6 flex flex-col justify-between h-full">
    <div>
      <Badge variant={level === 'BEGINNER' ? 'cyan' : level === 'INTERMEDIATE' ? 'purple' : 'rose'} className="mb-3">
        {level}
      </Badge>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-zinc-400 leading-relaxed mb-4">{desc}</p>
    </div>
    <div>
      {progress > 0 && <Progress value={progress} label="Progress" className="mb-4" />}
      <Button variant="cyan" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />} className="w-full">
        {progress > 0 ? 'Continue' : 'Start Pathway'}
      </Button>
    </div>
  </Card>
);

export const StatCard: React.FC<{ title: string; value: string; detail: string; icon: React.ReactNode }> = ({
  title,
  value,
  detail,
  icon,
}) => (
  <Card className="p-6 flex items-center gap-4">
    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <span className="text-2xl font-extrabold text-white font-mono block">{value}</span>
      <span className="text-xs font-bold text-zinc-200">{title}</span>
      <span className="text-[10px] text-zinc-500 block">{detail}</span>
    </div>
  </Card>
);
