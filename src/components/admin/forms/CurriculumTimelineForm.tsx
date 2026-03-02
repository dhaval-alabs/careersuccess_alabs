'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { CurriculumTimelineProps } from '@/components/public/sections/CurriculumTimeline';

interface CurriculumTimelineFormProps {
    data: Partial<CurriculumTimelineProps>;
    onChange: (data: Partial<CurriculumTimelineProps>) => void;
}

export function CurriculumTimelineForm({ data, onChange }: CurriculumTimelineFormProps) {
    const terms = data.terms || [];

    const handleTermChange = (index: number, field: string, value: any) => {
        const newTerms = [...terms];
        newTerms[index] = { ...newTerms[index], [field]: value };
        onChange({ ...data, terms: newTerms });
    };

    const addTerm = () => {
        onChange({ ...data, terms: [...terms, { title: '', duration: '', description: '', core_skills: [] }] });
    };

    const removeTerm = (index: number) => {
        const newTerms = terms.filter((_, i) => i !== index);
        onChange({ ...data, terms: newTerms });
    };

    const handleSkillsChange = (termIndex: number, skillsString: string) => {
        const skillsArray = skillsString.split(',').map(s => s.trim()).filter(s => s !== '');
        handleTermChange(termIndex, 'core_skills', skillsArray);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Headline</Label>
                    <Input
                        value={data.headline || ''}
                        onChange={(e) => onChange({ ...data, headline: e.target.value })}
                        placeholder="e.g. Master the Complete Data Stack"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                        value={data.description || ''}
                        onChange={(e) => onChange({ ...data, description: e.target.value })}
                        placeholder="A progressive 6-month journey..."
                    />
                </div>
            </div>

            <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium">Curriculum Terms/Modules</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addTerm}>
                        <Plus className="h-4 w-4 mr-2" /> Add Term
                    </Button>
                </div>

                {terms.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 border border-dashed rounded-lg">
                        No modules added yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {terms.map((term, index) => (
                            <div key={index} className="flex gap-4 items-start bg-slate-50 p-4 rounded-md border">
                                <div className="cursor-grab text-slate-400 opacity-50 hover:opacity-100 mt-2">
                                    <GripVertical className="h-5 w-5" />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-slate-500">Term Title</Label>
                                            <Input
                                                value={term.title || ''}
                                                onChange={(e) => handleTermChange(index, 'title', e.target.value)}
                                                placeholder="e.g. Term 1: Foundations"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-slate-500">Duration Tag</Label>
                                            <Input
                                                value={term.duration || ''}
                                                onChange={(e) => handleTermChange(index, 'duration', e.target.value)}
                                                placeholder="e.g. Weeks 1-4"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500">Description</Label>
                                        <Textarea
                                            value={term.description || ''}
                                            onChange={(e) => handleTermChange(index, 'description', e.target.value)}
                                            placeholder="What will students learn?"
                                            rows={2}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500">Core Skills (Comma separated)</Label>
                                        <Input
                                            value={(term.core_skills || []).join(', ')}
                                            onChange={(e) => handleSkillsChange(index, e.target.value)}
                                            placeholder="e.g. Python, SQL, Statistics"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeTerm(index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tools Array string representation for simplicity in CMS right now */}
            <div className="space-y-2 border-t pt-6">
                <Label>Tools Taught (Comma separated URLs for icons)</Label>
                <Textarea
                    value={(data.tools || []).join(',\n')}
                    onChange={(e) => onChange({ ...data, tools: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="https://icon1.png, https://icon2.png"
                    rows={3}
                />
            </div>
        </div>
    );
}
