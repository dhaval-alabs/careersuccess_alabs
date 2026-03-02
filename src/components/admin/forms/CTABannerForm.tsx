'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CTABannerProps } from '@/components/public/sections/CTABanner';

interface CTABannerFormProps {
    data: Partial<CTABannerProps>;
    onChange: (data: Partial<CTABannerProps>) => void;
}

export function CTABannerForm({ data, onChange }: CTABannerFormProps) {
    const handleCtaChange = (ctaType: 'cta_primary' | 'cta_secondary', field: string, value: string) => {
        onChange({
            ...data,
            [ctaType]: {
                ...(data[ctaType] || { label: '', url: '' }),
                [field]: value
            }
        });
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Section Label (Eyebrow)</Label>
                    <Input
                        value={data.section_label || ''}
                        onChange={(e) => onChange({ ...data, section_label: e.target.value })}
                        placeholder="e.g. READY TO START?"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Headline</Label>
                    <Input
                        value={data.headline || ''}
                        onChange={(e) => onChange({ ...data, headline: e.target.value })}
                        placeholder="e.g. Take the First Step Towards..."
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    value={data.description || ''}
                    onChange={(e) => onChange({ ...data, description: e.target.value })}
                    placeholder="Brief description to encourage the user..."
                    rows={2}
                />
            </div>

            <div className="border-t pt-6 space-y-6">
                <h3 className="font-semibold text-lg">Call to Action Buttons</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary CTA */}
                    <div className="bg-slate-50 p-4 rounded-lg border space-y-4">
                        <h4 className="font-medium text-sm text-primary">Primary Button</h4>
                        <div className="space-y-2">
                            <Label className="text-xs">Label</Label>
                            <Input
                                value={data.cta_primary?.label || ''}
                                onChange={(e) => handleCtaChange('cta_primary', 'label', e.target.value)}
                                placeholder="e.g. Apply Now"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Target URL</Label>
                            <Input
                                value={data.cta_primary?.url || ''}
                                onChange={(e) => handleCtaChange('cta_primary', 'url', e.target.value)}
                                placeholder="e.g. #enroll"
                            />
                        </div>
                    </div>

                    {/* Secondary CTA */}
                    <div className="bg-slate-50 p-4 rounded-lg border space-y-4">
                        <h4 className="font-medium text-sm text-slate-600">Secondary Button (Optional)</h4>
                        <div className="space-y-2">
                            <Label className="text-xs">Label</Label>
                            <Input
                                value={data.cta_secondary?.label || ''}
                                onChange={(e) => handleCtaChange('cta_secondary', 'label', e.target.value)}
                                placeholder="e.g. Download Brochure"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Target URL</Label>
                            <Input
                                value={data.cta_secondary?.url || ''}
                                onChange={(e) => handleCtaChange('cta_secondary', 'url', e.target.value)}
                                placeholder="e.g. /brochure.pdf"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
