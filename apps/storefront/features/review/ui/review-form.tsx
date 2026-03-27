'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button, Input } from '@homebase/ui';
import { toast } from 'sonner';
import { useCreateReview } from '../api/queries';

interface ReviewFormProps {
  productId: string;
  onSuccess: () => void;
}

function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`h-7 w-7 ${
              star <= (hovered || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm text-gray-500">
          {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value]}
        </span>
      )}
    </div>
  );
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createReview = useCreateReview();

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (rating === 0) errs.rating = 'Please select a rating';
    if (body.trim().length < 10) errs.body = 'Review must be at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    createReview.mutate(
      { productId, rating, title: title.trim() || undefined, body: body.trim() },
      {
        onSuccess: () => {
          toast.success('Review submitted successfully');
          setRating(0);
          setTitle('');
          setBody('');
          onSuccess();
        },
        onError: () => {
          toast.error('Failed to submit review. Please try again.');
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h4 className="text-sm font-semibold text-gray-900">Write Your Review</h4>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Rating *</label>
        <StarSelector value={rating} onChange={setRating} />
        {errors.rating && <p className="mt-1 text-xs text-red-500">{errors.rating}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={120}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Review *</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your thoughts about this product..."
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          maxLength={2000}
        />
        {errors.body && <p className="mt-1 text-xs text-red-500">{errors.body}</p>}
        <p className="mt-1 text-xs text-gray-400">{body.length}/2000</p>
      </div>

      <Button type="submit" disabled={createReview.isPending}>
        {createReview.isPending ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
