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
        onChange({ ...data, terms: [...terms, { name: '', duration: '', description: '', tools: [] }] });
    };

    const removeTerm = (index: number) => {
        const newTerms = terms.filter((_, i) => i !== index);
        onChange({ ...data, terms: newTerms });
    };

    const handleToolsChange = (termIndex: number, toolsString: string) => {
        // Convert comma separated string to objects \{ label, is_ai_tag \}
        const toolsArray = toolsString
            .split(',')
            .map(s => s.trim())
            .filter(s => s !== '')
            .map(s => ({
                label: s.replace('★', '').trim(),
                is_ai_tag: s.includes('★')
            }));
        handleTermChange(termIndex, 'tools', toolsArray);
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
                                            <Label className="text-xs text-slate-500">Term Name</Label>
                                            <Input
                                                value={term.name || ''}
                                                onChange={(e) => handleTermChange(index, 'name', e.target.value)}
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
                                        <Label className="text-xs text-slate-500">Tools (Comma separated. Add ★ for AI tag)</Label>
                                        <Input
                                            value={(term.tools || []).map(t => t.is_ai_tag ? `${t.label} ★` : t.label).join(', ')}
                                            onChange={(e) => handleToolsChange(index, e.target.value)}
                                            placeholder="e.g. Python, SQL, GenAI ★"
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
        </div>
    );
}
