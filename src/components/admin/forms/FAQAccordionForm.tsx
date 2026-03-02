'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { FAQAccordionProps } from '@/components/public/sections/FAQAccordion';

interface FAQAccordionFormProps {
    data: Partial<FAQAccordionProps>;
    onChange: (data: Partial<FAQAccordionProps>) => void;
}

export function FAQAccordionForm({ data, onChange }: FAQAccordionFormProps) {
    const faqs = data.faqs || [];

    const handleFaqChange = (index: number, field: string, value: string) => {
        const newFaqs = [...faqs];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        onChange({ ...data, faqs: newFaqs });
    };

    const addFaq = () => {
        onChange({ ...data, faqs: [...faqs, { question: '', answer: '' }] });
    };

    const removeFaq = (index: number) => {
        const newFaqs = faqs.filter((_, i) => i !== index);
        onChange({ ...data, faqs: newFaqs });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Headline</Label>
                    <Input
                        value={data.headline || ''}
                        onChange={(e) => onChange({ ...data, headline: e.target.value })}
                        placeholder="e.g. Frequently Asked Questions"
                    />
                </div>
            </div>

            <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium">FAQ Items</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addFaq}>
                        <Plus className="h-4 w-4 mr-2" /> Add FAQ
                    </Button>
                </div>

                {faqs.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 border border-dashed rounded-lg">
                        No FAQs added yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="flex gap-4 items-start bg-slate-50 p-4 rounded-md border">
                                <div className="cursor-grab text-slate-400 mt-2 opacity-50 hover:opacity-100">
                                    <GripVertical className="h-5 w-5" />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-500">Question</Label>
                                        <Input
                                            value={faq.question || ''}
                                            onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                                            placeholder="e.g. Who is this program for?"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-500">Answer</Label>
                                        <Textarea
                                            value={faq.answer || ''}
                                            onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                                            placeholder="Provide the answer here..."
                                            rows={3}
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFaq(index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
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
