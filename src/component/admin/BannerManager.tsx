'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import type { PromoBanner, BannerLink } from '@/types/promo-banner';
import useAxiosPublic  from '@/hooks/Axios/useAxiosPublic';

interface BannerManagerProps {
  initialBanners: PromoBanner[];
  token: string;
}

export default function BannerManager({ initialBanners, token }: BannerManagerProps) {
  const [banners, setBanners] = useState(initialBanners);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBanner, setEditingBanner] = useState<PromoBanner | null>(null);
  const [formData, setFormData] = useState({
    text: '',
    links: [{ text: '', url: '' }] as BannerLink[],
    bgColor: '#2d5f3f',
    isActive: true,
  });

  const axiosPublic = useAxiosPublic()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    const result = await axiosPublic.post('/promo-banners', formData );
    console.log(result,'resultresult');
    console.log('Submit:', formData);
  };

  const handleAddLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { text: '', url: '' }],
    });
  };

  const handleRemoveLink = (index: number) => {
    setFormData({
      ...formData,
      links: formData.links.filter((_, i) => i !== index),
    });
  };

  const handleLinkChange = (index: number, field: 'text' | 'url', value: string) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData({ ...formData, links: newLinks });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Promo Banner Manager</h1>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} />
          Add Banner
        </button>
      </div>

      {/* Banner List */}
      <div className="space-y-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="border rounded-lg p-4 flex items-center gap-4"
            style={{ borderLeftColor: banner.bgColor, borderLeftWidth: '4px' }}
          >
            <button className="cursor-move text-gray-400">
              <GripVertical size={20} />
            </button>
            
            <div className="flex-1">
              <p className="font-medium">{banner.text}</p>
              {banner.links && banner.links.length > 0 && (
                <div className="text-sm text-gray-600 mt-1">
                  Links: {banner.links.map(l => l.text).join(', ')}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingBanner(banner);
                  setFormData({
                    text: banner.text,
                    links: banner.links || [{ text: '', url: '' }],
                    bgColor: banner.bgColor,
                    isActive: banner.isActive,
                  });
                  setIsEditing(true);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit size={18} />
              </button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingBanner ? 'Edit Banner' : 'Create Banner'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Banner Text</label>
                <input
                  type="text"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Background Color</label>
                <input
                  type="color"
                  value={formData.bgColor}
                  onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                  className="w-full h-10 border rounded"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Links</label>
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Add Link
                  </button>
                </div>
                
                {formData.links.map((link, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Link text"
                      value={link.text}
                      onChange={(e) => handleLinkChange(idx, 'text', e.target.value)}
                      className="flex-1 border rounded px-3 py-2"
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                      className="flex-1 border rounded px-3 py-2"
                    />
                    {formData.links.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(idx)}
                        className="px-3 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <label className="text-sm">Active</label>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingBanner(null);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {editingBanner ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}