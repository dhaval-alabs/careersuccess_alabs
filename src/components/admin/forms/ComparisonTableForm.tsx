'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { ComparisonTableProps } from '@/components/public/sections/ComparisonTable';
import { Textarea } from '@/components/ui/textarea';

interface ComparisonTableFormProps {
    data: Partial<ComparisonTableProps>;
    onChange: (data: Partial<ComparisonTableProps>) => void;
}

export function ComparisonTableForm({ data, onChange }: ComparisonTableFormProps) {
    const rows = data.rows || [];

    const handleRowChange = (index: number, field: string, value: any) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        onChange({ ...data, rows: newRows });
    };

    const addRow = () => {
        onChange({ ...data, rows: [...rows, { scenario: '', traditional: '', graduate: '' }] });
    };

    const removeRow = (index: number) => {
        const newRows = rows.filter((_, i) => i !== index);
        onChange({ ...data, rows: newRows });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Section Label</Label>
                    <Input
                        value={data.section_label || ''}
                        onChange={(e) => onChange({ ...data, section_label: e.target.value })}
                        placeholder="e.g. Why This Course"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Headline</Label>
                    <Input
                        value={data.headline || ''}
                        onChange={(e) => onChange({ ...data, headline: e.target.value })}
                        placeholder="Headline text..."
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                        value={data.description || ''}
                        onChange={(e) => onChange({ ...data, description: e.target.value })}
                        placeholder="Description text..."
                    />
                </div>
                <div className="space-y-2">
                    <Label>Column Header: Scenario</Label>
                    <Input
                        value={data.col_header_scenario || ''}
                        onChange={(e) => onChange({ ...data, col_header_scenario: e.target.value })}
                        placeholder="e.g. Everyday Scenario"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Column Header: Traditional</Label>
                    <Input
                        value={data.col_header_traditional || ''}
                        onChange={(e) => onChange({ ...data, col_header_traditional: e.target.value })}
                        placeholder="e.g. The Traditional Analyst"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Column Header: Graduate</Label>
                    <Input
                        value={data.col_header_graduate || ''}
                        onChange={(e) => onChange({ ...data, col_header_graduate: e.target.value })}
                        placeholder="e.g. The AnalytixLabs Graduate"
                    />
                </div>
            </div>

            <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium">Comparison Rows</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addRow}>
                        <Plus className="h-4 w-4 mr-2" /> Add Row
                    </Button>
                </div>

                {rows.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 border border-dashed rounded-lg">
                        No rows added yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {rows.map((row, index) => (
                            <div key={index} className="flex gap-4 items-start bg-slate-50 p-4 rounded-md border group">
                                <div className="cursor-grab text-slate-400 opacity-50 hover:opacity-100 mt-2">
                                    <GripVertical className="h-5 w-5" />
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label className="text-xs text-slate-500 mb-1 block">Scenario</Label>
                                        <Textarea
                                            value={row.scenario || ''}
                                            onChange={(e) => handleRowChange(index, 'scenario', e.target.value)}
                                            placeholder="e.g. Prepping data..."
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-slate-500 mb-1 block">Traditional</Label>
                                        <Textarea
                                            value={row.traditional || ''}
                                            onChange={(e) => handleRowChange(index, 'traditional', e.target.value)}
                                            placeholder="..."
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-slate-500 mb-1 block">Graduate</Label>
                                        <Textarea
                                            value={row.graduate || ''}
                                            onChange={(e) => handleRowChange(index, 'graduate', e.target.value)}
                                            placeholder="..."
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeRow(index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-8"
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
