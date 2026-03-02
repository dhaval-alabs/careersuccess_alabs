'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { HeroBannerProps } from '@/components/public/sections/HeroBanner';

interface HeroFormProps {
    data: Partial<HeroBannerProps>;
    onChange: (data: Partial<HeroBannerProps>) => void;
}

export function HeroForm({ data, onChange }: HeroFormProps) {
    const handleChange = (field: keyof HeroBannerProps, value: any) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Eyebrow Label</Label>
                    <Input
                        value={data.eyebrow_label || ''}
                        onChange={(e) => handleChange('eyebrow_label', e.target.value)}
                        placeholder="e.g. NASSCOM CERTIFIED COURSE"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Headline</Label>
                    <Input
                        value={data.headline || ''}
                        onChange={(e) => handleChange('headline', e.target.value)}
                        placeholder="e.g. Future-Proof Your Career"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    value={data.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Brief course description..."
                    rows={4}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label>Stat 1 Value</Label>
                    <Input
                        value={data.stat1_value || ''}
                        onChange={(e) => handleChange('stat1_value', e.target.value)}
                        placeholder="e.g. 15,000+"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Stat 1 Label</Label>
                    <Input
                        value={data.stat1_label || ''}
                        onChange={(e) => handleChange('stat1_label', e.target.value)}
                        placeholder="e.g. Students Placed"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Alumni Brand Image URL</Label>
                    <Input
                        value={data.alumni_image || ''}
                        onChange={(e) => handleChange('alumni_image', e.target.value)}
                        placeholder="https://..."
                    />
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
                        placeholder="#syllabus"
                    />
                </div>
            </div>
        </div>
    );
}
