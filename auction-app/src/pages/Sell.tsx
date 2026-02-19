import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ImageUpload from '../components/ImageUpload';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { generateSlug } from '../utils/helpers';

const Sell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startPrice, setStartPrice] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const fileName = `${user!.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('listing-images').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('listing-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!startPrice || parseFloat(startPrice) <= 0) { toast.error('Please enter a valid starting price'); return; }
    if (!expiresAt) { toast.error('Please set an expiration date'); return; }
    if (new Date(expiresAt) <= new Date()) { toast.error('Expiration date must be in the future'); return; }

    setSubmitting(true);

    let imageUrl = '';
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch {
        const fallbackImages = [
          'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
        ];
        imageUrl = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
        toast.info('Using a placeholder image — storage bucket not configured.');
      }
    }

    const priceCents = Math.round(parseFloat(startPrice) * 100);
    const slug = generateSlug(title);

    const { data, error } = await supabase.from('listings').insert({
      title: title.trim(),
      description: description.trim(),
      slug,
      image_url: imageUrl,
      start_price: priceCents,
      current_price: priceCents,
      status: 'active',
      seller_id: user!.id,
      expires_at: new Date(expiresAt).toISOString(),
    }).select().maybeSingle();

    setSubmitting(false);

    if (error) {
      toast.error('Failed to create listing. Please try again.');
      return;
    }

    toast.success('Listing created!');
    navigate(`/listings/${data!.slug}`);
  };

  const minDate = new Date();
  minDate.setHours(minDate.getHours() + 1);
  const minDateStr = minDate.toISOString().slice(0, 16);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create a Listing</h1>
        <p className="text-gray-500 mt-1 text-sm">Fill out the details below to list your item for auction.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What are you selling?"
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              maxLength={200}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your item in detail — condition, features, history..."
              rows={5}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              maxLength={5000}
            />
            <p className="text-xs text-gray-400 mt-1">{description.length}/5000</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image</label>
            <ImageUpload onFileSelect={file => setImageFile(file)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Starting Price (USD) <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={startPrice}
                  onChange={e => setStartPrice(e.target.value)}
                  placeholder="0.00"
                  className="block w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Auction End Date <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                value={expiresAt}
                min={minDateStr}
                onChange={e => setExpiresAt(e.target.value)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Creating listing...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sell;
