'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { LearningModesProps } from '@/components/public/sections/LearningModes';

interface LearningModesFormProps {
    data: Partial<LearningModesProps>;
    onChange: (data: Partial<LearningModesProps>) => void;
}

export function LearningModesForm({ data, onChange }: LearningModesFormProps) {
    const defaultData = {
        headline: data.headline || '',
        description: data.description || '',
        modes: data.modes || []
    };

    const handleModeChange = (index: number, field: string, value: any) => {
        const newModes = [...defaultData.modes];
        newModes[index] = { ...newModes[index], [field]: value };
        onChange({ ...defaultData, modes: newModes });
    };

    const handleFeaturesChange = (index: number, featuresString: string) => {
        const featuresArray = featuresString.split('\n').map(s => s.trim()).filter(Boolean);
        handleModeChange(index, 'features', featuresArray);
    };

    const addMode = () => {
        onChange({
            ...defaultData,
            modes: [...defaultData.modes, { title: '', icon: '', description: '', features: [] }]
        });
    };

    const removeMode = (index: number) => {
        const newModes = defaultData.modes.filter((_, i) => i !== index);
        onChange({ ...defaultData, modes: newModes });
    };

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Header Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Headline</Label>
                        <Input
                            value={defaultData.headline}
                            onChange={(e) => onChange({ ...defaultData, headline: e.target.value })}
                            placeholder="e.g. Choose Your Mode of Learning"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={defaultData.description}
                            onChange={(e) => onChange({ ...defaultData, description: e.target.value })}
                            placeholder="Multiple delivery formats tailored to your schedule..."
                            rows={2}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4 border-t pt-6">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Delivery Modes</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addMode}>
                        <Plus className="h-4 w-4 mr-2" /> Add Mode
                    </Button>
                </div>

                {defaultData.modes.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 border border-dashed rounded-lg">
                        No learning modes added yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {defaultData.modes.map((mode, index) => (
                            <div key={index} className="bg-white p-5 rounded-xl border shadow-sm relative group">
                                <div className="absolute top-2 right-2 flex gap-1 bg-white rounded-md shadow-sm border opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="p-1.5 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600">
                                        <GripVertical className="h-4 w-4" />
                                    </div>
                                    <div
                                        className="p-1.5 cursor-pointer text-red-400 hover:text-red-600 border-l"
                                        onClick={() => removeMode(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </div>
                                </div>

                                <div className="space-y-5 pt-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Mode Title</Label>
                                            <Input
                                                value={mode.title || ''}
                                                onChange={(e) => handleModeChange(index, 'title', e.target.value)}
                                                placeholder="e.g. Classroom Bootcamps"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Icon SVG Path / Class</Label>
                                            <Input
                                                value={mode.icon || ''}
                                                onChange={(e) => handleModeChange(index, 'icon', e.target.value)}
                                                placeholder="Not yet active in rendering"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Short Description</Label>
                                        <Textarea
                                            value={mode.description || ''}
                                            onChange={(e) => handleModeChange(index, 'description', e.target.value)}
                                            placeholder="Learn in-person..."
                                            rows={2}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Features (One per line)</Label>
                                        <Textarea
                                            value={(mode.features || []).join('\n')}
                                            onChange={(e) => handleFeaturesChange(index, e.target.value)}
                                            placeholder="Weekend classes&#10;In-person mentoring"
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
