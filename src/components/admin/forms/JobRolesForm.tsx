'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { JobRolesProps } from '@/components/public/sections/JobRoles';

interface JobRolesFormProps {
    data: Partial<JobRolesProps>;
    onChange: (data: Partial<JobRolesProps>) => void;
}

export function JobRolesForm({ data, onChange }: JobRolesFormProps) {
    const roles = data.roles || [];

    const handleRoleChange = (index: number, field: string, value: any) => {
        const newRoles = [...roles];
        newRoles[index] = { ...newRoles[index], [field]: value };
        onChange({ ...data, roles: newRoles });
    };

    const addRole = () => {
        onChange({ ...data, roles: [...roles, { icon: '', title: '', description: '' }] });
    };

    const removeRole = (index: number) => {
        const newRoles = roles.filter((_, i) => i !== index);
        onChange({ ...data, roles: newRoles });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Headline</Label>
                    <Input
                        value={data.headline || ''}
                        onChange={(e) => onChange({ ...data, headline: e.target.value })}
                        placeholder="e.g. Roles You Can Target"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                        value={data.description || ''}
                        onChange={(e) => onChange({ ...data, description: e.target.value })}
                        placeholder="e.g. Equipped with high-demand skills..."
                    />
                </div>
            </div>

            <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium">Job Roles</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addRole}>
                        <Plus className="h-4 w-4 mr-2" /> Add Role
                    </Button>
                </div>

                {roles.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 border border-dashed rounded-lg">
                        No job roles added yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {roles.map((role, index) => (
                            <div key={index} className="flex gap-4 items-start bg-slate-50 p-4 rounded-md border">
                                <div className="cursor-grab text-slate-400 mt-2 opacity-50 hover:opacity-100">
                                    <GripVertical className="h-5 w-5" />
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-500">Role Title</Label>
                                        <Input
                                            value={role.title || ''}
                                            onChange={(e) => handleRoleChange(index, 'title', e.target.value)}
                                            placeholder="e.g. Data Scientist"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-500">Emoji / Icon</Label>
                                        <Input
                                            value={role.icon || ''}
                                            onChange={(e) => handleRoleChange(index, 'icon', e.target.value)}
                                            placeholder="e.g. 🤖"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-xs text-slate-500">Description</Label>
                                        <Textarea
                                            value={role.description || ''}
                                            onChange={(e) => handleRoleChange(index, 'description', e.target.value)}
                                            placeholder="What does this role do?"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeRole(index)}
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
