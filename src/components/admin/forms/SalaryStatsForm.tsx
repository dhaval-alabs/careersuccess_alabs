'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { SalaryStatsProps } from '@/components/public/sections/SalaryStats';

interface SalaryStatsFormProps {
    data: Partial<SalaryStatsProps>;
    onChange: (data: Partial<SalaryStatsProps>) => void;
}

export function SalaryStatsForm({ data, onChange }: SalaryStatsFormProps) {
    const salaryLevels = data.salary_levels || [];
    const stats = data.stats || [];

    const handleLevelChange = (index: number, field: string, value: any) => {
        const newLevels = [...salaryLevels];
        newLevels[index] = { ...newLevels[index], [field]: value };
        onChange({ ...data, salary_levels: newLevels });
    };

    const addLevel = () => {
        onChange({ ...data, salary_levels: [...salaryLevels, { label: '', percentage: 0, amount: '' }] });
    };

    const removeLevel = (index: number) => {
        const newLevels = salaryLevels.filter((_, i) => i !== index);
        onChange({ ...data, salary_levels: newLevels });
    };

    const handleStatChange = (index: number, field: string, value: any) => {
        const newStats = [...stats];
        newStats[index] = { ...newStats[index], [field]: value };
        onChange({ ...data, stats: newStats });
    };

    const addStat = () => {
        onChange({ ...data, stats: [...stats, { big_text: '', small_text: '' }] });
    };

    const removeStat = (index: number) => {
        const newStats = stats.filter((_, i) => i !== index);
        onChange({ ...data, stats: newStats });
    };

    return (
        <div className="space-y-8">
            <div className="space-y-4 border-b pb-6">
                <h3 className="font-semibold text-lg">Header</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Section Label</Label>
                        <Input
                            value={data.section_label || ''}
                            onChange={(e) => onChange({ ...data, section_label: e.target.value })}
                            placeholder="e.g. Earning Potential"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Headline</Label>
                        <Input
                            value={data.headline || ''}
                            onChange={(e) => onChange({ ...data, headline: e.target.value })}
                            placeholder="e.g. Skills That Pay More"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        value={data.description || ''}
                        onChange={(e) => onChange({ ...data, description: e.target.value })}
                        placeholder="Description..."
                        rows={2}
                    />
                </div>
            </div>

            <div className="space-y-4 border-b pb-6">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Salary Levels</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addLevel}>
                        <Plus className="h-4 w-4 mr-2" /> Add Level
                    </Button>
                </div>

                <div className="space-y-4">
                    {salaryLevels.map((level, index) => (
                        <div key={index} className="flex gap-4 items-start bg-slate-50 p-4 rounded-md border">
                            <div className="cursor-grab text-slate-400 mt-2 opacity-50 hover:opacity-100">
                                <GripVertical className="h-5 w-5" />
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500">Label</Label>
                                    <Input
                                        value={level.label || ''}
                                        onChange={(e) => handleLevelChange(index, 'label', e.target.value)}
                                        placeholder="e.g. Entry Level"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500">Percentage (0-100)</Label>
                                    <Input
                                        type="number"
                                        value={level.percentage || 0}
                                        onChange={(e) => handleLevelChange(index, 'percentage', parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500">Amount</Label>
                                    <Input
                                        value={level.amount || ''}
                                        onChange={(e) => handleLevelChange(index, 'amount', e.target.value)}
                                        placeholder="e.g. ~₹6 LPA"
                                    />
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeLevel(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 border-b pb-6">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Key Statistics</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addStat}>
                        <Plus className="h-4 w-4 mr-2" /> Add Stat
                    </Button>
                </div>

                <div className="space-y-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex gap-4 items-start bg-slate-50 p-4 rounded-md border">
                            <div className="cursor-grab text-slate-400 mt-2 opacity-50 hover:opacity-100">
                                <GripVertical className="h-5 w-5" />
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500">Big Text Value</Label>
                                    <Input
                                        value={stat.big_text || ''}
                                        onChange={(e) => handleStatChange(index, 'big_text', e.target.value)}
                                        placeholder="e.g. 20–30%"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500">Small Text Label</Label>
                                    <Input
                                        value={stat.small_text || ''}
                                        onChange={(e) => handleStatChange(index, 'small_text', e.target.value)}
                                        placeholder="e.g. Higher salary..."
                                    />
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeStat(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Certification Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Certification Title</Label>
                        <Input
                            value={data.cert_title || ''}
                            onChange={(e) => onChange({ ...data, cert_title: e.target.value })}
                            placeholder="e.g. Dual Certification"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Certification Description</Label>
                        <Input
                            value={data.cert_desc || ''}
                            onChange={(e) => onChange({ ...data, cert_desc: e.target.value })}
                            placeholder="e.g. Backed by Gov..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
