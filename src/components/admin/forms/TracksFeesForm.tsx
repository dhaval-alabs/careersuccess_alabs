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
    const tracks = data.tracks || [];
    const guarantee = data.guarantee || { icon: '', title: '', description: '', cta_label: '', cta_url: '' };

    const handleTrackChange = (index: number, field: string, value: any) => {
        const newTracks = [...tracks];
        newTracks[index] = { ...newTracks[index], [field]: value };
        onChange({ ...data, tracks: newTracks });
    };

    const addTrack = () => {
        onChange({
            ...data,
            tracks: [
                ...tracks,
                { style: 'primary', label: '', title: '', description: '', price: '', price_note: '', cta_label: '', cta_url: '' }
            ]
        });
    };

    const removeTrack = (index: number) => {
        const newTracks = tracks.filter((_, i) => i !== index);
        onChange({ ...data, tracks: newTracks });
    };

    const handleGuaranteeChange = (field: string, value: any) => {
        onChange({ ...data, guarantee: { ...guarantee, [field]: value } });
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
                            placeholder="e.g. Choose Your Path"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Headline</Label>
                        <Input
                            value={data.headline || ''}
                            onChange={(e) => onChange({ ...data, headline: e.target.value })}
                            placeholder="e.g. Pick the Track That Matches Your Ambition"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        value={data.description || ''}
                        onChange={(e) => onChange({ ...data, description: e.target.value })}
                        placeholder="Most working professionals go for..."
                        rows={2}
                    />
                </div>
            </div>

            <div className="space-y-4 border-b pb-6">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Tracks</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addTrack}>
                        <Plus className="h-4 w-4 mr-2" /> Add Track
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tracks.map((track, index) => (
                        <div key={index} className={`space-y-4 p-5 rounded-xl border relative ${track.style === 'primary' ? 'bg-slate-50' : 'bg-blue-50 border-blue-200'}`}>
                            <div className="absolute top-2 right-2 flex gap-1 bg-white rounded-md shadow-sm border opacity-50 hover:opacity-100 transition-opacity">
                                <div className="p-1.5 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600">
                                    <GripVertical className="h-4 w-4" />
                                </div>
                                <div
                                    className="p-1.5 cursor-pointer text-red-400 hover:text-red-600 border-l"
                                    onClick={() => removeTrack(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Style</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={track.style || 'primary'}
                                        onChange={(e) => handleTrackChange(index, 'style', e.target.value)}
                                    >
                                        <option value="primary">Primary (Standard)</option>
                                        <option value="secondary">Secondary (Highlighted)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Small Label (Badge)</Label>
                                    <Input
                                        value={track.label || ''}
                                        onChange={(e) => handleTrackChange(index, 'label', e.target.value)}
                                        placeholder="e.g. Track 1"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={track.title || ''}
                                    onChange={(e) => handleTrackChange(index, 'title', e.target.value)}
                                    placeholder="e.g. Core Data Analytics"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={track.description || ''}
                                    onChange={(e) => handleTrackChange(index, 'description', e.target.value)}
                                    rows={3}
                                    placeholder="The complete foundation..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Price</Label>
                                    <Input
                                        value={track.price || ''}
                                        onChange={(e) => handleTrackChange(index, 'price', e.target.value)}
                                        placeholder="e.g. ₹52,000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Price Note</Label>
                                    <Input
                                        value={track.price_note || ''}
                                        onChange={(e) => handleTrackChange(index, 'price_note', e.target.value)}
                                        placeholder="e.g. + GST  ·  6 months"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>CTA Label</Label>
                                    <Input
                                        value={track.cta_label || ''}
                                        onChange={(e) => handleTrackChange(index, 'cta_label', e.target.value)}
                                        placeholder="Start with Core →"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>CTA URL</Label>
                                    <Input
                                        value={track.cta_url || ''}
                                        onChange={(e) => handleTrackChange(index, 'cta_url', e.target.value)}
                                        placeholder="#enroll"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 border-b pb-6">
                <h3 className="font-semibold text-lg">Guarantee Box</h3>
                <div className="grid grid-cols-1 gap-4 p-5 rounded-xl border bg-green-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Icon / Emoji</Label>
                            <Input
                                value={guarantee.icon || ''}
                                onChange={(e) => handleGuaranteeChange('icon', e.target.value)}
                                placeholder="e.g. 🛡️"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                value={guarantee.title || ''}
                                onChange={(e) => handleGuaranteeChange('title', e.target.value)}
                                placeholder="e.g. We Back It With a Real Guarantee"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={guarantee.description || ''}
                            onChange={(e) => handleGuaranteeChange('description', e.target.value)}
                            rows={2}
                            placeholder="If you complete the program..."
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>CTA Label</Label>
                            <Input
                                value={guarantee.cta_label || ''}
                                onChange={(e) => handleGuaranteeChange('cta_label', e.target.value)}
                                placeholder="Claim Your Seat →"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>CTA URL</Label>
                            <Input
                                value={guarantee.cta_url || ''}
                                onChange={(e) => handleGuaranteeChange('cta_url', e.target.value)}
                                placeholder="#enroll"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
