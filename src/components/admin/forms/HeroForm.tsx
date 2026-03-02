'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { HeroBannerProps } from '@/components/public/sections/HeroBanner';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface HeroFormProps {
    data: Partial<HeroBannerProps>;
    onChange: (data: Partial<HeroBannerProps>) => void;
}

export function HeroForm({ data, onChange }: HeroFormProps) {
    const handleChange = (field: keyof HeroBannerProps, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleStatChange = (index: number, field: string, value: string) => {
        const newStats = [...(data.stats || [])];
        if (!newStats[index]) newStats[index] = { value: '', label: '' };
        newStats[index] = { ...newStats[index], [field]: value };
        handleChange('stats', newStats);
    };

    const addStat = () => {
        const newStats = [...(data.stats || []), { value: '', label: '' }];
        handleChange('stats', newStats);
    };

    const removeStat = (index: number) => {
        const newStats = (data.stats || []).filter((_, i) => i !== index);
        handleChange('stats', newStats);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Badge Text (Eyebrow)</Label>
                    <Input
                        value={data.badge_text || ''}
                        onChange={(e) => handleChange('badge_text', e.target.value)}
                        placeholder="e.g. NASSCOM CERTIFIED COURSE"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Headline</Label>
                    <Input
                        value={data.headline || ''}
                        onChange={(e) => handleChange('headline', e.target.value)}
                        placeholder="e.g. The Last Data Course"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Headline Highlight</Label>
                    <Input
                        value={data.headline_highlight || ''}
                        onChange={(e) => handleChange('headline_highlight', e.target.value)}
                        placeholder="e.g. With AI Built In."
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Subheadline</Label>
                <Textarea
                    value={data.subheadline || ''}
                    onChange={(e) => handleChange('subheadline', e.target.value)}
                    placeholder="Brief course description..."
                    rows={4}
                />
            </div>

            <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                    <Label>Stats</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addStat}>
                        <Plus className="h-4 w-4 mr-2" /> Add Stat
                    </Button>
                </div>
                <div className="space-y-3">
                    {(data.stats || []).map((stat, index) => (
                        <div key={index} className="flex gap-4 items-end">
                            <div className="flex-1 space-y-2">
                                <Label className="text-xs">Stat Value</Label>
                                <Input
                                    value={stat.value || ''}
                                    onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                                    placeholder="e.g. 15,000+"
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label className="text-xs">Stat Label</Label>
                                <Input
                                    value={stat.label || ''}
                                    onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                                    placeholder="e.g. Students Placed"
                                />
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeStat(index)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                    <Label>CTA Primary Label</Label>
                    <Input
                        value={data.cta_primary?.label || ''}
                        onChange={(e) => handleChange('cta_primary', { ...data.cta_primary, label: e.target.value })}
                        placeholder="e.g. Apply Now"
                    />
                </div>
                <div className="space-y-2">
                    <Label>CTA Primary URL</Label>
                    <Input
                        value={data.cta_primary?.url || ''}
                        onChange={(e) => handleChange('cta_primary', { ...data.cta_primary, url: e.target.value })}
                        placeholder="#enroll"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                    <Label>CTA Secondary Label</Label>
                    <Input
                        value={data.cta_secondary?.label || ''}
                        onChange={(e) => handleChange('cta_secondary', { ...data.cta_secondary, label: e.target.value })}
                        placeholder="e.g. Download Syllabus"
                    />
                </div>
                <div className="space-y-2">
                    <Label>CTA Secondary URL</Label>
                    <Input
                        value={data.cta_secondary?.url || ''}
                        onChange={(e) => handleChange('cta_secondary', { ...data.cta_secondary, url: e.target.value })}
                        placeholder="#curriculum"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                    <Label>Form Submit Button Label</Label>
                    <Input
                        value={data.form?.submit_label || ''}
                        onChange={(e) => handleChange('form', { ...data.form, submit_label: e.target.value })}
                        placeholder="e.g. Download Syllabus"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Form Success Message</Label>
                    <Input
                        value={data.form?.success_message || ''}
                        onChange={(e) => handleChange('form', { ...data.form, success_message: e.target.value })}
                        placeholder="e.g. Thank you!"
                    />
                </div>
            </div>
        </div>
    );
}
