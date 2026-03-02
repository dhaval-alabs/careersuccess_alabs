'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { ComparisonTableProps } from '@/components/public/sections/ComparisonTable';

interface ComparisonTableFormProps {
    data: Partial<ComparisonTableProps>;
    onChange: (data: Partial<ComparisonTableProps>) => void;
}

export function ComparisonTableForm({ data, onChange }: ComparisonTableFormProps) {
    const features = data.features || [];

    const handleFeatureChange = (index: number, field: string, value: any) => {
        const newFeatures = [...features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        onChange({ ...data, features: newFeatures });
    };

    const addFeature = () => {
        onChange({ ...data, features: [...features, { label: '', this_course: true, others: false }] });
    };

    const removeFeature = (index: number) => {
        const newFeatures = features.filter((_, i) => i !== index);
        onChange({ ...data, features: newFeatures });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Eyebrow Label</Label>
                    <Input
                        value={data.eyebrow_label || ''}
                        onChange={(e) => onChange({ ...data, eyebrow_label: e.target.value })}
                        placeholder="e.g. WHY CHOOSE US"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Headline</Label>
                    <Input
                        value={data.headline || ''}
                        onChange={(e) => onChange({ ...data, headline: e.target.value })}
                        placeholder="e.g. The AnalytixLabs Advantage"
                    />
                </div>
            </div>

            <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium">Comparison Features</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                        <Plus className="h-4 w-4 mr-2" /> Add Feature
                    </Button>
                </div>

                {features.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 border border-dashed rounded-lg">
                        No features added yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {features.map((feature, index) => (
                            <div key={index} className="flex gap-4 items-center bg-slate-50 p-4 rounded-md border group">
                                <div className="cursor-grab text-slate-400 opacity-50 hover:opacity-100">
                                    <GripVertical className="h-5 w-5" />
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="md:col-span-6">
                                        <Label className="text-xs text-slate-500 mb-1 block">Feature Label</Label>
                                        <Input
                                            value={feature.label || ''}
                                            onChange={(e) => handleFeatureChange(index, 'label', e.target.value)}
                                            placeholder="e.g. 1-on-1 Mentorship"
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <Label className="text-xs text-slate-500 mb-1 block text-center">This Course</Label>
                                        <div className="flex items-center justify-center h-10 border rounded-md bg-white">
                                            <input
                                                type="checkbox"
                                                checked={feature.this_course}
                                                onChange={(e) => handleFeatureChange(index, 'this_course', e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 text-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-3">
                                        <Label className="text-xs text-slate-500 mb-1 block text-center">Others</Label>
                                        <div className="flex items-center justify-center h-10 border rounded-md bg-white">
                                            <input
                                                type="checkbox"
                                                checked={feature.others}
                                                onChange={(e) => handleFeatureChange(index, 'others', e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 text-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFeature(index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
