'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SalaryStatsProps } from '@/components/public/sections/SalaryStats';

interface SalaryStatsFormProps {
    data: Partial<SalaryStatsProps>;
    onChange: (data: Partial<SalaryStatsProps>) => void;
}

export function SalaryStatsForm({ data, onChange }: SalaryStatsFormProps) {
    const handleLevelsChange = (levelObj: 'freshers' | 'experienced', field: string, value: string) => {
        onChange({
            ...data,
            salary_levels: {
                ...(data.salary_levels || {
                    freshers: { label: 'Freshers (0-2 Yrs)', ctc: '' },
                    experienced: { label: 'Experienced (3+ Yrs)', ctc: '', max_ctc: '' }
                }),
                [levelObj]: {
                    ...(data.salary_levels?.[levelObj] || {}),
                    [field]: value
                }
            }
        });
    };

    const handleStatChange = (statObj: 'hiring_partners' | 'avg_hike' | 'placements', field: string, value: string) => {
        onChange({
            ...data,
            key_stats: {
                ...(data.key_stats || {
                    hiring_partners: { value: '', label: '' },
                    avg_hike: { value: '', label: '' },
                    placements: { value: '', label: '' }
                }),
                [statObj]: {
                    ...(data.key_stats?.[statObj] || {}),
                    [field]: value
                }
            }
        });
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Headline</Label>
                    <Input
                        value={data.headline || ''}
                        onChange={(e) => onChange({ ...data, headline: e.target.value })}
                        placeholder="e.g. Industry Valued Outcomes"
                    />
                </div>
            </div>

            <div className="border-t pt-6 space-y-6">
                <h3 className="font-semibold text-lg">Salary Levels</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Freshers */}
                    <div className="bg-slate-50 p-4 rounded-lg border">
                        <h4 className="font-medium text-sm mb-4 pb-2 border-b">Freshers Level</h4>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs">Category Label</Label>
                                <Input
                                    value={data.salary_levels?.freshers?.label || 'Freshers (0-2 Yrs)'}
                                    onChange={(e) => handleLevelsChange('freshers', 'label', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Average CTC</Label>
                                <Input
                                    value={data.salary_levels?.freshers?.ctc || ''}
                                    onChange={(e) => handleLevelsChange('freshers', 'ctc', e.target.value)}
                                    placeholder="e.g. ₹9.4 LPA"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Experienced */}
                    <div className="bg-slate-50 p-4 rounded-lg border">
                        <h4 className="font-medium text-sm mb-4 pb-2 border-b">Experienced Level</h4>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs">Category Label</Label>
                                <Input
                                    value={data.salary_levels?.experienced?.label || 'Experienced (3+ Yrs)'}
                                    onChange={(e) => handleLevelsChange('experienced', 'label', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label className="text-xs">Average CTC</Label>
                                    <Input
                                        value={data.salary_levels?.experienced?.ctc || ''}
                                        onChange={(e) => handleLevelsChange('experienced', 'ctc', e.target.value)}
                                        placeholder="e.g. ₹15 LPA"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Max CTC</Label>
                                    <Input
                                        value={data.salary_levels?.experienced?.max_ctc || ''}
                                        onChange={(e) => handleLevelsChange('experienced', 'max_ctc', e.target.value)}
                                        placeholder="e.g. ₹32 LPA"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t pt-6 space-y-6">
                <h3 className="font-semibold text-lg">Key Statistics</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Hiring Partners */}
                    <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
                        <h4 className="font-medium text-sm text-slate-500">Stat 1: Hiring Partners</h4>
                        <div className="space-y-2">
                            <Label className="text-xs">Value</Label>
                            <Input
                                value={data.key_stats?.hiring_partners?.value || ''}
                                onChange={(e) => handleStatChange('hiring_partners', 'value', e.target.value)}
                                placeholder="e.g. 500+"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Label</Label>
                            <Input
                                value={data.key_stats?.hiring_partners?.label || ''}
                                onChange={(e) => handleStatChange('hiring_partners', 'label', e.target.value)}
                                placeholder="e.g. Hiring Partners"
                            />
                        </div>
                    </div>

                    {/* Avg Hike */}
                    <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
                        <h4 className="font-medium text-sm text-slate-500">Stat 2: Avg Hike</h4>
                        <div className="space-y-2">
                            <Label className="text-xs">Value</Label>
                            <Input
                                value={data.key_stats?.avg_hike?.value || ''}
                                onChange={(e) => handleStatChange('avg_hike', 'value', e.target.value)}
                                placeholder="e.g. 65%"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Label</Label>
                            <Input
                                value={data.key_stats?.avg_hike?.label || ''}
                                onChange={(e) => handleStatChange('avg_hike', 'label', e.target.value)}
                                placeholder="e.g. Avg. Salary Hike"
                            />
                        </div>
                    </div>

                    {/* Placements */}
                    <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
                        <h4 className="font-medium text-sm text-slate-500">Stat 3: Placements</h4>
                        <div className="space-y-2">
                            <Label className="text-xs">Value</Label>
                            <Input
                                value={data.key_stats?.placements?.value || ''}
                                onChange={(e) => handleStatChange('placements', 'value', e.target.value)}
                                placeholder="e.g. 15,000+"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Label</Label>
                            <Input
                                value={data.key_stats?.placements?.label || ''}
                                onChange={(e) => handleStatChange('placements', 'label', e.target.value)}
                                placeholder="e.g. Successful Placements"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
