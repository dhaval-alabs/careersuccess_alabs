'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { TracksFeesProps } from '@/components/public/sections/TracksFees';

interface TracksFeesFormProps {
    data: Partial<TracksFeesProps>;
    onChange: (data: Partial<TracksFeesProps>) => void;
}

export function TracksFeesForm({ data, onChange }: TracksFeesFormProps) {
    const defaultData = {
        eyebrow_label: data.eyebrow_label || '',
        headline: data.headline || '',
        description: data.description || '',
        certification_track: data.certification_track || {
            title: '',
            monthly_emi: '',
            total_fee: '',
            features: [],
            cta: { label: '', url: '' }
        },
        job_guarantee_track: data.job_guarantee_track || {
            title: '',
            monthly_emi: '',
            total_fee: '',
            features: [],
            cta: { label: '', url: '' },
            highlight_label: ''
        }
    };

    const handleTrackChange = (trackName: 'certification_track' | 'job_guarantee_track', field: string, value: any) => {
        onChange({
            ...defaultData,
            [trackName]: {
                ...defaultData[trackName],
                [field]: value
            }
        });
    };

    const handleTrackFeaturesChange = (trackName: 'certification_track' | 'job_guarantee_track', featuresString: string) => {
        const featuresArray = featuresString.split('\n').map(s => s.trim()).filter(Boolean);
        handleTrackChange(trackName, 'features', featuresArray);
    };

    return (
        <div className="space-y-8">
            {/* Header Content */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Header Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Eyebrow Label</Label>
                        <Input
                            value={defaultData.eyebrow_label}
                            onChange={(e) => onChange({ ...defaultData, eyebrow_label: e.target.value })}
                            placeholder="e.g. OPTIONS TAILORED FOR YOU"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Headline</Label>
                        <Input
                            value={defaultData.headline}
                            onChange={(e) => onChange({ ...defaultData, headline: e.target.value })}
                            placeholder="e.g. Flexible Tracks & Fees"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        value={defaultData.description}
                        onChange={(e) => onChange({ ...defaultData, description: e.target.value })}
                        placeholder="Choose the learning track that fits your career goals..."
                        rows={2}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Certification Track */}
                <div className="space-y-4 bg-slate-50 p-5 rounded-xl border">
                    <h3 className="font-semibold text-base text-slate-800">Track 1: Certification Track</h3>

                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                            value={defaultData.certification_track.title}
                            onChange={(e) => handleTrackChange('certification_track', 'title', e.target.value)}
                            placeholder="e.g. Professional Certification"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Monthly EMI</Label>
                            <Input
                                value={defaultData.certification_track.monthly_emi}
                                onChange={(e) => handleTrackChange('certification_track', 'monthly_emi', e.target.value)}
                                placeholder="e.g. ₹4,999/mo"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Total Fee</Label>
                            <Input
                                value={defaultData.certification_track.total_fee}
                                onChange={(e) => handleTrackChange('certification_track', 'total_fee', e.target.value)}
                                placeholder="e.g. ₹35,000 + GST"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Features (One per line)</Label>
                        <Textarea
                            value={(defaultData.certification_track.features || []).join('\n')}
                            onChange={(e) => handleTrackFeaturesChange('certification_track', e.target.value)}
                            rows={5}
                            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                            <Label>CTA Label</Label>
                            <Input
                                value={defaultData.certification_track.cta?.label || ''}
                                onChange={(e) => handleTrackChange('certification_track', 'cta', { ...defaultData.certification_track.cta, label: e.target.value })}
                                placeholder="Apply Now"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>CTA URL</Label>
                            <Input
                                value={defaultData.certification_track.cta?.url || ''}
                                onChange={(e) => handleTrackChange('certification_track', 'cta', { ...defaultData.certification_track.cta, url: e.target.value })}
                                placeholder="#enroll"
                            />
                        </div>
                    </div>
                </div>

                {/* Job Guarantee Track */}
                <div className="space-y-4 bg-blue-50/50 p-5 rounded-xl border border-blue-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg">
                        Premium Track
                    </div>
                    <h3 className="font-semibold text-base text-slate-800">Track 2: Job Guarantee Track</h3>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label>Highlight Label (Badge)</Label>
                            <Input
                                value={defaultData.job_guarantee_track.highlight_label || ''}
                                onChange={(e) => handleTrackChange('job_guarantee_track', 'highlight_label', e.target.value)}
                                placeholder="e.g. MOST POPULAR"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                value={defaultData.job_guarantee_track.title}
                                onChange={(e) => handleTrackChange('job_guarantee_track', 'title', e.target.value)}
                                placeholder="e.g. Job Guarantee Program"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Monthly EMI</Label>
                            <Input
                                value={defaultData.job_guarantee_track.monthly_emi}
                                onChange={(e) => handleTrackChange('job_guarantee_track', 'monthly_emi', e.target.value)}
                                placeholder="e.g. ₹9,999/mo"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Total Fee</Label>
                            <Input
                                value={defaultData.job_guarantee_track.total_fee}
                                onChange={(e) => handleTrackChange('job_guarantee_track', 'total_fee', e.target.value)}
                                placeholder="e.g. ₹65,000 + GST"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Features (One per line)</Label>
                        <Textarea
                            value={(defaultData.job_guarantee_track.features || []).join('\n')}
                            onChange={(e) => handleTrackFeaturesChange('job_guarantee_track', e.target.value)}
                            rows={5}
                            placeholder="Everything in Certification +&#10;100% Job Guarantee&#10;Mock Interviews"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                            <Label>CTA Label</Label>
                            <Input
                                value={defaultData.job_guarantee_track.cta?.label || ''}
                                onChange={(e) => handleTrackChange('job_guarantee_track', 'cta', { ...defaultData.job_guarantee_track.cta, label: e.target.value })}
                                placeholder="Apply for Job Guarantee"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>CTA URL</Label>
                            <Input
                                value={defaultData.job_guarantee_track.cta?.url || ''}
                                onChange={(e) => handleTrackChange('job_guarantee_track', 'cta', { ...defaultData.job_guarantee_track.cta, url: e.target.value })}
                                placeholder="#enroll"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
