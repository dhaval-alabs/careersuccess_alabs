'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { TrustStripProps } from '@/components/public/sections/TrustStrip';

interface TrustStripFormProps {
    data: Partial<TrustStripProps>;
    onChange: (data: Partial<TrustStripProps>) => void;
}

export function TrustStripForm({ data, onChange }: TrustStripFormProps) {
    const items = data.items || [];

    const handleAddItem = () => {
        onChange({ ...data, items: [...items, { label: '', value: '' }] });
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        onChange({ ...data, items: newItems });
    };

    const handleItemChange = (index: number, field: 'label' | 'value', value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        onChange({ ...data, items: newItems });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
                <h3 className="text-sm font-medium text-slate-900">Stat Items ({items.length}/4 Recommended)</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                    <Plus className="h-4 w-4 mr-2" /> Add Stat
                </Button>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-8 text-slate-500 border border-dashed rounded-lg">
                    No stats added yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div key={index} className="flex gap-3 items-center bg-slate-50 p-3 rounded-md border group">
                            <div className="cursor-grab active:cursor-grabbing text-slate-400 opacity-50 hover:opacity-100">
                                <GripVertical className="h-5 w-5" />
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <Label className="text-xs mb-1 block text-slate-500">Value</Label>
                                    <Input
                                        value={item.value}
                                        onChange={(e) => handleItemChange(index, 'value', e.target.value)}
                                        placeholder="e.g. 1.5 Lakh+"
                                        className="h-8"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs mb-1 block text-slate-500">Label</Label>
                                    <Input
                                        value={item.label}
                                        onChange={(e) => handleItemChange(index, 'label', e.target.value)}
                                        placeholder="e.g. Enrolled Students"
                                        className="h-8"
                                    />
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
